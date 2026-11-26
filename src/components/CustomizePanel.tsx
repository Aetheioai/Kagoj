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
  const tpl = getTemplateById(mode, templateId);
  const twoPageOnlyKeys = new Set(
    mode === 'cv' ? ['trainings', 'references', 'declaration'] : ['about']
  );
  const visibleOrderKeys =
    pageFormat === '1-page'
      ? customization.sectionOrder.filter((k) => !twoPageOnlyKeys.has(k))
      : customization.sectionOrder;
  const update = (patch: Partial<DocCustomization>) =>
    onChangeCustomization({ ...customization, ...patch });

  const sectionLabels: Record<string, string> =
    mode === 'cv'
      ? {
          objective: L.careerObjective,
          experience: L.experience,
          education: L.education,
          skills: L.skills,
          projects: L.projects,
          trainings: L.trainings,
          custom: language === 'bn' ? 'কাস্টম সেকশন' : 'Custom Sections',
          personal: L.personalInfo,
          references: L.references,
          declaration: L.declaration,
        }
      : {
          personal: L.personalDetails,
          careerEducation: L.educationCareer,
          family: L.familyBackground,
          address: L.addressDetails,
          about: L.aboutMe,
          expectations: L.partnerExpectations,
          custom: language === 'bn' ? 'কাস্টম সেকশন' : 'Custom Sections',
          guardian: L.guardianContact,
        };

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

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="sketch-heading text-2xl sm:text-3xl text-[#24211d] leading-tight">
            {language === 'bn'
              ? 'কাস্টমাইজ ও A4 PDF ডাউনলোড'
              : 'Customize & Export A4 PDF'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {language === 'bn'
              ? 'রং, ফন্ট, ছবি ও সেকশন সাজিয়ে সরাসরি A4 PDF ডাউনলোড করুন।'
              : 'Fine-tune colors, fonts, photo framing, or sections — updates your live A4 sheet immediately.'}
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
            {language === 'bn' ? 'রিসেট' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#24211d]">
            {language === 'bn' ? 'প্রধান রঙ (Accent Color)' : 'Accent Color'}
          </span>
          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5c564d] cursor-pointer">
            <span>{language === 'bn' ? 'নিজের রঙ:' : 'Custom:'}</span>
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
                <span>{language === 'bn' ? swatch.labelBn : swatch.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography, Text Size & Spacing — adapts to container width so buttons never squish */}
      <div className="grid grid-cols-1 @[520px]:grid-cols-3 gap-3.5">
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-[#24211d]">
            {language === 'bn' ? 'ফন্টের ধরন' : 'Font Style'}
          </div>
          <Segmented
            value={customization.fontStyle}
            onSelect={(fontStyle) => update({ fontStyle })}
            options={[
              { id: 'auto', label: language === 'bn' ? 'অটো' : 'Auto' },
              { id: 'sans', label: language === 'bn' ? 'আধুনিক' : 'Sans' },
              { id: 'serif', label: language === 'bn' ? 'ক্লাসিক' : 'Serif' },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-bold text-[#24211d]">
            {language === 'bn' ? 'অক্ষরের আকার' : 'Text Size'}
          </div>
          <Segmented
            value={customization.fontSize}
            onSelect={(fontSize) => update({ fontSize })}
            options={[
              { id: 'compact', label: language === 'bn' ? 'ছোট' : 'Compact' },
              { id: 'standard', label: language === 'bn' ? 'মাঝারি' : 'Normal' },
              { id: 'large', label: language === 'bn' ? 'বড়' : 'Large' },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-bold text-[#24211d]">
            {language === 'bn' ? 'পৃষ্ঠার ফাঁকা জায়গা' : 'Spacing'}
          </div>
          <Segmented
            value={customization.spacing}
            onSelect={(spacing) => update({ spacing })}
            options={[
              { id: 'tight', label: language === 'bn' ? 'ঘন' : 'Tight' },
              { id: 'balanced', label: language === 'bn' ? 'সুষম' : 'Balanced' },
              { id: 'airy', label: language === 'bn' ? 'প্রশস্ত' : 'Airy' },
            ]}
          />
        </div>
      </div>

      {/* Photo Framing Controls */}
      <div className="sketch-box-flat p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-[#24211d]">
            {language === 'bn' ? 'ছবির ধরন ও আকার' : 'Photo Display & Framing'}
          </span>
          {hasPhoto && (
            <button
              type="button"
              onClick={onTogglePhoto}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#3a3630]/40 bg-[#faf7f0] text-[#24211d] cursor-pointer whitespace-nowrap"
            >
              {showPhoto ? <Eye className="w-3.5 h-3.5 text-[#1e5645]" /> : <EyeOff className="w-3.5 h-3.5 text-[#7c5313]" />}
              {showPhoto
                ? language === 'bn'
                  ? 'ছবি দেখাচ্ছে'
                  : 'Photo Visible'
                : language === 'bn'
                ? 'ছবি লুকানো'
                : 'Photo Hidden'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 @[440px]:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#5c564d]">
              {language === 'bn' ? 'ফ্রেমের আকৃতি' : 'Photo Shape'}
            </div>
            <Segmented
              value={customization.photoShape}
              onSelect={(photoShape) => update({ photoShape })}
              options={[
                { id: 'rect', label: language === 'bn' ? 'পাসপোর্ট' : 'Passport' },
                { id: 'rounded', label: language === 'bn' ? 'রাউন্ডেড' : 'Rounded' },
                { id: 'circle', label: language === 'bn' ? 'গোল' : 'Circle' },
              ]}
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#5c564d]">
              {language === 'bn' ? 'ছবির আকার' : 'Photo Size'}
            </div>
            <Segmented
              value={customization.photoSize}
              onSelect={(photoSize) => update({ photoSize })}
              options={[
                { id: 'sm', label: language === 'bn' ? 'ছোট' : 'Small' },
                { id: 'md', label: language === 'bn' ? 'মাঝারি' : 'Medium' },
                { id: 'lg', label: language === 'bn' ? 'বড়' : 'Large' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Section Visibility & Reordering */}
      <div className="space-y-2.5">
        <div>
          <div className="text-sm font-bold text-[#24211d]">
            {language === 'bn' ? 'সেকশন সাজানো ও দেখানো/লুকানো' : 'Reorder or Hide Sections'}
          </div>
          <p className="text-xs text-[#5c564d]">
            {language === 'bn'
              ? 'উপরে/নিচে তীর দিয়ে সেকশনের ক্রম বদলান অথবা চোখের আইকনে ক্লিক করে লুকান।'
              : 'Move sections up or down to match your preference, or hide any section cleanly.'}
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
              {language === 'bn' ? 'নিজের কাস্টম সেকশন যোগ করুন' : 'Add Custom Sections'}
            </div>
            <p className="text-xs text-[#5c564d]">
              {language === 'bn'
                ? 'যেমন: সহশিক্ষা কার্যক্রম, পুরস্কার, প্রকাশনা বা বিশেষ পারিবারিক তথ্য।'
                : 'e.g. Extracurriculars, Awards, Publications, or Special Family Note.'}
            </p>
          </div>
          <button
            type="button"
            onClick={addCustomSection}
            className="sketch-btn px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-[#1e5645]" />
            {language === 'bn' ? 'নতুন সেকশন' : 'Add Section'}
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
                placeholder={
                  language === 'bn'
                    ? 'সেকশনের শিরোনাম (যেমন: সহশিক্ষা কার্যক্রম)'
                    : 'Section Title (e.g. Extracurricular Activities)'
                }
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
              placeholder={
                language === 'bn'
                  ? 'বিবরণ লিখুন (প্রতি লাইনে একটি পয়েন্ট লিখলে বুলেট তালিকা হবে)...'
                  : 'Write details here (put each item on a new line for bullets)...'
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
