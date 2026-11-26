import {
  DocCustomization,
  DocLanguage,
  InvoiceData,
} from '../types/builder';
import { getTemplateById } from '../data/templates';
import {
  calculateInvoiceTotals,
  formatBDNumber,
  formatCurrency,
  toTakaInWords,
} from './bdNumbers';
import { formatDisplayDate, hasText, tintHex } from './storage';

export type CodeExportFormat = 'html' | 'react' | 'json';

function escapeHtml(raw: string): string {
  return String(raw ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getDocTitle(data: InvoiceData, language: DocLanguage): string {
  if (hasText(data.customDocTitle)) return data.customDocTitle;
  const isBn = language === 'bn';
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
}

interface ResolvedInvoiceTheme {
  templateName: string;
  accent: string;
  secondary: string;
  paperTint: string;
  useSerif: boolean;
  isSidebar: boolean;
  isCashMemoFrame: boolean;
  isPureBW: boolean;
  isDarkBanner: boolean;
  isFullGridTable: boolean;
  isDeliveryHighlight: boolean;
  isGoldTrim: boolean;
  isZebraRows: boolean;
  isDoubleBorderCashMemo: boolean;
  currency: string;
  stamp: NonNullable<DocCustomization['invoiceStamp']>;
  showUnitCol: boolean;
  showPaymentBlock: boolean;
  showTakaWords: boolean;
  showCustomerSig: boolean;
  padX: number;
  padY: number;
}

function resolveTheme(
  templateId: string,
  customization?: DocCustomization
): ResolvedInvoiceTheme {
  const meta = getTemplateById('invoice', templateId);
  const hasCustomAccent = Boolean(customization?.accentColor);
  const rawAccent = hasCustomAccent ? customization!.accentColor : meta.accent;
  const rawSecondary = hasCustomAccent ? tintHex(rawAccent, 0.07) : meta.secondary;

  const fontStyle = customization?.fontStyle ?? 'auto';
  const useSerif = fontStyle === 'serif' || (fontStyle === 'auto' && Boolean(meta.serif));
  const spacing = customization?.spacing ?? 'balanced';
  const borderStyle = customization?.borderStyle ?? 'default';

  const isPureBW = templateId === 'inv-inksaver-bill';
  const isSidebar = templateId === 'inv-sidebar-bill';
  const isCashMemoFrame =
    borderStyle === 'framed' ||
    (borderStyle === 'default' &&
      (templateId === 'inv-bd-cash-memo' ||
        templateId === 'inv-clean-vat' ||
        templateId === 'inv-proforma-sheet'));
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
  const isZebraRows =
    templateId === 'inv-green-ledger' || templateId === 'inv-warm-boutique';
  const isDoubleBorderCashMemo = templateId === 'inv-bd-cash-memo';

  return {
    templateName: meta.name,
    accent: isPureBW && !hasCustomAccent ? '#111111' : rawAccent,
    secondary: isPureBW && !hasCustomAccent ? '#f5f5f5' : rawSecondary,
    paperTint: meta.paperTint || '#ffffff',
    useSerif,
    isSidebar,
    isCashMemoFrame,
    isPureBW,
    isDarkBanner,
    isFullGridTable,
    isDeliveryHighlight,
    isGoldTrim,
    isZebraRows,
    isDoubleBorderCashMemo,
    currency: customization?.currencySymbol || '৳',
    stamp: customization?.invoiceStamp || 'none',
    showUnitCol: customization?.showUnitCol !== false,
    showPaymentBlock: customization?.showPaymentBlock !== false,
    showTakaWords: customization?.showTakaWords !== false,
    showCustomerSig: customization?.showCustomerSig !== false,
    padX: spacing === 'tight' ? 34 : spacing === 'airy' ? 48 : 40,
    padY: spacing === 'tight' ? 28 : spacing === 'airy' ? 44 : 36,
  };
}

export function getInvoiceComponentName(templateId: string): string {
  const cleaned = templateId
    .replace(/^inv-/, '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `${cleaned || 'CashMemo'}Invoice`;
}

/**
 * Generates a 100% standalone, print-ready HTML + CSS file for the selected
 * Cash Memo / Invoice template that works in PHP, Laravel, Django, Express,
 * Puppeteer, or any plain web app.
 */
export function generateInvoiceHtmlCode(
  templateId: string,
  data: InvoiceData,
  language: DocLanguage,
  customization?: DocCustomization
): string {
  const isBn = language === 'bn';
  const theme = resolveTheme(templateId, customization);
  const totals = calculateInvoiceTotals(data);
  const docTitle = getDocTitle(data, language);
  const takaWords =
    data.takaWordsOverride.trim() ||
    toTakaInWords(totals.grandTotal, language, theme.currency);

  const formattedDate = hasText(data.date) ? formatDisplayDate(data.date, language) : '';
  const formattedDueDate = hasText(data.dueDate)
    ? formatDisplayDate(data.dueDate, language)
    : '';
  const bizContact = [data.businessAddress, data.businessPhone, data.businessEmail]
    .filter(hasText)
    .join(' · ');

  const hasPayment =
    theme.showPaymentBlock &&
    (hasText(data.bkashNumber) ||
      hasText(data.nagadNumber) ||
      hasText(data.rocketNumber) ||
      hasText(data.bankDetails));

  const stampMap: Record<string, { label: string; color: string }> = {
    paid: { label: isBn ? 'পরিশোধিত' : 'PAID', color: '#15803d' },
    due: { label: isBn ? 'বকেয়া' : 'DUE', color: '#b91c1c' },
    partial: { label: isBn ? 'আংশিক পরিশোধ' : 'PARTIAL PAID', color: '#b45309' },
    quotation: { label: isBn ? 'কোটেশন' : 'QUOTATION', color: '#1d4ed8' },
  };
  const stampBadge =
    theme.stamp !== 'none' && stampMap[theme.stamp]
      ? `<div class="stamp" style="color:${stampMap[theme.stamp].color};border-color:${stampMap[theme.stamp].color};">${escapeHtml(stampMap[theme.stamp].label)}</div>`
      : '';

  const rowsHtml =
    data.items.length === 0
      ? `<tr><td colspan="${theme.showUnitCol ? 6 : 5}" class="empty-row">${escapeHtml(
          isBn ? 'কোনো পণ্য যোগ করা হয়নি' : 'No line items added yet'
        )}</td></tr>`
      : data.items
          .map((item, idx) => {
            const lineTotal = Math.max(0, item.qty) * Math.max(0, item.rate);
            const zebraClass = theme.isZebraRows && idx % 2 === 1 ? ' class="zebra"' : '';
            return `          <tr${zebraClass}>
            <td class="text-center muted">${escapeHtml(formatBDNumber(idx + 1, language))}</td>
            <td class="item-desc">${escapeHtml(item.description || '—')}</td>
            <td class="text-right">${escapeHtml(
              formatBDNumber(item.qty, language, Number.isInteger(item.qty) ? 0 : 2)
            )}</td>${
              theme.showUnitCol
                ? `\n            <td class="text-center muted">${escapeHtml(item.unit)}</td>`
                : ''
            }
            <td class="text-right">${escapeHtml(formatCurrency(item.rate, language, theme.currency))}</td>
            <td class="text-right item-total">${escapeHtml(
              formatCurrency(lineTotal, language, theme.currency)
            )}</td>
          </tr>`;
          })
          .join('\n');

  const paymentItemsHtml = [
    hasText(data.bkashNumber)
      ? `<p><strong style="color:#c2185b;">bKash:</strong> ${escapeHtml(data.bkashNumber)}</p>`
      : '',
    hasText(data.nagadNumber)
      ? `<p><strong style="color:#d84315;">Nagad:</strong> ${escapeHtml(data.nagadNumber)}</p>`
      : '',
    hasText(data.rocketNumber)
      ? `<p><strong style="color:#6a1b9a;">Rocket:</strong> ${escapeHtml(data.rocketNumber)}</p>`
      : '',
    hasText(data.bankDetails)
      ? `<p><strong>${escapeHtml(isBn ? 'ব্যাংক:' : 'Bank:')}</strong> ${escapeHtml(
          data.bankDetails
        )}</p>`
      : '',
  ]
    .filter(Boolean)
    .join('\n            ');

  const sidebarPaymentHtml = [
    hasText(data.bkashNumber) ? `<p>bKash: ${escapeHtml(data.bkashNumber)}</p>` : '',
    hasText(data.nagadNumber) ? `<p>Nagad: ${escapeHtml(data.nagadNumber)}</p>` : '',
    hasText(data.rocketNumber) ? `<p>Rocket: ${escapeHtml(data.rocketNumber)}</p>` : '',
    hasText(data.bankDetails)
      ? `<p class="sidebar-muted">${escapeHtml(data.bankDetails)}</p>`
      : '',
  ]
    .filter(Boolean)
    .join('\n          ');

  const bodySectionsHtml = `      <!-- Parties & Invoice Metadata -->
      <section class="parties-grid">
        <div class="bill-to${theme.isDeliveryHighlight ? ' delivery-box' : ''}">
          <p class="section-kicker">${escapeHtml(
            theme.isDeliveryHighlight
              ? isBn
                ? 'ডেলিভারি / ক্রেতার তথ্য'
                : 'DELIVER TO / CUSTOMER'
              : isBn
              ? 'ক্রেতা / বিল প্রাপক'
              : 'BILL TO'
          )}</p>
          <p class="client-name">${escapeHtml(
            data.clientName || (isBn ? 'ক্রেতার নাম' : 'Customer Name')
          )}</p>${
            hasText(data.clientCompany)
              ? `\n          <p class="client-company">${escapeHtml(data.clientCompany)}</p>`
              : ''
          }${
            hasText(data.clientPhone)
              ? `\n          <p class="client-phone">${escapeHtml(
                  (isBn ? 'মোবাইল: ' : 'Phone: ') + data.clientPhone
                )}</p>`
              : ''
          }${
            hasText(data.clientAddress)
              ? `\n          <p class="client-address">${escapeHtml(data.clientAddress)}</p>`
              : ''
          }
        </div>

        <div class="meta-col">${
          hasText(data.invoiceNo)
            ? `\n          <div class="meta-row"><span>${escapeHtml(
                isBn ? 'নম্বর:' : 'No:'
              )}</span><strong>${escapeHtml(data.invoiceNo)}</strong></div>`
            : ''
        }${
          hasText(formattedDate)
            ? `\n          <div class="meta-row"><span>${escapeHtml(
                isBn ? 'তারিখ:' : 'Date:'
              )}</span><span>${escapeHtml(formattedDate)}</span></div>`
            : ''
        }${
          hasText(formattedDueDate)
            ? `\n          <div class="meta-row"><span>${escapeHtml(
                data.docKind === 'quotation'
                  ? isBn
                    ? 'মেয়াদ:'
                    : 'Valid Until:'
                  : isBn
                  ? 'পরিশোধের তারিখ:'
                  : 'Due Date:'
              )}</span><span>${escapeHtml(formattedDueDate)}</span></div>`
            : ''
        }${
          hasText(data.orderRef)
            ? `\n          <div class="meta-row"><span>${escapeHtml(
                isBn ? 'অর্ডার নং:' : 'Order Ref:'
              )}</span><span>${escapeHtml(data.orderRef)}</span></div>`
            : ''
        }${stampBadge ? `\n          <div style="margin-top:8px;">${stampBadge}</div>` : ''}
        </div>
      </section>

      <!-- Line Items Table -->
      <section>
        <table class="items-table">
          <thead>
            <tr>
              <th class="text-center" style="width:40px;">${escapeHtml(isBn ? 'ক্র.' : '#')}</th>
              <th class="text-left">${escapeHtml(isBn ? 'বিবরণ' : 'Description')}</th>
              <th class="text-right" style="width:68px;">${escapeHtml(isBn ? 'পরিমাণ' : 'Qty')}</th>${
                theme.showUnitCol
                  ? `\n              <th class="text-center" style="width:68px;">${escapeHtml(
                      isBn ? 'একক' : 'Unit'
                    )}</th>`
                  : ''
              }
              <th class="text-right" style="width:96px;">${escapeHtml(isBn ? 'দর' : 'Rate')}</th>
              <th class="text-right" style="width:112px;">${escapeHtml(isBn ? 'টাকা' : 'Amount')}</th>
            </tr>
          </thead>
          <tbody>
${rowsHtml}
          </tbody>
        </table>
      </section>

      <!-- Amount in Words, Payment Methods & Totals -->
      <section class="summary-grid">
        <div class="summary-left">${
          theme.showTakaWords
            ? `\n          <div class="taka-words-box">
            <p class="section-kicker">${escapeHtml(
              isBn ? 'কথায় (মোট টাকা)' : 'Amount in Words'
            )}</p>
            <p class="taka-words-value">${escapeHtml(takaWords)}</p>
          </div>`
            : ''
        }${
          !theme.isSidebar && hasPayment
            ? `\n          <div class="payment-box">
            <p class="section-kicker">${escapeHtml(
              isBn ? 'পেমেন্ট তথ্য (বিকাশ / নগদ / ব্যাংক)' : 'Payment Methods (MFS & Bank)'
            )}</p>
            ${paymentItemsHtml}
          </div>`
            : ''
        }
        </div>

        <div class="totals-col">
          <div class="total-row">
            <span>${escapeHtml(isBn ? 'উপ-সর্বমোট:' : 'Subtotal:')}</span>
            <strong>${escapeHtml(formatCurrency(totals.subtotal, language, theme.currency))}</strong>
          </div>${
            totals.discountAmount > 0
              ? `\n          <div class="total-row">
            <span>${escapeHtml(
              (isBn ? 'ডিসকাউন্ট' : 'Discount') +
                (data.discountType === 'percent' ? ` (${data.discountValue}%)` : '') +
                ':'
            )}</span>
            <strong style="color:#9f3324;">- ${escapeHtml(
              formatCurrency(totals.discountAmount, language, theme.currency)
            )}</strong>
          </div>`
              : ''
          }${
            totals.vatAmount > 0
              ? `\n          <div class="total-row">
            <span>${escapeHtml(
              isBn
                ? `ভ্যাট (${formatBDNumber(data.vatPercent, language)}%):`
                : `VAT (${data.vatPercent}%):`
            )}</span>
            <strong>+ ${escapeHtml(formatCurrency(totals.vatAmount, language, theme.currency))}</strong>
          </div>`
              : ''
          }${
            totals.shippingCharge > 0
              ? `\n          <div class="total-row">
            <span>${escapeHtml(isBn ? 'ডেলিভারি চার্জ:' : 'Delivery / Shipping:')}</span>
            <strong>+ ${escapeHtml(
              formatCurrency(totals.shippingCharge, language, theme.currency)
            )}</strong>
          </div>`
              : ''
          }
          <div class="grand-total-bar">
            <span>${escapeHtml(isBn ? 'সর্বমোট বিল' : 'Grand Total')}</span>
            <span>${escapeHtml(formatCurrency(totals.grandTotal, language, theme.currency))}</span>
          </div>${
            totals.advancePaid > 0
              ? `\n          <div class="total-row">
            <span>${escapeHtml(isBn ? 'অগ্রিম / পরিশোধিত:' : 'Advance Paid:')}</span>
            <strong style="color:#15803d;">${escapeHtml(
              formatCurrency(totals.advancePaid, language, theme.currency)
            )}</strong>
          </div>
          <div class="balance-due-bar">
            <span>${escapeHtml(
              theme.isDeliveryHighlight
                ? isBn
                  ? 'ক্যাশ অন ডেলিভারি (বকেয়া)'
                  : 'COD Balance Due'
                : isBn
                ? 'বকেয়া (Due)'
                : 'Balance Due'
            )}</span>
            <span>${escapeHtml(formatCurrency(totals.balanceDue, language, theme.currency))}</span>
          </div>`
              : ''
          }
        </div>
      </section>${
        hasText(data.notes) || hasText(data.terms)
          ? `\n\n      <!-- Notes & Terms -->
      <section class="notes-block">${
        hasText(data.notes)
          ? `\n        <p><strong>${escapeHtml(isBn ? 'নোট: ' : 'Note: ')}</strong>${escapeHtml(
              data.notes
            )}</p>`
          : ''
      }${
        hasText(data.terms)
          ? `\n        <p><strong>${escapeHtml(isBn ? 'শর্তাবলি: ' : 'Terms: ')}</strong>${escapeHtml(
              data.terms
            )}</p>`
          : ''
      }
      </section>`
          : ''
      }

      <!-- Signatures -->
      <section class="signatures">${
        theme.showCustomerSig
          ? `\n        <div class="sig-col">
          <div class="sig-space"></div>
          <div class="sig-line sig-line-customer">${escapeHtml(
            isBn ? 'ক্রেতা / গ্রহণকারীর স্বাক্ষর' : 'Customer / Receiver Signature'
          )}</div>
        </div>`
          : '\n        <div></div>'
      }
        <div class="sig-col">
          <div class="sig-space"></div>
          <div class="sig-line sig-line-auth">${
            hasText(data.authorizedName)
              ? `<div class="sig-name">${escapeHtml(data.authorizedName)}</div>`
              : ''
          }<div>${escapeHtml(
            data.authorizedTitle || (isBn ? 'অনুমোদিত স্বাক্ষর' : 'Authorized Signature')
          )}</div></div>
        </div>
      </section>`;

  const layoutHtml = theme.isSidebar
    ? `  <div class="sheet sheet-sidebar">
    <aside class="sidebar">
      <div>
        <p class="sidebar-kicker">${escapeHtml(docTitle)}</p>
        <h1 class="sidebar-brand">${escapeHtml(
          data.businessName || (isBn ? 'প্রতিষ্ঠানের নাম' : 'Business Name')
        )}</h1>${
          hasText(data.businessTagline)
            ? `\n        <p class="sidebar-tagline">${escapeHtml(data.businessTagline)}</p>`
            : ''
        }
        <div class="sidebar-block">${
          hasText(data.businessPhone) ? `\n          <p>${escapeHtml(data.businessPhone)}</p>` : ''
        }${
          hasText(data.businessEmail) ? `\n          <p>${escapeHtml(data.businessEmail)}</p>` : ''
        }${
          hasText(data.businessAddress)
            ? `\n          <p class="sidebar-muted">${escapeHtml(data.businessAddress)}</p>`
            : ''
        }${
          hasText(data.businessRegNo)
            ? `\n          <p class="sidebar-muted">${escapeHtml(data.businessRegNo)}</p>`
            : ''
        }
        </div>${
          hasPayment
            ? `\n        <div class="sidebar-block">
          <p class="sidebar-kicker">${escapeHtml(isBn ? 'পেমেন্ট' : 'Payment')}</p>
          ${sidebarPaymentHtml}
        </div>`
            : ''
        }
      </div>
      <p class="sidebar-footer">${escapeHtml(data.invoiceNo)}</p>
    </aside>
    <main class="sidebar-main">
${bodySectionsHtml}
    </main>
  </div>`
    : `  <div class="sheet">${
        theme.isDarkBanner
          ? `\n    <header class="banner-header">
      <div>
        <h1 class="banner-brand">${escapeHtml(
          data.businessName || (isBn ? 'প্রতিষ্ঠানের নাম' : 'Business Name')
        )}</h1>${
          hasText(data.businessTagline)
            ? `\n        <p class="banner-sub">${escapeHtml(data.businessTagline)}</p>`
            : ''
        }${
          hasText(bizContact)
            ? `\n        <p class="banner-meta">${escapeHtml(bizContact)}</p>`
            : ''
        }
      </div>
      <div class="banner-right">
        <p class="banner-title">${escapeHtml(docTitle)}</p>${
          hasText(data.businessRegNo)
            ? `\n        <p class="banner-meta">${escapeHtml(data.businessRegNo)}</p>`
            : ''
        }
      </div>
    </header>`
          : ''
      }
    <div class="sheet-body${theme.isCashMemoFrame ? ' has-frame' : ''}">
      <div class="sheet-inner${theme.isCashMemoFrame ? ' framed-box' : ''}">${
        !theme.isDarkBanner
          ? theme.isDoubleBorderCashMemo
            ? `\n      <header class="memo-header-center">
        <h1 class="brand-name">${escapeHtml(
          data.businessName || (isBn ? 'দোকান / প্রতিষ্ঠানের নাম' : 'Shop / Business Name')
        )}</h1>${
          hasText(data.businessTagline)
            ? `\n        <p class="brand-sub">${escapeHtml(data.businessTagline)}</p>`
            : ''
        }${
          hasText(bizContact) ? `\n        <p class="brand-sub">${escapeHtml(bizContact)}</p>` : ''
        }${
          hasText(data.businessRegNo)
            ? `\n        <p class="brand-reg">${escapeHtml(data.businessRegNo)}</p>`
            : ''
        }
        <div style="margin-top:8px;"><span class="memo-title-pill">${escapeHtml(
          docTitle
        )}</span></div>
      </header>`
            : `\n      <header class="standard-header">
        <div>
          <h1 class="brand-name">${escapeHtml(
            data.businessName || (isBn ? 'প্রতিষ্ঠানের নাম' : 'Business Name')
          )}</h1>${
            hasText(data.businessTagline)
              ? `\n          <p class="brand-sub">${escapeHtml(data.businessTagline)}</p>`
              : ''
          }${
            hasText(bizContact)
              ? `\n          <p class="brand-sub">${escapeHtml(bizContact)}</p>`
              : ''
          }${
            hasText(data.businessRegNo)
              ? `\n          <p class="brand-reg">${escapeHtml(data.businessRegNo)}</p>`
              : ''
          }
        </div>
        <div class="doc-title-right">${escapeHtml(docTitle)}</div>
      </header>`
          : ''
      }
${bodySectionsHtml}
      </div>
    </div>
  </div>`;

  const fontLink = theme.useSerif
    ? 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@500;700&display=swap'
    : 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

  const fontFamily = theme.useSerif
    ? '"Cormorant Garamond", "Noto Serif Bengali", Georgia, serif'
    : isBn
    ? '"Hind Siliguri", sans-serif'
    : '"Plus Jakarta Sans", "Hind Siliguri", sans-serif';

  return `<!DOCTYPE html>
<html lang="${isBn ? 'bn' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(docTitle)} — ${escapeHtml(data.businessName || theme.templateName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${fontLink}" rel="stylesheet" />
  <style>
    :root {
      --accent: ${theme.accent};
      --secondary: ${theme.secondary};
      --paper: ${theme.paperTint};
      --ink: #1b1a18;
      --muted: #5c5852;
      --line: ${theme.isPureBW ? '#444444' : '#e2ddd3'};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #ece8df;
      color: var(--ink);
      font-family: ${fontFamily};
      font-size: 12.6px;
      line-height: ${isBn ? 1.58 : 1.5};
      padding: 24px 12px;
      font-variant-numeric: tabular-nums;
    }
    .print-bar {
      max-width: 794px;
      margin: 0 auto 14px;
      display: flex;
      justify-content: flex-end;
    }
    .print-btn {
      background: var(--accent);
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .sheet {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: var(--paper);
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
    }
    .sheet-sidebar { flex-direction: row; }
    .sidebar {
      width: 215px;
      flex-shrink: 0;
      background: var(--accent);
      color: #ffffff;
      padding: ${theme.padY}px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sidebar-kicker { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; opacity: 0.7; font-weight: 700; }
    .sidebar-brand { font-size: 18px; font-weight: 700; line-height: 1.25; margin-top: 4px; }
    .sidebar-tagline { font-size: 11px; opacity: 0.8; margin-top: 4px; }
    .sidebar-block { margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.18); font-size: 11px; display: flex; flex-direction: column; gap: 4px; }
    .sidebar-muted { opacity: 0.78; }
    .sidebar-footer { font-size: 10px; opacity: 0.55; }
    .sidebar-main { flex: 1; padding: ${theme.padY}px ${theme.padX - 8}px; display: flex; flex-direction: column; gap: 18px; }

    .banner-header {
      background: var(--accent);
      color: #ffffff;
      padding: ${Math.max(22, theme.padY - 10)}px ${theme.padX}px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;${theme.isGoldTrim ? '\n      border-bottom: 3px solid #c59b43;' : ''}
    }
    .banner-brand { font-size: 21px; font-weight: 700; line-height: 1.2; }
    .banner-sub { font-size: 11.4px; opacity: 0.85; margin-top: 2px; }
    .banner-meta { font-size: 11px; opacity: 0.78; margin-top: 4px; }
    .banner-right { text-align: right; flex-shrink: 0; }
    .banner-title { font-size: 22px; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; color: ${
      theme.isGoldTrim ? '#f3d082' : '#ffffff'
    }; }

    .sheet-body { flex: 1; display: flex; flex-direction: column; padding: ${
      theme.isCashMemoFrame ? '20px' : `${theme.padY}px ${theme.padX}px`
    }; }
    .sheet-inner { flex: 1; display: flex; flex-direction: column; gap: 18px; }
    .framed-box {
      border: ${
        theme.isDoubleBorderCashMemo ? '4px double var(--accent)' : '1.5px solid var(--accent)'
      };
      padding: ${Math.max(20, theme.padY - 10)}px ${Math.max(24, theme.padX - 10)}px;
    }

    .memo-header-center {
      text-align: center;
      padding-bottom: 14px;
      border-bottom: 3px double var(--accent);
    }
    .memo-title-pill {
      display: inline-block;
      background: var(--accent);
      color: #ffffff;
      padding: 3px 18px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-size: 12.5px;
    }
    .standard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      padding-bottom: 14px;
      border-bottom: 2px solid var(--accent);
    }
    .brand-name { font-size: ${theme.isDoubleBorderCashMemo ? 23 : 21}px; font-weight: 800; color: var(--accent); line-height: 1.2; }
    .brand-sub { font-size: 11.4px; color: #4a4845; margin-top: 3px; }
    .brand-reg { font-size: 10.6px; color: var(--muted); margin-top: 2px; }
    .doc-title-right { font-size: 21px; font-weight: 900; color: var(--accent); letter-spacing: 0.06em; text-transform: uppercase; flex-shrink: 0; }

    .parties-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 16px; align-items: start; }
    .delivery-box { background: var(--secondary); border-left: 4px solid var(--accent); padding: 12px 14px; }
    .section-kicker { font-size: 10.6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); margin-bottom: 4px; }
    .client-name { font-size: 14px; font-weight: 700; color: #111111; }
    .client-company { font-weight: 600; color: #333333; }
    .client-phone { font-weight: 600; color: #222222; font-size: 12.2px; }
    .client-address { color: #4a4845; font-size: 12px; margin-top: 2px; }
    .meta-col { text-align: right; display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
    .meta-row { display: flex; justify-content: flex-end; gap: 8px; }
    .meta-row span:first-child { color: var(--muted); }
    .stamp { display: inline-block; padding: 4px 14px; border: 2.5px solid; border-radius: 4px; font-weight: 900; letter-spacing: 0.12em; transform: rotate(-8deg); opacity: 0.85; }

    .items-table { width: 100%; border-collapse: collapse;${
      theme.isFullGridTable ? ' border: 1.5px solid var(--accent);' : ''
    } }
    .items-table thead tr { background: ${theme.isPureBW ? '#f2f2f2' : 'var(--accent)'}; color: ${
    theme.isPureBW ? '#111111' : '#ffffff'
  };${theme.isPureBW ? ' border-bottom: 2px solid #111111;' : ''} }
    .items-table th { padding: 8px 10px; font-size: 11.6px; font-weight: 700;${
      theme.isFullGridTable
        ? ` border: 1px solid ${theme.isPureBW ? '#222222' : '#cfc9be'};`
        : ''
    } }
    .items-table td { padding: 9px 10px; border-bottom: 1px solid var(--line);${
      theme.isFullGridTable
        ? ` border: 1px solid ${theme.isPureBW ? '#222222' : '#cfc9be'};`
        : ''
    } }
    .items-table tr.zebra { background: var(--secondary); }
    .item-desc { font-weight: 500; color: #171717; }
    .item-total { font-weight: 700; color: #111111; }
    .empty-row { text-align: center; padding: 24px; color: #7c7468; font-style: italic; }
    .text-left { text-align: left; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .muted { color: var(--muted); }

    .summary-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 20px; align-items: start; }
    .summary-left { display: flex; flex-direction: column; gap: 12px; }
    .taka-words-box { background: ${
      theme.isPureBW ? '#f7f7f7' : 'var(--secondary)'
    }; border-left: 3.5px solid var(--accent); padding: 10px 14px; }
    .taka-words-value { font-weight: 600; font-size: 12.2px; color: #171717; }
    .payment-box { border: 1px solid ${
      theme.isPureBW ? '#333333' : `${theme.accent}40`
    }; padding: 10px 14px; font-size: 11.6px; display: flex; flex-direction: column; gap: 3px; }

    .totals-col { display: flex; flex-direction: column; gap: 6px; font-size: 12.2px; }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e0d7; }
    .grand-total-bar { background: ${
      theme.isPureBW ? '#111111' : 'var(--accent)'
    }; color: #ffffff; padding: 8px 12px; font-weight: 800; font-size: 13.8px; display: flex; justify-content: space-between; }
    .balance-due-bar {
      background: ${theme.isDeliveryHighlight ? '#fef2f2' : 'var(--secondary)'};
      border: 1.5px solid ${theme.isDeliveryHighlight ? '#b91c1c' : 'var(--accent)'};
      color: ${theme.isDeliveryHighlight ? '#b91c1c' : '#111111'};
      padding: 6px 12px;
      font-weight: 800;
      font-size: 13.2px;
      display: flex;
      justify-content: space-between;
    }

    .notes-block { border-top: 1px dashed #d6d0c6; padding-top: 10px; font-size: 11.4px; color: #4a4845; display: flex; flex-direction: column; gap: 4px; }

    .signatures { margin-top: auto; padding-top: 28px; display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; }
    .sig-col { min-width: 190px; text-align: center; }
    .sig-space { height: 40px; }
    .sig-line { padding-top: 6px; font-size: 11.5px; color: #333333; }
    .sig-line-customer { border-top: 1px solid #444444; font-weight: 600; }
    .sig-line-auth { border-top: 1.5px solid var(--accent); }
    .sig-name { font-weight: 700; color: #141414; font-size: 12px; }

    @media print {
      @page { size: A4; margin: 0; }
      body { background: #ffffff; padding: 0; }
      .print-bar { display: none; }
      .sheet { box-shadow: none; width: 100%; min-height: 297mm; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <button class="print-btn" onclick="window.print()">${escapeHtml(
      isBn ? 'প্রিন্ট / PDF সেভ করুন' : 'Print / Save as PDF'
    )}</button>
  </div>
${layoutHtml}
</body>
</html>`;
}

/**
 * Generates a drop-in, zero-dependency React + TypeScript + Tailwind component
 * matching the selected Cash Memo / Invoice template.
 */
export function generateInvoiceReactCode(
  templateId: string,
  data: InvoiceData,
  language: DocLanguage,
  customization?: DocCustomization
): string {
  const isBn = language === 'bn';
  const theme = resolveTheme(templateId, customization);
  const compName = getInvoiceComponentName(templateId);
  const docTitle = getDocTitle(data, language);

  const samplePayload = {
    docTitle,
    invoiceNo: data.invoiceNo || 'INV-2026-001',
    date: data.date || new Date().toISOString().slice(0, 10),
    dueDate: data.dueDate || '',
    orderRef: data.orderRef || '',
    businessName: data.businessName || (isBn ? 'প্রতিষ্ঠানের নাম' : 'Your Business Name'),
    businessTagline: data.businessTagline || '',
    businessAddress: data.businessAddress || '',
    businessPhone: data.businessPhone || '',
    businessEmail: data.businessEmail || '',
    businessRegNo: data.businessRegNo || '',
    clientName: data.clientName || (isBn ? 'ক্রেতার নাম' : 'Customer Name'),
    clientCompany: data.clientCompany || '',
    clientPhone: data.clientPhone || '',
    clientAddress: data.clientAddress || '',
    items: data.items.map((it) => ({
      id: it.id,
      description: it.description,
      qty: it.qty,
      unit: it.unit,
      rate: it.rate,
    })),
    discountType: data.discountType,
    discountValue: data.discountValue,
    vatPercent: data.vatPercent,
    shippingCharge: data.shippingCharge,
    advancePaid: data.advancePaid,
    bkashNumber: data.bkashNumber || '',
    nagadNumber: data.nagadNumber || '',
    rocketNumber: data.rocketNumber || '',
    bankDetails: data.bankDetails || '',
    notes: data.notes || '',
    terms: data.terms || '',
    authorizedName: data.authorizedName || '',
    authorizedTitle: data.authorizedTitle || (isBn ? 'অনুমোদিত স্বাক্ষর' : 'Authorized Signature'),
  };

  const sampleJson = JSON.stringify(samplePayload, null, 2);

  return `import React from 'react';

export interface CashMemoItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
}

export interface CashMemoPropsData {
  docTitle: string;
  invoiceNo: string;
  date: string;
  dueDate?: string;
  orderRef?: string;
  businessName: string;
  businessTagline?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessRegNo?: string;
  clientName: string;
  clientCompany?: string;
  clientPhone?: string;
  clientAddress?: string;
  items: CashMemoItem[];
  discountType: 'flat' | 'percent';
  discountValue: number;
  vatPercent: number;
  shippingCharge: number;
  advancePaid: number;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  bankDetails?: string;
  notes?: string;
  terms?: string;
  authorizedName?: string;
  authorizedTitle?: string;
}

export const SAMPLE_CASH_MEMO: CashMemoPropsData = ${sampleJson};

const CURRENCY = ${JSON.stringify(theme.currency)};
const ACCENT = ${JSON.stringify(theme.accent)};
const SECONDARY = ${JSON.stringify(theme.secondary)};
const PAPER = ${JSON.stringify(theme.paperTint)};

function formatMoney(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return \`\${CURRENCY} \${rounded.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  })}\`;
}

export function ${compName}({ data = SAMPLE_CASH_MEMO }: { data?: CashMemoPropsData }) {
  const subtotal = data.items.reduce(
    (sum, item) => sum + Math.max(0, item.qty) * Math.max(0, item.rate),
    0
  );
  const discountAmount =
    data.discountType === 'percent'
      ? (subtotal * Math.max(0, data.discountValue)) / 100
      : Math.max(0, data.discountValue);
  const taxable = Math.max(0, subtotal - discountAmount);
  const vatAmount = (taxable * Math.max(0, data.vatPercent)) / 100;
  const grandTotal = taxable + vatAmount + Math.max(0, data.shippingCharge);
  const balanceDue = Math.max(0, grandTotal - Math.max(0, data.advancePaid));

  const businessMeta = [data.businessAddress, data.businessPhone, data.businessEmail]
    .filter(Boolean)
    .join(' · ');
  const hasPayment = Boolean(
    data.bkashNumber || data.nagadNumber || data.rocketNumber || data.bankDetails
  );

  const bodyContent = (
    <>
      {/* Customer & Invoice Info */}
      <section className="grid grid-cols-12 gap-4 items-start">
        <div
          className="col-span-7${theme.isDeliveryHighlight ? ' p-3.5' : ''}"${
            theme.isDeliveryHighlight
              ? `\n          style={{ backgroundColor: SECONDARY, borderLeft: \`4px solid \${ACCENT}\` }}`
              : ''
          }
        >
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
            ${isBn ? 'ক্রেতা / বিল প্রাপক' : 'BILL TO'}
          </p>
          <p className="text-sm font-bold text-neutral-900">{data.clientName}</p>
          {data.clientCompany && <p className="text-xs font-semibold text-neutral-700">{data.clientCompany}</p>}
          {data.clientPhone && <p className="text-xs font-semibold text-neutral-800">{data.clientPhone}</p>}
          {data.clientAddress && <p className="text-xs text-neutral-600 mt-0.5">{data.clientAddress}</p>}
        </div>

        <div className="col-span-5 text-right text-xs space-y-1 tabular-nums">
          {data.invoiceNo && (
            <div className="flex justify-end gap-2">
              <span className="text-neutral-500">${isBn ? 'নম্বর:' : 'No:'}</span>
              <span className="font-bold text-neutral-900">{data.invoiceNo}</span>
            </div>
          )}
          {data.date && (
            <div className="flex justify-end gap-2">
              <span className="text-neutral-500">${isBn ? 'তারিখ:' : 'Date:'}</span>
              <span className="font-semibold">{data.date}</span>
            </div>
          )}
          {data.dueDate && (
            <div className="flex justify-end gap-2">
              <span className="text-neutral-500">${isBn ? 'মেয়াদ / তারিখ:' : 'Due Date:'}</span>
              <span className="font-semibold">{data.dueDate}</span>
            </div>
          )}
          {data.orderRef && (
            <div className="flex justify-end gap-2">
              <span className="text-neutral-500">${isBn ? 'অর্ডার নং:' : 'Order Ref:'}</span>
              <span className="font-semibold">{data.orderRef}</span>
            </div>
          )}
        </div>
      </section>

      {/* Line Items Table */}
      <section>
        <table
          className="w-full border-collapse text-xs tabular-nums"
          style={${theme.isFullGridTable ? `{ border: \`1.5px solid \${ACCENT}\` }` : 'undefined'}}
        >
          <thead>
            <tr
              style={{
                backgroundColor: ${theme.isPureBW ? `'#f2f2f2'` : 'ACCENT'},
                color: ${theme.isPureBW ? `'#111111'` : `'#ffffff'`},
              }}
            >
              <th className="py-2 px-2.5 text-center font-bold w-10">${isBn ? 'ক্র.' : '#'}</th>
              <th className="py-2 px-3 text-left font-bold">${isBn ? 'বিবরণ' : 'Description'}</th>
              <th className="py-2 px-2.5 text-right font-bold w-16">${isBn ? 'পরিমাণ' : 'Qty'}</th>${
                theme.showUnitCol
                  ? `\n              <th className="py-2 px-2 text-center font-bold w-16">${
                      isBn ? 'একক' : 'Unit'
                    }</th>`
                  : ''
              }
              <th className="py-2 px-2.5 text-right font-bold w-24">${isBn ? 'দর' : 'Rate'}</th>
              <th className="py-2 px-3 text-right font-bold w-28">${isBn ? 'টাকা' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr
                key={item.id}
                className="border-b border-neutral-200"
                style={{
                  backgroundColor: ${
                    theme.isZebraRows ? `idx % 2 === 1 ? SECONDARY : '#ffffff'` : `'#ffffff'`
                  },
                }}
              >
                <td className="py-2.5 px-2.5 text-center text-neutral-500">{idx + 1}</td>
                <td className="py-2.5 px-3 font-medium text-neutral-900">{item.description}</td>
                <td className="py-2.5 px-2.5 text-right">{item.qty}</td>${
                  theme.showUnitCol
                    ? `\n                <td className="py-2.5 px-2 text-center text-neutral-500">{item.unit}</td>`
                    : ''
                }
                <td className="py-2.5 px-2.5 text-right">{formatMoney(item.rate)}</td>
                <td className="py-2.5 px-3 text-right font-bold text-neutral-900">
                  {formatMoney(Math.max(0, item.qty) * Math.max(0, item.rate))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Payment Block & Totals */}
      <section className="grid grid-cols-12 gap-5 items-start">
        <div className="col-span-7 space-y-3">
          {${!theme.isSidebar ? 'hasPayment' : 'false'} && (
            <div className="px-3.5 py-2.5 border text-xs space-y-1" style={{ borderColor: \`\${ACCENT}40\` }}>
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                ${isBn ? 'পেমেন্ট তথ্য (বিকাশ / নগদ / ব্যাংক)' : 'Payment Methods (MFS & Bank)'}
              </p>
              {data.bkashNumber && <p><strong className="text-pink-700">bKash:</strong> {data.bkashNumber}</p>}
              {data.nagadNumber && <p><strong className="text-orange-700">Nagad:</strong> {data.nagadNumber}</p>}
              {data.rocketNumber && <p><strong className="text-purple-700">Rocket:</strong> {data.rocketNumber}</p>}
              {data.bankDetails && <p><strong>${isBn ? 'ব্যাংক:' : 'Bank:'}</strong> {data.bankDetails}</p>}
            </div>
          )}
        </div>

        <div className="col-span-5 text-xs tabular-nums space-y-1.5">
          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-600">${isBn ? 'উপ-সর্বমোট:' : 'Subtotal:'}</span>
            <span className="font-semibold">{formatMoney(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-600">${isBn ? 'ডিসকাউন্ট:' : 'Discount:'}</span>
              <span className="font-semibold text-red-700">- {formatMoney(discountAmount)}</span>
            </div>
          )}
          {vatAmount > 0 && (
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-600">${isBn ? 'ভ্যাট' : 'VAT'} ({data.vatPercent}%):</span>
              <span className="font-semibold">+ {formatMoney(vatAmount)}</span>
            </div>
          )}
          {data.shippingCharge > 0 && (
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-600">${isBn ? 'ডেলিভারি চার্জ:' : 'Shipping:'}</span>
              <span className="font-semibold">+ {formatMoney(data.shippingCharge)}</span>
            </div>
          )}
          <div
            className="flex justify-between items-center px-3 py-2 font-extrabold text-sm text-white"
            style={{ backgroundColor: ${theme.isPureBW ? `'#111111'` : 'ACCENT'} }}
          >
            <span>${isBn ? 'সর্বমোট বিল' : 'Grand Total'}</span>
            <span>{formatMoney(grandTotal)}</span>
          </div>
          {data.advancePaid > 0 && (
            <>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-600">${isBn ? 'অগ্রিম / পরিশোধিত:' : 'Advance Paid:'}</span>
                <span className="font-semibold text-emerald-700">{formatMoney(data.advancePaid)}</span>
              </div>
              <div
                className="flex justify-between items-center px-3 py-1.5 font-extrabold"
                style={{ backgroundColor: SECONDARY, border: \`1.5px solid \${ACCENT}\` }}
              >
                <span>${isBn ? 'বকেয়া (Due)' : 'Balance Due'}</span>
                <span>{formatMoney(balanceDue)}</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Notes & Terms */}
      {(data.notes || data.terms) && (
        <section className="pt-2.5 border-t border-dashed border-neutral-300 text-xs text-neutral-600 space-y-1">
          {data.notes && <p><strong className="text-neutral-900">${isBn ? 'নোট: ' : 'Note: '}</strong>{data.notes}</p>}
          {data.terms && <p><strong className="text-neutral-900">${isBn ? 'শর্তাবলি: ' : 'Terms: '}</strong>{data.terms}</p>}
        </section>
      )}

      {/* Signatures */}
      <section className="pt-8 mt-auto flex items-end justify-between gap-8 text-xs">
        ${
          theme.showCustomerSig
            ? `<div className="min-w-[180px] text-center">
          <div className="h-10" />
          <div className="border-t border-neutral-600 pt-1.5 font-semibold text-neutral-700">
            ${isBn ? 'ক্রেতা / গ্রহণকারীর স্বাক্ষর' : 'Customer Signature'}
          </div>
        </div>`
            : '<div />'
        }
        <div className="min-w-[200px] text-center">
          <div className="h-10" />
          <div className="pt-1.5" style={{ borderTop: \`1.5px solid \${ACCENT}\` }}>
            {data.authorizedName && <p className="font-bold text-neutral-900">{data.authorizedName}</p>}
            <p className="text-neutral-600">{data.authorizedTitle}</p>
          </div>
        </div>
      </section>
    </>
  );

  ${
    theme.isSidebar
      ? `return (
    <div
      className="w-[794px] min-h-[1123px] mx-auto flex text-neutral-900 print:w-full print:shadow-none shadow-md"
      style={{ backgroundColor: PAPER }}
    >
      <aside
        className="w-[215px] shrink-0 text-white p-6 flex flex-col justify-between"
        style={{ backgroundColor: ACCENT }}
      >
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold">{data.docTitle}</p>
            <h1 className="text-lg font-bold mt-1">{data.businessName}</h1>
            {data.businessTagline && <p className="text-xs text-white/75 mt-1">{data.businessTagline}</p>}
          </div>
          <div className="text-xs text-white/85 pt-3 border-t border-white/15 space-y-1">
            {data.businessPhone && <p>{data.businessPhone}</p>}
            {data.businessEmail && <p className="break-all">{data.businessEmail}</p>}
            {data.businessAddress && <p className="text-white/75">{data.businessAddress}</p>}
          </div>
          {hasPayment && (
            <div className="text-xs text-white/90 pt-3 border-t border-white/15 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">${
                isBn ? 'পেমেন্ট' : 'Payment'
              }</p>
              {data.bkashNumber && <p>bKash: {data.bkashNumber}</p>}
              {data.nagadNumber && <p>Nagad: {data.nagadNumber}</p>}
              {data.rocketNumber && <p>Rocket: {data.rocketNumber}</p>}
              {data.bankDetails && <p className="text-white/80">{data.bankDetails}</p>}
            </div>
          )}
        </div>
        <p className="text-[10px] text-white/55">{data.invoiceNo}</p>
      </aside>
      <main className="flex-1 p-8 flex flex-col gap-5">{bodyContent}</main>
    </div>
  );`
      : `return (
    <div
      className="w-[794px] min-h-[1123px] mx-auto flex flex-col text-neutral-900 print:w-full print:shadow-none shadow-md"
      style={{ backgroundColor: PAPER }}
    >${
      theme.isDarkBanner
        ? `
      <header
        className="text-white px-10 py-6 flex items-center justify-between gap-6"
        style={{ backgroundColor: ACCENT${
          theme.isGoldTrim ? `, borderBottom: '3px solid #c59b43'` : ''
        } }}
      >
        <div>
          <h1 className="text-xl font-bold">{data.businessName}</h1>
          {data.businessTagline && <p className="text-xs text-white/80 mt-0.5">{data.businessTagline}</p>}
          {businessMeta && <p className="text-[11px] text-white/75 mt-1">{businessMeta}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black tracking-wider uppercase" style={{ color: ${
            theme.isGoldTrim ? `'#f3d082'` : `'#ffffff'`
          } }}>
            {data.docTitle}
          </p>
          {data.businessRegNo && <p className="text-[11px] text-white/75 mt-1">{data.businessRegNo}</p>}
        </div>
      </header>`
        : ''
    }
      <div className="${theme.isCashMemoFrame ? 'p-5' : 'px-10 py-9'} flex-1 flex flex-col">
        <div
          className="flex-1 flex flex-col gap-5"${
            theme.isCashMemoFrame
              ? `\n          style={{ border: \`${
                  theme.isDoubleBorderCashMemo ? '4px double' : '1.5px solid'
                } \${ACCENT}\`, padding: '24px 28px' }}`
              : ''
          }
        >${
          !theme.isDarkBanner
            ? theme.isDoubleBorderCashMemo
              ? `
          <header className="text-center pb-3.5 space-y-1" style={{ borderBottom: \`3px double \${ACCENT}\` }}>
            <h1 className="text-2xl font-black" style={{ color: ACCENT }}>{data.businessName}</h1>
            {data.businessTagline && <p className="text-xs text-neutral-600">{data.businessTagline}</p>}
            {businessMeta && <p className="text-xs text-neutral-600">{businessMeta}</p>}
            <div className="pt-1.5">
              <span className="inline-block px-5 py-0.5 text-xs font-extrabold tracking-widest uppercase text-white" style={{ backgroundColor: ACCENT }}>
                {data.docTitle}
              </span>
            </div>
          </header>`
              : `
          <header className="pb-3.5 flex items-start justify-between gap-6" style={{ borderBottom: \`2px solid \${ACCENT}\` }}>
            <div>
              <h1 className="text-xl font-bold" style={{ color: ACCENT }}>{data.businessName}</h1>
              {data.businessTagline && <p className="text-xs text-neutral-600 mt-0.5">{data.businessTagline}</p>}
              {businessMeta && <p className="text-[11px] text-neutral-500 mt-1">{businessMeta}</p>}
            </div>
            <p className="text-xl font-black tracking-wider uppercase shrink-0" style={{ color: ACCENT }}>
              {data.docTitle}
            </p>
          </header>`
            : ''
        }
          {bodyContent}
        </div>
      </div>
    </div>
  );`
  }
}
`;
}

/**
 * Generates a structured JSON schema + live totals payload for the selected
 * Cash Memo / Invoice template.
 */
export function generateInvoiceJsonCode(
  templateId: string,
  data: InvoiceData,
  language: DocLanguage,
  customization?: DocCustomization
): string {
  const theme = resolveTheme(templateId, customization);
  const totals = calculateInvoiceTotals(data);
  const takaWords =
    data.takaWordsOverride.trim() ||
    toTakaInWords(totals.grandTotal, language, theme.currency);

  const payload = {
    template: {
      id: templateId,
      name: theme.templateName,
      accentColor: theme.accent,
      secondaryColor: theme.secondary,
      paperTint: theme.paperTint,
      currency: theme.currency,
      language,
    },
    document: {
      kind: data.docKind,
      title: getDocTitle(data, language),
      invoiceNo: data.invoiceNo,
      date: data.date,
      dueDate: data.dueDate,
      orderRef: data.orderRef,
      stamp: theme.stamp,
    },
    business: {
      name: data.businessName,
      tagline: data.businessTagline,
      address: data.businessAddress,
      phone: data.businessPhone,
      email: data.businessEmail,
      website: data.businessWebsite,
      registrationNo: data.businessRegNo,
    },
    customer: {
      name: data.clientName,
      company: data.clientCompany,
      phone: data.clientPhone,
      address: data.clientAddress,
    },
    items: data.items.map((item, index) => ({
      sl: index + 1,
      description: item.description,
      qty: item.qty,
      unit: item.unit,
      rate: item.rate,
      lineTotal: Math.max(0, item.qty) * Math.max(0, item.rate),
    })),
    totals: {
      subtotal: totals.subtotal,
      discountType: data.discountType,
      discountValue: data.discountValue,
      discountAmount: totals.discountAmount,
      vatPercent: data.vatPercent,
      vatAmount: totals.vatAmount,
      shippingCharge: totals.shippingCharge,
      grandTotal: totals.grandTotal,
      advancePaid: totals.advancePaid,
      balanceDue: totals.balanceDue,
      amountInWords: takaWords,
    },
    paymentMethods: {
      bkash: data.bkashNumber,
      nagad: data.nagadNumber,
      rocket: data.rocketNumber,
      bank: data.bankDetails,
    },
    notes: data.notes,
    terms: data.terms,
    authorizedBy: {
      name: data.authorizedName,
      title: data.authorizedTitle,
    },
  };

  return JSON.stringify(payload, null, 2);
}
