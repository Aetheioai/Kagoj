import React, { useEffect, useRef, useState } from 'react';
import { Crop, Eye, EyeOff, Trash2, Upload } from 'lucide-react';
import { AppMode, DocCustomization, DocLanguage } from '../types/builder';
import { PhotoEditorModal } from './PhotoEditorModal';

export function PencilLogoMark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Hand-drawn paper sheet */}
      <path
        d="M7 5.5C11.5 4.8 19.5 5 23.5 5.3C24.2 8.2 26.8 10 29 10.7C29.3 17.5 29.1 25.5 28.6 31.2C21.5 31.8 13.5 31.5 7.4 31C6.8 23.2 6.8 13.5 7 5.5Z"
        fill="#FFFDF8"
        stroke="#24211D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.3 5.4C23.5 7.8 23.6 9.8 23.6 10.9C25.5 10.9 27.3 10.8 28.9 10.7"
        stroke="#24211D"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sketched lines */}
      <path
        d="M11 13.5C14.2 13.2 17.8 13.4 20.5 13.5"
        stroke="#1E5645"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M11 18.2C15 18 19.8 18.3 24 18.1"
        stroke="#5C564D"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M11 22.8C14.5 22.7 18.4 22.9 21.8 22.6"
        stroke="#5C564D"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Diagonal pencil */}
      <path
        d="M20.5 28.5L31.2 17.6C32.1 16.7 33.4 18 32.5 18.9L21.8 29.8L18.4 30.8L20.5 28.5Z"
        fill="#F3C979"
        stroke="#24211D"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SketchUnderline({ className = 'w-32 h-2.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 12" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8.5C38 3.5 92 2.5 157 7.5"
        stroke="#1E5645"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M12 10.2C56 6.8 106 6.2 148 9.2"
        stroke="#C88A2E"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function SketchDivider({ className = 'my-6' }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 600 10" fill="none" className="w-full h-2.5 text-[#3a3630]/30">
        <path
          d="M2 5.5C90 3.2 180 7.4 298 4.8C412 2.5 510 6.8 598 4.6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="6 5"
        />
      </svg>
    </div>
  );
}

export function SketchCheckIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.2 9.8C5.2 11.4 6.5 12.8 7.5 14C9.5 10.5 12.2 6.8 15.2 3.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface SketchStepTrailProps {
  steps: string[];
  currentStep: number;
  completedSteps: boolean[];
  onSelectStep: (idx: number) => void;
}

export function SketchStepTrail({
  steps,
  currentStep,
  completedSteps,
  onSelectStep,
}: SketchStepTrailProps) {
  return (
    <nav aria-label="Workbook steps" className="w-full overflow-x-auto pb-1">
      <ol className="flex items-center gap-1.5 min-w-max">
        {steps.map((label, idx) => {
          const isCurrent = idx === currentStep;
          const isDone = completedSteps[idx];
          return (
            <React.Fragment key={label}>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectStep(idx)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`group flex items-center gap-2 px-2.5 py-1.5 text-[13px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-[#1e5645] text-[#fffdf8] border-[1.5px] border-[#24211d] shadow-[2px_2px_0px_#24211d]'
                      : isDone
                      ? 'bg-[#eef5f2] text-[#1e5645] border-[1.5px] border-[#1e5645]/45 hover:border-[#24211d]'
                      : 'bg-[#fffdf8] text-[#5c564d] border-[1.5px] border-[#c8c0b2] hover:border-[#24211d] hover:text-[#24211d]'
                  }`}
                  style={{
                    borderRadius: '10px 12px 11px 9px / 11px 9px 12px 10px',
                  }}
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center text-xs font-bold tabular-nums shrink-0 ${
                      isCurrent
                        ? 'bg-[#fffdf8] text-[#1e5645]'
                        : isDone
                        ? 'bg-[#1e5645] text-[#fffdf8]'
                        : 'bg-[#f1eadc] text-[#5c564d]'
                    }`}
                    style={{ borderRadius: '50% 45% 52% 48%' }}
                  >
                    {isDone && !isCurrent ? <SketchCheckIcon className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span>{label}</span>
                </button>
              </li>
              {idx < steps.length - 1 && (
                <li aria-hidden="true" className="text-[#a89f91] shrink-0">
                  <svg viewBox="0 0 18 10" fill="none" className="w-3.5 h-2.5">
                    <path
                      d="M1 5.5C6 4.2 11 5.8 16 4.8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeDasharray="3 3"
                    />
                  </svg>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

interface FieldWrapperProps {
  label: string;
  optionalText?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({
  label,
  optionalText,
  hint,
  children,
  className = '',
}: FieldWrapperProps) {
  return (
    <label className={`block ${className}`}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-[#24211d]">{label}</span>
        {optionalText && (
          <span className="text-xs text-[#7c7468]">{optionalText}</span>
        )}
      </div>
      {children}
      {hint && <p className="mt-1 text-xs text-[#6f685e]">{hint}</p>}
    </label>
  );
}

interface PhotoUploaderProps {
  photo: string;
  showPhoto: boolean;
  language?: DocLanguage;
  mode?: AppMode;
  personName?: string;
  photoShape?: DocCustomization['photoShape'];
  onChangePhotoShape?: (shape: DocCustomization['photoShape']) => void;
  onPhotoChange: (dataUrl: string) => void;
  onToggleShow: () => void;
  onRemove: () => void;
  labels: {
    upload: string;
    replace: string;
    remove: string;
    visible: string;
    hidden: string;
    hideAction?: string;
    showAction?: string;
    editAction?: string;
  };
  helperText: string;
}

export function PhotoUploader({
  photo,
  showPhoto,
  language = 'en',
  mode = 'cv',
  personName,
  photoShape = 'rect',
  onChangePhotoShape,
  onPhotoChange,
  onToggleShow,
  onRemove,
  labels,
  helperText,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [editorSrc, setEditorSrc] = useState<string | null>(null);
  const [rawOriginalUrl, setRawOriginalUrl] = useState<string | null>(null);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (rawOriginalUrl && rawOriginalUrl.startsWith('blob:')) {
        URL.revokeObjectURL(rawOriginalUrl);
      }
    };
  }, [rawOriginalUrl]);

  const openFileInEditor = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি JPG বা PNG ছবি বেছে নিন।'
          : 'Please choose a valid JPG or PNG image file.'
      );
      return;
    }
    if (rawOriginalUrl && rawOriginalUrl.startsWith('blob:')) {
      URL.revokeObjectURL(rawOriginalUrl);
    }
    const objUrl = URL.createObjectURL(file);
    setRawOriginalUrl(objUrl);
    setEditorSrc(objUrl);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openFileInEditor(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleReEdit = () => {
    const src = rawOriginalUrl || photo;
    if (src) {
      setEditorSrc(src);
    }
  };

  const handleRemovePhoto = () => {
    if (rawOriginalUrl && rawOriginalUrl.startsWith('blob:')) {
      URL.revokeObjectURL(rawOriginalUrl);
    }
    setRawOriginalUrl(null);
    onRemove();
  };

  const thumbRadiusClass =
    photoShape === 'circle'
      ? 'rounded-full'
      : photoShape === 'rounded'
      ? 'rounded-xl'
      : '';

  return (
    <>
      <div className="sketch-box-dashed p-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className={`w-20 h-24 shrink-0 overflow-hidden bg-[#f3ede0] border-[1.5px] border-[#3a3630] flex items-center justify-center relative ${thumbRadiusClass}`}
            style={
              photoShape === 'rect'
                ? { borderRadius: '8px 10px 9px 7px / 9px 7px 10px 8px' }
                : photoShape === 'circle'
                ? { width: '84px', height: '84px' }
                : undefined
            }
          >
            {photo ? (
              <img
                src={photo}
                alt="Uploaded portrait"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-top transition-opacity ${
                  showPhoto ? 'opacity-100' : 'opacity-30 grayscale'
                }`}
              />
            ) : (
              <svg viewBox="0 0 48 56" fill="none" className="w-10 h-12 text-[#8c8478]">
                <circle cx="24" cy="19" r="9" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 2" />
                <path
                  d="M10 47C12 37 17.5 33 24 33C30.5 33 36 37 38 47"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeDasharray="3 2"
                />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#24211d] mb-1">
              {photo ? (showPhoto ? labels.visible : labels.hidden) : labels.upload}
            </p>
            <p className="text-xs text-[#6f685e] mb-3 leading-relaxed">{helperText}</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="sketch-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#24211d] cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5" />
                {photo ? labels.replace : labels.upload}
              </button>

              {photo && (
                <>
                  <button
                    type="button"
                    onClick={handleReEdit}
                    className="sketch-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#1e5645] cursor-pointer whitespace-nowrap"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    {labels.editAction || (language === 'bn' ? 'ক্রপ / এডিট' : 'Crop & Edit')}
                  </button>

                  <button
                    type="button"
                    onClick={onToggleShow}
                    className={`sketch-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap ${
                      showPhoto
                        ? 'bg-[#e6f0ec] text-[#1e5645]'
                        : 'bg-[#fbf2df] text-[#7c5313]'
                    }`}
                  >
                    {showPhoto ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPhoto
                      ? labels.hideAction || 'Hide on PDF'
                      : labels.showAction || 'Show on PDF'}
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#9f3324] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {labels.remove}
                  </button>
                </>
              )}
            </div>
            {error && <p className="mt-2 text-xs text-[#9f3324]">{error}</p>}
          </div>
        </div>
      </div>

      {editorSrc && (
        <PhotoEditorModal
          imageSrc={editorSrc}
          language={language}
          mode={mode}
          personName={personName}
          initialShape={photoShape}
          onCancel={() => setEditorSrc(null)}
          onReplaceFile={openFileInEditor}
          onApply={(croppedDataUrl, nextShape) => {
            onPhotoChange(croppedDataUrl);
            onChangePhotoShape?.(nextShape);
            setEditorSrc(null);
          }}
        />
      )}
    </>
  );
}
