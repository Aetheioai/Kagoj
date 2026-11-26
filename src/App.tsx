import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Eye,
  FileDown,
  FileEdit,
  Loader2,
  Lock,
  SkipForward,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  AppMode,
  CustomSectionEntry,
  DocCustomization,
  DocLanguage,
  PageFormat,
  WorkspaceState,
} from './types/builder';
import { LABELS } from './data/i18n';
import {
  SAMPLE_BIODATA_1P_BN,
  SAMPLE_BIODATA_1P_EN,
  SAMPLE_BIODATA_BN,
  SAMPLE_BIODATA_EN,
  SAMPLE_CV_1P_BN,
  SAMPLE_CV_1P_EN,
  SAMPLE_CV_BN,
  SAMPLE_CV_EN,
} from './data/samples';
import {
  clearWorkspaceStorage,
  createDefaultCustomization,
  createDefaultWorkspace,
  downloadWorkspaceBackup,
  hasAnyBiodataData,
  hasAnyCVData,
  hasText,
  loadWorkspaceFromStorage,
  parseBackupFile,
  saveWorkspaceToStorage,
} from './utils/storage';
import { exportElementToA4Pdf } from './utils/pdfExport';
import { PencilLogoMark } from './components/SketchChrome';
import { ModeStep } from './components/steps/ModeStep';
import { CVSteps } from './components/steps/CVSteps';
import { BiodataSteps } from './components/steps/BiodataSteps';
import { TemplateGallery } from './components/TemplateGallery';
import { CustomizePanel } from './components/CustomizePanel';
import { A4PreviewPane } from './components/A4PreviewPane';
import { CVTemplateRenderer } from './components/templates/CVTemplates';
import { BiodataTemplateRenderer } from './components/templates/BiodataTemplates';

type AppStage = 'purpose' | 'templates' | 'editor';

const PRIVACY_ILLUS_SRC = '/src/assets/images/sketch_privacy_lock_1795659050240.jpg';

