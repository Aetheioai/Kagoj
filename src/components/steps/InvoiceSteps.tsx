import React from 'react';
import { Calculator, Plus, Trash2, UserCheck } from 'lucide-react';
import {
  DocCustomization,
  DocLanguage,
  InvoiceData,
  InvoiceDocKind,
  InvoiceLineItem,
} from '../../types/builder';
import {
  calculateInvoiceTotals,
  formatCurrency,
  toTakaInWords,
} from '../../utils/bdNumbers';
import { makeId } from '../../utils/storage';
import { FieldWrapper, PhotoUploader, SketchDivider } from '../SketchChrome';
import { SignatureUploader } from '../SignaturePadModal';

interface InvoiceStepsProps {
  step: number; // 1 = Doc Type & Business Branding, 2 = Client & Line Items, 3 = Totals, bKash/Bank & Signature
  data: InvoiceData;
  language: DocLanguage;
  customization: DocCustomization;
  hasCvData: boolean;
  onFillFromCv: () => void;
  onChangeCustomization: (next: DocCustomization) => void;
  onChange: (next: InvoiceData) => void;
}

export function InvoiceSteps({
  step,
  data,
  language,
  customization,
  hasCvData,
  onFillFromCv,
  onChangeCustomization,
  onChange,
}: InvoiceStepsProps) {
  const isBn = language === 'bn';
  const update = (patch: Partial<InvoiceData>) => onChange({ ...data, ...patch });
  const currency = customization.currencySymbol || '৳';
  const totals = calculateInvoiceTotals(data);

  // =========================================================================
  // STEP 1: DOCUMENT TYPE, BUSINESS DETAILS & LOGO
  // =========================================================================
  if (step === 1) {
    const docKinds: { id: InvoiceDocKind; en: string; bn: string }[] = [
      { id: 'invoice', en: 'Invoice', bn: 'ইনভয়েস' },
      { id: 'cash_memo', en: 'Cash Memo', bn: 'ক্যাশ মেমো' },
      { id: 'quotation', en: 'Quotation', bn: 'কোটেশন' },
      { id: 'bill', en: 'Bill / Receipt', bn: 'বিল / রসিদ' },
    ];

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="sketch-heading text-3xl text-[#24211d]">
              {isBn ? 'প্রতিষ্ঠানের তথ্য ও বিলের ধরন' : 'Business Details & Document Type'}
            </h2>
            <p className="text-xs text-[#5c564d] mt-1">
              {isBn
                ? 'ক্যাশ মেমো, ইনভয়েস বা কোটেশন বেছে নিন এবং আপনার দোকান বা কোম্পানির তথ্য দিন।'
                : 'Select Invoice, Cash Memo, or Quotation and enter your shop, studio, or company branding.'}
            </p>
          </div>
          {hasCvData && (
            <button
              type="button"
              onClick={onFillFromCv}
              className="sketch-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#eef6f2] text-[#1e5645] cursor-pointer whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {isBn ? 'সিভি থেকে তথ্য আনুন' : 'Fill from my CV'}
            </button>
          )}
        </div>

        {/* Document Kind Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#5c564d] block">
            {isBn ? 'ডকুমেন্টের ধরন:' : 'Document Type:'}
          </span>
          <div className="inline-flex flex-wrap border-[1.5px] border-[#3a3630] rounded-lg overflow-hidden bg-[#f7f2e7]">
            {docKinds.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => update({ docKind: k.id })}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  data.docKind === k.id
                    ? 'bg-[#1e5645] text-[#fffdf8]'
                    : 'text-[#5c564d] hover:text-[#24211d]'
                }`}
              >
                {isBn ? k.bn : k.en}
              </button>
            ))}
          </div>
        </div>

        <PhotoUploader
          photo={data.logo}
          showPhoto={data.showLogo}
          language={language}
          mode="invoice"
          personName={data.businessName}
          photoShape="rounded"
          onPhotoChange={(img) => update({ logo: img, showLogo: true })}
          onToggleShow={() => update({ showLogo: !data.showLogo })}
          onRemove={() => update({ logo: '', showLogo: false })}
          labels={{
            upload: isBn ? 'ব্যবসার লোগো আপলোড (ঐচ্ছিক)' : 'Upload Business Logo (Optional)',
            replace: isBn ? 'লোগো বদলান' : 'Replace Logo',
            remove: isBn ? 'মুছুন' : 'Remove',
            visible: isBn ? 'লোগো দৃশ্যমান' : 'Logo Visible',
            hidden: isBn ? 'লোগো লুকানো' : 'Logo Hidden',
          }}
          helperText={
            isBn
              ? 'দোকান, পেজ বা কোম্পানির লোগো থাকলে দিন — ক্রপ করে সুন্দরভাবে বসাতে পারবেন।'
              : 'Optional business or shop logo; opens the crop editor before placing it on your invoice.'
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FieldWrapper label={isBn ? 'দোকান / প্রতিষ্ঠানের নাম' : 'Business / Shop Name'}>
            <input
              type="text"
              value={data.businessName}
              onChange={(e) => update({ businessName: e.target.value })}
              placeholder={isBn ? 'রূপসী বাংলা শাড়ি ও বুটিক হাউস' : 'Bengal Craft & Tech Studio'}
              className="sketch-input w-full px-3 py-2 text-sm font-semibold"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'ট্যাগলাইন / ব্যবসার বিবরণ' : 'Tagline / Specialty'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
          >
            <input
              type="text"
              value={data.businessTagline}
              onChange={(e) => update({ businessTagline: e.target.value })}
              placeholder={isBn ? 'তাঁতের শাড়ি ও ঐতিহ্যবাহী পোশাক' : 'Web Design, Branding & Print Solutions'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper label={isBn ? 'ফোন নম্বর' : 'Business Phone'}>
            <input
              type="text"
              value={data.businessPhone}
              onChange={(e) => update({ businessPhone: e.target.value })}
              placeholder={isBn ? '০১৭১২-৯০৮০৭০' : '+880 1712-908070'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'ইমেইল / ফেসবুক পেজ' : 'Email / Website'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
          >
            <input
              type="text"
              value={data.businessEmail}
              onChange={(e) => update({ businessEmail: e.target.value })}
              placeholder="billing@business.com"
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper label={isBn ? 'দোকান / অফিসের ঠিকানা' : 'Business Address'} className="sm:col-span-2">
            <input
              type="text"
              value={data.businessAddress}
              onChange={(e) => update({ businessAddress: e.target.value })}
              placeholder={isBn ? 'দোকান ১৪, নিউ মার্কেট, ঢাকা-১২০৫' : 'Level 4, House 12, Road 11, Banani, Dhaka-1213'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'বিন / টিন / ট্রেড লাইসেন্স' : 'BIN / TIN / Trade License'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
          >
            <input
              type="text"
              value={data.businessRegNo}
              onChange={(e) => update({ businessRegNo: e.target.value })}
              placeholder={isBn ? 'ট্রেড লাইসেন্স: DSCC-০৪১৯২২' : 'BIN: 002489105-0102'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'কাস্টম শিরোনাম (যদি বদলাতে চান)' : 'Custom Document Title'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
          >
            <input
              type="text"
              value={data.customDocTitle}
              onChange={(e) => update({ customDocTitle: e.target.value })}
              placeholder={isBn ? 'যেমন: প্রোফর্মা ইনভয়েস' : 'e.g. PROFORMA INVOICE'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 2: CLIENT DETAILS, INVOICE META & LINE ITEMS TABLE
  // =========================================================================
  if (step === 2) {
    const addItem = () => {
      const next: InvoiceLineItem = {
        id: makeId('it'),
        description: '',
        qty: 1,
        unit: isBn ? 'পিস' : 'pcs',
        rate: 0,
      };
      update({ items: [...data.items, next] });
    };

    const updateItem = (id: string, patch: Partial<InvoiceLineItem>) => {
      update({
        items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      });
    };

    const removeItem = (id: string) => {
      update({ items: data.items.filter((it) => it.id !== id) });
    };

    return (
      <div className="space-y-5">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">
            {isBn ? 'ক্রেতার তথ্য ও পণ্যের তালিকা' : 'Client Details & Line Items'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isBn
              ? 'ক্রেতার নাম ও প্রতিটি পণ্যের পরিমাণ ও দর লিখুন — মোট হিসাব স্বয়ংক্রিয়ভাবে হবে।'
              : 'Enter customer details and line items — totals and Bangladeshi Taka-in-words compute automatically.'}
          </p>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FieldWrapper label={isBn ? 'মেমো / ইনভয়েস নং' : 'Invoice No.'}>
            <input
              type="text"
              value={data.invoiceNo}
              onChange={(e) => update({ invoiceNo: e.target.value })}
              placeholder="INV-2026-001"
              className="sketch-input w-full px-2.5 py-2 text-xs font-semibold"
            />
          </FieldWrapper>

          <FieldWrapper label={isBn ? 'তারিখ' : 'Date'}>
            <input
              type="date"
              value={data.date}
              onChange={(e) => update({ date: e.target.value })}
              className="sketch-input w-full px-2.5 py-2 text-xs"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'মেয়াদ / শেষ তারিখ' : 'Due / Valid Until'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Opt.'}
          >
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => update({ dueDate: e.target.value })}
              className="sketch-input w-full px-2.5 py-2 text-xs"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'অর্ডার / PO নং' : 'Order / PO Ref'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Opt.'}
          >
            <input
              type="text"
              value={data.orderRef}
              onChange={(e) => update({ orderRef: e.target.value })}
              placeholder="PO-8841"
              className="sketch-input w-full px-2.5 py-2 text-xs"
            />
          </FieldWrapper>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FieldWrapper label={isBn ? 'ক্রেতা / ক্লায়েন্টের নাম' : 'Client / Customer Name'}>
            <input
              type="text"
              value={data.clientName}
              onChange={(e) => update({ clientName: e.target.value })}
              placeholder={isBn ? 'জনাবা নুসরাত জাহান' : 'Mr. Rafiqul Islam'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'প্রতিষ্ঠান (যদি থাকে)' : 'Client Company'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
          >
            <input
              type="text"
              value={data.clientCompany}
              onChange={(e) => update({ clientCompany: e.target.value })}
              placeholder={isBn ? 'প্রতিষ্ঠানের নাম' : 'GreenDelta Agro Foods Ltd.'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper label={isBn ? 'ক্রেতার মোবাইল' : 'Client Phone'}>
            <input
              type="text"
              value={data.clientPhone}
              onChange={(e) => update({ clientPhone: e.target.value })}
              placeholder={isBn ? '০১৮১১-৪৪৫৫৬৬' : '+880 1811-445566'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper label={isBn ? 'ক্রেতার ঠিকানা / ডেলিভারি ঠিকানা' : 'Client / Delivery Address'}>
            <input
              type="text"
              value={data.clientAddress}
              onChange={(e) => update({ clientAddress: e.target.value })}
              placeholder={isBn ? 'বাসা ৯, রোড ৪, ধানমন্ডি, ঢাকা' : 'Plot 27, Gulshan Avenue, Dhaka-1212'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>
        </div>

        <SketchDivider className="my-2" />

        {/* Dynamic Line Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1e5645]">
              {isBn ? 'পণ্য ও সেবার তালিকা' : 'Items & Services'}
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="sketch-btn inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#1e5645] text-[#fffdf8] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {isBn ? 'আইটেম যোগ করুন' : 'Add Item'}
            </button>
          </div>

          {data.items.length === 0 ? (
            <div className="sketch-box-dashed p-5 text-center text-xs text-[#6f685e]">
              {isBn
                ? 'এখনো কোনো পণ্য যোগ করা হয়নি। "আইটেম যোগ করুন" বাটনে ক্লিক করুন।'
                : 'No line items yet. Click "Add Item" to start billing.'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {data.items.map((item, idx) => {
                const lineTotal = Math.max(0, item.qty) * Math.max(0, item.rate);
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-[#d6cfc0] bg-[#fffdf8] space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#5c564d] tabular-nums">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#1e5645] tabular-nums">
                          {formatCurrency(lineTotal, language, currency)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[#9f3324] hover:bg-[#fdf2f2] p-1 rounded cursor-pointer"
                          aria-label={isBn ? 'মুছুন' : 'Delete item'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder={
                        isBn
                          ? 'পণ্য বা সেবার বিবরণ (যেমন: ঢাকাই জামদানি শাড়ি)'
                          : 'Item or service description'
                      }
                      className="sketch-input w-full px-2.5 py-1.5 text-sm"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-[#6f685e] block mb-0.5">
                          {isBn ? 'পরিমাণ' : 'Qty'}
                        </span>
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(item.id, { qty: parseFloat(e.target.value) || 0 })
                          }
                          className="sketch-input w-full px-2.5 py-1.5 text-xs tabular-nums"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-[#6f685e] block mb-0.5">
                          {isBn ? 'একক' : 'Unit'}
                        </span>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                          placeholder={isBn ? 'পিস / সেট' : 'pcs / set'}
                          className="sketch-input w-full px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-[#6f685e] block mb-0.5">
                          {isBn ? `দর (${currency})` : `Rate (${currency})`}
                        </span>
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(item.id, { rate: parseFloat(e.target.value) || 0 })
                          }
                          className="sketch-input w-full px-2.5 py-1.5 text-xs tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mini live subtotal bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#eef6f2] border border-[#1e5645]/30 text-xs font-semibold text-[#1e5645]">
            <span className="inline-flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              {isBn ? 'মোট উপ-সর্বমোট (Subtotal)' : 'Items Subtotal'}
            </span>
            <span className="text-sm font-bold tabular-nums">
              {formatCurrency(totals.subtotal, language, currency)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 3: DISCOUNT, VAT, TAKA-IN-WORDS, BKASH/NAGAD/BANK & SIGNATURE
  // =========================================================================
  const autoWords = toTakaInWords(totals.grandTotal, language, currency);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="sketch-heading text-3xl text-[#24211d]">
          {isBn ? 'ডিসকাউন্ট, ভ্যাট, পেমেন্ট ও স্বাক্ষর' : 'Totals, Payment & Signature'}
        </h2>
        <p className="text-xs text-[#5c564d] mt-1">
          {isBn
            ? 'ডিসকাউন্ট, ভ্যাট, ডেলিভারি চার্জ, অগ্রিম পরিশোধ এবং বিকাশ/নগদ/ব্যাংক তথ্য যুক্ত করুন।'
            : 'Configure discount, VAT, delivery charge, advance paid, bKash/Nagad/Bank details, and signature.'}
        </p>
      </div>

      {/* Totals Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <span className="block text-xs font-semibold text-[#24211d] mb-1">
            {isBn ? 'ডিসকাউন্ট' : 'Discount'}
          </span>
          <div className="flex">
            <input
              type="number"
              min={0}
              step="any"
              value={data.discountValue}
              onChange={(e) => update({ discountValue: parseFloat(e.target.value) || 0 })}
              className="sketch-input w-full px-2.5 py-1.5 text-xs tabular-nums rounded-r-none"
            />
            <button
              type="button"
              onClick={() =>
                update({
                  discountType: data.discountType === 'fixed' ? 'percent' : 'fixed',
                })
              }
              className="px-2.5 py-1.5 text-xs font-bold bg-[#f1eadc] border border-l-0 border-[#3a3630] rounded-r-md cursor-pointer"
              title={isBn ? '৳ অথবা % বদলান' : 'Toggle fixed or %'}
            >
              {data.discountType === 'percent' ? '%' : currency}
            </button>
          </div>
        </div>

        <FieldWrapper label={isBn ? 'ভ্যাট / ট্যাক্স (%)' : 'VAT / Tax (%)'}>
          <input
            type="number"
            min={0}
            max={100}
            step="any"
            value={data.vatPercent}
            onChange={(e) => update({ vatPercent: parseFloat(e.target.value) || 0 })}
            className="sketch-input w-full px-2.5 py-1.5 text-xs tabular-nums"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? `ডেলিভারি চার্জ (${currency})` : `Delivery / Shipping (${currency})`}>
          <input
            type="number"
            min={0}
            step="any"
            value={data.shippingCharge}
            onChange={(e) => update({ shippingCharge: parseFloat(e.target.value) || 0 })}
            className="sketch-input w-full px-2.5 py-1.5 text-xs tabular-nums"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? `অগ্রিম / পরিশোধিত (${currency})` : `Advance Paid (${currency})`}>
          <input
            type="number"
            min={0}
            step="any"
            value={data.advancePaid}
            onChange={(e) => update({ advancePaid: parseFloat(e.target.value) || 0 })}
            className="sketch-input w-full px-2.5 py-1.5 text-xs tabular-nums"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'স্ট্যাম্প (সিল)' : 'Status Stamp'}>
          <select
            value={customization.invoiceStamp || 'none'}
            onChange={(e) =>
              onChangeCustomization({
                ...customization,
                invoiceStamp: e.target.value as DocCustomization['invoiceStamp'],
              })
            }
            className="sketch-input w-full px-2.5 py-1.5 text-xs bg-white"
          >
            <option value="none">{isBn ? 'কোনো সিল নেই' : 'No Stamp'}</option>
            <option value="paid">{isBn ? 'পরিশোধিত (PAID)' : 'PAID'}</option>
            <option value="due">{isBn ? 'বকেয়া (DUE)' : 'DUE'}</option>
            <option value="partial">{isBn ? 'আংশিক পরিশোধিত' : 'PARTIAL'}</option>
            <option value="quotation">{isBn ? 'কোটেশন (QUOTATION)' : 'QUOTATION'}</option>
          </select>
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'মুদ্রার চিহ্ন' : 'Currency Symbol'}>
          <select
            value={currency}
            onChange={(e) =>
              onChangeCustomization({ ...customization, currencySymbol: e.target.value })
            }
            className="sketch-input w-full px-2.5 py-1.5 text-xs bg-white"
          >
            <option value="৳">৳ (Taka)</option>
            <option value="BDT">BDT</option>
            <option value="Tk">Tk</option>
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
            <option value="£">£ (GBP)</option>
          </select>
        </FieldWrapper>
      </div>

      {/* Live Totals & Auto Taka-in-Words Box */}
      <div className="p-3.5 rounded-lg bg-[#f7f2e7] border border-[#c8c0b2] space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-[#5c564d]">{isBn ? 'সর্বমোট বিল (Grand Total):' : 'Grand Total:'}</span>
          <span className="font-bold text-[#24211d] tabular-nums">
            {formatCurrency(totals.grandTotal, language, currency)}
          </span>
        </div>
        {totals.advancePaid > 0 && (
          <div className="flex justify-between">
            <span className="text-[#5c564d]">{isBn ? 'বকেয়া (Balance Due):' : 'Balance Due:'}</span>
            <span className="font-bold text-[#9f3324] tabular-nums">
              {formatCurrency(totals.balanceDue, language, currency)}
            </span>
          </div>
        )}
        <div className="pt-1 border-t border-dashed border-[#c8c0b2] text-[#1e5645] font-medium">
          <span className="font-bold">{isBn ? 'কথায়: ' : 'In Words: '}</span>
          {data.takaWordsOverride.trim() || autoWords}
        </div>
      </div>

      <FieldWrapper
        label={isBn ? 'কথায় টাকা (নিজে বদলাতে চাইলে)' : 'Custom Amount in Words'}
        optionalText={isBn ? 'খালি রাখলে স্বয়ংক্রিয়ভাবে হবে' : 'Leave blank for auto Lakh/Crore'}
      >
        <input
          type="text"
          value={data.takaWordsOverride}
          onChange={(e) => update({ takaWordsOverride: e.target.value })}
          placeholder={autoWords}
          className="sketch-input w-full px-3 py-2 text-xs"
        />
      </FieldWrapper>

      <SketchDivider className="my-2" />

      {/* Bangladeshi MFS & Bank Payment Block */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#1e5645]">
          {isBn ? 'বিকাশ, নগদ, রকেট ও ব্যাংক পেমেন্ট তথ্য' : 'bKash, Nagad, Rocket & Bank Payment Details'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FieldWrapper label={isBn ? 'বিকাশ (bKash)' : 'bKash Number'} optionalText={isBn ? 'ঐচ্ছিক' : 'Opt.'}>
            <input
              type="text"
              value={data.bkashNumber}
              onChange={(e) => update({ bkashNumber: e.target.value })}
              placeholder="017XX-XXXXXX"
              className="sketch-input w-full px-2.5 py-1.5 text-xs"
            />
          </FieldWrapper>
          <FieldWrapper label={isBn ? 'নগদ (Nagad)' : 'Nagad Number'} optionalText={isBn ? 'ঐচ্ছিক' : 'Opt.'}>
            <input
              type="text"
              value={data.nagadNumber}
              onChange={(e) => update({ nagadNumber: e.target.value })}
              placeholder="017XX-XXXXXX"
              className="sketch-input w-full px-2.5 py-1.5 text-xs"
            />
          </FieldWrapper>
          <FieldWrapper label={isBn ? 'রকেট (Rocket)' : 'Rocket Number'} optionalText={isBn ? 'ঐচ্ছিক' : 'Opt.'}>
            <input
              type="text"
              value={data.rocketNumber}
              onChange={(e) => update({ rocketNumber: e.target.value })}
              placeholder="017XX-XXXXXX-X"
              className="sketch-input w-full px-2.5 py-1.5 text-xs"
            />
          </FieldWrapper>
          <FieldWrapper
            label={isBn ? 'ব্যাংক অ্যাকাউন্ট তথ্য' : 'Bank Account Details'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
            className="sm:col-span-3"
          >
            <input
              type="text"
              value={data.bankDetails}
              onChange={(e) => update({ bankDetails: e.target.value })}
              placeholder={
                isBn
                  ? 'ব্যাংকের নাম · হিসাবের নাম · হিসাব নং · শাখা'
                  : 'Bank Name · Account Title · Account No. · Branch'
              }
              className="sketch-input w-full px-3 py-2 text-xs"
            />
          </FieldWrapper>
        </div>
      </div>

      <SketchDivider className="my-2" />

      {/* Notes, Terms & Authorized Signature */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FieldWrapper label={isBn ? 'ধন্যবাদ / নোট' : 'Note to Customer'} optionalText={isBn ? 'ঐচ্ছিক' : 'Opt.'}>
          <textarea
            rows={2}
            value={data.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder={isBn ? 'আমাদের সাথে থাকার জন্য ধন্যবাদ!' : 'Thank you for your business!'}
            className="sketch-input w-full px-3 py-2 text-xs"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'শর্তাবলি (Terms)' : 'Terms & Conditions'} optionalText={isBn ? 'ঐচ্ছিক' : 'Opt.'}>
          <textarea
            rows={2}
            value={data.terms}
            onChange={(e) => update({ terms: e.target.value })}
            placeholder={isBn ? 'বিক্রীত পণ্য ৩ দিনের মধ্যে পরিবর্তনযোগ্য।' : 'Payment due within 7 working days.'}
            className="sketch-input w-full px-3 py-2 text-xs"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'স্বাক্ষরকারীর নাম' : 'Authorized Signatory Name'}>
          <input
            type="text"
            value={data.authorizedName}
            onChange={(e) => update({ authorizedName: e.target.value })}
            placeholder={isBn ? 'মোঃ কামরুল হাসান' : 'Tanvir Ahmed'}
            className="sketch-input w-full px-3 py-2 text-xs"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'পদবি (যেমন: স্বত্বাধিকারী / ক্যাশিয়ার)' : 'Title (Proprietor / Accounts)'}>
          <input
            type="text"
            value={data.authorizedTitle}
            onChange={(e) => update({ authorizedTitle: e.target.value })}
            placeholder={isBn ? 'স্বত্বাধিকারী / ক্যাশিয়ার' : 'Proprietor / Accounts'}
            className="sketch-input w-full px-3 py-2 text-xs"
          />
        </FieldWrapper>
      </div>

      <SignatureUploader
        signature={data.signatureImage}
        language={language}
        onChange={(sig) => update({ signatureImage: sig })}
        title={isBn ? 'অনুমোদিত স্বাক্ষর (ঐচ্ছিক)' : 'Authorized Signature (Optional)'}
      />
    </div>
  );
}
