import React from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  LayoutGrid,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  AppMode,
  CustomSectionEntry,
  DocCustomization,
  DocLanguage,
  POSTER_ASPECT_RATIOS,
  PageFormat,
} from '../types/builder';
import { LABELS } from '../data/i18n';
import { getTemplateById } from '../data/templates';
import { makeId } from '../utils/storage';

interface CustomizePanelProps {
  mode: AppMode;
  pageFormat: PageFormat;
  language: DocLanguage;
  templateId: string;
  customization: DocCustomization;
  showPhoto: boolean;
  hasPhoto: boolean;
  customSections: CustomSectionEntry[];
  onChangeCustomization: (next: DocCustomization) => void;
  onTogglePhoto: () => void;
  onChangeCustomSections: (next: CustomSectionEntry[]) => void;
  onResetDefaults: () => void;
  onSwitchTemplate?: () => void;
}

const COLOR_SWATCHES = [
  { hex: '', labelEn: 'Template Default', labelBn: 'ডিফল্ট' },
  { hex: '#1e5645', labelEn: 'Forest Emerald', labelBn: 'পান্না সবুজ' },
  { hex: '#17365d', labelEn: 'Bank Navy', labelBn: 'ব্যাংক নেভি' },
  { hex: '#7c1d2b', labelEn: 'Royal Maroon', labelBn: 'রয়্যাল মেরুন' },
  { hex: '#b91c1c', labelEn: 'Street Crimson', labelBn: 'লাল পোস্টার' },
  { hex: '#134e4a', labelEn: 'Deep Teal', labelBn: 'গাঢ় টিল' },
  { hex: '#7a5228', labelEn: 'Antique Bronze', labelBn: 'ব্রোঞ্জ' },
  { hex: '#9a3412', labelEn: 'Warm Terracotta', labelBn: 'টেরাকোটা' },
  { hex: '#18181b', labelEn: 'Print Black', labelBn: 'সাদাকালো' },
];

