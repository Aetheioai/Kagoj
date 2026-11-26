import React, { useState } from 'react';
import { ArrowRight, Check, FileEdit, FileText, Files, Lock, Trash2 } from 'lucide-react';
import { AppMode, DocLanguage, PageFormat } from '../../types/builder';
import { LABELS } from '../../data/i18n';
import { getTemplatesForMode } from '../../data/templates';
import { toBanglaDigits } from '../../utils/storage';
import { SketchUnderline } from '../SketchChrome';

import cvIllusImg from '../../assets/images/sketch_cv_workbook_1795659049299.jpg';
import biodataIllusImg from '../../assets/images/sketch_biodata_workbook_1795659049927.jpg';
import jobAppIllusImg from '../../assets/images/sketch_job_app_1795686970565.jpg';
import officeLetterIllusImg from '../../assets/images/sketch_office_letter_1795686971609.jpg';
import posterIllusImg from '../../assets/images/sketch_poster_tolet_1795686972835.jpg';
import invoiceIllusImg from '../../assets/images/sketch_invoice_memo_1795686974554.jpg';

interface ModeStepProps {
  mode: AppMode;
  pageFormat: PageFormat;
  language: DocLanguage;
  hasSavedDraft: boolean;
  onSelectMode: (mode: AppMode) => void;
  onSelectPageFormat: (fmt: PageFormat) => void;
  onSelectLanguage: (lang: DocLanguage) => void;
  onContinueToTemplates: () => void;
  onResumeDraft: () => void;
  onRequestClearAll: () => void;
}

type LauncherCategory = 'all' | 'career' | 'family' | 'business' | 'posters';

interface DocCardConfig {
  id: AppMode;
  category: Exclude<LauncherCategory, 'all'>;
  img: string;
  alt: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  metaEn: string;
  metaBn: string;
  imgCover?: boolean;
}

