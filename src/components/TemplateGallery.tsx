import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Code2 } from 'lucide-react';
import {
  AppMode,
  BiodataData,
  CVData,
  DocCustomization,
  DocLanguage,
  InvoiceData,
  JobAppData,
  OfficeLetterData,
  POSTER_ASPECT_RATIOS,
  PageFormat,
  PosterAspectRatio,
  PosterData,
  getPosterAspectSpec,
} from '../types/builder';
import { LABELS } from '../data/i18n';
import { getTemplateById, getTemplatesForMode } from '../data/templates';
import { EXTRA_CATEGORIES_BN, EXTRA_CATEGORIES_EN } from '../data/extraTemplates';
import {
  SAMPLE_BIODATA_1P_BN,
  SAMPLE_BIODATA_1P_EN,
  SAMPLE_BIODATA_BN,
  SAMPLE_BIODATA_EN,
  SAMPLE_CV_1P_BN,
  SAMPLE_CV_1P_EN,
  SAMPLE_CV_BN,
  SAMPLE_CV_EN,
} from '../data/samples';
import {
  SAMPLE_INVOICE_BN,
  SAMPLE_INVOICE_EN,
  SAMPLE_JOB_APP_BN,
  SAMPLE_JOB_APP_EN,
  SAMPLE_OFFICE_LETTER_BN,
  SAMPLE_OFFICE_LETTER_EN,
  SAMPLE_POSTER_TOLET_BN,
  SAMPLE_POSTER_TOLET_EN,
  SAMPLE_POSTER_TUITION_BN,
  SAMPLE_POSTER_TUITION_EN,
} from '../data/extraSamples';
import {
  hasAnyBiodataData,
  hasAnyCVData,
  hasAnyInvoiceData,
  hasAnyJobAppData,
  hasAnyOfficeLetterData,
  hasAnyPosterData,
  toBanglaDigits,
} from '../utils/storage';
import { DocumentRenderer } from './DocumentRenderer';
import { SketchUnderline } from './SketchChrome';

