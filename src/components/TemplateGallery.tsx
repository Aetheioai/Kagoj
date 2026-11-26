import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import {
  AppMode,
  BiodataData,
  CVData,
  DocCustomization,
  DocLanguage,
  PageFormat,
} from '../types/builder';
import { LABELS } from '../data/i18n';
import { getTemplateById, getTemplatesForMode } from '../data/templates';
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
import { hasAnyBiodataData, hasAnyCVData, toBanglaDigits } from '../utils/storage';
import { CVTemplateRenderer } from './templates/CVTemplates';
import { BiodataTemplateRenderer } from './templates/BiodataTemplates';
import { SketchUnderline } from './SketchChrome';

function ScaledMiniA4({ children }: { children: React.ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.32);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth > 0) {
        setScale(el.clientWidth / 794);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className="w-full aspect-[210/285] bg-white border border-[#24211d]/15 overflow-hidden relative mb-2.5 rounded-sm"
    >
      <div
        className="origin-top-left pointer-events-none select-none"
        style={{
          width: '794px',
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
  selectedTemplateId: string;
  customization: DocCustomization;
  onSelectTemplate: (id: string) => void;
  onChangePageFormat: (fmt: PageFormat) => void;
  onBackToPurpose: () => void;
  onContinueToEditor: (templateId?: string) => void;
}

export function TemplateGallery({
  mode,
  pageFormat,
  language,
  cv,
  biodata,
  selectedTemplateId,
  customization,
  onSelectTemplate,
  onChangePageFormat,
  onBackToPurpose,
  onContinueToEditor,
}: TemplateGalleryProps) {
  const L = LABELS[language];
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setActiveCategory('all');
  }, [mode]);

  const templates = useMemo(() => getTemplatesForMode(mode), [mode]);
  const categories = mode === 'cv' ? L.ui.cvCategories : L.ui.biodataCategories;
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
    if (pageFormat === '1-page') {
      return language === 'bn' ? SAMPLE_CV_1P_BN : SAMPLE_CV_1P_EN;
    }
    return language === 'bn' ? SAMPLE_CV_BN : SAMPLE_CV_EN;
  }, [cv, language, pageFormat]);

  const hasUserBiodata = useMemo(() => hasAnyBiodataData(biodata), [biodata]);

  const previewBiodata = useMemo(() => {
    if (hasUserBiodata) return biodata;
    if (pageFormat === '1-page') {
      return language === 'bn' ? SAMPLE_BIODATA_1P_BN : SAMPLE_BIODATA_1P_EN;
    }
    return language === 'bn' ? SAMPLE_BIODATA_BN : SAMPLE_BIODATA_EN;
  }, [biodata, hasUserBiodata, language, pageFormat]);

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
            {language === 'bn' ? 'উদ্দেশ্য পরিবর্তন করুন' : 'Change purpose'}
          </button>
          <h1 className="sketch-heading text-3xl sm:text-4xl text-[#24211d] leading-tight">
            {mode === 'cv'
              ? language === 'bn'
                ? `বাংলাদেশি সিভি টেমপ্লেট বেছে নিন (${toBanglaDigits(templates.length)}টি)`
                : `Choose a Bangladeshi CV Template (${templates.length})`
              : language === 'bn'
              ? `বিবাহের বায়োডাটা টেমপ্লেট বেছে নিন (${toBanglaDigits(templates.length)}টি)`
              : `Choose a Marriage Biodata Template (${templates.length})`}
          </h1>
          <SketchUnderline className="w-40 h-2.5 mt-1" />
          <p className="text-xs sm:text-sm text-[#5c564d] mt-1.5">
            {language === 'bn'
              ? 'পছন্দের ডিজাইন বেছে নিন — পরের ধাপে নিজের তথ্য বসিয়ে লাইভ প্রিভিউ দেখবেন এবং A4 PDF ডাউনলোড করবেন।'
              : 'Pick your favorite layout below. Next you will enter your details with live A4 preview and direct PDF export.'}
          </p>
        </div>

        {/* Live 1-Page / 2-Page Format Toggle */}
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
      </div>

      {/* Category Filter Bar — horizontal swipe rail on mobile, wrap on desktop */}
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

      {/* Responsive Miniature A4 Template Showcase (1-col on 320px, 2-col phones, 3-col tablet, 4-col desktop, 5-col ultrawide) */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-5">
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
                <ScaledMiniA4>
                  {mode === 'cv' ? (
                    <CVTemplateRenderer
                      data={previewCV}
                      templateId={tpl.id}
                      language={language}
                      customization={{ ...customization, accentColor: '' }}
                      pageFormat={pageFormat}
                    />
                  ) : (
                    <BiodataTemplateRenderer
                      data={getThumbnailBiodata(tpl.id)}
                      templateId={tpl.id}
                      language={language}
                      customization={{ ...customization, accentColor: '' }}
                      pageFormat={pageFormat}
                    />
                  )}
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
                      {language === 'bn' ? tpl.nameBn : tpl.name}
                    </span>
                  </div>
                  <p className="hidden sm:line-clamp-2 text-xs leading-snug text-[#5c564d] mt-0.5 pl-4.5">
                    {language === 'bn' ? tpl.descriptionBn : tpl.description}
                  </p>
                </div>

                <div className="pt-2 mt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(tpl.id);
                      onContinueToEditor(tpl.id);
                    }}
                    className={`w-full py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs font-bold rounded-lg inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#1e5645] text-[#fffdf8]'
                        : 'bg-[#f3ede0] text-[#24211d] group-hover:bg-[#24211d] group-hover:text-[#fffdf8]'
                    }`}
                  >
                    <span className="truncate">
                      {language === 'bn' ? 'বেছে নিন' : 'Use Template'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Continue Bar with iOS Safe-Area Padding */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-[#faf7f0]/95 backdrop-blur-sm border-t border-[#3a3630]/30 px-3.5 sm:px-6 pt-3 safe-bottom">
        <div className="max-w-[1380px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-3 h-3 rounded-full shrink-0 border border-black/15"
              style={{ backgroundColor: selectedTemplate.accent }}
            />
            <div className="min-w-0">
              <div className="text-[11px] text-[#6f685e] leading-tight">
                {language === 'bn' ? 'নির্বাচিত টেমপ্লেট' : 'Selected'}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#24211d] truncate">
                {language === 'bn' ? selectedTemplate.nameBn : selectedTemplate.name}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onContinueToEditor(selectedTemplate.id)}
            className="sketch-btn px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#1e5645] text-[#fffdf8] inline-flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>
              {language === 'bn' ? 'তথ্য লিখুন' : 'Add Your Info'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
