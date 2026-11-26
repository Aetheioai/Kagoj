import { DocLanguage, InvoiceData } from '../types/builder';
import { toBanglaDigits } from './storage';

// Exact 0..99 Bangla number words for natural Lakh/Crore Taka-in-words conversion
const BN_0_99: string[] = [
  'শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়',
  'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোল', 'সতেরো', 'আঠারো', 'উনিশ',
  'বিশ', 'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ',
  'ত্রিশ', 'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ',
  'চল্লিশ', 'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ',
  'পঞ্চাশ', 'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট',
  'ষাট', 'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর',
  'সত্তর', 'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি',
  'আশি', 'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই',
  'নব্বই', 'একানব্বই', 'বিরানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই',
];

const EN_ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];

const EN_TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

function enUnder100(n: number): string {
  if (n < 20) return EN_ONES[n];
  const t = Math.floor(n / 10);
  const r = n % 10;
  return r > 0 ? `${EN_TENS[t]} ${EN_ONES[r]}` : EN_TENS[t];
}

function enUnder1000(n: number): string {
  const h = Math.floor(n / 100);
  const rem = n % 100;
  if (h > 0 && rem > 0) return `${EN_ONES[h]} Hundred ${enUnder100(rem)}`;
  if (h > 0) return `${EN_ONES[h]} Hundred`;
  return enUnder100(rem);
}

function bnUnder1000(n: number): string {
  const h = Math.floor(n / 100);
  const rem = n % 100;
  if (h > 0 && rem > 0) return `${BN_0_99[h]} শত ${BN_0_99[rem]}`;
  if (h > 0) return `${BN_0_99[h]} শত`;
  return rem > 0 ? BN_0_99[rem] : '';
}

/**
 * Converts a Bangladeshi BDT amount into authentic Lakh / Crore words
 * in either English ("One Lakh Twenty-Five Thousand Taka Only")
 * or Bangla ("এক লক্ষ পঁচিশ হাজার টাকা মাত্র").
 */
export function toTakaInWords(
  rawAmount: number,
  lang: DocLanguage,
  currencySymbol = '৳'
): string {
  const safe = Math.max(0, Number.isFinite(rawAmount) ? rawAmount : 0);
  const whole = Math.floor(safe);
  const poisha = Math.round((safe - whole) * 100);

  const isTaka =
    !currencySymbol ||
    currencySymbol.includes('৳') ||
    currencySymbol.toUpperCase().includes('BDT') ||
    currencySymbol.toUpperCase().includes('TK');

  if (whole === 0 && poisha === 0) {
    return lang === 'bn'
      ? isTaka
        ? 'শূন্য টাকা মাত্র'
        : 'শূন্য মাত্র'
      : isTaka
      ? 'Zero Taka Only'
      : 'Zero Only';
  }

  // South Asian / Bangladeshi grouping: Crore (1,00,00,000), Lakh (1,00,000), Thousand (1,000), Hundred (100)
  const crore = Math.floor(whole / 10000000);
  const lakh = Math.floor((whole % 10000000) / 100000);
  const thousand = Math.floor((whole % 100000) / 1000);
  const rest = whole % 1000;

  if (lang === 'bn') {
    const parts: string[] = [];
    if (crore > 0) {
      parts.push(`${crore < 100 ? BN_0_99[crore] : bnUnder1000(crore)} কোটি`);
    }
    if (lakh > 0) parts.push(`${BN_0_99[lakh]} লক্ষ`);
    if (thousand > 0) parts.push(`${BN_0_99[thousand]} হাজার`);
    if (rest > 0) parts.push(bnUnder1000(rest));

    const unit = isTaka ? 'টাকা' : '';
    const main = `${parts.join(' ')}${unit ? ' ' + unit : ''}`.trim();
    if (poisha > 0 && isTaka) {
      return `${main} ${BN_0_99[poisha]} পয়সা মাত্র`;
    }
    return `${main} মাত্র`;
  }

  const parts: string[] = [];
  if (crore > 0) {
    parts.push(`${crore < 100 ? enUnder100(crore) : enUnder1000(crore)} Crore`);
  }
  if (lakh > 0) parts.push(`${enUnder100(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${enUnder100(thousand)} Thousand`);
  if (rest > 0) parts.push(enUnder1000(rest));

  const unit = isTaka ? 'Taka' : currencySymbol.trim();
  const main = `${parts.join(' ')}${unit ? ' ' + unit : ''}`.trim();
  if (poisha > 0 && isTaka) {
    return `${main} and ${enUnder100(poisha)} Poisha Only`;
  }
  return `${main} Only`;
}

/**
 * Formats a number in Bangladeshi lakh/crore comma grouping (e.g. 1,25,000 or ১,২৫,০০০)
 */
export function formatBDNumber(value: number, lang: DocLanguage, decimals = 0): string {
  const safe = Number.isFinite(value) ? value : 0;
  const fixed = decimals > 0 ? safe.toFixed(decimals) : Math.round(safe).toString();
  const [intPart, decPart] = fixed.split('.');
  const isNeg = intPart.startsWith('-');
  const digits = isNeg ? intPart.slice(1) : intPart;

  let grouped = digits;
  if (digits.length > 3) {
    const last3 = digits.slice(-3);
    const prefix = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    grouped = `${prefix},${last3}`;
  }
  const formatted = `${isNeg ? '-' : ''}${grouped}${decPart ? '.' + decPart : ''}`;
  return lang === 'bn' ? toBanglaDigits(formatted) : formatted;
}

export function formatCurrency(
  value: number,
  lang: DocLanguage,
  symbol = '৳'
): string {
  const hasDecimals = Math.abs(value - Math.round(value)) > 0.005;
  const num = formatBDNumber(value, lang, hasDecimals ? 2 : 0);
  return `${symbol} ${num}`;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  vatAmount: number;
  shippingCharge: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
}

export function calculateInvoiceTotals(data: InvoiceData): InvoiceTotals {
  const subtotal = (data.items || []).reduce((sum, item) => {
    const q = Number.isFinite(item.qty) ? Math.max(0, item.qty) : 0;
    const r = Number.isFinite(item.rate) ? Math.max(0, item.rate) : 0;
    return sum + q * r;
  }, 0);

  const rawDisc = Number.isFinite(data.discountValue) ? Math.max(0, data.discountValue) : 0;
  const discountAmount =
    data.discountType === 'percent'
      ? Math.min(subtotal, (subtotal * rawDisc) / 100)
      : Math.min(subtotal, rawDisc);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const vatRate = Number.isFinite(data.vatPercent) ? Math.max(0, data.vatPercent) : 0;
  const vatAmount = (taxableAmount * vatRate) / 100;
  const shippingCharge = Number.isFinite(data.shippingCharge)
    ? Math.max(0, data.shippingCharge)
    : 0;
  const grandTotal = taxableAmount + vatAmount + shippingCharge;
  const advancePaid = Number.isFinite(data.advancePaid) ? Math.max(0, data.advancePaid) : 0;
  const balanceDue = Math.max(0, grandTotal - advancePaid);

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    vatAmount,
    shippingCharge,
    grandTotal,
    advancePaid,
    balanceDue,
  };
}