function ScaledMiniA4({
  children,
  canvasWidth = 794,
  canvasHeight = 1123,
}: {
  children: React.ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.32);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth > 0) {
        setScale(el.clientWidth / canvasWidth);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasWidth]);

  return (
    <div
      ref={boxRef}
      className="w-full bg-white border border-[#24211d]/15 overflow-hidden relative mb-2.5 rounded-sm"
      style={{ aspectRatio: `${canvasWidth} / ${canvasHeight}` }}
    >
      <div
        className="origin-top-left pointer-events-none select-none"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface TemplateGalleryProps {
  mode: AppMode;
  pageFormat: PageFormat;
  language: DocLanguage;
  cv: CVData;
  biodata: BiodataData;
  jobApp: JobAppData;
  officeLetter: OfficeLetterData;
  poster: PosterData;
  invoice: InvoiceData;
  selectedTemplateId: string;
  customization: DocCustomization;
  onSelectTemplate: (id: string) => void;
  onChangePageFormat: (fmt: PageFormat) => void;
  onChangePosterAspectRatio?: (ratio: PosterAspectRatio) => void;
  onInspectInvoiceCode?: (templateId: string) => void;
  onBackToPurpose: () => void;
  onContinueToEditor: (templateId?: string) => void;
}

export function TemplateGallery({
  mode,
  pageFormat,
  language,
  cv,
  biodata,
  jobApp,
  officeLetter,
  poster,
  invoice,
  selectedTemplateId,
  customization,
  onSelectTemplate,
  onChangePageFormat,
  onChangePosterAspectRatio,
  onInspectInvoiceCode,
  onBackToPurpose,
  onContinueToEditor,
}: TemplateGalleryProps) {
  const L = LABELS[language];
  const isBn = language === 'bn';
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setActiveCategory('all');
  }, [mode]);

  const templates = useMemo(() => getTemplatesForMode(mode), [mode]);
  const categories = useMemo<Record<string, string>>(() => {
    if (mode === 'cv') return L.ui.cvCategories;
    if (mode === 'biodata') return L.ui.biodataCategories;
    return isBn ? EXTRA_CATEGORIES_BN[mode] : EXTRA_CATEGORIES_EN[mode];
  }, [mode, isBn, L.ui.cvCategories, L.ui.biodataCategories]);

  const selectedTemplate = useMemo(
    () => getTemplateById(mode, selectedTemplateId),
    [mode, selectedTemplateId]
  );

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return templates;
    return templates.filter((t) => t.category === activeCategory);
  }, [templates, activeCategory]);

  const previewCV = useMemo(() => {
    if (hasAnyCVData(cv)) return cv;
    if (pageFormat === '1-page') return isBn ? SAMPLE_CV_1P_BN : SAMPLE_CV_1P_EN;
    return isBn ? SAMPLE_CV_BN : SAMPLE_CV_EN;
  }, [cv, isBn, pageFormat]);

  const hasUserBiodata = useMemo(() => hasAnyBiodataData(biodata), [biodata]);
  const previewBiodata = useMemo(() => {
    if (hasUserBiodata) return biodata;
    if (pageFormat === '1-page') return isBn ? SAMPLE_BIODATA_1P_BN : SAMPLE_BIODATA_1P_EN;
    return isBn ? SAMPLE_BIODATA_BN : SAMPLE_BIODATA_EN;
  }, [biodata, hasUserBiodata, isBn, pageFormat]);

  const previewJobApp = useMemo(
    () => (hasAnyJobAppData(jobApp) ? jobApp : isBn ? SAMPLE_JOB_APP_BN : SAMPLE_JOB_APP_EN),
    [jobApp, isBn]
  );

  const previewOfficeLetter = useMemo(
    () =>
      hasAnyOfficeLetterData(officeLetter)
        ? officeLetter
        : isBn
        ? SAMPLE_OFFICE_LETTER_BN
        : SAMPLE_OFFICE_LETTER_EN,
    [officeLetter, isBn]
  );

  const hasUserPoster = useMemo(() => hasAnyPosterData(poster), [poster]);
  const previewInvoice = useMemo(
    () => (hasAnyInvoiceData(invoice) ? invoice : isBn ? SAMPLE_INVOICE_BN : SAMPLE_INVOICE_EN),
    [invoice, isBn]
  );

  const getThumbnailBiodata = (tplId: string): BiodataData => {
    if (hasUserBiodata) return previewBiodata;
    if (
      tplId === 'sindoor-alpona-hindu' ||
      tplId === 'banarasi-crimson-gold' ||
      tplId === 'marigold-gaye-holud'
    ) {
      return { ...previewBiodata, invocationPreset: 'om' };
    }
    if (tplId === 'shantiniketan-lotus' || tplId === 'kalighat-ivory-vermilion') {
      return { ...previewBiodata, invocationPreset: 'shri_durga_bn' };
    }
    if (
      tplId === 'cathedral-ivory-gold' ||
      tplId === 'olive-chapel-sage' ||
      tplId === 'midnight-stella-christian' ||
      tplId === 'dove-pearl-minimal'
    ) {
      return { ...previewBiodata, invocationPreset: 'christian_blessing' };
    }
    if (
      tplId === 'saffron-dharmachakra' ||
      tplId === 'bodhi-serenity-jade' ||
      tplId === 'chittagong-hill-weave' ||
      tplId === 'lotus-stupa-ivory'
    ) {
      return { ...previewBiodata, invocationPreset: 'buddhist_namo' };
    }
    return previewBiodata;
  };

  const getThumbnailPoster = (category: string): PosterData => {
    if (hasUserPoster) return poster;
    if (category === 'tuition') {
      return isBn ? SAMPLE_POSTER_TUITION_BN : SAMPLE_POSTER_TUITION_EN;
    }
    return isBn ? SAMPLE_POSTER_TOLET_BN : SAMPLE_POSTER_TOLET_EN;
  };

  const headingByMode: Record<AppMode, { en: string; bn: string }> = {
    cv: { en: 'Choose a Bangladeshi CV Template', bn: 'বাংলাদেশি সিভি টেমপ্লেট বেছে নিন' },
    biodata: { en: 'Choose a Marriage Biodata Template', bn: 'বিবাহের বায়োডাটা টেমপ্লেট বেছে নিন' },
    job_app: { en: 'Choose a Job Application Template', bn: 'চাকরির আবেদনপত্র টেমপ্লেট বেছে নিন' },
    office_letter: { en: 'Choose an Office Letter Template', bn: 'দরখাস্ত ও চিঠির টেমপ্লেট বেছে নিন' },
    poster: { en: 'Choose a To-Let / Tuition Poster Template', bn: 'টু-লেট ও টিউশন পোস্টার বেছে নিন' },
    invoice: { en: 'Choose an Invoice / Cash Memo Template', bn: 'ইনভয়েস ও ক্যাশ মেমো বেছে নিন' },
  };

  const supportsPageFormatToggle = mode === 'cv' || mode === 'biodata';
  const posterSpec = getPosterAspectSpec(customization.posterAspectRatio);
  const thumbWidth = mode === 'poster' ? posterSpec.width : 794;
  const thumbHeight = mode === 'poster' ? posterSpec.height : 1077;
  const isWidePoster =
    mode === 'poster' &&
    (posterSpec.id === 'a4-landscape' || posterSpec.id === '16:9');

  return (
    <div className="max-w-[1380px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-28 space-y-5 sm:space-y-6">
      {/* Gallery Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-dashed border-[#3a3630]/30">
        <div>
          <button
            type="button"
            onClick={onBackToPurpose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c564d] hover:text-[#24211d] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isBn ? 'অন্য ডকুমেন্ট বেছে নিন' : 'All document types'}
          </button>
          <h1 className="sketch-heading text-3xl sm:text-4xl text-[#24211d] leading-tight">
            {isBn
              ? `${headingByMode[mode].bn} (${toBanglaDigits(templates.length)}টি)`
              : `${headingByMode[mode].en} (${templates.length})`}
          </h1>
          <SketchUnderline className="w-40 h-2.5 mt-1" />
          <p className="text-xs sm:text-sm text-[#5c564d] mt-1.5">
            {mode === 'poster'
              ? isBn
                ? 'যেকোনো সাইজ (A4, ১:১, ৪:৫, ৯:১৬, ১৬:৯) বেছে নিন — প্রিন্টের PDF অথবা ফেসবুক/হোয়াটসঅ্যাপের PNG ডাউনলোড করুন।'
                : 'Preview all 15 layouts in any aspect ratio — export print-ready PDF or high-res PNG for social sharing.'
              : mode === 'invoice'
              ? isBn
                ? 'ডিজাইন বেছে নিন অথবা প্রতিটি টেমপ্লেটের "কোড" বাটনে ক্লিক করে HTML / React কোড নিন।'
                : 'Pick a layout to customize and export, or click Code on any Cash Memo template to use it in your own app.'
              : isBn
              ? 'পছন্দের ডিজাইন বেছে নিন — পরের ধাপে সবকিছু নিজের মতো কাস্টমাইজ করে A4 PDF ডাউনলোড করবেন।'
              : 'Pick your favorite layout below. Next you can customize every detail live and download a crisp A4 PDF.'}
          </p>
        </div>

        {/* Live 1-Page / 2-Page Format Toggle (CV & Biodata only) */}
        {supportsPageFormatToggle && (
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="inline-flex p-0.5 bg-[#f3ede0] border border-[#3a3630]/55"
              style={{ borderRadius: '9px' }}
            >
              <button
                type="button"
                onClick={() => onChangePageFormat('1-page')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md cursor-pointer whitespace-nowrap transition-colors ${
                  pageFormat === '1-page'
                    ? 'bg-[#24211d] text-[#fffdf8]'
                    : 'text-[#5c564d] hover:text-[#24211d]'
                }`}
              >
                {L.ui.onePageLabel}
              </button>
              <button
                type="button"
                onClick={() => onChangePageFormat('2-page')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md cursor-pointer whitespace-nowrap transition-colors ${
                  pageFormat === '2-page'
                    ? 'bg-[#24211d] text-[#fffdf8]'
                    : 'text-[#5c564d] hover:text-[#24211d]'
                }`}
              >
                {L.ui.twoPageLabel}
              </button>
            </div>
          </div>
        )}

        {/* Live Poster Aspect Ratio Switcher */}
        {mode === 'poster' && onChangePosterAspectRatio && (
          <div className="flex flex-col items-start md:items-end gap-1 shrink-0 max-w-full">
            <span className="text-[11px] font-semibold text-[#5c564d]">
              {isBn ? 'পোস্টারের সাইজ (Aspect Ratio):' : 'Poster Aspect Ratio:'}
            </span>
            <div
              className="inline-flex p-0.5 bg-[#f3ede0] border border-[#3a3630]/55 overflow-x-auto max-w-full no-scrollbar"
              style={{ borderRadius: '9px' }}
              role="group"
              aria-label="Poster aspect ratio"
            >
              {POSTER_ASPECT_RATIOS.map((spec) => {
                const active = posterSpec.id === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => onChangePosterAspectRatio(spec.id)}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-md cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-[#1e5645] text-[#fffdf8]'
                        : 'text-[#5c564d] hover:text-[#24211d]'
                    }`}
                  >
                    {isBn ? spec.shortBn : spec.shortEn}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-nowrap sm:flex-wrap gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0 pb-1">
        {Object.entries(categories).map(([key, label]) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveCategory(key)}
              className={`px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#24211d] text-[#fffdf8] border-[#24211d]'
                  : 'bg-[#fffdf8] text-[#5c564d] border-[#3a3630]/35 hover:border-[#24211d]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Responsive Miniature Template Grid */}
      <div
        className={
          isWidePoster
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'
            : 'grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-5'
        }
      >
        {filtered.map((tpl) => {
          const isSelected = tpl.id === selectedTemplateId;
          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              onDoubleClick={() => {
                onSelectTemplate(tpl.id);
                onContinueToEditor(tpl.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTemplate(tpl.id);
                }
              }}
              className={`group text-left p-2 sm:p-3 cursor-pointer transition-transform relative flex flex-col ${
                isSelected
                  ? 'bg-[#eef5f2] border-2 border-[#1e5645] shadow-[3px_3px_0px_#1e5645] sm:shadow-[4px_4px_0px_#1e5645]'
                  : 'bg-[#fffdf8] border-[1.5px] border-[#3a3630]/45 hover:border-[#24211d] hover:-translate-y-0.5'
              }`}
              style={{ borderRadius: '12px' }}
            >
              <div className="relative">
                <ScaledMiniA4 canvasWidth={thumbWidth} canvasHeight={thumbHeight}>
                  <DocumentRenderer
                    mode={mode}
                    templateId={tpl.id}
                    language={language}
                    customization={{ ...customization, accentColor: '' }}
                    pageFormat={pageFormat}
                    cv={previewCV}
                    biodata={getThumbnailBiodata(tpl.id)}
                    jobApp={previewJobApp}
                    officeLetter={previewOfficeLetter}
                    poster={getThumbnailPoster(tpl.category)}
                    invoice={previewInvoice}
                  />
                </ScaledMiniA4>
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[#1e5645] text-white flex items-center justify-center rounded-full shadow">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="px-0.5 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15"
                      style={{ backgroundColor: tpl.accent }}
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#24211d] truncate">
                      {isBn ? tpl.nameBn : tpl.name}
                    </span>
                  </div>
                  <p className="hidden sm:line-clamp-2 text-xs leading-snug text-[#5c564d] mt-0.5 pl-4.5">
                    {isBn ? tpl.descriptionBn : tpl.description}
                  </p>
                </div>

                <div className="pt-2 mt-1 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(tpl.id);
                      onContinueToEditor(tpl.id);
                    }}
                    className={`flex-1 py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs font-bold rounded-lg inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#1e5645] text-[#fffdf8]'
                        : 'bg-[#f3ede0] text-[#24211d] group-hover:bg-[#24211d] group-hover:text-[#fffdf8]'
                    }`}
                  >
                    <span className="truncate">{isBn ? 'বেছে নিন' : 'Use Template'}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>

                  {mode === 'invoice' && onInspectInvoiceCode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(tpl.id);
                        onInspectInvoiceCode(tpl.id);
                      }}
                      title={
                        isBn
                          ? 'এই ক্যাশ মেমো টেমপ্লেটের HTML / React কোড দেখুন'
                          : 'View & copy HTML / React code for this template'
                      }
                      className="py-1.5 px-2.5 text-[11px] sm:text-xs font-bold rounded-lg border border-[#3a3630]/40 bg-[#fffdf8] text-[#24211d] hover:border-[#1e5645] hover:text-[#1e5645] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{isBn ? 'কোড' : 'Code'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Continue Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-[#faf7f0]/95 backdrop-blur-sm border-t border-[#3a3630]/30 px-3.5 sm:px-6 pt-3 safe-bottom">
        <div className="max-w-[1380px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-3 h-3 rounded-full shrink-0 border border-black/15"
              style={{ backgroundColor: selectedTemplate.accent }}
            />
            <div className="min-w-0">
              <div className="text-[11px] text-[#6f685e] leading-tight">
                {isBn ? 'নির্বাচিত টেমপ্লেট' : 'Selected'}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#24211d] truncate">
                {isBn ? selectedTemplate.nameBn : selectedTemplate.name}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onContinueToEditor(selectedTemplate.id)}
            className="sketch-btn px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#1e5645] text-[#fffdf8] inline-flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{isBn ? 'তথ্য লিখুন' : 'Add Your Info'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
