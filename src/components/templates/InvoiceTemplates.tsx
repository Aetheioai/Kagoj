import React from 'react';
import {
  DEFAULT_INVOICE_SECTION_ORDER,
  DocCustomization,
  DocLanguage,
  InvoiceData,
} from '../../types/builder';
import { getTemplateById } from '../../data/templates';
import {
  calculateInvoiceTotals,
  formatBDNumber,
  formatCurrency,
  toTakaInWords,
} from '../../utils/bdNumbers';
import { formatDisplayDate, hasText, tintHex } from '../../utils/storage';

interface InvoiceRendererProps {
  data: InvoiceData;
  templateId: string;
  language: DocLanguage;
  customization?: DocCustomization;
}

const DISPLAY_SERIF = '"Cormorant Garamond", "Noto Serif Bengali", Georgia, serif';

export function InvoiceTemplateRenderer({
  data,
  templateId,
  language,
  customization,
}: InvoiceRendererProps) {
  const isBn = language === 'bn';
  const meta = getTemplateById('invoice', templateId);
  const hasCustomAccent = Boolean(customization?.accentColor);
  const accent = hasCustomAccent ? customization!.accentColor : meta.accent;
  const secondary = hasCustomAccent ? tintHex(accent, 0.07) : meta.secondary;

  const fontStyle = customization?.fontStyle ?? 'auto';
  const useSerif = fontStyle === 'serif' || (fontStyle === 'auto' && Boolean(meta.serif));

  const fontSize = customization?.fontSize ?? 'standard';
  const scale = fontSize === 'compact' ? 0.92 : fontSize === 'large' ? 1.07 : 1;
  const fs = (px: number) => `${(px * scale).toFixed(1)}px`;

  const spacing = customization?.spacing ?? 'balanced';
  const padX = spacing === 'tight' ? 34 : spacing === 'airy' ? 48 : 40;
  const padY = spacing === 'tight' ? 28 : spacing === 'airy' ? 44 : 36;
  const gapClass = spacing === 'tight' ? 'space-y-3.5' : spacing === 'airy' ? 'space-y-6' : 'space-y-4.5';

  const borderStyle = customization?.borderStyle ?? 'default';
  const currency = customization?.currencySymbol || '৳';
  const stamp = customization?.invoiceStamp || 'none';
  const showLogo =
    customization?.showLogo !== false && Boolean(data.showLogo && hasText(data.logo));
  const showUnitCol = customization?.showUnitCol !== false;
  const showPaymentBlock = customization?.showPaymentBlock !== false;
  const showTakaWords = customization?.showTakaWords !== false;
  const showCustomerSig = customization?.showCustomerSig !== false;

  const sigSize = customization?.signatureSize ?? 'md';
  const sigHeight = sigSize === 'sm' ? 32 : sigSize === 'lg' ? 56 : 42;
  const showSigImg = customization?.showSignatureImage !== false && hasText(data.signatureImage);

  const hidden = new Set(customization?.hiddenSections ?? []);
  const isShown = (key: string) => !hidden.has(key);

  const totals = calculateInvoiceTotals(data);
  const takaWords =
    data.takaWordsOverride.trim() ||
    toTakaInWords(totals.grandTotal, language, currency);

  const defaultDocTitle = (() => {
    if (hasText(data.customDocTitle)) return data.customDocTitle;
    if (isBn) {
      switch (data.docKind) {
        case 'cash_memo':
          return 'ক্যাশ মেমো';
        case 'quotation':
          return 'কোটেশন / দরপত্র';
        case 'bill':
          return 'বিল / রসিদ';
        default:
          return 'ইনভয়েস';
      }
    }
    switch (data.docKind) {
      case 'cash_memo':
        return 'CASH MEMO';
      case 'quotation':
        return 'QUOTATION';
      case 'bill':
        return 'BILL / RECEIPT';
      default:
        return 'INVOICE';
    }
  })();

  const formattedDate = hasText(data.date) ? formatDisplayDate(data.date, language) : '';
  const formattedDueDate = hasText(data.dueDate)
    ? formatDisplayDate(data.dueDate, language)
    : '';
  const customSections = (data.customSections || []).filter(
    (s) => hasText(s.title) || hasText(s.content)
  );

  // Layout flags for all 15 distinct invoice templates
  const isSidebar = templateId === 'inv-sidebar-bill';
  const isCashMemoFrame =
    borderStyle === 'framed' ||
    (borderStyle === 'default' &&
      (templateId === 'inv-bd-cash-memo' ||
        templateId === 'inv-clean-vat' ||
        templateId === 'inv-proforma-sheet'));
  const isPureBW = templateId === 'inv-inksaver-bill';
  const isDarkBanner =
    templateId === 'inv-dhaka-corporate' ||
    templateId === 'inv-charcoal-gold' ||
    templateId === 'inv-teal-agency' ||
    templateId === 'inv-rose-ink-shop';
  const isFullGridTable =
    templateId === 'inv-bd-cash-memo' ||
    templateId === 'inv-accounting-grid' ||
    templateId === 'inv-clean-vat' ||
    templateId === 'inv-inksaver-bill';
  const isDeliveryHighlight = templateId === 'inv-delivery-slip';
  const isGoldTrim = templateId === 'inv-charcoal-gold';

  const effectiveAccent = isPureBW && !hasCustomAccent ? '#111111' : accent;
  const effectiveSecondary = isPureBW && !hasCustomAccent ? '#f5f5f5' : secondary;
  const goldColor = '#c59b43';

  const hasPaymentData =
    hasText(data.bkashNumber) ||
    hasText(data.nagadNumber) ||
    hasText(data.rocketNumber) ||
    hasText(data.bankDetails);

  const rootStyle: React.CSSProperties = {
    fontFamily: useSerif
      ? DISPLAY_SERIF
      : language === 'bn'
      ? '"Noto Sans Bengali", sans-serif'
      : '"Plus Jakarta Sans", "Noto Sans Bengali", sans-serif',
    backgroundColor: meta.paperTint || '#ffffff',
    color: '#1b1a18',
    fontSize: fs(12.6),
    lineHeight: isBn ? 1.58 : 1.5,
  };

  const renderStamp = () => {
    if (stamp === 'none') return null;
    const stampConfig: Record<string, { label: string; color: string }> = {
      paid: { label: isBn ? 'পরিশোধিত' : 'PAID', color: '#15803d' },
      due: { label: isBn ? 'বকেয়া' : 'DUE', color: '#b91c1c' },
      partial: { label: isBn ? 'আংশিক পরিশোধ' : 'PARTIAL PAID', color: '#b45309' },
      quotation: { label: isBn ? 'কোটেশন' : 'QUOTATION', color: '#1d4ed8' },
    };
    const cfg = stampConfig[stamp];
    if (!cfg) return null;
    return (
      <div
        className="pointer-events-none select-none inline-block px-3.5 py-1 font-black tracking-widest uppercase"
        style={{
          color: cfg.color,
          border: `2.5px solid ${cfg.color}`,
          borderRadius: '4px',
          transform: 'rotate(-8deg)',
          fontSize: fs(13),
          opacity: 0.85,
        }}
      >
        {cfg.label}
      </div>
    );
  };

  const sectionOrder =
    customization?.sectionOrder?.length
      ? customization.sectionOrder
      : [...DEFAULT_INVOICE_SECTION_ORDER];

  const renderParties = () => {
    if (!isShown('parties')) return null;
    return (
      <section className="a4-avoid-break grid grid-cols-12 gap-4 items-start">
        <div
          className={`${isDeliveryHighlight ? 'col-span-7 p-3.5' : 'col-span-7'}`}
          style={
            isDeliveryHighlight
              ? {
                  backgroundColor: effectiveSecondary,
                  borderLeft: `4px solid ${effectiveAccent}`,
                }
              : undefined
          }
        >
          <p
            className="font-bold uppercase tracking-wider mb-1"
            style={{ color: effectiveAccent, fontSize: fs(10.8) }}
          >
            {isDeliveryHighlight
              ? isBn
                ? 'ডেলিভারি / ক্রেতার তথ্য'
                : 'DELIVER TO / CUSTOMER'
              : isBn
              ? 'ক্রেতা / বিল প্রাপক'
              : 'BILL TO'}
          </p>
          <p className="font-bold text-[#111]" style={{ fontSize: fs(14) }}>
            {data.clientName || (isBn ? 'ক্রেতার নাম' : 'Customer Name')}
          </p>
          {hasText(data.clientCompany) && (
            <p className="font-semibold text-[#333]">{data.clientCompany}</p>
          )}
          {hasText(data.clientPhone) && (
            <p className="font-semibold text-[#222] tabular-nums" style={{ fontSize: fs(12.2) }}>
              {isBn ? 'মোবাইল: ' : 'Phone: '}
              {data.clientPhone}
            </p>
          )}
          {hasText(data.clientAddress) && (
            <p className="text-[#4a4845] mt-0.5 leading-snug" style={{ fontSize: fs(12) }}>
              {data.clientAddress}
            </p>
          )}
        </div>

        <div className="col-span-5 text-right space-y-1 tabular-nums" style={{ fontSize: fs(12) }}>
          {hasText(data.invoiceNo) && (
            <div className="flex justify-end gap-2">
              <span className="text-[#5c5852]">
                {isBn ? 'নম্বর:' : 'No:'}
              </span>
              <span className="font-bold text-[#111]">{data.invoiceNo}</span>
            </div>
          )}
          {hasText(formattedDate) && (
            <div className="flex justify-end gap-2">
              <span className="text-[#5c5852]">{isBn ? 'তারিখ:' : 'Date:'}</span>
              <span className="font-semibold">{formattedDate}</span>
            </div>
          )}
          {hasText(formattedDueDate) && (
            <div className="flex justify-end gap-2">
              <span className="text-[#5c5852]">
                {data.docKind === 'quotation'
                  ? isBn
                    ? 'মেয়াদ:'
                    : 'Valid Until:'
                  : isBn
                  ? 'পরিশোধের তারিখ:'
                  : 'Due Date:'}
              </span>
              <span className="font-semibold">{formattedDueDate}</span>
            </div>
          )}
          {hasText(data.orderRef) && (
            <div className="flex justify-end gap-2">
              <span className="text-[#5c5852]">{isBn ? 'অর্ডার নং:' : 'Order Ref:'}</span>
              <span className="font-semibold">{data.orderRef}</span>
            </div>
          )}
          {stamp !== 'none' && <div className="pt-2">{renderStamp()}</div>}
        </div>
      </section>
    );
  };

  const renderItemsTable = () => {
    if (!isShown('items')) return null;
    const cellBorder = isFullGridTable
      ? `1px solid ${isPureBW ? '#222' : '#cfc9be'}`
      : 'none';
    const rowBottomBorder = `1px solid ${isPureBW ? '#444' : '#e2ddd3'}`;

    return (
      <section>
        <table
          className="w-full border-collapse tabular-nums"
          style={{
            border: isFullGridTable ? `1.5px solid ${effectiveAccent}` : undefined,
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: isPureBW ? '#f2f2f2' : effectiveAccent,
                color: isPureBW ? '#111111' : '#ffffff',
                borderBottom: isPureBW ? '2px solid #111111' : undefined,
              }}
            >
              <th
                className="py-2 px-2.5 text-center font-bold w-10"
                style={{ fontSize: fs(11.6), border: cellBorder }}
              >
                {isBn ? 'ক্র.' : '#'}
              </th>
              <th
                className="py-2 px-3 text-left font-bold"
                style={{ fontSize: fs(11.6), border: cellBorder }}
              >
                {isBn ? 'বিবরণ' : 'Description'}
              </th>
              <th
                className="py-2 px-2.5 text-right font-bold w-16"
                style={{ fontSize: fs(11.6), border: cellBorder }}
              >
                {isBn ? 'পরিমাণ' : 'Qty'}
              </th>
              {showUnitCol && (
                <th
                  className="py-2 px-2 text-center font-bold w-16"
                  style={{ fontSize: fs(11.6), border: cellBorder }}
                >
                  {isBn ? 'একক' : 'Unit'}
                </th>
              )}
              <th
                className="py-2 px-2.5 text-right font-bold w-24"
                style={{ fontSize: fs(11.6), border: cellBorder }}
              >
                {isBn ? 'দর' : 'Rate'}
              </th>
              <th
                className="py-2 px-3 text-right font-bold w-28"
                style={{ fontSize: fs(11.6), border: cellBorder }}
              >
                {isBn ? 'টাকা' : 'Amount'}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 ? (
              <tr>
                <td
                  colSpan={showUnitCol ? 6 : 5}
                  className="py-6 text-center text-[#7c7468] italic"
                >
                  {isBn ? 'কোনো পণ্য যোগ করা হয়নি' : 'No line items added yet'}
                </td>
              </tr>
            ) : (
              data.items.map((item, idx) => {
                const lineTotal = Math.max(0, item.qty) * Math.max(0, item.rate);
                const zebra = !isPureBW && idx % 2 === 1 ? effectiveSecondary : '#ffffff';
                return (
                  <tr
                    key={item.id}
                    className="a4-avoid-break"
                    style={{
                      backgroundColor:
                        templateId === 'inv-green-ledger' || templateId === 'inv-warm-boutique'
                          ? zebra
                          : '#ffffff',
                      borderBottom: rowBottomBorder,
                    }}
                  >
                    <td
                      className="py-2.5 px-2.5 text-center text-[#524e48]"
                      style={{ border: cellBorder }}
                    >
                      {formatBDNumber(idx + 1, language)}
                    </td>
                    <td
                      className="py-2.5 px-3 font-medium text-[#171717]"
                      style={{ border: cellBorder }}
                    >
                      {item.description || '—'}
                    </td>
                    <td className="py-2.5 px-2.5 text-right" style={{ border: cellBorder }}>
                      {formatBDNumber(item.qty, language, Number.isInteger(item.qty) ? 0 : 2)}
                    </td>
                    {showUnitCol && (
                      <td
                        className="py-2.5 px-2 text-center text-[#524e48]"
                        style={{ border: cellBorder }}
                      >
                        {item.unit}
                      </td>
                    )}
                    <td className="py-2.5 px-2.5 text-right" style={{ border: cellBorder }}>
                      {formatCurrency(item.rate, language, currency)}
                    </td>
                    <td
                      className="py-2.5 px-3 text-right font-bold text-[#111]"
                      style={{ border: cellBorder }}
                    >
                      {formatCurrency(lineTotal, language, currency)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    );
  };

  const renderTotalsAndTakaWords = () => {
    if (!isShown('totals')) return null;
    return (
      <section className="a4-avoid-break grid grid-cols-12 gap-5 items-start">
        {/* Left: Taka in Words + Notes */}
        <div className="col-span-7 space-y-3">
          {isShown('takaWords') && showTakaWords && (
            <div
              className="px-3.5 py-2.5"
              style={{
                backgroundColor: isPureBW ? '#f7f7f7' : effectiveSecondary,
                borderLeft: `3.5px solid ${effectiveAccent}`,
              }}
            >
              <p
                className="font-bold uppercase tracking-wider"
                style={{ fontSize: fs(10.5), color: effectiveAccent }}
              >
                {isBn ? 'কথায় (মোট টাকা)' : 'Amount in Words'}
              </p>
              <p className="font-semibold text-[#171717] mt-0.5" style={{ fontSize: fs(12.2) }}>
                {takaWords}
              </p>
            </div>
          )}

          {!isSidebar && isShown('payment') && showPaymentBlock && hasPaymentData && (
            <div
              className="px-3.5 py-2.5 space-y-1"
              style={{
                border: `1px solid ${isPureBW ? '#333' : `${effectiveAccent}35`}`,
              }}
            >
              <p
                className="font-bold uppercase tracking-wider"
                style={{ fontSize: fs(10.5), color: effectiveAccent }}
              >
                {isBn ? 'পেমেন্ট তথ্য (বিকাশ / নগদ / ব্যাংক)' : 'Payment Methods (MFS & Bank)'}
              </p>
              <div className="space-y-0.5 text-[#2a2825]" style={{ fontSize: fs(11.6) }}>
                {hasText(data.bkashNumber) && (
                  <p>
                    <span className="font-bold text-[#c2185b]">bKash: </span>
                    {data.bkashNumber}
                  </p>
                )}
                {hasText(data.nagadNumber) && (
                  <p>
                    <span className="font-bold text-[#d84315]">Nagad: </span>
                    {data.nagadNumber}
                  </p>
                )}
                {hasText(data.rocketNumber) && (
                  <p>
                    <span className="font-bold text-[#6a1b9a]">Rocket: </span>
                    {data.rocketNumber}
                  </p>
                )}
                {hasText(data.bankDetails) && (
                  <p className="pt-0.5">
                    <span className="font-bold">{isBn ? 'ব্যাংক: ' : 'Bank: '}</span>
                    {data.bankDetails}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Numeric Summary Table */}
        <div className="col-span-5 tabular-nums space-y-1.5" style={{ fontSize: fs(12.2) }}>
          <div className="flex justify-between py-1 border-b border-[#e5e0d7]">
            <span className="text-[#524e48]">{isBn ? 'উপ-সর্বমোট:' : 'Subtotal:'}</span>
            <span className="font-semibold">
              {formatCurrency(totals.subtotal, language, currency)}
            </span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="flex justify-between py-1 border-b border-[#e5e0d7]">
              <span className="text-[#524e48]">
                {isBn ? 'ডিসকাউন্ট' : 'Discount'}
                {data.discountType === 'percent' ? ` (${data.discountValue}%)` : ''}:
              </span>
              <span className="font-semibold text-[#9f3324]">
                - {formatCurrency(totals.discountAmount, language, currency)}
              </span>
            </div>
          )}

          {totals.vatAmount > 0 && (
            <div className="flex justify-between py-1 border-b border-[#e5e0d7]">
              <span className="text-[#524e48]">
                {isBn ? `ভ্যাট (${formatBDNumber(data.vatPercent, language)}%):` : `VAT (${data.vatPercent}%):`}
              </span>
              <span className="font-semibold">
                + {formatCurrency(totals.vatAmount, language, currency)}
              </span>
            </div>
          )}

          {totals.shippingCharge > 0 && (
            <div className="flex justify-between py-1 border-b border-[#e5e0d7]">
              <span className="text-[#524e48]">
                {isBn ? 'ডেলিভারি চার্জ:' : 'Delivery / Shipping:'}
              </span>
              <span className="font-semibold">
                + {formatCurrency(totals.shippingCharge, language, currency)}
              </span>
            </div>
          )}

          <div
            className="flex justify-between items-center px-3 py-2 font-extrabold"
            style={{
              backgroundColor: isPureBW ? '#111111' : effectiveAccent,
              color: '#ffffff',
              fontSize: fs(13.8),
            }}
          >
            <span>{isBn ? 'সর্বমোট বিল' : 'Grand Total'}</span>
            <span>{formatCurrency(totals.grandTotal, language, currency)}</span>
          </div>

          {totals.advancePaid > 0 && (
            <>
              <div className="flex justify-between py-1 border-b border-[#e5e0d7]">
                <span className="text-[#524e48]">
                  {isBn ? 'অগ্রিম / পরিশোধিত:' : 'Advance Paid:'}
                </span>
                <span className="font-semibold text-[#15803d]">
                  {formatCurrency(totals.advancePaid, language, currency)}
                </span>
              </div>
              <div
                className="flex justify-between items-center px-3 py-1.5 font-extrabold"
                style={{
                  backgroundColor: isDeliveryHighlight ? '#fef2f2' : effectiveSecondary,
                  border: `1.5px solid ${isDeliveryHighlight ? '#b91c1c' : effectiveAccent}`,
                  color: isDeliveryHighlight ? '#b91c1c' : '#111111',
                  fontSize: fs(13.2),
                }}
              >
                <span>
                  {isDeliveryHighlight
                    ? isBn
                      ? 'ক্যাশ অন ডেলিভারি (বকেয়া)'
                      : 'COD Balance Due'
                    : isBn
                    ? 'বকেয়া (Due)'
                    : 'Balance Due'}
                </span>
                <span>{formatCurrency(totals.balanceDue, language, currency)}</span>
              </div>
            </>
          )}
        </div>
      </section>
    );
  };

  const renderNotesAndTerms = () => {
    if (!isShown('notes') || (!hasText(data.notes) && !hasText(data.terms))) return null;
    return (
      <section
        className="a4-avoid-break pt-2.5 space-y-1.5 text-[#4a4845]"
        style={{
          borderTop: '1px dashed #d6d0c6',
          fontSize: fs(11.4),
        }}
      >
        {hasText(data.notes) && (
          <p>
            <span className="font-bold text-[#222]">{isBn ? 'নোট: ' : 'Note: '}</span>
            {data.notes}
          </p>
        )}
        {hasText(data.terms) && (
          <p>
            <span className="font-bold text-[#222]">{isBn ? 'শর্তাবলি: ' : 'Terms: '}</span>
            {data.terms}
          </p>
        )}
      </section>
    );
  };

  const renderCustom = () => {
    if (!isShown('custom') || customSections.length === 0) return null;
    return (
      <>
        {customSections.map((sec) => (
          <section key={sec.id} className="a4-avoid-break space-y-0.5">
            {hasText(sec.title) && (
              <p className="font-bold" style={{ color: effectiveAccent, fontSize: fs(12) }}>
                {sec.title}
              </p>
            )}
            {hasText(sec.content) && (
              <p className="whitespace-pre-line text-[#333]" style={{ fontSize: fs(11.6) }}>
                {sec.content}
              </p>
            )}
          </section>
        ))}
      </>
    );
  };

  const renderSignatures = () => {
    if (!isShown('signatures')) return null;
    return (
      <section className="a4-avoid-break pt-6 mt-auto flex items-end justify-between gap-8">
        {showCustomerSig ? (
          <div className="min-w-[180px] text-center">
            <div className="h-10" />
            <div className="border-t border-[#444] pt-1.5">
              <p className="font-semibold text-[#333]" style={{ fontSize: fs(11.5) }}>
                {isBn ? 'ক্রেতা / গ্রহণকারীর স্বাক্ষর' : 'Customer / Receiver Signature'}
              </p>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="min-w-[200px] text-center">
          <div className="min-h-[42px] flex items-end justify-center mb-1">
            {showSigImg ? (
              <img
                src={data.signatureImage}
                alt="Authorized signature"
                referrerPolicy="no-referrer"
                style={{ height: `${sigHeight}px` }}
                className="w-auto max-w-[180px] object-contain"
              />
            ) : (
              <div className="h-9" />
            )}
          </div>
          <div className="pt-1.5" style={{ borderTop: `1.5px solid ${effectiveAccent}` }}>
            {hasText(data.authorizedName) && (
              <p className="font-bold text-[#141414]" style={{ fontSize: fs(12) }}>
                {data.authorizedName}
              </p>
            )}
            <p className="text-[#4a4845]" style={{ fontSize: fs(11.2) }}>
              {data.authorizedTitle ||
                (isBn ? 'অনুমোদিত স্বাক্ষর' : 'Authorized Signature')}
            </p>
          </div>
        </div>
      </section>
    );
  };

  const renderOrderedBody = () =>
    sectionOrder.map((key) => {
      switch (key) {
        case 'parties':
          return <React.Fragment key={key}>{renderParties()}</React.Fragment>;
        case 'items':
          return <React.Fragment key={key}>{renderItemsTable()}</React.Fragment>;
        case 'totals':
          return <React.Fragment key={key}>{renderTotalsAndTakaWords()}</React.Fragment>;
        case 'notes':
          return <React.Fragment key={key}>{renderNotesAndTerms()}</React.Fragment>;
        case 'custom':
          return <React.Fragment key={key}>{renderCustom()}</React.Fragment>;
        case 'signatures':
          return <React.Fragment key={key}>{renderSignatures()}</React.Fragment>;
        default:
          return null;
      }
    });

  // =========================================================================
  // SIDEBAR INVOICE LAYOUT (inv-sidebar-bill)
  // =========================================================================
  if (isSidebar) {
    return (
      <div className="a4-sheet flex" style={rootStyle}>
        <aside
          className="w-[215px] shrink-0 text-white flex flex-col justify-between"
          style={{
            backgroundColor: effectiveAccent,
            padding: `${padY}px 20px`,
          }}
        >
          <div className="space-y-5">
            {showLogo && (
              <img
                src={data.logo}
                alt="Business logo"
                referrerPolicy="no-referrer"
                className="h-14 w-auto object-contain bg-white rounded-md p-1.5"
              />
            )}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/65 font-bold">
                {defaultDocTitle}
              </p>
              <h1 className="font-bold text-white leading-tight mt-1" style={{ fontSize: fs(18) }}>
                {data.businessName || (isBn ? 'প্রতিষ্ঠানের নাম' : 'Business Name')}
              </h1>
              {hasText(data.businessTagline) && (
                <p className="text-white/75 mt-1" style={{ fontSize: fs(11) }}>
                  {data.businessTagline}
                </p>
              )}
            </div>

            <div className="space-y-1 text-white/85 pt-3 border-t border-white/15" style={{ fontSize: fs(11) }}>
              {hasText(data.businessPhone) && <p>{data.businessPhone}</p>}
              {hasText(data.businessEmail) && <p className="break-all">{data.businessEmail}</p>}
              {hasText(data.businessWebsite) && <p className="break-all">{data.businessWebsite}</p>}
              {hasText(data.businessAddress) && <p className="text-white/75">{data.businessAddress}</p>}
              {hasText(data.businessRegNo) && (
                <p className="text-white/70 pt-1">{data.businessRegNo}</p>
              )}
            </div>

            {showPaymentBlock && hasPaymentData && (
              <div className="space-y-1 text-white/90 pt-3 border-t border-white/15" style={{ fontSize: fs(11) }}>
                <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">
                  {isBn ? 'পেমেন্ট' : 'Payment'}
                </p>
                {hasText(data.bkashNumber) && <p>bKash: {data.bkashNumber}</p>}
                {hasText(data.nagadNumber) && <p>Nagad: {data.nagadNumber}</p>}
                {hasText(data.rocketNumber) && <p>Rocket: {data.rocketNumber}</p>}
                {hasText(data.bankDetails) && (
                  <p className="text-white/80 leading-snug pt-0.5">{data.bankDetails}</p>
                )}
              </div>
            )}
          </div>

          <p className="text-[10px] text-white/50">{data.invoiceNo}</p>
        </aside>

        <main
          className={`flex-1 min-w-0 flex flex-col ${gapClass}`}
          style={{ padding: `${padY}px ${padX - 8}px` }}
        >
          {renderOrderedBody()}
        </main>
      </div>
    );
  }

  // =========================================================================
  // STANDARD / BANNER / TRADITIONAL CASH MEMO LAYOUTS (14 TEMPLATES)
  // =========================================================================
  return (
    <div className="a4-sheet flex flex-col" style={rootStyle}>
      {/* Full-Width Dark Banner Header */}
      {isDarkBanner && (
        <header
          className="text-white flex items-center justify-between gap-6 shrink-0"
          style={{
            backgroundColor: effectiveAccent,
            padding: `${Math.max(22, padY - 10)}px ${padX}px`,
            borderBottom: isGoldTrim ? `3px solid ${goldColor}` : undefined,
          }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {showLogo && (
              <img
                src={data.logo}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="h-14 w-14 object-contain bg-white rounded-md p-1 shrink-0"
              />
            )}
            <div className="min-w-0">
              <h1
                className="font-bold text-white leading-tight"
                style={{ fontSize: fs(21), fontFamily: useSerif ? DISPLAY_SERIF : undefined }}
              >
                {data.businessName || (isBn ? 'প্রতিষ্ঠানের নাম' : 'Business Name')}
              </h1>
              {hasText(data.businessTagline) && (
                <p className="text-white/80 mt-0.5" style={{ fontSize: fs(11.4) }}>
                  {data.businessTagline}
                </p>
              )}
              <p className="text-white/75 mt-1" style={{ fontSize: fs(11) }}>
                {[data.businessAddress, data.businessPhone, data.businessEmail]
                  .filter(hasText)
                  .join(' · ')}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p
              className="font-black tracking-wider uppercase"
              style={{
                fontSize: fs(22),
                color: isGoldTrim ? '#f3d082' : '#ffffff',
              }}
            >
              {defaultDocTitle}
            </p>
            {hasText(data.businessRegNo) && (
              <p className="text-white/75 mt-1" style={{ fontSize: fs(10.5) }}>
                {data.businessRegNo}
              </p>
            )}
          </div>
        </header>
      )}

      {/* Sheet Frame / Inner Content */}
      <div
        className="flex-1 flex flex-col"
        style={{
          padding: isCashMemoFrame ? '20px' : `${padY}px ${padX}px`,
        }}
      >
        <div
          className={`flex-1 flex flex-col ${gapClass}`}
          style={
            isCashMemoFrame
              ? {
                  border:
                    templateId === 'inv-bd-cash-memo'
                      ? `4px double ${effectiveAccent}`
                      : `1.5px solid ${effectiveAccent}`,
                  padding: `${Math.max(20, padY - 10)}px ${Math.max(24, padX - 10)}px`,
                }
              : undefined
          }
        >
          {/* Non-Banner Header */}
          {!isDarkBanner && (
            <header
              className="a4-avoid-break pb-3.5"
              style={{
                borderBottom:
                  templateId === 'inv-bd-cash-memo'
                    ? `3px double ${effectiveAccent}`
                    : `2px solid ${effectiveAccent}`,
              }}
            >
              {templateId === 'inv-bd-cash-memo' ? (
                <div className="text-center space-y-1">
                  {showLogo && (
                    <img
                      src={data.logo}
                      alt="Shop Logo"
                      referrerPolicy="no-referrer"
                      className="h-12 w-auto mx-auto object-contain mb-1"
                    />
                  )}
                  <h1
                    className="font-black leading-tight"
                    style={{ fontSize: fs(23), color: effectiveAccent }}
                  >
                    {data.businessName || (isBn ? 'দোকান / প্রতিষ্ঠানের নাম' : 'Shop / Business Name')}
                  </h1>
                  {hasText(data.businessTagline) && (
                    <p className="text-[#4a4845]" style={{ fontSize: fs(11.6) }}>
                      {data.businessTagline}
                    </p>
                  )}
                  <p className="text-[#4a4845]" style={{ fontSize: fs(11.4) }}>
                    {[data.businessAddress, data.businessPhone, data.businessEmail]
                      .filter(hasText)
                      .join(' · ')}
                  </p>
                  {hasText(data.businessRegNo) && (
                    <p className="text-[#5c5852]" style={{ fontSize: fs(10.8) }}>
                      {data.businessRegNo}
                    </p>
                  )}
                  <div className="pt-1.5">
                    <span
                      className="inline-block px-5 py-0.5 font-extrabold tracking-widest uppercase"
                      style={{
                        backgroundColor: effectiveAccent,
                        color: '#ffffff',
                        fontSize: fs(12.5),
                      }}
                    >
                      {defaultDocTitle}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-3.5 min-w-0">
                    {showLogo && (
                      <img
                        src={data.logo}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 object-contain shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h1
                        className="font-bold leading-tight"
                        style={{
                          fontSize: fs(21),
                          color: effectiveAccent,
                          fontFamily: useSerif ? DISPLAY_SERIF : undefined,
                        }}
                      >
                        {data.businessName || (isBn ? 'প্রতিষ্ঠানের নাম' : 'Business Name')}
                      </h1>
                      {hasText(data.businessTagline) && (
                        <p className="text-[#524e48] mt-0.5" style={{ fontSize: fs(11.6) }}>
                          {data.businessTagline}
                        </p>
                      )}
                      <p className="text-[#524e48] mt-1" style={{ fontSize: fs(11.2) }}>
                        {[data.businessAddress, data.businessPhone, data.businessEmail]
                          .filter(hasText)
                          .join(' · ')}
                      </p>
                      {hasText(data.businessRegNo) && (
                        <p className="text-[#6b665f] mt-0.5" style={{ fontSize: fs(10.6) }}>
                          {data.businessRegNo}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="font-black tracking-wider uppercase"
                      style={{ fontSize: fs(21), color: effectiveAccent }}
                    >
                      {defaultDocTitle}
                    </p>
                  </div>
                </div>
              )}
            </header>
          )}

          {renderOrderedBody()}
        </div>
      </div>
    </div>
  );
}
