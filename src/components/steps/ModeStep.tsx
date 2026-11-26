import React from 'react';
import { ArrowRight, Check, FileEdit, FileText, Files, Lock, Trash2 } from 'lucide-react';
import { AppMode, DocLanguage, PageFormat } from '../../types/builder';
import { LABELS } from '../../data/i18n';
import { SketchUnderline } from '../SketchChrome';

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

import cvIllusImg from '../../assets/images/sketch_cv_workbook_1795659049299.jpg';
import biodataIllusImg from '../../assets/images/sketch_biodata_workbook_1795659049927.jpg';

const CV_ILLUS_SRC = cvIllusImg;
const BIODATA_ILLUS_SRC = biodataIllusImg;

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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8">
      {/* Focused Centered Purpose Question */}
      <div className="text-center space-y-2">
        <h1 className="sketch-heading text-3xl sm:text-5xl text-[#24211d] leading-tight">
          {language === 'bn' ? 'আজ কী তৈরি করতে চান?' : 'What are you creating today?'}
        </h1>
        <div className="flex justify-center">
          <SketchUnderline className="w-44 h-3" />
        </div>
        <p className="text-sm sm:text-base text-[#5c564d] max-w-xl mx-auto leading-relaxed">
          {language === 'bn'
            ? 'প্রথমে উদ্দেশ্য বেছে নিন — এরপর আপনার জন্য উপযোগী টেমপ্লেট দেখে তথ্য বসিয়ে সরাসরি A4 PDF ডাউনলোড করুন।'
            : 'Choose your purpose first, browse templates made for it, then fill in your details and export a print-ready A4 PDF.'}
        </p>
      </div>

      {/* 1. Purpose Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button
          type="button"
          onClick={() => onSelectMode('cv')}
          className={`text-left p-5 sm:p-6 cursor-pointer transition-transform relative ${
            mode === 'cv'
              ? 'bg-[#eef5f2] border-2 border-[#1e5645] shadow-[5px_5px_0px_#1e5645]'
              : 'bg-[#fffdf8] border-[1.5px] border-[#3a3630]/55 hover:border-[#24211d] hover:-translate-y-0.5'
          }`}
          style={{ borderRadius: '16px 18px 17px 14px / 15px 17px 16px 18px' }}
        >
          {mode === 'cv' && (
            <span className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-[#1e5645] text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </span>
          )}
          <div className="h-24 sm:h-32 w-full mb-3 sm:mb-4 overflow-hidden flex items-center justify-center rounded-xl bg-[#faf7f0]">
            <img
              src={CV_ILLUS_SRC}
              alt="Bangladeshi CV sketchbook illustration"
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain mix-blend-multiply p-2"
            />
          </div>
          <h2 className="sketch-heading text-2xl sm:text-3xl text-[#24211d] leading-snug">
            {L.ui.cvCardTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#5c564d] mt-1.5 leading-relaxed">
            {language === 'bn'
              ? 'ব্যাংক, কর্পোরেট, এনজিও, টেক ও সরকারি চাকরির জন্য ২২টি টেমপ্লেট।'
              : '22 templates for Bangladeshi banks, corporate, NGOs, tech & govt jobs.'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('biodata')}
          className={`text-left p-4 sm:p-6 cursor-pointer transition-transform relative ${
            mode === 'biodata'
              ? 'bg-[#eef5f2] border-2 border-[#1e5645] shadow-[4px_4px_0px_#1e5645] sm:shadow-[5px_5px_0px_#1e5645]'
              : 'bg-[#fffdf8] border-[1.5px] border-[#3a3630]/55 hover:border-[#24211d] hover:-translate-y-0.5'
          }`}
          style={{ borderRadius: '17px 15px 18px 16px / 16px 18px 15px 17px' }}
        >
          {mode === 'biodata' && (
            <span className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-[#1e5645] text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </span>
          )}
          <div className="h-24 sm:h-32 w-full mb-3 sm:mb-4 overflow-hidden flex items-center justify-center rounded-xl bg-[#faf7f0]">
            <img
              src={BIODATA_ILLUS_SRC}
              alt="Bangladeshi Marriage Biodata illustration"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover scale-105 mix-blend-multiply"
            />
          </div>
          <h2 className="sketch-heading text-2xl sm:text-3xl text-[#24211d] leading-snug">
            {L.ui.biodataCardTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#5c564d] mt-1.5 leading-relaxed">
            {language === 'bn'
              ? 'ইসলামিক, সনাতন, খ্রিস্টান, বৌদ্ধ ও আধুনিক ৩৭টি অভিজাত বায়োডাটা ডিজাইন।'
              : '37 royal, Islamic, Hindu, Christian, Buddhist & modern family layouts.'}
          </p>
        </button>
      </div>

      {/* 2. Page Format & Language Bar */}
      <div className="sketch-box-flat p-4 sm:p-5 space-y-4">
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
                  ? language === 'bn'
                    ? 'ফ্রেশার ও কর্পোরেটের জন্য সংক্ষিপ্ত ১ পৃষ্ঠার প্রশ্ন ও বিন্যাস।'
                    : 'Focused essentials sized to fit cleanly on a single A4 page.'
                  : language === 'bn'
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
                  ? language === 'bn'
                    ? 'প্রশিক্ষণ, ব্যক্তিগত তথ্য ও রেফারেন্সসহ পূর্ণাঙ্গ ২ পৃষ্ঠার সিভি।'
                    : 'Full details with training, personal info, references & signature.'
                  : language === 'bn'
                  ? 'বিস্তারিত পারিবারিক পরিচিতি, দেশের বাড়ি ও প্রত্যাশাসহ ২ পৃষ্ঠা।'
                  : 'Complete family tree, extended relatives, Desher Bari & About Me.'}
              </p>
            </div>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dashed border-[#3a3630]/25">
          <div className="flex items-center gap-2 text-xs text-[#1e5645] font-semibold">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {language === 'bn'
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

      {/* 3. Primary CTA to Browse Templates for Chosen Purpose */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-4">
          {hasSavedDraft && (
            <button
              type="button"
              onClick={onResumeDraft}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e5645] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              <FileEdit className="w-4 h-4" />
              {language === 'bn' ? 'আগের খসড়া থেকে শুরু করুন' : 'Resume saved draft'}
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
            {mode === 'cv'
              ? language === 'bn'
                ? 'সিভি টেমপ্লেট দেখুন (২২টি)'
                : 'Browse CV Templates (22)'
              : language === 'bn'
              ? 'বায়োডাটা টেমপ্লেট দেখুন (৩৭টি)'
              : 'Browse Biodata Templates (37)'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
