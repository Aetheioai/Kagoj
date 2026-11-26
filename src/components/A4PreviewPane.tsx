import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Code2, LayoutGrid, SlidersHorizontal, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
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
import { getTemplateById } from '../data/templates';
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  applySmartPageBreaks,
} from '../utils/pagination';
import { DocumentRenderer } from './DocumentRenderer';

interface A4PreviewPaneProps {
  mode: AppMode;
  pageFormat: PageFormat;
  language: DocLanguage;
  cv: CVData;
  biodata: BiodataData;
  jobApp: JobAppData;
  officeLetter: OfficeLetterData;
  poster: PosterData;
  invoice: InvoiceData;
  activeTemplateId: string;
  hasContent: boolean;
  customization: DocCustomization;
  onChangePageFormat: (fmt: PageFormat) => void;
  onChangePosterAspectRatio?: (ratio: PosterAspectRatio) => void;
  onOpenInvoiceCode?: () => void;
  onOpenTemplates: () => void;
  onOpenCustomize: () => void;
  onLoadSample: () => void;
}

export function A4PreviewPane({
  mode,
  pageFormat,
  language,
  cv,
  biodata,
  jobApp,
  officeLetter,
  poster,
  invoice,
  activeTemplateId,
  hasContent,
  customization,
  onChangePageFormat,
  onChangePosterAspectRatio,
  onOpenInvoiceCode,
  onOpenTemplates,
  onOpenCustomize,
  onLoadSample,
}: A4PreviewPaneProps) {
  const L = LABELS[language];
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const [fitScale, setFitScale] = useState(0.62);
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [zoomMode, setZoomMode] = useState<'fit' | 'actual'>('fit');
  const [pageCount, setPageCount] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(A4_HEIGHT_PX);
  const [fitStatus, setFitStatus] = useState<'exact' | 'compressed' | 'overflow'>('exact');

  const activeTemplate = getTemplateById(mode, activeTemplateId);
  const supportsPageFormatToggle = mode === 'cv' || mode === 'biodata';
  const effectivePageFormat: PageFormat =
    mode === 'poster' ? '1-page' : supportsPageFormatToggle ? pageFormat : '2-page';
  const posterSpec = getPosterAspectSpec(customization.posterAspectRatio);
  const targetWidth = mode === 'poster' ? posterSpec.width : A4_WIDTH_PX;
  const targetHeight = mode === 'poster' ? posterSpec.height : sheetHeight;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth <= 0) return;
      setVisibleWidth(el.clientWidth);
      const style = window.getComputedStyle(el);
      const padX =
        (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
      const avail = Math.max(200, el.clientWidth - padX - 2);
      setFitScale(Math.min(1, avail / targetWidth));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [targetWidth]);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || visibleWidth <= 0) return;

    if (mode === 'poster') {
      setPageCount(1);
      setSheetHeight(posterSpec.height);
      setFitStatus('exact');
      return;
    }

    const run = () => {
      const result = applySmartPageBreaks(sheet, {
        replicatePageFrames: true,
        pageFormat: effectivePageFormat,
      });
      setPageCount(result.totalPages);
      setSheetHeight(result.contentHeight);
      setFitStatus(result.fitStatus);
    };

    const raf = window.requestAnimationFrame(run);
    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled && sheetRef.current) run();
      });
    }
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
    };
  }, [
    mode,
    effectivePageFormat,
    cv,
    biodata,
    jobApp,
    officeLetter,
    poster,
    invoice,
    activeTemplateId,
    language,
    customization,
    visibleWidth,
  ]);

  const scale = zoomMode === 'actual' ? 1 : fitScale;

  return (
    <div className="flex flex-col flex-1 lg:h-full min-w-0">
      {/* Preview Desk Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-[#f3ede0] border-b border-[#3a3630]/25 min-w-0 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-bold text-[#24211d] truncate max-w-[140px] sm:max-w-[210px]">
            {language === 'bn' ? activeTemplate.nameBn : activeTemplate.name}
          </span>
          <span className="text-[#8c8478]" aria-hidden="true">
            ·
          </span>
          <span className="text-xs text-[#5c564d] tabular-nums whitespace-nowrap shrink-0">
            {mode === 'poster'
              ? `${language === 'bn' ? posterSpec.shortBn : posterSpec.shortEn} · ${posterSpec.width}×${posterSpec.height}`
              : `A4 · ${pageCount} ${
                  language === 'bn' ? 'পৃষ্ঠা' : pageCount === 1 ? 'page' : 'pages'
                }`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {supportsPageFormatToggle && (
            <div
              className="inline-flex bg-[#fffdf8] border border-[#3a3630]/45 rounded-lg p-0.5"
              role="group"
              aria-label="Page format"
            >
              <button
                type="button"
                onClick={() => onChangePageFormat('1-page')}
                className={`px-2 py-1 sm:py-0.5 text-xs font-bold rounded cursor-pointer whitespace-nowrap transition-colors ${
                  pageFormat === '1-page'
                    ? 'bg-[#1e5645] text-[#fffdf8]'
                    : 'text-[#5c564d] hover:text-[#24211d]'
                }`}
              >
                {language === 'bn' ? '১ পৃষ্ঠা' : '1-Page'}
              </button>
              <button
                type="button"
                onClick={() => onChangePageFormat('2-page')}
                className={`px-2 py-1 sm:py-0.5 text-xs font-bold rounded cursor-pointer whitespace-nowrap transition-colors ${
                  pageFormat === '2-page'
                    ? 'bg-[#1e5645] text-[#fffdf8]'
                    : 'text-[#5c564d] hover:text-[#24211d]'
                }`}
              >
                {language === 'bn' ? '২ পৃষ্ঠা' : '2-Page'}
              </button>
            </div>
          )}

          {mode === 'poster' && onChangePosterAspectRatio && (
            <select
              value={posterSpec.id}
              onChange={(e) =>
                onChangePosterAspectRatio(e.target.value as PosterAspectRatio)
              }
              aria-label={language === 'bn' ? 'পোস্টারের সাইজ' : 'Poster aspect ratio'}
              className="px-2 py-1 text-xs font-bold text-[#24211d] bg-[#fffdf8] border border-[#3a3630]/45 rounded-lg cursor-pointer"
            >
              {POSTER_ASPECT_RATIOS.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {language === 'bn' ? spec.shortBn : spec.shortEn}
                </option>
              ))}
            </select>
          )}

          {mode === 'invoice' && onOpenInvoiceCode && (
            <button
              type="button"
              onClick={onOpenInvoiceCode}
              className="px-2.5 py-1 text-xs font-bold text-[#24211d] bg-[#fffdf8] border border-[#3a3630]/50 rounded-lg hover:border-[#1e5645] hover:text-[#1e5645] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'কোড দেখুন' : 'View Code'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenTemplates}
            className="px-2.5 py-1 text-xs font-semibold text-[#24211d] bg-[#fffdf8] border border-[#3a3630]/45 rounded-lg hover:border-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'টেমপ্লেট' : 'Templates'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCustomize}
            className="px-2.5 py-1 text-xs font-semibold text-[#1e5645] bg-[#eef5f2] border border-[#1e5645]/45 rounded-lg hover:border-[#1e5645] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'bn' ? 'কাস্টমাইজ' : 'Customize'}
            </span>
          </button>

          <div className="inline-flex bg-[#fffdf8] border border-[#3a3630]/45 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setZoomMode('fit')}
              className={`px-2 py-1 sm:py-0.5 text-xs font-medium rounded flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                zoomMode === 'fit'
                  ? 'bg-[#24211d] text-[#fffdf8]'
                  : 'text-[#5c564d] hover:text-[#24211d]'
              }`}
            >
              <ZoomOut className="w-3 h-3" />
              {L.ui.fitWidth}
            </button>
            <button
              type="button"
              onClick={() => setZoomMode('actual')}
              className={`px-2 py-1 sm:py-0.5 text-xs font-medium rounded flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                zoomMode === 'actual'
                  ? 'bg-[#24211d] text-[#fffdf8]'
                  : 'text-[#5c564d] hover:text-[#24211d]'
              }`}
            >
              <ZoomIn className="w-3 h-3" />
              {L.ui.actualSize}
            </button>
          </div>
        </div>
      </div>

      {/* Gentle 1-Page Overflow Notice (CV & Biodata only) */}
      {supportsPageFormatToggle && pageFormat === '1-page' && fitStatus === 'overflow' && (
        <div className="px-4 py-2 bg-[#fdf4e3] border-b border-[#c88a2e]/35 flex items-center justify-between gap-2 text-xs text-[#69440e]">
          <span className="truncate">
            {language === 'bn'
              ? 'তথ্য ১ পৃষ্ঠার বেশি হয়ে গেছে — কিছু অংশ কমান অথবা ২ পৃষ্ঠার ফরম্যাটে যান।'
              : 'Your details exceed 1 page — trim a few lines or switch to 2-Page Format.'}
          </span>
          <button
            type="button"
            onClick={() => onChangePageFormat('2-page')}
            className="px-2.5 py-1 text-xs font-bold bg-[#24211d] text-[#fffdf8] rounded-md cursor-pointer whitespace-nowrap shrink-0"
          >
            {language === 'bn' ? '২ পৃষ্ঠা চালু করুন' : 'Switch to 2-Page'}
          </button>
        </div>
      )}

      {/* Subtle Sample Nudge when empty */}
      {!hasContent && (
        <div className="px-4 py-2 bg-[#fbf2df] border-b border-[#c88a2e]/30 flex items-center justify-between gap-2 text-xs text-[#593c0e]">
          <span className="truncate">
            {language === 'bn'
              ? 'তথ্য লিখতে শুরু করুন অথবা নমুনা তথ্য দিয়ে দেখুন।'
              : 'Type your details on the left or preview with sample data.'}
          </span>
          <button
            type="button"
            onClick={onLoadSample}
            className="px-2.5 py-1 text-xs font-bold bg-[#fffdf8] border border-[#3a3630]/50 rounded-md text-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c88a2e]" />
            {L.ui.loadSample}
          </button>
        </div>
      )}

      {/* Scaled A4 Paper Canvas */}
      <div
        ref={containerRef}
        className={`flex-1 sketch-desk p-2.5 sm:p-5 ${
          zoomMode === 'actual'
            ? 'overflow-x-auto lg:overflow-auto'
            : 'overflow-visible lg:overflow-auto'
        }`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          className="mx-auto bg-white shadow-[0_6px_28px_rgba(36,33,29,0.14)] border border-[#24211d]/12 overflow-hidden"
          style={{
            width: `${Math.floor(targetWidth * scale)}px`,
            height: `${Math.ceil(targetHeight * scale)}px`,
            position: 'relative',
          }}
        >
          <div
            ref={sheetRef}
            className="origin-top-left bg-white relative"
            style={{
              width: `${targetWidth}px`,
              transform: `scale(${scale})`,
            }}
          >
            <DocumentRenderer
              mode={mode}
              templateId={activeTemplateId}
              language={language}
              customization={customization}
              pageFormat={effectivePageFormat}
              cv={cv}
              biodata={biodata}
              jobApp={jobApp}
              officeLetter={officeLetter}
              poster={poster}
              invoice={invoice}
            />

            {Array.from({ length: Math.max(0, pageCount - 1) }).map((_, idx) => {
              const y = (idx + 1) * A4_HEIGHT_PX;
              return (
                <div
                  key={idx}
                  className="a4-page-guide pointer-events-none absolute left-0 right-0 flex items-center justify-center"
                  style={{ top: `${y - 8}px`, height: '16px', zIndex: 30 }}
                >
                  <div className="w-full h-[14px] bg-[#ece5d5] border-y border-[#3a3630]/25 flex items-center justify-center">
                    <span className="bg-[#24211d] text-[#fffdf8] text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide">
                      {language === 'bn' ? `পৃষ্ঠা ${idx + 2}` : `Page ${idx + 2}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