export function CustomizePanel({
  mode,
  pageFormat,
  language,
  templateId,
  customization,
  showPhoto,
  hasPhoto,
  customSections,
  onChangeCustomization,
  onTogglePhoto,
  onChangeCustomSections,
  onResetDefaults,
  onSwitchTemplate,
}: CustomizePanelProps) {
  const L = LABELS[language];
  const isBn = language === 'bn';
  const tpl = getTemplateById(mode, templateId);

  const twoPageOnlyKeys = new Set(
    mode === 'cv'
      ? ['trainings', 'references', 'declaration']
      : mode === 'biodata'
      ? ['about']
      : []
  );
  const visibleOrderKeys =
    (mode === 'cv' || mode === 'biodata') && pageFormat === '1-page'
      ? customization.sectionOrder.filter((k) => !twoPageOnlyKeys.has(k))
      : customization.sectionOrder;

  const update = (patch: Partial<DocCustomization>) =>
    onChangeCustomization({ ...customization, ...patch });

  const sectionLabels: Record<string, string> = ((): Record<string, string> => {
    switch (mode) {
      case 'cv':
        return {
          objective: L.careerObjective,
          experience: L.experience,
          education: L.education,
          skills: L.skills,
          projects: L.projects,
          trainings: L.trainings,
          custom: isBn ? 'কাস্টম সেকশন' : 'Custom Sections',
          personal: L.personalInfo,
          references: L.references,
          declaration: L.declaration,
        };
      case 'biodata':
        return {
          personal: L.personalDetails,
          careerEducation: L.educationCareer,
          family: L.familyBackground,
          address: L.addressDetails,
          about: L.aboutMe,
          expectations: L.partnerExpectations,
          custom: isBn ? 'কাস্টম সেকশন' : 'Custom Sections',
          guardian: L.guardianContact,
        };
      case 'job_app':
        return {
          recipient: isBn ? 'প্রাপক ও তারিখ (বরাবর)' : 'Recipient & Date',
          subject: isBn ? 'বিষয় (Subject)' : 'Subject Line',
          body: isBn ? 'আবেদনের মূল বক্তব্য' : 'Letter Body',
          enclosures: isBn ? 'সংযুক্তি (Enclosures)' : 'Enclosures',
          custom: isBn ? 'কাস্টম সেকশন' : 'Custom Sections',
          signature: isBn ? 'স্বাক্ষর ও নাম' : 'Sign-Off & Signature',
        };
      case 'office_letter':
        return {
          letterhead: isBn ? 'লেটারহেড / তারিখ ও স্মারক' : 'Letterhead / Date & Ref',
          recipient: isBn ? 'প্রাপক (বরাবর)' : 'Recipient (To)',
          through: isBn ? 'মাধ্যম (Through)' : 'Through Line',
          subject: isBn ? 'বিষয় (Subject)' : 'Subject',
          body: isBn ? 'দরখাস্তের মূল বক্তব্য' : 'Letter Body',
          cc: isBn ? 'অনুলিপি (CC)' : 'Copy To (CC)',
          custom: isBn ? 'কাস্টম সেকশন' : 'Custom Sections',
          signature: isBn ? 'স্বাক্ষর ও প্রেরকের তথ্য' : 'Signature & Sender Block',
        };
      case 'poster':
        return {
          headline: isBn ? 'প্রধান শিরোনাম ব্যানার' : 'Headline Banner',
          price: isBn ? 'ভাড়া / সম্মানী বক্স' : 'Rent / Honorarium Box',
          details: isBn ? 'মূল তথ্য ও ছবি' : 'Key Specs & Photo',
          features: isBn ? 'সুবিধাসমূহ তালিকা' : 'Features Checklist',
          address: isBn ? 'ঠিকানা ও যোগাযোগ বক্স' : 'Address & Phone Box',
          custom: isBn ? 'কাস্টম সেকশন' : 'Custom Sections',
          strips: isBn ? 'কাটার উপযোগী ফোন স্লিপ' : 'Tear-Off Phone Strips',
        };
      case 'invoice':
        return {
          parties: isBn ? 'ক্রেতা ও ইনভয়েস নম্বর' : 'Bill To & Invoice Info',
          items: isBn ? 'পণ্য ও সেবার ছক' : 'Line Items Table',
          totals: isBn ? 'মোট হিসাব, ভ্যাট ও পেমেন্ট' : 'Totals, VAT & Payment',
          takaWords: isBn ? 'কথায় টাকা (লক্ষ/কোটি)' : 'Amount in Words',
          payment: isBn ? 'বিকাশ / নগদ / ব্যাংক' : 'bKash / Nagad / Bank',
          notes: isBn ? 'নোট ও শর্তাবলি' : 'Notes & Terms',
          custom: isBn ? 'কাস্টম সেকশন' : 'Custom Sections',
          signatures: isBn ? 'স্বাক্ষর লাইন' : 'Signatures',
        };
    }
  })();

  const toggleSection = (key: string) => {
    const exists = customization.hiddenSections.includes(key);
    update({
      hiddenSections: exists
        ? customization.hiddenSections.filter((k) => k !== key)
        : [...customization.hiddenSections, key],
    });
  };

  const moveSection = (visibleIdx: number, dir: -1 | 1) => {
    const targetVisibleIdx = visibleIdx + dir;
    if (targetVisibleIdx < 0 || targetVisibleIdx >= visibleOrderKeys.length) return;
    const keyA = visibleOrderKeys[visibleIdx];
    const keyB = visibleOrderKeys[targetVisibleIdx];
    const idxA = customization.sectionOrder.indexOf(keyA);
    const idxB = customization.sectionOrder.indexOf(keyB);
    if (idxA === -1 || idxB === -1) return;
    const next = [...customization.sectionOrder];
    [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
    update({ sectionOrder: next });
  };

  const addCustomSection = () => {
    onChangeCustomSections([
      ...customSections,
      { id: makeId('custom'), title: '', content: '' },
    ]);
  };

  const updateCustomSection = (id: string, patch: Partial<CustomSectionEntry>) => {
    onChangeCustomSections(
      customSections.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const removeCustomSection = (id: string) => {
    onChangeCustomSections(customSections.filter((c) => c.id !== id));
  };

  const Segmented = <T extends string>({
    value,
    options,
    onSelect,
  }: {
    value: T;
    options: Array<{ id: T; label: string }>;
    onSelect: (v: T) => void;
  }) => (
    <div className="grid grid-flow-col auto-cols-fr gap-1 p-1 bg-[#f3ede0] border border-[#3a3630]/35 rounded-lg min-w-0">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id)}
          className={`py-1.5 px-2 text-xs font-semibold rounded-md cursor-pointer truncate transition-colors ${
            value === opt.id
              ? 'bg-[#24211d] text-[#fffdf8]'
              : 'text-[#5c564d] hover:text-[#24211d]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  const showPhotoControls = mode === 'cv' || mode === 'biodata' || mode === 'poster';
  const showSignatureControls =
    mode === 'job_app' || mode === 'office_letter' || mode === 'invoice' || mode === 'cv';
  const showBorderControl =
    mode === 'job_app' || mode === 'office_letter' || mode === 'poster' || mode === 'invoice';

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="sketch-heading text-2xl sm:text-3xl text-[#24211d] leading-tight">
            {mode === 'poster'
              ? isBn
                ? 'কাস্টমাইজ ও PDF / PNG ডাউনলোড'
                : 'Customize & Export PDF / PNG'
              : isBn
              ? 'কাস্টমাইজ ও A4 PDF ডাউনলোড'
              : 'Customize & Export A4 PDF'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {mode === 'poster'
              ? isBn
                ? 'সাইজ/অনুপাত, রং, ফন্ট ও সেকশন ঠিক করে সরাসরি PDF অথবা PNG ছবি ডাউনলোড করুন।'
                : 'Fine-tune aspect ratio, colors, typography, or sections and export as crisp PDF or PNG.'
              : isBn
              ? 'রং, ফন্ট, বর্ডার, স্বাক্ষর ও সেকশন নিজের মতো সাজিয়ে সরাসরি A4 PDF ডাউনলোড করুন।'
              : 'Fine-tune colors, typography, borders, signatures, or sections — updates your A4 sheet live.'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onSwitchTemplate && (
            <button
              type="button"
              onClick={onSwitchTemplate}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[#24211d] hover:border-[#1e5645] hover:text-[#1e5645] border border-[#3a3630]/45 rounded-lg bg-[#fffdf8] cursor-pointer whitespace-nowrap transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              {L.ui.switchTemplate}
            </button>
          )}
          <button
            type="button"
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#5c564d] hover:text-[#24211d] border border-[#3a3630]/35 rounded-lg bg-[#fffdf8] cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isBn ? 'রিসেট' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#24211d]">
            {isBn ? 'প্রধান রঙ (Accent Color)' : 'Accent Color'}
          </span>
          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5c564d] cursor-pointer">
            <span>{isBn ? 'নিজের রঙ:' : 'Custom:'}</span>
            <input
              type="color"
              value={customization.accentColor || tpl.accent}
              onChange={(e) => update({ accentColor: e.target.value })}
              className="w-6 h-6 rounded border border-[#3a3630] cursor-pointer bg-transparent p-0"
              aria-label="Pick custom accent color"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((swatch) => {
            const isSelected = customization.accentColor === swatch.hex;
            const displayHex = swatch.hex || tpl.accent;
            return (
              <button
                key={swatch.labelEn}
                type="button"
                onClick={() => update({ accentColor: swatch.hex })}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border cursor-pointer whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#24211d] text-[#fffdf8] border-[#24211d]'
                    : 'bg-[#fffdf8] text-[#24211d] border-[#3a3630]/35 hover:border-[#24211d]'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/60 shrink-0"
                  style={{ backgroundColor: displayHex }}
                />
                <span>{isBn ? swatch.labelBn : swatch.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography, Text Size & Spacing */}
      <div className="grid grid-cols-1 @[520px]:grid-cols-3 gap-3.5">
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-[#24211d]">
            {isBn ? 'ফন্টের ধরন' : 'Font Style'}
          </div>
          <Segmented
            value={customization.fontStyle}
            onSelect={(fontStyle) => update({ fontStyle })}
            options={[
              { id: 'auto', label: isBn ? 'অটো' : 'Auto' },
              { id: 'sans', label: isBn ? 'আধুনিক' : 'Sans' },
              { id: 'serif', label: isBn ? 'ক্লাসিক' : 'Serif' },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-bold text-[#24211d]">
            {isBn ? 'অক্ষরের আকার' : 'Text Size'}
          </div>
          <Segmented
            value={customization.fontSize}
            onSelect={(fontSize) => update({ fontSize })}
            options={[
              { id: 'compact', label: isBn ? 'ছোট' : 'Compact' },
              { id: 'standard', label: isBn ? 'মাঝারি' : 'Normal' },
              { id: 'large', label: isBn ? 'বড়' : 'Large' },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-bold text-[#24211d]">
            {isBn ? 'পৃষ্ঠার ফাঁকা জায়গা' : 'Spacing'}
          </div>
          <Segmented
            value={customization.spacing}
            onSelect={(spacing) => update({ spacing })}
            options={[
              { id: 'tight', label: isBn ? 'ঘন' : 'Tight' },
              { id: 'balanced', label: isBn ? 'সুষম' : 'Balanced' },
              { id: 'airy', label: isBn ? 'প্রশস্ত' : 'Airy' },
            ]}
          />
        </div>
      </div>

      {/* Page Border Style + Signature Controls */}
      {(showBorderControl || showSignatureControls) && (
        <div className="sketch-box-flat p-4 space-y-3.5">
          {showBorderControl && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#24211d]">
                {isBn ? 'পৃষ্ঠার বর্ডার ফ্রেম' : 'Page Frame / Border Style'}
              </div>
              <Segmented
                value={customization.borderStyle || 'default'}
                onSelect={(borderStyle) => update({ borderStyle })}
                options={[
                  { id: 'default', label: isBn ? 'টেমপ্লেট ডিফল্ট' : 'Template Default' },
                  { id: 'clean', label: isBn ? 'ফ্রেম ছাড়া' : 'Clean No-Frame' },
                  { id: 'framed', label: isBn ? 'বর্ডার ফ্রেম' : 'Framed Border' },
                ]}
              />
            </div>
          )}

          {showSignatureControls && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#24211d]">
                  {isBn ? 'হাতের স্বাক্ষরের আকার' : 'Handwritten Signature Size'}
                </span>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e5645] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.showSignatureImage !== false}
                    onChange={(e) => update({ showSignatureImage: e.target.checked })}
                    className="accent-[#1e5645] w-3.5 h-3.5"
                  />
                  {isBn ? 'স্বাক্ষর ছবি দেখান' : 'Show Signature Image'}
                </label>
              </div>
              <Segmented
                value={customization.signatureSize || 'md'}
                onSelect={(signatureSize) => update({ signatureSize })}
                options={[
                  { id: 'sm', label: isBn ? 'ছোট' : 'Small' },
                  { id: 'md', label: isBn ? 'মাঝারি' : 'Medium' },
                  { id: 'lg', label: isBn ? 'বড়' : 'Large' },
                ]}
              />
            </div>
          )}
        </div>
      )}

      {/* Poster-Specific Controls */}
      {mode === 'poster' && (
        <div className="sketch-box-flat p-4 space-y-3.5">
          <div className="text-sm font-bold text-[#24211d]">
            {isBn ? 'পোস্টারের সাইজ ও সেটিংস' : 'Poster Size & Options'}
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#5c564d]">
              {isBn ? 'সাইজ / অনুপাত (Aspect Ratio):' : 'Aspect Ratio:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {POSTER_ASPECT_RATIOS.map((spec) => {
                const active =
                  (customization.posterAspectRatio || 'a4-portrait') === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => update({ posterAspectRatio: spec.id })}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer truncate transition-colors ${
                      active
                        ? 'bg-[#24211d] text-[#fffdf8] border-[#24211d]'
                        : 'bg-[#fffdf8] text-[#24211d] border-[#3a3630]/35 hover:border-[#24211d]'
                    }`}
                  >
                    {isBn ? spec.shortBn : spec.shortEn}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#24211d] cursor-pointer">
              <input
                type="checkbox"
                checked={customization.showPriceBanner !== false}
                onChange={(e) => update({ showPriceBanner: e.target.checked })}
                className="accent-[#1e5645] w-4 h-4"
              />
              {isBn ? 'ভাড়া / সম্মানী ব্যানার দেখান' : 'Show Rent / Honorarium Box'}
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#24211d] cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(customization.showTearOffStrips)}
                onChange={(e) => update({ showTearOffStrips: e.target.checked })}
                className="accent-[#1e5645] w-4 h-4"
              />
              {isBn ? 'ঐচ্ছিক: নিচে কাটার নম্বর স্লিপ' : 'Optional: Tear-Off Phone Strips'}
            </label>
          </div>
          {Boolean(customization.showTearOffStrips) && (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#5c564d]">
                {isBn ? 'স্লিপের সংখ্যা:' : 'Tear-Off Tab Count:'}
              </span>
              <Segmented
                value={String(customization.tearOffCount ?? 6)}
                onSelect={(v) => update({ tearOffCount: Number(v) })}
                options={[
                  { id: '5', label: '5' },
                  { id: '6', label: '6' },
                  { id: '7', label: '7' },
                  { id: '8', label: '8' },
                ]}
              />
            </div>
          )}
        </div>
      )}

      {/* Invoice-Specific Controls */}
      {mode === 'invoice' && (
        <div className="sketch-box-flat p-4 space-y-3.5">
          <div className="text-sm font-bold text-[#24211d]">
            {isBn ? 'ইনভয়েস ও ক্যাশ মেমো কাস্টমাইজেশন' : 'Invoice & Cash Memo Controls'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#5c564d]">
                {isBn ? 'স্ট্যাম্প / সিল' : 'Status Stamp'}
              </span>
              <select
                value={customization.invoiceStamp || 'none'}
                onChange={(e) =>
                  update({
                    invoiceStamp: e.target.value as DocCustomization['invoiceStamp'],
                  })
                }
                className="sketch-input w-full px-2.5 py-1.5 text-xs bg-white"
              >
                <option value="none">{isBn ? 'কোনো সিল নেই' : 'No Stamp'}</option>
                <option value="paid">{isBn ? 'পরিশোধিত (PAID)' : 'PAID'}</option>
                <option value="due">{isBn ? 'বকেয়া (DUE)' : 'DUE'}</option>
                <option value="partial">{isBn ? 'আংশিক পরিশোধিত' : 'PARTIAL PAID'}</option>
                <option value="quotation">{isBn ? 'কোটেশন' : 'QUOTATION'}</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#5c564d]">
                {isBn ? 'মুদ্রার চিহ্ন' : 'Currency Symbol'}
              </span>
              <select
                value={customization.currencySymbol || '৳'}
                onChange={(e) => update({ currencySymbol: e.target.value })}
                className="sketch-input w-full px-2.5 py-1.5 text-xs bg-white"
              >
                <option value="৳">৳ (Bangladeshi Taka)</option>
                <option value="BDT">BDT</option>
                <option value="Tk">Tk</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              {
                key: 'showLogo' as const,
                en: 'Show Business Logo',
                bn: 'লোগো দেখান',
              },
              {
                key: 'showUnitCol' as const,
                en: 'Show Unit Column',
                bn: 'একক (Unit) কলাম',
              },
              {
                key: 'showTakaWords' as const,
                en: 'Taka in Words',
                bn: 'কথায় টাকা দেখান',
              },
              {
                key: 'showPaymentBlock' as const,
                en: 'bKash / Bank Block',
                bn: 'বিকাশ/ব্যাংক বক্স',
              },
              {
                key: 'showCustomerSig' as const,
                en: 'Customer Signature Line',
                bn: 'ক্রেতার স্বাক্ষর লাইন',
              },
            ].map((item) => (
              <label
                key={item.key}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#24211d] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={customization[item.key] !== false}
                  onChange={(e) => update({ [item.key]: e.target.checked })}
                  className="accent-[#1e5645] w-3.5 h-3.5"
                />
                {isBn ? item.bn : item.en}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Photo Framing Controls (CV, Biodata, Poster) */}
      {showPhotoControls && (
        <div className="sketch-box-flat p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-[#24211d]">
              {isBn ? 'ছবির ধরন ও আকার' : 'Photo Display & Framing'}
            </span>
            {hasPhoto && (
              <button
                type="button"
                onClick={onTogglePhoto}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#3a3630]/40 bg-[#faf7f0] text-[#24211d] cursor-pointer whitespace-nowrap"
              >
                {showPhoto ? (
                  <Eye className="w-3.5 h-3.5 text-[#1e5645]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#7c5313]" />
                )}
                {showPhoto
                  ? isBn
                    ? 'ছবি দেখাচ্ছে'
                    : 'Photo Visible'
                  : isBn
                  ? 'ছবি লুকানো'
                  : 'Photo Hidden'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 @[440px]:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[#5c564d]">
                {isBn ? 'ফ্রেমের আকৃতি' : 'Photo Shape'}
              </div>
              <Segmented
                value={customization.photoShape}
                onSelect={(photoShape) => update({ photoShape })}
                options={[
                  { id: 'rect', label: isBn ? 'পাসপোর্ট' : 'Passport' },
                  { id: 'rounded', label: isBn ? 'রাউন্ডেড' : 'Rounded' },
                  { id: 'circle', label: isBn ? 'গোল' : 'Circle' },
                ]}
              />
            </div>
            {mode !== 'poster' && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#5c564d]">
                  {isBn ? 'ছবির আকার' : 'Photo Size'}
                </div>
                <Segmented
                  value={customization.photoSize}
                  onSelect={(photoSize) => update({ photoSize })}
                  options={[
                    { id: 'sm', label: isBn ? 'ছোট' : 'Small' },
                    { id: 'md', label: isBn ? 'মাঝারি' : 'Medium' },
                    { id: 'lg', label: isBn ? 'বড়' : 'Large' },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Visibility & Reordering */}
      <div className="space-y-2.5">
        <div>
          <div className="text-sm font-bold text-[#24211d]">
            {isBn ? 'সেকশন সাজানো ও দেখানো/লুকানো' : 'Reorder or Hide Sections'}
          </div>
          <p className="text-xs text-[#5c564d]">
            {isBn
              ? 'উপরে/নিচে তীর দিয়ে সেকশনের ক্রম বদলান অথবা চোখের আইকনে ক্লিক করে লুকান।'
              : 'Move sections up or down or toggle visibility cleanly on your A4 sheet.'}
          </p>
        </div>

        <div className="divide-y divide-[#3a3630]/15 border border-[#3a3630]/35 rounded-xl bg-[#fffdf8] overflow-hidden">
          {visibleOrderKeys.map((key, visibleIdx) => {
            const isHidden = customization.hiddenSections.includes(key);
            return (
              <div
                key={key}
                className={`flex items-center justify-between gap-2 px-3 py-2 text-xs ${
                  isHidden ? 'bg-[#f6f1e6] text-[#8c8478]' : 'text-[#24211d]'
                }`}
              >
                <span className={`font-semibold truncate ${isHidden ? 'line-through' : ''}`}>
                  {sectionLabels[key] || key}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={visibleIdx === 0}
                    onClick={() => moveSection(visibleIdx, -1)}
                    className="p-1 text-[#5c564d] hover:text-[#24211d] disabled:opacity-25 cursor-pointer"
                    aria-label="Move section up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={visibleIdx === visibleOrderKeys.length - 1}
                    onClick={() => moveSection(visibleIdx, 1)}
                    className="p-1 text-[#5c564d] hover:text-[#24211d] disabled:opacity-25 cursor-pointer"
                    aria-label="Move section down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSection(key)}
                    className={`p-1 rounded cursor-pointer ${
                      isHidden ? 'text-[#9f3324]' : 'text-[#1e5645]'
                    }`}
                    aria-label={isHidden ? 'Show section' : 'Hide section'}
                  >
                    {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom User-Added Sections */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-[#24211d]">
              {isBn ? 'নিজের কাস্টম সেকশন যোগ করুন' : 'Add Custom Sections'}
            </div>
            <p className="text-xs text-[#5c564d]">
              {isBn
                ? 'যেকোনো অতিরিক্ত তথ্য, শর্তাবলি বা বিশেষ নোট যোগ করুন।'
                : 'Add any extra note, declaration, warranty, or custom block to your document.'}
            </p>
          </div>
          <button
            type="button"
            onClick={addCustomSection}
            className="sketch-btn px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-[#1e5645]" />
            {isBn ? 'নতুন সেকশন' : 'Add Section'}
          </button>
        </div>

        {customSections.map((cs) => (
          <div key={cs.id} className="sketch-box-flat p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="sketch-input"
                value={cs.title}
                onChange={(e) => updateCustomSection(cs.id, { title: e.target.value })}
                placeholder={isBn ? 'সেকশনের শিরোনাম' : 'Section Title'}
              />
              <button
                type="button"
                onClick={() => removeCustomSection(cs.id)}
                className="p-1.5 text-[#9f3324] cursor-pointer shrink-0"
                aria-label="Remove custom section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={3}
              className="sketch-input"
              value={cs.content}
              onChange={(e) => updateCustomSection(cs.id, { content: e.target.value })}
              placeholder={isBn ? 'বিবরণ লিখুন...' : 'Write details here...'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