export default function App() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(() =>
    loadWorkspaceFromStorage()
  );
  // Always open on Stage 1 (Purpose) -> Stage 2 (Templates) -> Stage 3 (Add Info, Preview & Export)
  const [stage, setStage] = useState<AppStage>('purpose');
  const [editorStep, setEditorStep] = useState<number>(0);
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit');
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ text: string; tone?: 'ok' | 'err' } | null>(null);

  // Offscreen unscaled 794px A4 element used exclusively for crisp direct PDF download
  const pdfCaptureRef = useRef<HTMLDivElement>(null);

  const L = LABELS[workspace.language];
  const activeFormat: PageFormat =
    workspace.mode === 'cv' ? workspace.cvFormat : workspace.biodataFormat;
  const steps =
    workspace.mode === 'cv'
      ? activeFormat === '1-page'
        ? L.ui.cvSteps1P
        : L.ui.cvSteps2P
      : activeFormat === '1-page'
      ? L.ui.biodataSteps1P
      : L.ui.biodataSteps2P;
  const customizeStepIndex = steps.length - 1;
  const safeEditorStep = Math.min(editorStep, customizeStepIndex);

  const activeCustomization =
    workspace.mode === 'cv' ? workspace.cvStyle : workspace.biodataStyle;
  const activeTemplateId =
    workspace.mode === 'cv' ? workspace.cvTemplateId : workspace.biodataTemplateId;
  const currentDoc = workspace.mode === 'cv' ? workspace.cv : workspace.biodata;
  const hasSavedDraft =
    workspace.mode === 'cv' ? hasAnyCVData(workspace.cv) : hasAnyBiodataData(workspace.biodata);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveWorkspaceToStorage(workspace);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [workspace]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const notify = (text: string, tone: 'ok' | 'err' = 'ok') => setToast({ text, tone });

  const goToStage = (nextStage: AppStage, targetEditorStep?: number) => {
    setStage(nextStage);
    if (typeof targetEditorStep === 'number') {
      setEditorStep(targetEditorStep);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToEditorStep = (idx: number) => {
    setEditorStep(Math.max(0, Math.min(customizeStepIndex, idx)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchMobilePane = (pane: 'edit' | 'preview') => {
    setMobilePane(pane);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const setMode = (mode: AppMode) => {
    setWorkspace((prev) => {
      const nextFormat = mode === 'cv' ? prev.cvFormat : prev.biodataFormat;
      const nextMax = nextFormat === '1-page' ? 3 : 4;
      setEditorStep((s) => (s === customizeStepIndex ? nextMax : Math.min(s, nextMax)));
      return { ...prev, mode };
    });
  };

  const setPageFormat = (fmt: PageFormat) => {
    const wasOnCustomize = safeEditorStep === customizeStepIndex;
    const nextCustomizeIndex = fmt === '1-page' ? 3 : 4;
    setWorkspace((prev) =>
      prev.mode === 'cv' ? { ...prev, cvFormat: fmt } : { ...prev, biodataFormat: fmt }
    );
    setEditorStep((prevStep) => {
      if (wasOnCustomize) return nextCustomizeIndex;
      return Math.min(prevStep, nextCustomizeIndex);
    });
  };

  const setLanguage = (language: DocLanguage) => {
    setWorkspace((prev) => ({ ...prev, language }));
  };

  const handleSelectTemplate = (id: string) => {
    setWorkspace((prev) => {
      if (prev.mode === 'cv') {
        return { ...prev, cvTemplateId: id };
      }
      const curPreset = prev.biodata.invocationPreset;
      let nextPreset = curPreset;
      if (curPreset !== 'custom' && curPreset !== 'none') {
        if (
          id === 'sindoor-alpona-hindu' ||
          id === 'banarasi-crimson-gold' ||
          id === 'marigold-gaye-holud'
        ) {
          nextPreset = 'om';
        } else if (id === 'shantiniketan-lotus' || id === 'kalighat-ivory-vermilion') {
          nextPreset = 'shri_durga_bn';
        } else if (
          id === 'cathedral-ivory-gold' ||
          id === 'olive-chapel-sage' ||
          id === 'midnight-stella-christian' ||
          id === 'dove-pearl-minimal'
        ) {
          nextPreset = 'christian_blessing';
        } else if (
          id === 'saffron-dharmachakra' ||
          id === 'bodhi-serenity-jade' ||
          id === 'chittagong-hill-weave' ||
          id === 'lotus-stupa-ivory'
        ) {
          nextPreset = 'buddhist_namo';
        } else if (
          id === 'islamic-geometric' ||
          id === 'andalusian-zellij-arch' ||
          id === 'mughal-arch-palace'
        ) {
          if (
            curPreset === 'om' ||
            curPreset === 'shri_durga_bn' ||
            curPreset === 'christian_blessing' ||
            curPreset === 'buddhist_namo'
          ) {
            nextPreset = prev.language === 'bn' ? 'bismillah_ar_bn' : 'bismillah_ar_en';
          }
        }
      }
      return {
        ...prev,
        biodataTemplateId: id,
        biodata:
          nextPreset !== curPreset
            ? { ...prev.biodata, invocationPreset: nextPreset }
            : prev.biodata,
      };
    });
  };

  const updateActiveCustomization = (next: DocCustomization) => {
    setWorkspace((prev) =>
      prev.mode === 'cv' ? { ...prev, cvStyle: next } : { ...prev, biodataStyle: next }
    );
  };

  const updateCustomSections = (next: CustomSectionEntry[]) => {
    setWorkspace((prev) =>
      prev.mode === 'cv'
        ? { ...prev, cv: { ...prev.cv, customSections: next } }
        : { ...prev, biodata: { ...prev.biodata, customSections: next } }
    );
  };

  const toggleActivePhoto = () => {
    setWorkspace((prev) =>
      prev.mode === 'cv'
        ? { ...prev, cv: { ...prev.cv, showPhoto: !prev.cv.showPhoto } }
        : { ...prev, biodata: { ...prev.biodata, showPhoto: !prev.biodata.showPhoto } }
    );
  };

  const handleLoadSample = () => {
    setWorkspace((prev) => {
      if (prev.mode === 'cv') {
        const sample =
          prev.cvFormat === '1-page'
            ? prev.language === 'bn'
              ? SAMPLE_CV_1P_BN
              : SAMPLE_CV_1P_EN
            : prev.language === 'bn'
            ? SAMPLE_CV_BN
            : SAMPLE_CV_EN;
        return { ...prev, cv: structuredClone(sample) };
      }
      const sample =
        prev.biodataFormat === '1-page'
          ? prev.language === 'bn'
            ? SAMPLE_BIODATA_1P_BN
            : SAMPLE_BIODATA_1P_EN
          : prev.language === 'bn'
          ? SAMPLE_BIODATA_BN
          : SAMPLE_BIODATA_EN;
      return {
        ...prev,
        biodata: {
          ...structuredClone(sample),
          invocationPreset: prev.biodata.invocationPreset,
        },
      };
    });
    notify(
      workspace.language === 'bn'
        ? activeFormat === '1-page'
          ? '১ পৃষ্ঠার নমুনা তথ্য লোড হয়েছে।'
          : '২ পৃষ্ঠার নমুনা তথ্য লোড হয়েছে।'
        : activeFormat === '1-page'
        ? '1-Page Bangladeshi sample data loaded.'
        : '2-Page Bangladeshi sample data loaded.'
    );
  };

  const handleDownloadBackup = () => {
    downloadWorkspaceBackup(workspace);
    notify(
      workspace.language === 'bn'
        ? 'ব্যক্তিগত ব্যাকআপ (.json) ডাউনলোড হয়েছে।'
        : 'Private backup (.json) downloaded.'
    );
  };

  const handleRestoreBackup = async (file: File) => {
    try {
      const restored = await parseBackupFile(file);
      setWorkspace(restored);
      setStage('editor');
      setEditorStep(0);
      setShowPrivacyModal(false);
      notify(
        restored.language === 'bn'
          ? 'আপনার ব্যাকআপ সফলভাবে ফিরিয়ে আনা হয়েছে।'
          : 'Private backup restored.'
      );
    } catch (err) {
      notify(
        err instanceof Error ? err.message : 'Could not restore this backup file.',
        'err'
      );
    }
  };

  const handleConfirmClearAll = () => {
    clearWorkspaceStorage();
    setWorkspace((prev) => ({
      ...createDefaultWorkspace(),
      mode: prev.mode,
      language: prev.language,
      cvFormat: prev.cvFormat,
      biodataFormat: prev.biodataFormat,
    }));
    setStage('purpose');
    setEditorStep(0);
    setShowClearConfirm(false);
    setShowPrivacyModal(false);
    notify(
      workspace.language === 'bn'
        ? 'এই ব্রাউজার থেকে আপনার সব ব্যক্তিগত তথ্য মুছে ফেলা হয়েছে।'
        : 'Everything has been cleared cleanly from this browser.'
    );
  };

  // Direct client-side A4 PDF generation & download (works reliably inside iframes!)
  const handleExportPdf = async () => {
    const captureNode = pdfCaptureRef.current;
    if (!captureNode || isExporting) return;

    setIsExporting(true);
    try {
      const personName =
        workspace.mode === 'cv' ? workspace.cv.fullName : workspace.biodata.fullName;
      const docType = workspace.mode === 'cv' ? 'CV' : 'Marriage-Biodata';
      const fmtSuffix = activeFormat === '1-page' ? '1-Page' : '2-Page';
      const safeName = hasText(personName)
        ? personName
            .trim()
            .replace(/[\\/:*?"<>|]+/g, '')
            .replace(/\s+/g, '-')
        : 'Kagoj';
      await exportElementToA4Pdf(
        captureNode,
        `${safeName}-${docType}-${fmtSuffix}.pdf`,
        activeFormat
      );
      notify(
        workspace.language === 'bn'
          ? 'আপনার A4 PDF সফলভাবে ডাউনলোড হয়েছে!'
          : 'Your A4 PDF has been downloaded!'
      );
    } catch (err) {
      console.error('PDF export failed:', err);
      notify(
        workspace.language === 'bn'
          ? 'PDF তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Could not generate PDF. Please try again.',
        'err'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const progressPct = Math.round(((safeEditorStep + 1) / steps.length) * 100);
  const isOptionalStep =
    safeEditorStep > 0 && safeEditorStep < customizeStepIndex && safeEditorStep >= 2;

  const journeyItems: Array<{ id: AppStage; num: string; labelEn: string; labelBn: string }> = [
    { id: 'purpose', num: '1', labelEn: 'Purpose', labelBn: 'উদ্দেশ্য' },
    { id: 'templates', num: '2', labelEn: 'Templates', labelBn: 'টেমপ্লেট' },
    { id: 'editor', num: '3', labelEn: 'Add Info & Export', labelBn: 'তথ্য ও PDF' },
  ];

  const stageRank = (s: AppStage) => (s === 'purpose' ? 0 : s === 'templates' ? 1 : 2);

  return (
    <>
      <div className="no-print min-h-[100dvh] flex flex-col">
        {/* Clean Single-Line Top Bar with 3-Stage Journey Indicator */}
        <header className="sticky top-0 z-30 bg-[#faf7f0]/95 backdrop-blur-sm border-b border-[#3a3630]/35">
          <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-3">
            {/* Zone 1: Brand */}
            <button
              type="button"
              onClick={() => goToStage('purpose')}
              className="flex items-center gap-2 text-left cursor-pointer whitespace-nowrap shrink-0"
            >
              <PencilLogoMark className="w-7 h-7 shrink-0" />
              <span className="sketch-heading text-2xl font-bold text-[#24211d] leading-none">
                {workspace.language === 'bn' ? 'কাগজ' : 'Kagoj'}
              </span>
            </button>

            {/* Zone 2: Clear 3-Stage Progress Navigation — inline only at lg+ (1024px+) so header never clips on tablets/split views */}
            <nav
              aria-label="Creation steps"
              className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs xl:text-sm min-w-0"
            >
              {journeyItems.map((item, idx) => {
                const isActive = stage === item.id;
                const isCompleted = stageRank(stage) > stageRank(item.id);
                return (
                  <React.Fragment key={item.id}>
                    <button
                      type="button"
                      onClick={() => goToStage(item.id)}
                      className={`inline-flex items-center gap-1.5 px-2 xl:px-2.5 py-1 rounded-lg font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-[#eef5f2] text-[#1e5645] border border-[#1e5645]/45'
                          : isCompleted
                          ? 'text-[#24211d] hover:bg-[#f3ede0]'
                          : 'text-[#6f685e] hover:text-[#24211d] hover:bg-[#f3ede0]/70'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full text-[11px] font-bold inline-flex items-center justify-center tabular-nums shrink-0 ${
                          isActive
                            ? 'bg-[#1e5645] text-white'
                            : isCompleted
                            ? 'bg-[#24211d] text-[#fffdf8]'
                            : 'bg-[#e6dfd1] text-[#5c564d]'
                        }`}
                      >
                        {item.num}
                      </span>
                      <span>{workspace.language === 'bn' ? item.labelBn : item.labelEn}</span>
                    </button>
                    {idx < journeyItems.length - 1 && (
                      <span className="text-[#b8ad9b] select-none" aria-hidden="true">
                        /
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            {/* Zone 3: Language, Privacy, Clear Everything & Contextual Primary Action — strictly budgeted for 320px..2560px */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setLanguage(workspace.language === 'en' ? 'bn' : 'en')}
                className="px-2 sm:px-2.5 py-1.5 min-h-[36px] text-xs font-bold text-[#24211d] bg-[#fffdf8] border border-[#3a3630]/40 rounded-lg hover:border-[#24211d] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
              >
                {workspace.language === 'en' ? 'বাংলা' : 'EN'}
              </button>

              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="p-2 min-h-[36px] min-w-[36px] xl:px-2.5 text-xs font-semibold text-[#1e5645] bg-[#fffdf8] border border-[#3a3630]/40 rounded-lg hover:border-[#1e5645] inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                title={workspace.language === 'bn' ? 'প্রাইভেসি ও ব্যাকআপ' : 'Privacy & Backup'}
                aria-label={workspace.language === 'bn' ? 'প্রাইভেসি ও ব্যাকআপ' : 'Privacy & Backup'}
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden 2xl:inline">
                  {workspace.language === 'bn' ? 'ব্যাকআপ' : 'Backup'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="p-2 sm:px-2.5 lg:p-2 xl:px-3 min-h-[36px] min-w-[36px] text-xs font-semibold text-[#9f3324] bg-[#fffdf8] hover:bg-[#fdf2f0] border border-[#9f3324]/45 rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                title={L.ui.clearEverything}
                aria-label={L.ui.clearEverything}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline lg:hidden xl:inline">{L.ui.clearEverything}</span>
              </button>

              {stage === 'editor' && (
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExportPdf}
                  className="sketch-btn px-2.5 sm:px-3.5 py-1.5 min-h-[36px] text-xs sm:text-sm font-bold bg-[#1e5645] text-[#fffdf8] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  <span className="sm:hidden">
                    {isExporting ? '...' : 'PDF'}
                  </span>
                  <span className="hidden sm:inline lg:hidden xl:inline">
                    {isExporting
                      ? workspace.language === 'bn'
                        ? 'তৈরি হচ্ছে...'
                        : 'Preparing...'
                      : workspace.language === 'bn'
                      ? 'A4 PDF ডাউনলোড'
                      : 'Download A4 PDF'}
                  </span>
                  <span className="hidden lg:inline xl:hidden">
                    {isExporting
                      ? workspace.language === 'bn'
                        ? 'তৈরি হচ্ছে...'
                        : 'Preparing...'
                      : workspace.language === 'bn'
                      ? 'PDF ডাউনলোড'
                      : 'Export PDF'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile & Tablet (< 1024px) 3-Stage Stepper Bar — zero header crowding at 320px..1023px */}
          <div className="lg:hidden border-t border-[#3a3630]/20 bg-[#f3ede0]/90 px-2.5 py-1 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            {journeyItems.map((item, idx) => {
              const isActive = stage === item.id;
              return (
                <React.Fragment key={item.id}>
                  <button
                    type="button"
                    onClick={() => goToStage(item.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                      isActive ? 'bg-[#1e5645] text-white' : 'text-[#5c564d] hover:text-[#24211d]'
                    }`}
                  >
                    {item.num}. {workspace.language === 'bn' ? item.labelBn : item.labelEn}
                  </button>
                  {idx < journeyItems.length - 1 && (
                    <span className="text-[#9e9484] text-[10px] shrink-0" aria-hidden="true">
                      →
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile & Tablet (< 1024px) Edit / Preview Toggle unified inside sticky header so it never overlaps or drifts */}
          {stage === 'editor' && (
            <div className="lg:hidden border-t border-[#3a3630]/20 bg-[#f3ede0]/95 px-3 py-1.5 flex items-center justify-center">
              <div className="inline-flex p-0.5 bg-[#fffdf8] border border-[#3a3630]/60 rounded-lg w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => switchMobilePane('edit')}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                    mobilePane === 'edit' ? 'bg-[#24211d] text-[#fffdf8]' : 'text-[#5c564d]'
                  }`}
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  {L.ui.editDetails}
                </button>
                <button
                  type="button"
                  onClick={() => switchMobilePane('preview')}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                    mobilePane === 'preview' ? 'bg-[#1e5645] text-[#fffdf8]' : 'text-[#5c564d]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {L.ui.livePreview}
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Toast Notification — sits cleanly above sticky mobile bottom bars */}
        {toast && (
          <div className="fixed bottom-20 sm:bottom-5 left-4 right-4 sm:left-auto sm:right-5 z-50 sm:max-w-sm">
            <div
              className={`sketch-box px-4 py-3 flex items-center gap-2.5 text-sm font-medium ${
                toast.tone === 'err'
                  ? 'bg-[#fdf2f0] border-[#9f3324] text-[#7c1d13]'
                  : 'bg-[#eef5f2] border-[#1e5645] text-[#174235]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toast.text}</span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STAGE 1: ASK PURPOSE FIRST (Full-Canvas Serene Welcome)           */}
        {/* ================================================================= */}
        {stage === 'purpose' && (
          <main className="flex-1 flex items-center">
            <div className="w-full">
              <ModeStep
                mode={workspace.mode}
                pageFormat={activeFormat}
                language={workspace.language}
                hasSavedDraft={hasSavedDraft}
                onSelectMode={setMode}
                onSelectPageFormat={setPageFormat}
                onSelectLanguage={setLanguage}
                onContinueToTemplates={() => goToStage('templates')}
                onResumeDraft={() => goToStage('editor', 0)}
                onRequestClearAll={() => setShowClearConfirm(true)}
              />
            </div>
          </main>
        )}

        {/* ================================================================= */}
        {/* STAGE 2: BROWSE TEMPLATES FOR CHOSEN PURPOSE (Full-Width Gallery) */}
        {/* ================================================================= */}
        {stage === 'templates' && (
          <main className="flex-1">
            <TemplateGallery
              mode={workspace.mode}
              pageFormat={activeFormat}
              language={workspace.language}
              cv={workspace.cv}
              biodata={workspace.biodata}
              selectedTemplateId={activeTemplateId}
              customization={activeCustomization}
              onSelectTemplate={handleSelectTemplate}
              onChangePageFormat={setPageFormat}
              onBackToPurpose={() => goToStage('purpose')}
              onContinueToEditor={(chosenId) => {
                if (chosenId) handleSelectTemplate(chosenId);
                setMobilePane('edit');
                goToStage('editor', 0);
              }}
            />
          </main>
        )}

        {/* ================================================================= */}
        {/* STAGE 3: ADD INFO, LIVE PREVIEW & EXPORT (Adaptive Split Studio)  */}
        {/* ================================================================= */}
        {stage === 'editor' && (
          <div className="flex-1 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[minmax(380px,44%)_minmax(0,1fr)] items-stretch">
            {/* LEFT PANE: Step-by-Step Info Form & Customize (@container enables true container-aware grids!) */}
            <section
              className={`@container min-w-0 flex flex-col border-r-0 lg:border-r border-[#3a3630]/25 bg-[#faf7f0]/75 ${
                mobilePane === 'preview' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              {/* Clean Step Progress Bar for Filling Info */}
              <div className="px-4 sm:px-7 pt-5 pb-4 border-b border-dashed border-[#3a3630]/25">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-bold text-[#1e5645] tabular-nums">
                    {workspace.language === 'bn'
                      ? `ধাপ ${safeEditorStep + 1} / ${steps.length} · ${steps[safeEditorStep]}`
                      : `Step ${safeEditorStep + 1} of ${steps.length} · ${steps[safeEditorStep]}`}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#5c564d] hover:text-[#1e5645] cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#b37416]" />
                      {L.ui.loadSample}
                    </button>
                    <span className="text-xs text-[#6f685e] tabular-nums">{progressPct}%</span>
                  </div>
                </div>

                {/* Clickable Step Segments (4 for 1-Page, 5 for 2-Page) */}
                <div
                  className={`grid gap-1.5 ${
                    steps.length === 4 ? 'grid-cols-4' : 'grid-cols-5'
                  }`}
                  role="tablist"
                  aria-label="Form steps"
                >
                  {steps.map((label, idx) => {
                    const isActive = idx === safeEditorStep;
                    const isPast = idx < safeEditorStep;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => goToEditorStep(idx)}
                        title={label}
                        className="group py-1 text-left cursor-pointer focus-visible:outline-none"
                      >
                        <div
                          className={`h-2 rounded-full transition-colors ${
                            isActive
                              ? 'bg-[#1e5645]'
                              : isPast
                              ? 'bg-[#1e5645]/45 group-hover:bg-[#1e5645]/75'
                              : 'bg-[#d9d0c0] group-hover:bg-[#b8ad9b]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Form Body */}
              <div className="flex-1 px-4 sm:px-7 py-6 sm:py-7 min-w-0">
                {safeEditorStep < customizeStepIndex && workspace.mode === 'cv' && (
                  <CVSteps
                    step={safeEditorStep + 1}
                    pageFormat={activeFormat}
                    data={workspace.cv}
                    language={workspace.language}
                    photoShape={workspace.cvStyle.photoShape}
                    onChangePhotoShape={(photoShape) =>
                      updateActiveCustomization({ ...workspace.cvStyle, photoShape })
                    }
                    onChange={(cv) => setWorkspace((prev) => ({ ...prev, cv }))}
                  />
                )}

                {safeEditorStep < customizeStepIndex && workspace.mode === 'biodata' && (
                  <BiodataSteps
                    step={safeEditorStep + 1}
                    pageFormat={activeFormat}
                    data={workspace.biodata}
                    language={workspace.language}
                    photoShape={workspace.biodataStyle.photoShape}
                    onChangePhotoShape={(photoShape) =>
                      updateActiveCustomization({ ...workspace.biodataStyle, photoShape })
                    }
                    onChange={(biodata) => setWorkspace((prev) => ({ ...prev, biodata }))}
                  />
                )}

                {safeEditorStep === customizeStepIndex && (
                  <CustomizePanel
                    mode={workspace.mode}
                    pageFormat={activeFormat}
                    language={workspace.language}
                    templateId={activeTemplateId}
                    customization={activeCustomization}
                    showPhoto={currentDoc.showPhoto}
                    hasPhoto={Boolean(currentDoc.photo)}
                    customSections={currentDoc.customSections || []}
                    onChangeCustomization={updateActiveCustomization}
                    onTogglePhoto={toggleActivePhoto}
                    onChangeCustomSections={updateCustomSections}
                    onSwitchTemplate={() => goToStage('templates')}
                    onResetDefaults={() =>
                      updateActiveCustomization(createDefaultCustomization(workspace.mode))
                    }
                  />
                )}
              </div>

              {/* Sticky Step Footer Navigation on Mobile + Desktop */}
              <footer className="sticky bottom-0 lg:static z-20 px-4 sm:px-8 pt-3.5 safe-bottom lg:py-4 bg-[#f3ede0]/95 backdrop-blur-sm border-t border-[#3a3630]/25 flex items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (safeEditorStep === 0) {
                      goToStage('templates');
                    } else {
                      goToEditorStep(safeEditorStep - 1);
                    }
                  }}
                  className="sketch-btn px-3 sm:px-3.5 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {safeEditorStep === 0
                    ? workspace.language === 'bn'
                      ? 'টেমপ্লেট'
                      : 'Templates'
                    : L.ui.prevStep}
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  {isOptionalStep && (
                    <button
                      type="button"
                      onClick={() => goToEditorStep(safeEditorStep + 1)}
                      className="text-xs font-semibold text-[#5c564d] hover:text-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap px-1 py-2"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{L.ui.skipStep}</span>
                      <span className="sm:hidden">
                        {workspace.language === 'bn' ? 'এড়িয়ে যান' : 'Skip'}
                      </span>
                    </button>
                  )}

                  {safeEditorStep < customizeStepIndex ? (
                    <button
                      type="button"
                      onClick={() => goToEditorStep(safeEditorStep + 1)}
                      className="sketch-btn px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-bold bg-[#24211d] text-[#fffdf8] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <span>{L.ui.nextStep}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isExporting}
                      onClick={handleExportPdf}
                      className="sketch-btn px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-bold bg-[#1e5645] text-[#fffdf8] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileDown className="w-4 h-4" />
                      )}
                      <span>
                        {isExporting
                          ? workspace.language === 'bn'
                            ? 'তৈরি হচ্ছে...'
                            : 'Preparing...'
                          : workspace.language === 'bn'
                          ? 'A4 PDF ডাউনলোড'
                          : 'Download A4 PDF'}
                      </span>
                    </button>
                  )}
                </div>
              </footer>
            </section>

            {/* RIGHT PANE: Natural flow on mobile/tablet (< 1024px), Sticky Split Preview on Desktop (lg+) */}
            <aside
              className={`min-w-0 lg:sticky lg:top-[57px] lg:h-[calc(100dvh-57px)] lg:overflow-hidden flex flex-col ${
                mobilePane === 'edit' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <A4PreviewPane
                mode={workspace.mode}
                pageFormat={activeFormat}
                language={workspace.language}
                cv={workspace.cv}
                biodata={workspace.biodata}
                cvTemplateId={workspace.cvTemplateId}
                biodataTemplateId={workspace.biodataTemplateId}
                customization={activeCustomization}
                onChangePageFormat={setPageFormat}
                onOpenTemplates={() => goToStage('templates')}
                onOpenCustomize={() => {
                  switchMobilePane('edit');
                  goToEditorStep(customizeStepIndex);
                }}
                onLoadSample={handleLoadSample}
              />
            </aside>
          </div>
        )}

        {/* Clean Privacy & Backup Modal */}
        {showPrivacyModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
            className="fixed inset-0 z-50 bg-[#24211d]/45 flex items-center justify-center p-4"
            onClick={() => setShowPrivacyModal(false)}
          >
            <div
              className="sketch-box max-w-md w-full p-6 space-y-5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-4 right-4 p-1.5 text-[#5c564d] hover:text-[#24211d] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3.5 pr-6">
                <div className="w-14 h-14 shrink-0 overflow-hidden rounded-md">
                  <img
                    src={PRIVACY_ILLUS_SRC}
                    alt="Private local notebook padlock"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div>
                  <h3
                    id="privacy-modal-title"
                    className="sketch-heading text-2xl text-[#24211d] leading-snug"
                  >
                    {L.ui.privacyTitle}
                  </h3>
                  <p className="text-xs text-[#5c564d] mt-1 leading-relaxed">
                    {L.ui.privacyDesc}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-dashed border-[#3a3630]/25">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="sketch-btn px-3 py-2 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {L.ui.saveBackup}
                  </button>

                  <label className="sketch-btn px-3 py-2 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    {L.ui.restoreBackup}
                    <input
                      type="file"
                      accept="application/json,.json"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleRestoreBackup(f);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPrivacyModal(false);
                    setShowClearConfirm(true);
                  }}
                  className="w-full py-2 text-xs font-semibold text-[#9f3324] hover:bg-[#fdf2f0] rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {L.ui.clearEverything}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Clear Everything Confirmation Modal */}
        {showClearConfirm && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-modal-title"
            className="fixed inset-0 z-50 bg-[#24211d]/45 flex items-center justify-center p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <div
              className="sketch-box max-w-md w-full p-6 space-y-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="absolute top-4 right-4 p-1.5 text-[#5c564d] hover:text-[#24211d] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="pr-6">
                <h3 id="clear-modal-title" className="sketch-heading text-2xl text-[#9f3324]">
                  {L.ui.confirmClearTitle}
                </h3>
                <p className="text-xs text-[#5c564d] mt-1.5 leading-relaxed">
                  {L.ui.confirmClearBody}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="sketch-btn px-4 py-2 text-xs font-semibold bg-[#fffdf8] text-[#24211d] cursor-pointer"
                >
                  {L.ui.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearAll}
                  className="sketch-btn px-4 py-2 text-xs font-bold bg-[#9f3324] text-white cursor-pointer"
                >
                  {L.ui.confirmClearYes}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Offscreen Unscaled 794px A4 Canvas for Direct Crisp PDF Download */}
      <div
        aria-hidden="true"
        className="no-print"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div ref={pdfCaptureRef} style={{ width: '794px', backgroundColor: '#ffffff' }}>
          {workspace.mode === 'cv' ? (
            <CVTemplateRenderer
              data={workspace.cv}
              templateId={workspace.cvTemplateId}
              language={workspace.language}
              customization={workspace.cvStyle}
              pageFormat={workspace.cvFormat}
            />
          ) : (
            <BiodataTemplateRenderer
              data={workspace.biodata}
              templateId={workspace.biodataTemplateId}
              language={workspace.language}
              customization={workspace.biodataStyle}
              pageFormat={workspace.biodataFormat}
            />
          )}
        </div>
      </div>

      {/* Native Print Fallback Root */}
      <div className="print-only-root" aria-hidden="true">
        {workspace.mode === 'cv' ? (
          <CVTemplateRenderer
            data={workspace.cv}
            templateId={workspace.cvTemplateId}
            language={workspace.language}
            customization={workspace.cvStyle}
            pageFormat={workspace.cvFormat}
          />
        ) : (
          <BiodataTemplateRenderer
            data={workspace.biodata}
            templateId={workspace.biodataTemplateId}
            language={workspace.language}
            customization={workspace.biodataStyle}
            pageFormat={workspace.biodataFormat}
          />
        )}
      </div>
    </>
  );
}
