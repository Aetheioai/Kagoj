import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Eraser, PenTool, Trash2, Undo2, Upload, X } from 'lucide-react';
import { DocLanguage } from '../types/builder';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

const INK_COLORS = [
  { id: 'black', hex: '#111827', labelEn: 'Black Ink', labelBn: 'কালো কালি' },
  { id: 'blue', hex: '#1d4ed8', labelEn: 'Official Blue', labelBn: 'নীল কালি' },
  { id: 'forest', hex: '#14532d', labelEn: 'Deep Green', labelBn: 'গাঢ় সবুজ' },
];

const PEN_WIDTHS = [
  { value: 2.2, labelEn: 'Fine', labelBn: 'চিকন' },
  { value: 3.4, labelEn: 'Medium', labelBn: 'মাঝারি' },
  { value: 5.0, labelEn: 'Bold', labelBn: 'মোটা' },
];

interface SignaturePadModalProps {
  language: DocLanguage;
  initialSignature?: string;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
}

export function SignaturePadModal({
  language,
  initialSignature,
  onCancel,
  onApply,
}: SignaturePadModalProps) {
  const isBn = language === 'bn';
  const [tab, setTab] = useState<'draw' | 'upload'>('draw');
  const [inkColor, setInkColor] = useState<string>('#111827');
  const [penWidth, setPenWidth] = useState<number>(3.4);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Upload & white-paper cleanup state
  const [uploadedRawSrc, setUploadedRawSrc] = useState<string>(initialSignature || '');
  const [uploadedPreview, setUploadedPreview] = useState<string>(initialSignature || '');
  const [removeBg, setRemoveBg] = useState<boolean>(true);
  const [bgThreshold, setBgThreshold] = useState<number>(215);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeStrokeRef = useRef<Stroke | null>(null);

  const CANVAS_W = 640;
  const CANVAS_H = 220;

  const redrawCanvas = useCallback(
    (list: Stroke[], active?: Stroke | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== CANVAS_W * dpr || canvas.height !== CANVAS_H * dpr) {
        canvas.width = CANVAS_W * dpr;
        canvas.height = CANVAS_H * dpr;
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      const all = active ? [...list, active] : list;
      for (const stroke of all) {
        if (stroke.points.length === 0) continue;
        ctx.strokeStyle = stroke.color;
        ctx.fillStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (stroke.points.length === 1) {
          ctx.beginPath();
          ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length - 1; i++) {
          const midX = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
          const midY = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, midX, midY);
        }
        const last = stroke.points[stroke.points.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }
      ctx.restore();
    },
    []
  );

  useEffect(() => {
    if (tab === 'draw') {
      redrawCanvas(strokes, activeStrokeRef.current);
    }
  }, [strokes, tab, redrawCanvas]);

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getPointerPos(e);
    const stroke: Stroke = { points: [pt], color: inkColor, width: penWidth };
    activeStrokeRef.current = stroke;
    setIsDrawing(true);
    redrawCanvas(strokes, stroke);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !activeStrokeRef.current) return;
    const pt = getPointerPos(e);
    const pts = activeStrokeRef.current.points;
    const prev = pts[pts.length - 1];
    if (!prev || Math.hypot(pt.x - prev.x, pt.y - prev.y) >= 1.5) {
      pts.push(pt);
      redrawCanvas(strokes, activeStrokeRef.current);
    }
  };

  const finishStroke = () => {
    if (!isDrawing || !activeStrokeRef.current) return;
    const finished = activeStrokeRef.current;
    activeStrokeRef.current = null;
    setIsDrawing(false);
    setStrokes((prev) => [...prev, finished]);
  };

  // Process uploaded signature photo to clean white paper background into transparent PNG
  useEffect(() => {
    if (tab !== 'upload' || !uploadedRawSrc) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      const maxW = 680;
      const maxH = 260;
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);

      if (removeBg) {
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum >= bgThreshold) {
            d[i + 3] = 0;
          } else if (lum >= bgThreshold - 28) {
            const ratio = (bgThreshold - lum) / 28;
            d[i + 3] = Math.round(d[i + 3] * ratio);
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      const trimmed = trimCanvasToPng(c, 8);
      setUploadedPreview(trimmed || c.toDataURL('image/png'));
    };
    img.src = uploadedRawSrc;
    return () => {
      cancelled = true;
    };
  }, [uploadedRawSrc, removeBg, bgThreshold, tab]);

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedRawSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirm = () => {
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || strokes.length === 0) return;
      const trimmed = trimCanvasToPng(canvas, 14);
      if (trimmed) onApply(trimmed);
      return;
    }
    if (uploadedPreview) {
      onApply(uploadedPreview);
    }
  };

  const canSave = tab === 'draw' ? strokes.length > 0 : Boolean(uploadedPreview);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#24211d]/55 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={isBn ? 'হাতের স্বাক্ষর তৈরি করুন' : 'Create Handwritten Signature'}
    >
      <div className="sketch-card w-full max-w-2xl bg-[#fffdf8] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-dashed border-[#c8c0b2]">
          <div>
            <h3 className="sketch-heading text-2xl text-[#24211d]">
              {isBn ? 'হাতের স্বাক্ষর প্যাড' : 'Handwritten Signature Pad'}
            </h3>
            <p className="text-xs text-[#6f685e]">
              {isBn
                ? 'মাউস বা আঙুল দিয়ে স্বাক্ষর আঁকুন অথবা কাগজের স্বাক্ষরের ছবি আপলোড করুন।'
                : 'Draw with mouse or finger, or upload a photo of your signature on white paper.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c8c0b2] text-[#5c564d] hover:text-[#24211d] hover:border-[#24211d] cursor-pointer"
            aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="px-4 sm:px-5 pt-3 flex items-center gap-2">
          <div className="inline-flex border-[1.5px] border-[#3a3630] rounded-lg overflow-hidden bg-[#f7f2e7]">
            <button
              type="button"
              onClick={() => setTab('draw')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                tab === 'draw' ? 'bg-[#1e5645] text-[#fffdf8]' : 'text-[#5c564d] hover:text-[#24211d]'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              {isBn ? 'স্বাক্ষর আঁকুন' : 'Draw Signature'}
            </button>
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                tab === 'upload' ? 'bg-[#1e5645] text-[#fffdf8]' : 'text-[#5c564d] hover:text-[#24211d]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              {isBn ? 'ছবি আপলোড' : 'Upload Image'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {tab === 'draw' ? (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Ink Colors */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#5c564d]">
                      {isBn ? 'কালি:' : 'Ink:'}
                    </span>
                    {INK_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setInkColor(c.hex)}
                        title={isBn ? c.labelBn : c.labelEn}
                        className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
                          inkColor === c.hex
                            ? 'border-[#24211d] scale-110'
                            : 'border-[#d6cfc0] hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>

                  {/* Stroke Width */}
                  <div className="inline-flex border border-[#c8c0b2] rounded-md overflow-hidden bg-[#fffdf8]">
                    {PEN_WIDTHS.map((w) => (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => setPenWidth(w.value)}
                        className={`px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                          penWidth === w.value
                            ? 'bg-[#24211d] text-[#fffdf8]'
                            : 'text-[#5c564d] hover:text-[#24211d]'
                        }`}
                      >
                        {isBn ? w.labelBn : w.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Undo & Clear */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStrokes((prev) => prev.slice(0, -1))}
                    disabled={strokes.length === 0}
                    className="sketch-btn inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#fffdf8] text-[#24211d] disabled:opacity-40 cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    {isBn ? 'আনডু' : 'Undo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStrokes([])}
                    disabled={strokes.length === 0}
                    className="sketch-btn inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#fffdf8] text-[#9f3324] disabled:opacity-40 cursor-pointer"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    {isBn ? 'মুছুন' : 'Clear'}
                  </button>
                </div>
              </div>

              {/* Drawing Canvas */}
              <div className="relative rounded-lg border-[1.5px] border-[#3a3630] bg-white overflow-hidden select-none">
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={finishStroke}
                  onPointerCancel={finishStroke}
                  className="w-full h-[190px] sm:h-[220px] block cursor-crosshair touch-none"
                />
                {/* Guide baseline */}
                <div
                  className="pointer-events-none absolute left-8 right-8 bottom-10 border-b border-dashed border-[#c8c0b2]"
                  aria-hidden="true"
                />
                {strokes.length === 0 && !isDrawing && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-[#9c9487]">
                      {isBn ? 'এখানে আপনার স্বাক্ষর আঁকুন...' : 'Sign inside this box...'}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadFile}
                className="hidden"
              />
              <div className="sketch-box-dashed p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-[#5c564d]">
                  {isBn
                    ? 'সাদা কাগজে কলম দিয়ে স্বাক্ষর করে ছবি তুলুন — কাগজের সাদা ব্যাকগ্রাউন্ড স্বয়ংক্রিয়ভাবে পরিষ্কার হয়ে যাবে।'
                    : 'Take a photo of your signature on white paper — we automatically clean the white background locally.'}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="sketch-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#fffdf8] text-[#24211d] shrink-0 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {uploadedRawSrc
                    ? isBn
                      ? 'অন্য ছবি দিন'
                      : 'Choose Another'
                    : isBn
                    ? 'স্বাক্ষরের ছবি দিন'
                    : 'Upload Signature'}
                </button>
              </div>

              {uploadedRawSrc && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#24211d] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={removeBg}
                        onChange={(e) => setRemoveBg(e.target.checked)}
                        className="accent-[#1e5645] w-4 h-4"
                      />
                      {isBn ? 'সাদা কাগজের ব্যাকগ্রাউন্ড মুছুন' : 'Clean white paper background'}
                    </label>
                    {removeBg && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#5c564d]">
                          {isBn ? 'পরিষ্কার মাত্রা:' : 'Cleanup:'}
                        </span>
                        <input
                          type="range"
                          min={150}
                          max={245}
                          value={bgThreshold}
                          onChange={(e) => setBgThreshold(Number(e.target.value))}
                          className="w-28 accent-[#1e5645]"
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className="rounded-lg border-[1.5px] border-[#3a3630] p-4 flex items-center justify-center min-h-[120px]"
                    style={{
                      backgroundImage:
                        'repeating-conic-gradient(#f3efe6 0% 25%, #ffffff 0% 50%)',
                      backgroundSize: '16px 16px',
                    }}
                  >
                    {uploadedPreview && (
                      <img
                        src={uploadedPreview}
                        alt="Processed signature preview"
                        referrerPolicy="no-referrer"
                        className="max-h-24 max-w-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3.5 border-t border-dashed border-[#c8c0b2] bg-[#f7f2e7]/60 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-semibold text-[#5c564d] hover:text-[#24211d] cursor-pointer"
          >
            {isBn ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canSave}
            className="sketch-btn inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1e5645] text-[#fffdf8] disabled:opacity-40 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            {isBn ? 'স্বাক্ষর যুক্ত করুন' : 'Use Signature'}
          </button>
        </div>
      </div>
    </div>
  );
}

function trimCanvasToPng(source: HTMLCanvasElement, padding = 10): string {
  const ctx = source.getContext('2d');
  if (!ctx) return '';
  const { width, height } = source;
  const data = ctx.getImageData(0, 0, width, height).data;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return '';

  const cropW = Math.min(width, maxX - minX + 1 + padding * 2);
  const cropH = Math.min(height, maxY - minY + 1 + padding * 2);
  const out = document.createElement('canvas');
  out.width = cropW;
  out.height = cropH;
  const octx = out.getContext('2d');
  if (!octx) return '';
  octx.drawImage(
    source,
    Math.max(0, minX - padding),
    Math.max(0, minY - padding),
    cropW,
    cropH,
    0,
    0,
    cropW,
    cropH
  );
  return out.toDataURL('image/png');
}

interface SignatureUploaderProps {
  signature: string;
  language: DocLanguage;
  onChange: (dataUrl: string) => void;
  title?: string;
  helperText?: string;
}

export function SignatureUploader({
  signature,
  language,
  onChange,
  title,
  helperText,
}: SignatureUploaderProps) {
  const isBn = language === 'bn';
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sketch-box-dashed p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-36 h-16 shrink-0 bg-white border-[1.5px] border-[#c8c0b2] rounded-lg flex items-center justify-center p-2 overflow-hidden">
            {signature ? (
              <img
                src={signature}
                alt="Handwritten signature"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-[11px] text-[#9c9487] text-center">
                {isBn ? 'স্বাক্ষর নেই' : 'No signature'}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#24211d]">
              {title || (isBn ? 'হাতের স্বাক্ষর (ঐচ্ছিক)' : 'Handwritten Signature (Optional)')}
            </p>
            <p className="text-xs text-[#6f685e] mt-0.5 mb-2.5">
              {helperText ||
                (isBn
                  ? 'স্বাক্ষর এঁকে বা ছবি আপলোড করে সরাসরি ডকুমেন্টে বসান — সম্পূর্ণ আপনার ডিভাইসে থাকে।'
                  : 'Draw your signature or upload a photo on white paper — processed 100% locally.')}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="sketch-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#1e5645] cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                {signature
                  ? isBn
                    ? 'স্বাক্ষর পরিবর্তন'
                    : 'Edit / Redraw'
                  : isBn
                  ? 'স্বাক্ষর আঁকুন / আপলোড'
                  : 'Draw / Upload Signature'}
              </button>
              {signature && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#9f3324] hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isBn ? 'মুছুন' : 'Remove'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {open && (
        <SignaturePadModal
          language={language}
          initialSignature={signature}
          onCancel={() => setOpen(false)}
          onApply={(dataUrl) => {
            onChange(dataUrl);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
