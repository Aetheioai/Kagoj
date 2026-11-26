import React, { Suspense, lazy } from 'react';
import {
  AppMode,
  BiodataData,
  CVData,
  DocCustomization,
  DocLanguage,
  InvoiceData,
  JobAppData,
  OfficeLetterData,
  PageFormat,
  PosterData,
} from '../types/builder';
import { CVTemplateRenderer } from './templates/CVTemplates';
import { BiodataTemplateRenderer } from './templates/BiodataTemplates';

const LazyJobAppRenderer = lazy(() =>
  import('./templates/JobAppTemplates').then((m) => ({
    default: m.JobAppTemplateRenderer,
  }))
);

const LazyOfficeLetterRenderer = lazy(() =>
  import('./templates/OfficeLetterTemplates').then((m) => ({
    default: m.OfficeLetterTemplateRenderer,
  }))
);

const LazyPosterRenderer = lazy(() =>
  import('./templates/PosterTemplates').then((m) => ({
    default: m.PosterTemplateRenderer,
  }))
);

const LazyInvoiceRenderer = lazy(() =>
  import('./templates/InvoiceTemplates').then((m) => ({
    default: m.InvoiceTemplateRenderer,
  }))
);

export interface DocumentRendererProps {
  mode: AppMode;
  templateId: string;
  language: DocLanguage;
  customization?: DocCustomization;
  pageFormat?: PageFormat;
  cv: CVData;
  biodata: BiodataData;
  jobApp: JobAppData;
  officeLetter: OfficeLetterData;
  poster: PosterData;
  invoice: InvoiceData;
}

export function DocumentRenderer({
  mode,
  templateId,
  language,
  customization,
  pageFormat,
  cv,
  biodata,
  jobApp,
  officeLetter,
  poster,
  invoice,
}: DocumentRendererProps) {
  if (mode === 'cv') {
    return (
      <CVTemplateRenderer
        data={cv}
        templateId={templateId}
        language={language}
        customization={customization}
        pageFormat={pageFormat || '2-page'}
      />
    );
  }

  if (mode === 'biodata') {
    return (
      <BiodataTemplateRenderer
        data={biodata}
        templateId={templateId}
        language={language}
        customization={customization}
        pageFormat={pageFormat || '2-page'}
      />
    );
  }

  const fallback = (
    <div className="a4-sheet flex items-center justify-center bg-white text-sm text-[#6f685e]">
      {language === 'bn' ? 'টেমপ্লেট লোড হচ্ছে...' : 'Loading template...'}
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      {mode === 'job_app' && (
        <LazyJobAppRenderer
          data={jobApp}
          templateId={templateId}
          language={language}
          customization={customization}
        />
      )}
      {mode === 'office_letter' && (
        <LazyOfficeLetterRenderer
          data={officeLetter}
          templateId={templateId}
          language={language}
          customization={customization}
        />
      )}
      {mode === 'poster' && (
        <LazyPosterRenderer
          data={poster}
          templateId={templateId}
          language={language}
          customization={customization}
        />
      )}
      {mode === 'invoice' && (
        <LazyInvoiceRenderer
          data={invoice}
          templateId={templateId}
          language={language}
          customization={customization}
        />
      )}
    </Suspense>
  );
}