const DOC_CARDS: DocCardConfig[] = [
  {
    id: 'cv',
    category: 'career',
    img: cvIllusImg,
    alt: 'Bangladeshi CV sketchbook illustration',
    titleEn: 'Bangladeshi CV / Resume',
    titleBn: 'বাংলাদেশি সিভি / রিজিউমি',
    descEn: 'For banks, corporate, NGOs, tech, universities & govt jobs.',
    descBn: 'ব্যাংক, কর্পোরেট, এনজিও, টেক ও সরকারি চাকরির জন্য।',
    metaEn: '22 templates · 1-Page & 2-Page',
    metaBn: '২২টি টেমপ্লেট · ১ ও ২ পৃষ্ঠা',
  },
  {
    id: 'biodata',
    category: 'family',
    img: biodataIllusImg,
    alt: 'Bangladeshi Marriage Biodata illustration',
    titleEn: 'Marriage Biodata',
    titleBn: 'বিবাহের বায়োডাটা',
    descEn: 'Royal, Islamic, Hindu, Christian, Buddhist & modern family layouts.',
    descBn: 'ইসলামিক, সনাতন, খ্রিস্টান, বৌদ্ধ ও আধুনিক পারিবারিক ডিজাইন।',
    metaEn: '37 templates · 1-Page & 2-Page',
    metaBn: '৩৭টি টেমপ্লেট · ১ ও ২ পৃষ্ঠা',
    imgCover: true,
  },
  {
    id: 'job_app',
    category: 'career',
    img: jobAppIllusImg,
    alt: 'Job Application and Cover Letter illustration',
    titleEn: 'Job Application & Cover Letter',
    titleBn: 'চাকরির আবেদনপত্র / কভার লেটার',
    descEn: 'Formal Bangla Borabor & English cover letters with CV auto-fill.',
    descBn: 'বরাবর ফরম্যাট ও ইংরেজি কভার লেটার — সিভি থেকে এক ক্লিকে তথ্য বসান।',
    metaEn: '15 templates · EN & Formal বাংলা',
    metaBn: '১৫টি টেমপ্লেট · বাংলা ও ইংরেজি',
  },
  {
    id: 'office_letter',
    category: 'business',
    img: officeLetterIllusImg,
    alt: 'Office Letters and Formal Applications illustration',
    titleEn: 'Office Letters & Dorokhasto',
    titleBn: 'দরখাস্ত ও অফিশিয়াল চিঠি',
    descEn: 'Leave, resignation, bank requests, NOC, school TC & office notices.',
    descBn: 'ছুটি, পদত্যাগ, ব্যাংক আবেদন, এনওসি, টিসি ও অফিস নোটিশ।',
    metaEn: '15 templates · 8 EN/BN presets',
    metaBn: '১৫টি টেমপ্লেট · ৮টি প্রস্তুত ড্রাফট',
  },
  {
    id: 'poster',
    category: 'posters',
    img: posterIllusImg,
    alt: 'To-Let and Private Tuition Poster illustration',
    titleEn: 'To-Let & Tuition Posters',
    titleBn: 'টু-লেট ও টিউশন পোস্টার',
    descEn: 'Print & social posters in A4, 1:1, 4:5, 9:16 & 16:9 — export PDF or PNG.',
    descBn: 'A4 প্রিন্ট ও ফেসবুক/হোয়াটসঅ্যাপের সব সাইজে (১:১, ৪:৫, ৯:১৬, ১৬:৯) পোস্টার।',
    metaEn: '15 templates · All aspect ratios · PDF & PNG',
    metaBn: '১৫টি টেমপ্লেট · সব সাইজ · PDF ও PNG',
  },
  {
    id: 'invoice',
    category: 'business',
    img: invoiceIllusImg,
    alt: 'Invoice, Cash Memo and Quotation illustration',
    titleEn: 'Invoice, Cash Memo & Quotation',
    titleBn: 'ইনভয়েস, ক্যাশ মেমো ও কোটেশন',
    descEn: 'Auto BDT Taka-in-words, bKash/Nagad/Bank block & copyable template code.',
    descBn: 'অটো কথায় টাকা, বিকাশ/নগদ/ব্যাংক তথ্য ও নিজের অ্যাপের জন্য টেমপ্লেট কোড।',
    metaEn: '15 templates · Auto ৳ & Copy Code',
    metaBn: '১৫টি টেমপ্লেট · অটো ৳ ও কোড কপি',
  },
];

const CATEGORY_FILTERS: Array<{ id: LauncherCategory; en: string; bn: string }> = [
  { id: 'all', en: 'All (6)', bn: 'সব (৬টি)' },
  { id: 'career', en: 'Career', bn: 'ক্যারিয়ার' },
  { id: 'family', en: 'Family', bn: 'পরিবার' },
  { id: 'business', en: 'Office & Business', bn: 'অফিস ও ব্যবসা' },
  { id: 'posters', en: 'Posters', bn: 'পোস্টার' },
];

export function ModeStep({
  mode,
  pageFormat,
  language,
  hasSavedDraft,
  onSelectMode,
  onSelectPageFormat,
  onSelectLanguage,
  onContinueToTemplates,
  onResumeDraft,
  onRequestClearAll,
}: ModeStepProps) {
  const L = LABELS[language];
  const isBn = language === 'bn';
  const [filter, setFilter] = useState<LauncherCategory>('all');

  const visibleCards =
    filter === 'all' ? DOC_CARDS : DOC_CARDS.filter((c) => c.category === filter);

  const selectedCard = DOC_CARDS.find((c) => c.id === mode) ?? DOC_CARDS[0];
  const selectedTplCount = getTemplatesForMode(mode).length;
  const supportsPageFormatToggle = mode === 'cv' || mode === 'biodata';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-7">
      {/* Centered Purpose Heading */}
      <div className="text-center space-y-2">
        <h1 className="sketch-heading text-3xl sm:text-5xl text-[#24211d] leading-tight">
          {isBn ? 'আজ কী তৈরি করতে চান?' : 'What are you creating today?'}
        </h1>
        <div className="flex justify-center">
          <SketchUnderline className="w-44 h-3" />
        </div>
        <p className="text-sm sm:text-base text-[#5c564d] max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'বাংলাদেশের ৬টি জরুরি ডকুমেন্টের জন্য ১১৯টি প্রিন্ট-রেডি টেমপ্লেট — কোনো অ্যাকাউন্ট ছাড়াই সরাসরি A4 PDF ডাউনলোড করুন।'
            : '119 print-ready A4 templates across 6 essential Bangladeshi document builders — completely free and private in your browser.'}
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center justify-center">
        <div className="inline-flex flex-wrap justify-center gap-1.5">
          {CATEGORY_FILTERS.map((cat) => {
            const active = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#24211d] text-[#fffdf8] border-[#24211d]'
                    : 'bg-[#fffdf8] text-[#5c564d] border-[#3a3630]/35 hover:border-[#24211d] hover:text-[#24211d]'
                }`}
              >
                {isBn ? cat.bn : cat.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6-Card Sketchbook Document Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {visibleCards.map((card, idx) => {
          const isSelected = mode === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectMode(card.id)}
              onDoubleClick={() => {
                onSelectMode(card.id);
                onContinueToTemplates();
              }}
              className={`text-left p-4 sm:p-5 cursor-pointer transition-transform relative flex flex-col ${
                isSelected
                  ? 'bg-[#eef5f2] border-2 border-[#1e5645] shadow-[4px_4px_0px_#1e5645]'
                  : 'bg-[#fffdf8] border-[1.5px] border-[#3a3630]/50 hover:border-[#24211d] hover:-translate-y-0.5'
              }`}
              style={{
                borderRadius:
                  idx % 2 === 0
                    ? '16px 18px 17px 14px / 15px 17px 16px 18px'
                    : '17px 15px 18px 16px / 16px 18px 15px 17px',
              }}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#1e5645] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}

              <div className="h-24 sm:h-28 w-full mb-3 overflow-hidden flex items-center justify-center rounded-xl bg-[#faf7f0]">
                <img
                  src={card.img}
                  alt={card.alt}
                  referrerPolicy="no-referrer"
                  className={
                    card.imgCover
                      ? 'h-full w-full object-cover scale-105 mix-blend-multiply'
                      : 'h-full w-full object-contain mix-blend-multiply p-2'
                  }
                />
              </div>

              <h2 className="sketch-heading text-xl sm:text-2xl text-[#24211d] leading-snug">
                {isBn ? card.titleBn : card.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-[#5c564d] mt-1 leading-relaxed flex-1">
                {isBn ? card.descBn : card.descEn}
              </p>
              <p className="text-xs font-semibold text-[#1e5645] mt-2.5 pt-2 border-t border-dashed border-[#3a3630]/20">
                {isBn ? card.metaBn : card.metaEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Contextual Format & Language Bar */}
      <div className="sketch-box-flat p-4 sm:p-5 space-y-4">
        {supportsPageFormatToggle && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSelectPageFormat('1-page')}
              className={`text-left p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                pageFormat === '1-page'
                  ? 'bg-[#24211d] text-[#fffdf8] border-2 border-[#24211d]'
                  : 'bg-[#fffdf8] text-[#24211d] border border-[#3a3630]/40 hover:border-[#24211d]'
              }`}
              style={{ borderRadius: '11px' }}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  pageFormat === '1-page'
                    ? 'bg-[#1e5645] text-white'
                    : 'bg-[#f3ede0] text-[#24211d]'
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-snug">{L.ui.onePageLabel}</div>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    pageFormat === '1-page' ? 'text-[#fffdf8]/80' : 'text-[#5c564d]'
                  }`}
                >
                  {mode === 'cv'
                    ? isBn
                      ? 'ফ্রেশার ও কর্পোরেটের জন্য সংক্ষিপ্ত ১ পৃষ্ঠার সিভি।'
                      : 'Focused essentials sized to fit cleanly on a single A4 page.'
                    : isBn
                    ? 'হোয়াটসঅ্যাপ ও প্রিন্টের জন্য মূল তথ্যসহ নিখুঁত ১ পৃষ্ঠা।'
                    : 'Essential personal, career, family & guardian details on 1 page.'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectPageFormat('2-page')}
              className={`text-left p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                pageFormat === '2-page'
                  ? 'bg-[#24211d] text-[#fffdf8] border-2 border-[#24211d]'
                  : 'bg-[#fffdf8] text-[#24211d] border border-[#3a3630]/40 hover:border-[#24211d]'
              }`}
              style={{ borderRadius: '11px' }}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  pageFormat === '2-page'
                    ? 'bg-[#1e5645] text-white'
                    : 'bg-[#f3ede0] text-[#24211d]'
                }`}
              >
                <Files className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-snug">{L.ui.twoPageLabel}</div>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    pageFormat === '2-page' ? 'text-[#fffdf8]/80' : 'text-[#5c564d]'
                  }`}
                >
                  {mode === 'cv'
                    ? isBn
                      ? 'প্রশিক্ষণ, ব্যক্তিগত তথ্য ও রেফারেন্সসহ পূর্ণাঙ্গ ২ পৃষ্ঠা।'
                      : 'Full details with training, personal info, references & signature.'
                    : isBn
                    ? 'বিস্তারিত পারিবারিক পরিচিতি, দেশের বাড়ি ও প্রত্যাশাসহ ২ পৃষ্ঠা।'
                    : 'Complete family tree, extended relatives, Desher Bari & About Me.'}
                </p>
              </div>
            </button>
          </div>
        )}

        <div
          className={`flex flex-wrap items-center justify-between gap-3 ${
            supportsPageFormatToggle ? 'pt-3 border-t border-dashed border-[#3a3630]/25' : ''
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-[#1e5645] font-semibold">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isBn
                ? '১০০% আপনার ব্রাউজারে সংরক্ষিত — কোনো সার্ভার বা সাইন-আপ নেই'
                : '100% browser-only privacy — no sign-up, no server uploads'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-[#5c564d]">{L.ui.docLanguage}:</span>
            <div
              className="inline-flex p-0.5 bg-[#f3ede0] border border-[#3a3630]/55 shrink-0"
              style={{ borderRadius: '8px' }}
            >
              <button
                type="button"
                onClick={() => onSelectLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer whitespace-nowrap transition-colors ${
                  language === 'en'
                    ? 'bg-[#24211d] text-[#fffdf8]'
                    : 'text-[#5c564d] hover:text-[#24211d]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage('bn')}
                className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer whitespace-nowrap transition-colors ${
                  language === 'bn'
                    ? 'bg-[#24211d] text-[#fffdf8]'
                    : 'text-[#5c564d] hover:text-[#24211d]'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-4">
          {hasSavedDraft && (
            <button
              type="button"
              onClick={onResumeDraft}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e5645] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              <FileEdit className="w-4 h-4" />
              {isBn ? 'আগের খসড়া থেকে শুরু করুন' : 'Resume saved draft'}
            </button>
          )}
          <button
            type="button"
            onClick={onRequestClearAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9f3324] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {L.ui.clearEverything}
          </button>
        </div>

        <button
          type="button"
          onClick={onContinueToTemplates}
          className="sketch-btn w-full sm:w-auto px-7 py-3 text-sm sm:text-base font-bold bg-[#1e5645] text-[#fffdf8] inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <span>
            {isBn
              ? `${selectedCard.titleBn} টেমপ্লেট দেখুন (${toBanglaDigits(selectedTplCount)}টি)`
              : `Browse ${selectedCard.titleEn} Templates (${selectedTplCount})`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
