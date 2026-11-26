import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Crop,
  FlipHorizontal2,
  Grid3X3,
  RotateCcw,
  RotateCw,
  SlidersHorizontal,
  Sparkles,
  Upload,
  UserRound,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { AppMode, DocCustomization, DocLanguage } from '../types/builder';

export type CropAspect = 'passport' | 'portrait' | 'square' | 'free';
export type GuideMode = 'outline' | 'grid' | 'none';
export type FilterPreset = 'original' | 'studio' | 'warm' | 'bw';

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type HandleType =
  | 'pan'
  | 'nw'
  | 'ne'
  | 'sw'
  | 'se'
  | 'n'
  | 's'
  | 'e'
  | 'w';

interface PhotoEditorModalProps {
  imageSrc: string;
  language: DocLanguage;
  mode?: AppMode;
  personName?: string;
  initialShape?: DocCustomization['photoShape'];
  onCancel: () => void;
  onReplaceFile?: (file: File) => void;
  onApply: (croppedDataUrl: string, shape: DocCustomization['photoShape']) => void;
}

const ASPECT_RATIO_VALUES: Record<Exclude<CropAspect, 'free'>, number> = {
  passport: 4 / 5, // Standard BD Passport (40mm x 50mm)
  portrait: 3 / 4, // Classic Marriage Biodata Portrait
  square: 1, // 1:1 Avatar / Circle
};

function buildCssFilter(
  brightness: number,
  contrast: number,
  preset: FilterPreset
): string {
  let b = 100 + brightness;
  let c = 100 + contrast;
  let s = 100;
  let sepia = 0;

  if (preset === 'studio') {
    b += 5;
    c += 8;
    s = 104;
  } else if (preset === 'warm') {
    b += 3;
    c += 4;
    s = 108;
    sepia = 12;
  } else if (preset === 'bw') {
    c += 10;
    s = 0;
  }

  return `brightness(${Math.max(40, b)}%) contrast(${Math.max(50, c)}%) saturate(${Math.max(0, s)}%) sepia(${sepia}%)`;
}

function computeCenteredCrop(
  stageW: number,
  stageH: number,
  aspect: CropAspect
): CropRect {
  const padX = Math.max(18, Math.round(stageW * 0.08));
  const padY = Math.max(18, Math.round(stageH * 0.08));
  const maxW = Math.max(120, stageW - padX * 2);
  const maxH = Math.max(120, stageH - padY * 2);

  const ratio = aspect === 'free' ? 4 / 5 : ASPECT_RATIO_VALUES[aspect];
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  w = Math.round(w);
  h = Math.round(h);
  return {
    x: Math.round((stageW - w) / 2),
    y: Math.round((stageH - h) / 2),
    w,
    h,
  };
}

export function PhotoEditorModal({
  imageSrc,
  language,
  mode = 'cv',
  personName,
  initialShape = 'rect',
  onCancel,
  onReplaceFile,
  onApply,
}: PhotoEditorModalProps) {
  const isBn = language === 'bn';
  const stageRef = useRef<HTMLDivElement>(null);
  const stageCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [imgError, setImgError] = useState(false);

  const [stageSize, setStageSize] = useState({ w: 380, h: 320 });
  const [aspect, setAspect] = useState<CropAspect>(
    initialShape === 'circle' ? 'square' : mode === 'biodata' ? 'portrait' : 'passport'
  );
  const [shape, setShape] = useState<DocCustomization['photoShape']>(initialShape);
  const [guideMode, setGuideMode] = useState<GuideMode>('outline');

  const [cropRect, setCropRect] = useState<CropRect>(() =>
    computeCenteredCrop(380, 320, mode === 'biodata' ? 'portrait' : 'passport')
  );

  // Transform state
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotate90, setRotate90] = useState<number>(0); // 0, 90, 180, 270
  const [straighten, setStraighten] = useState<number>(0); // -20 .. +20
  const [flipH, setFlipH] = useState<boolean>(false);

  // Studio tone controls
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust'>('crop');
  const [filterPreset, setFilterPreset] = useState<FilterPreset>('original');
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);

  // Pointer drag state
  const dragRef = useRef<{
    type: HandleType;
    startX: number;
    startY: number;
    startOffset: { x: number; y: number };
    startCrop: CropRect;
    pointerId: number;
  } | null>(null);

  // Pinch-to-zoom tracking
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartRef = useRef<{ dist: number; zoom: number } | null>(null);

  // Load image cleanly
  useEffect(() => {
    setImgError(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgEl(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setRotate90(0);
      setStraighten(0);
      setFlipH(false);
    };
    img.onerror = () => {
      setImgEl(null);
      setImgError(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Lock body scroll while editor is open & close on Escape
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onCancel]);

  const aspectRef = useRef<CropAspect>(aspect);
  aspectRef.current = aspect;

  // Measure interactive stage responsively
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let lastW = 0;
    let lastH = 0;
    const measure = () => {
      const w = Math.max(240, Math.floor(el.clientWidth));
      const h = Math.max(240, Math.floor(el.clientHeight));
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      setStageSize({ w, h });
      setCropRect(computeCenteredCrop(w, h, aspectRef.current));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Attach non-passive wheel listener so mouse-wheel zoom never scrolls the modal behind it
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.0014;
      setZoom((prev) => Math.min(3.5, Math.max(0.6, +(prev + delta).toFixed(3))));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Recenter crop rect when aspect changes
  const handleSelectAspect = (nextAspect: CropAspect) => {
    setAspect(nextAspect);
    setCropRect(computeCenteredCrop(stageSize.w, stageSize.h, nextAspect));
    if (nextAspect === 'square') {
      setShape((prev) => (prev === 'circle' ? 'circle' : prev));
    }
  };

  const handleSelectShape = (nextShape: DocCustomization['photoShape']) => {
    setShape(nextShape);
    if (nextShape === 'circle' && aspect !== 'square') {
      setAspect('square');
      setCropRect(computeCenteredCrop(stageSize.w, stageSize.h, 'square'));
    }
  };

  const totalRotation = rotate90 + straighten;

  // Base scale fits the image cleanly over the initial centered crop frame
  const baseScale = useMemo(() => {
    if (!imgEl) return 1;
    const swapped = rotate90 % 180 !== 0;
    const natW = swapped ? imgEl.naturalHeight : imgEl.naturalWidth;
    const natH = swapped ? imgEl.naturalWidth : imgEl.naturalHeight;
    const refCrop = computeCenteredCrop(stageSize.w, stageSize.h, aspect);
    return Math.max(refCrop.w / natW, refCrop.h / natH);
  }, [imgEl, rotate90, stageSize.w, stageSize.h, aspect]);

  const filterString = useMemo(
    () => buildCssFilter(brightness, contrast, filterPreset),
    [brightness, contrast, filterPreset]
  );

  // Shared WYSIWYG image draw helper
  const drawCroppedToCanvas = useCallback(
    (
      canvas: HTMLCanvasElement,
      outW: number,
      outH: number,
      applyShapeClip: boolean
    ) => {
      if (!imgEl || cropRect.w <= 0 || cropRect.h <= 0) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = outW;
      canvas.height = outH;

      ctx.save();
      ctx.clearRect(0, 0, outW, outH);

      if (applyShapeClip && shape === 'circle') {
        const r = Math.min(outW, outH) / 2;
        ctx.beginPath();
        ctx.arc(outW / 2, outH / 2, r, 0, Math.PI * 2);
        ctx.clip();
      } else if (applyShapeClip && shape === 'rounded') {
        const radius = Math.round(Math.min(outW, outH) * 0.12);
        ctx.beginPath();
        ctx.roundRect(0, 0, outW, outH, radius);
        ctx.clip();
      }

      // Crisp formal white studio fill behind image
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);

      const scaleToOut = outW / cropRect.w;
      const stageCenterX = stageSize.w / 2;
      const stageCenterY = stageSize.h / 2;
      const cropCenterX = cropRect.x + cropRect.w / 2;
      const cropCenterY = cropRect.y + cropRect.h / 2;

      // Image center in crop-relative coordinates
      const relX = stageCenterX + offset.x - cropCenterX;
      const relY = stageCenterY + offset.y - cropCenterY;

      ctx.filter = filterString;
      ctx.translate(outW / 2 + relX * scaleToOut, outH / 2 + relY * scaleToOut);
      ctx.rotate((totalRotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, 1);

      const drawW = imgEl.naturalWidth * baseScale * zoom * scaleToOut;
      const drawH = imgEl.naturalHeight * baseScale * zoom * scaleToOut;
      ctx.drawImage(imgEl, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    },
    [
      imgEl,
      cropRect,
      shape,
      stageSize.w,
      stageSize.h,
      offset.x,
      offset.y,
      filterString,
      totalRotation,
      flipH,
      baseScale,
      zoom,
    ]
  );

  // Render interactive full-stage canvas + live miniature preview canvas
  useEffect(() => {
    const stageCanvas = stageCanvasRef.current;
    if (stageCanvas && imgEl) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      stageCanvas.width = Math.round(stageSize.w * dpr);
      stageCanvas.height = Math.round(stageSize.h * dpr);
      const ctx = stageCanvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, stageSize.w, stageSize.h);

        // Soft paper-studio checkerboard background
        ctx.fillStyle = '#e5dfd2';
        ctx.fillRect(0, 0, stageSize.w, stageSize.h);

        // Draw transformed photo centered at stageCenter + offset
        ctx.save();
        ctx.filter = filterString;
        ctx.translate(stageSize.w / 2 + offset.x, stageSize.h / 2 + offset.y);
        ctx.rotate((totalRotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, 1);
        const drawW = imgEl.naturalWidth * baseScale * zoom;
        const drawH = imgEl.naturalHeight * baseScale * zoom;
        ctx.drawImage(imgEl, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        // Dark outer scrim masking everything outside the cut outline
        ctx.save();
        ctx.fillStyle = 'rgba(24, 22, 19, 0.58)';
        ctx.beginPath();
        ctx.rect(0, 0, stageSize.w, stageSize.h);
        if (shape === 'circle') {
          const cx = cropRect.x + cropRect.w / 2;
          const cy = cropRect.y + cropRect.h / 2;
          const r = Math.min(cropRect.w, cropRect.h) / 2;
          ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
        } else if (shape === 'rounded') {
          const rad = Math.round(Math.min(cropRect.w, cropRect.h) * 0.12);
          ctx.roundRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h, rad);
        } else {
          ctx.rect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
        }
        ctx.fill('evenodd');
        ctx.restore();

        ctx.restore();
      }
    }

    // Update live document preview canvas
    const prevCanvas = previewCanvasRef.current;
    if (prevCanvas && imgEl && cropRect.w > 0 && cropRect.h > 0) {
      const targetW = 240;
      const targetH = Math.max(120, Math.round((targetW * cropRect.h) / cropRect.w));
      drawCroppedToCanvas(prevCanvas, targetW, targetH, true);
    }
  }, [
    imgEl,
    stageSize,
    cropRect,
    offset,
    zoom,
    totalRotation,
    flipH,
    filterString,
    baseScale,
    shape,
    drawCroppedToCanvas,
  ]);

  // Pointer interactions: drag photo OR drag crop/cut handles
  const beginDrag = (type: HandleType, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && type === 'pan') {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      pinchStartRef.current = { dist, zoom };
      dragRef.current = null;
      return;
    }

    dragRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: { ...offset },
      startCrop: { ...cropRect },
      pointerId: e.pointerId,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointersRef.current.has(e.pointerId)) {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Pinch-to-zoom on touch screens
    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const nextZoom = Math.min(
        3.5,
        Math.max(0.6, pinchStartRef.current.zoom * (dist / Math.max(10, pinchStartRef.current.dist)))
      );
      setZoom(nextZoom);
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.type === 'pan') {
      setOffset({
        x: drag.startOffset.x + dx,
        y: drag.startOffset.y + dy,
      });
      return;
    }

    // Resize crop box via corner or edge handles
    const minSize = 84;
    const pad = 12;
    const s = drag.startCrop;
    let { x, y, w, h } = s;

    const lockedRatio =
      aspect === 'free' ? null : ASPECT_RATIO_VALUES[aspect];

    if (lockedRatio) {
      // Corner proportional resize keeping opposite corner anchored
      const isLeft = drag.type.includes('w');
      const isTop = drag.type.includes('n');
      const rawW = isLeft ? s.w - dx : s.w + dx;
      const rawH = isTop ? s.h - dy : s.h + dy;

      // Pick dominant delta cleanly
      let nextW = Math.abs(dx) >= Math.abs(dy) ? rawW : rawH * lockedRatio;
      let nextH = nextW / lockedRatio;

      if (nextW < minSize) {
        nextW = minSize;
        nextH = nextW / lockedRatio;
      }
      if (nextH < minSize) {
        nextH = minSize;
        nextW = nextH * lockedRatio;
      }

      const maxAvailW = isLeft ? s.x + s.w - pad : stageSize.w - pad - s.x;
      const maxAvailH = isTop ? s.y + s.h - pad : stageSize.h - pad - s.y;

      if (nextW > maxAvailW) {
        nextW = maxAvailW;
        nextH = nextW / lockedRatio;
      }
      if (nextH > maxAvailH) {
        nextH = maxAvailH;
        nextW = nextH * lockedRatio;
      }

      w = Math.round(nextW);
      h = Math.round(nextH);
      x = Math.round(isLeft ? s.x + s.w - w : s.x);
      y = Math.round(isTop ? s.y + s.h - h : s.y);
    } else {
      // Free cut mode — independent edges & corners
      if (drag.type.includes('e')) {
        w = Math.max(minSize, Math.min(stageSize.w - pad - s.x, s.w + dx));
      }
      if (drag.type.includes('s')) {
        h = Math.max(minSize, Math.min(stageSize.h - pad - s.y, s.h + dy));
      }
      if (drag.type.includes('w')) {
        const newX = Math.max(pad, Math.min(s.x + s.w - minSize, s.x + dx));
        w = s.x + s.w - newX;
        x = newX;
      }
      if (drag.type.includes('n')) {
        const newY = Math.max(pad, Math.min(s.y + s.h - minSize, s.y + dy));
        h = s.y + s.h - newY;
        y = newY;
      }
    }

    setCropRect({ x, y, w, h });
  };

  const endDrag = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
    }
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setRotate90(0);
    setStraighten(0);
    setFlipH(false);
    setBrightness(0);
    setContrast(0);
    setFilterPreset('original');
    setCropRect(computeCenteredCrop(stageSize.w, stageSize.h, aspect));
  };

  const handleApply = () => {
    if (!imgEl || cropRect.w <= 0 || cropRect.h <= 0) return;
    const outCanvas = document.createElement('canvas');
    const maxDim = 680;
    const ratio = cropRect.w / cropRect.h;
    const outW = ratio >= 1 ? maxDim : Math.round(maxDim * ratio);
    const outH = ratio >= 1 ? Math.round(maxDim / ratio) : maxDim;

    // Export clean rectangular raster (templates apply border-radius / circle clipping dynamically)
    drawCroppedToCanvas(outCanvas, outW, outH, false);
    const dataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    onApply(dataUrl, shape);
  };

  const previewRadiusClass =
    shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-lg' : 'rounded-none';

  const aspectRatioCss =
    cropRect.w > 0 && cropRect.h > 0 ? `${cropRect.w} / ${cropRect.h}` : '4 / 5';

  const displayName =
    personName?.trim() ||
    (mode === 'cv'
      ? isBn
        ? 'তানভীর আহমেদ চৌধুরী'
        : 'Tanvir Ahmed Chowdhury'
      : isBn
      ? 'মাহমুদুল হাসান রাফি'
      : 'Mahmudul Hasan Rafi');

  const displaySubtitle =
    mode === 'cv'
      ? isBn
        ? 'সফটওয়্যার ইঞ্জিনিয়ার / ব্যাংকার · ঢাকা'
        : 'Software Engineer · Dhaka, Bangladesh'
      : isBn
      ? 'বিবাহের বায়োডাটা · ঢাকা'
      : 'Marriage Biodata · Dhaka, Bangladesh';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-editor-title"
      className="fixed inset-0 z-50 bg-[#1f1c18]/65 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-4"
      onClick={onCancel}
    >
      <div
        className="sketch-box w-full max-w-4xl max-h-[94dvh] flex flex-col overflow-hidden bg-[#faf7f0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 bg-[#f3ede0] border-b border-[#3a3630]/30 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Crop className="w-4 h-4 text-[#1e5645] shrink-0" />
            <h2
              id="photo-editor-title"
              className="sketch-heading text-xl sm:text-2xl text-[#24211d] truncate leading-none"
            >
              {isBn ? 'ছবি এডিট ও ক্রপ করুন' : 'Crop & Frame Your Photo'}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onReplaceFile && (
              <>
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onReplaceFile(f);
                    e.target.value = '';
                  }}
                />
                <button
                  type="button"
                  onClick={() => replaceInputRef.current?.click()}
                  className="px-2.5 py-1.5 text-xs font-semibold text-[#24211d] bg-[#fffdf8] border border-[#3a3630]/40 rounded-lg hover:border-[#24211d] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {isBn ? 'অন্য ছবি নিন' : 'Change Photo'}
                  </span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 text-xs font-semibold text-[#5c564d] hover:text-[#24211d] bg-[#fffdf8] border border-[#3a3630]/35 rounded-lg inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              title={isBn ? 'আগের অবস্থায় ফিরুন' : 'Reset edits'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'রিসেট' : 'Reset'}</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 text-[#5c564d] hover:text-[#24211d] cursor-pointer"
              aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Workspace Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_272px] gap-4 sm:gap-5">
          {/* LEFT: Interactive Crop & Cut Canvas Stage + Controls */}
          <div className="space-y-3.5 min-w-0">
            {/* Aspect Ratio & Outline Guide Quick Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                className="inline-flex flex-wrap p-0.5 bg-[#f3ede0] border border-[#3a3630]/45 rounded-lg"
                role="group"
                aria-label={isBn ? 'ক্রপ অনুপাত' : 'Crop ratio'}
              >
                {(
                  [
                    { id: 'passport', en: 'Passport 4:5', bn: 'পাসপোর্ট ৪:৫' },
                    { id: 'portrait', en: 'Portrait 3:4', bn: 'পোর্ট্রেট ৩:৪' },
                    { id: 'square', en: 'Square 1:1', bn: 'বর্গ ১:১' },
                    { id: 'free', en: 'Free Cut', bn: 'ফ্রি কাট' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectAspect(item.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer whitespace-nowrap transition-colors ${
                      aspect === item.id
                        ? 'bg-[#24211d] text-[#fffdf8]'
                        : 'text-[#5c564d] hover:text-[#24211d]'
                    }`}
                  >
                    {isBn ? item.bn : item.en}
                  </button>
                ))}
              </div>

              {/* Outline Guide Switcher */}
              <div
                className="inline-flex p-0.5 bg-[#fffdf8] border border-[#3a3630]/40 rounded-lg"
                role="group"
                aria-label={isBn ? 'আউটলাইন গাইড' : 'Outline guide'}
              >
                <button
                  type="button"
                  onClick={() => setGuideMode('outline')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md inline-flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
                    guideMode === 'outline'
                      ? 'bg-[#1e5645] text-white'
                      : 'text-[#5c564d] hover:text-[#24211d]'
                  }`}
                  title={isBn ? 'মুখ ও কাঁধের আউটলাইন গাইড' : 'Head & shoulders outline guide'}
                >
                  <UserRound className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isBn ? 'আউটলাইন' : 'Outline'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGuideMode('grid')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md inline-flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
                    guideMode === 'grid'
                      ? 'bg-[#1e5645] text-white'
                      : 'text-[#5c564d] hover:text-[#24211d]'
                  }`}
                  title={isBn ? 'গ্রিড লাইন' : 'Rule of thirds grid'}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isBn ? 'গ্রিড' : 'Grid'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGuideMode('none')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md cursor-pointer whitespace-nowrap transition-colors ${
                    guideMode === 'none'
                      ? 'bg-[#1e5645] text-white'
                      : 'text-[#5c564d] hover:text-[#24211d]'
                  }`}
                >
                  {isBn ? 'বন্ধ' : 'Off'}
                </button>
              </div>
            </div>

            {/* Interactive Canvas Viewport */}
            <div
              ref={stageRef}
              onPointerDown={(e) => beginDrag('pan', e)}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="relative w-full h-[270px] sm:h-[340px] rounded-xl overflow-hidden border-[1.5px] border-[#3a3630] select-none touch-none cursor-grab active:cursor-grabbing bg-[#e5dfd2]"
            >
              {imgError ? (
                <div className="w-full h-full flex items-center justify-center p-6 text-center text-sm text-[#9f3324]">
                  {isBn
                    ? 'ছবিটি লোড করা যায়নি। অনুগ্রহ করে JPG বা PNG ছবি দিন।'
                    : 'Could not load this image. Please try another JPG or PNG file.'}
                </div>
              ) : (
                <>
                  <canvas
                    ref={stageCanvasRef}
                    className="w-full h-full block pointer-events-none"
                  />

                  {/* Interactive Crop Cut Frame + Portrait Silhouette Outline + Resize Handles */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${cropRect.x}px`,
                      top: `${cropRect.y}px`,
                      width: `${cropRect.w}px`,
                      height: `${cropRect.h}px`,
                    }}
                  >
                    {/* Crisp White + Forest Cut Outline */}
                    <div
                      className={`w-full h-full border-2 border-white shadow-[0_0_0_1px_rgba(30,86,69,0.85)] relative overflow-hidden ${
                        shape === 'circle'
                          ? 'rounded-full'
                          : shape === 'rounded'
                          ? 'rounded-xl'
                          : 'rounded-none'
                      }`}
                    >
                      {/* Head & Shoulders Passport Silhouette Guide */}
                      {guideMode === 'outline' && (
                        <svg
                          viewBox="0 0 200 250"
                          preserveAspectRatio="xMidYMid meet"
                          className="w-full h-full pointer-events-none"
                          aria-hidden="true"
                        >
                          {/* Subtle center vertical axis & eye-level line */}
                          <line
                            x1="100"
                            y1="14"
                            x2="100"
                            y2="236"
                            stroke="rgba(255,255,255,0.45)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                          <line
                            x1="28"
                            y1="96"
                            x2="172"
                            y2="96"
                            stroke="rgba(255,255,255,0.55)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                          {/* Head oval outline */}
                          <ellipse
                            cx="100"
                            cy="94"
                            rx="40"
                            ry="50"
                            fill="none"
                            stroke="rgba(255,255,255,0.9)"
                            strokeWidth="1.8"
                            strokeDasharray="6 4"
                          />
                          {/* Shoulders curve outline */}
                          <path
                            d="M22 248 C28 192, 56 168, 100 168 C144 168, 172 192, 178 248"
                            fill="none"
                            stroke="rgba(255,255,255,0.9)"
                            strokeWidth="1.8"
                            strokeDasharray="6 4"
                          />
                        </svg>
                      )}

                      {/* Rule of Thirds Grid */}
                      {guideMode === 'grid' && (
                        <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                          {Array.from({ length: 9 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="border border-white/40"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 4 Interactive Corner Cut Handles */}
                    {(
                      [
                        { id: 'nw', pos: '-top-2 -left-2 cursor-nwse-resize' },
                        { id: 'ne', pos: '-top-2 -right-2 cursor-nesw-resize' },
                        { id: 'sw', pos: '-bottom-2 -left-2 cursor-nesw-resize' },
                        { id: 'se', pos: '-bottom-2 -right-2 cursor-nwse-resize' },
                      ] as const
                    ).map((h) => (
                      <div
                        key={h.id}
                        onPointerDown={(e) => beginDrag(h.id, e)}
                        className={`pointer-events-auto absolute ${h.pos} w-4 h-4 bg-[#fffdf8] border-2 border-[#1e5645] rounded-sm shadow`}
                      />
                    ))}

                    {/* 4 Edge Cut Handles (active in Free Cut mode) */}
                    {aspect === 'free' &&
                      (
                        [
                          { id: 'n', pos: '-top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 cursor-ns-resize' },
                          { id: 's', pos: '-bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 cursor-ns-resize' },
                          { id: 'w', pos: '-left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-8 cursor-ew-resize' },
                          { id: 'e', pos: '-right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-8 cursor-ew-resize' },
                        ] as const
                      ).map((h) => (
                        <div
                          key={h.id}
                          onPointerDown={(e) => beginDrag(h.id, e)}
                          className={`pointer-events-auto absolute ${h.pos} bg-[#fffdf8] border border-[#1e5645] rounded-full shadow`}
                        />
                      ))}
                  </div>

                  {/* Subtle Gesture Hint */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#24211d]/75 text-[#fffdf8] text-[11px] pointer-events-none whitespace-nowrap">
                    {isBn
                      ? 'ছবি টেনে সরান · কোণা টেনে কাটুন'
                      : 'Drag photo to position · Drag corners to cut'}
                  </div>
                </>
              )}
            </div>

            {/* Crop / Studio Adjust Mode Tabs */}
            <div className="sketch-box-flat p-3.5 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-[#3a3630]/25">
                <div className="inline-flex p-0.5 bg-[#f3ede0] border border-[#3a3630]/35 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab('crop')}
                    className={`px-3 py-1 text-xs font-bold rounded-md inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                      activeTab === 'crop'
                        ? 'bg-[#24211d] text-[#fffdf8]'
                        : 'text-[#5c564d] hover:text-[#24211d]'
                    }`}
                  >
                    <Crop className="w-3.5 h-3.5" />
                    {isBn ? 'জুম ও ঘোরান' : 'Zoom & Rotate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('adjust')}
                    className={`px-3 py-1 text-xs font-bold rounded-md inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                      activeTab === 'adjust'
                        ? 'bg-[#24211d] text-[#fffdf8]'
                        : 'text-[#5c564d] hover:text-[#24211d]'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {isBn ? 'আলো ও টোন' : 'Light & Tone'}
                  </button>
                </div>

                {/* Quick Rotate & Flip Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setRotate90((r) => (r + 270) % 360)}
                    className="p-1.5 rounded-md bg-[#fffdf8] border border-[#3a3630]/35 hover:border-[#24211d] text-[#24211d] cursor-pointer"
                    title={isBn ? 'বামে ৯০° ঘোরান' : 'Rotate left 90°'}
                    aria-label={isBn ? 'বামে ৯০° ঘোরান' : 'Rotate left 90°'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotate90((r) => (r + 90) % 360)}
                    className="p-1.5 rounded-md bg-[#fffdf8] border border-[#3a3630]/35 hover:border-[#24211d] text-[#24211d] cursor-pointer"
                    title={isBn ? 'ডানে ৯০° ঘোরান' : 'Rotate right 90°'}
                    aria-label={isBn ? 'ডানে ৯০° ঘোরান' : 'Rotate right 90°'}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipH((f) => !f)}
                    className={`p-1.5 rounded-md border cursor-pointer transition-colors ${
                      flipH
                        ? 'bg-[#1e5645] text-white border-[#1e5645]'
                        : 'bg-[#fffdf8] text-[#24211d] border-[#3a3630]/35 hover:border-[#24211d]'
                    }`}
                    title={isBn ? 'উল্টে দিন (মিরর)' : 'Flip horizontal'}
                    aria-label={isBn ? 'উল্টে দিন' : 'Flip horizontal'}
                  >
                    <FlipHorizontal2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {activeTab === 'crop' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Zoom Control */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#24211d]">
                      <span>{isBn ? 'জুম' : 'Zoom'}</span>
                      <span className="tabular-nums text-[#5c564d]">
                        {Math.round(zoom * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))}
                        className="p-1 text-[#5c564d] hover:text-[#24211d] cursor-pointer"
                        aria-label="Zoom out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="range"
                        min={0.6}
                        max={3}
                        step={0.02}
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="flex-1 accent-[#1e5645] cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
                        className="p-1 text-[#5c564d] hover:text-[#24211d] cursor-pointer"
                        aria-label="Zoom in"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Fine Straighten Control */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#24211d]">
                      <span>{isBn ? 'সোজা করুন' : 'Straighten'}</span>
                      <span className="tabular-nums text-[#5c564d]">
                        {straighten > 0 ? `+${straighten}°` : `${straighten}°`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-20}
                      max={20}
                      step={1}
                      value={straighten}
                      onChange={(e) => setStraighten(parseInt(e.target.value, 10))}
                      className="w-full accent-[#1e5645] cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Quick Studio Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        { id: 'original', en: 'Original', bn: 'মূল ছবি' },
                        { id: 'studio', en: 'Formal Studio', bn: 'স্টুডিও উজ্জ্বল' },
                        { id: 'warm', en: 'Warm Portrait', bn: 'উষ্ণ পোর্ট্রেট' },
                        { id: 'bw', en: 'Classic B&W', bn: 'সাদা-কালো' },
                      ] as const
                    ).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFilterPreset(p.id)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md border inline-flex items-center gap-1 cursor-pointer transition-colors ${
                          filterPreset === p.id
                            ? 'bg-[#1e5645] text-white border-[#1e5645]'
                            : 'bg-[#fffdf8] text-[#5c564d] border-[#3a3630]/35 hover:border-[#24211d]'
                        }`}
                      >
                        {p.id === 'studio' && <Sparkles className="w-3 h-3" />}
                        {isBn ? p.bn : p.en}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#24211d]">
                        <span>{isBn ? 'উজ্জ্বলতা' : 'Brightness'}</span>
                        <span className="tabular-nums text-[#5c564d]">
                          {brightness > 0 ? `+${brightness}` : brightness}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-30}
                        max={30}
                        step={1}
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                        className="w-full accent-[#1e5645] cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#24211d]">
                        <span>{isBn ? 'কনট্রাস্ট' : 'Contrast'}</span>
                        <span className="tabular-nums text-[#5c564d]">
                          {contrast > 0 ? `+${contrast}` : contrast}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-30}
                        max={30}
                        step={1}
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                        className="w-full accent-[#1e5645] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Cut Outline Selector & Live Document Preview */}
          <div className="flex flex-col gap-3.5 min-w-0">
            {/* Cut Frame Shape Selector */}
            <div className="sketch-box-flat p-3.5 space-y-2.5">
              <div className="text-xs font-bold text-[#24211d]">
                {isBn ? 'ছবির আউটলাইন / ফ্রেম' : 'Photo Outline Shape'}
              </div>
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-[#f3ede0] border border-[#3a3630]/40 rounded-lg">
                {(
                  [
                    { id: 'rect', en: 'Passport', bn: 'পাসপোর্ট' },
                    { id: 'rounded', en: 'Rounded', bn: 'গোলাকার কোণা' },
                    { id: 'circle', en: 'Circle', bn: 'বৃত্তাকার' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectShape(item.id)}
                    className={`py-1.5 px-1 text-[11px] font-semibold rounded-md cursor-pointer truncate transition-colors ${
                      shape === item.id
                        ? 'bg-[#24211d] text-[#fffdf8]'
                        : 'text-[#5c564d] hover:text-[#24211d]'
                    }`}
                  >
                    {isBn ? item.bn : item.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Time Preview of How It Will Look on the Document */}
            <div className="sketch-box-flat p-3.5 space-y-3 flex-1 flex flex-col">
              <div>
                <div className="text-xs font-bold text-[#1e5645]">
                  {isBn ? 'ডকুমেন্টে যেমন দেখাবে' : 'How It Will Look'}
                </div>
                <p className="text-[11px] text-[#6f685e] mt-0.5">
                  {isBn
                    ? 'আপনার A4 ডকুমেন্টের লাইভ প্রিভিউ'
                    : 'Live cropped result inside your A4 header'}
                </p>
              </div>

              {/* Standalone Crisp Cropped Portrait Preview */}
              <div className="bg-[#f3ede0]/70 rounded-lg p-3 flex items-center justify-center border border-dashed border-[#3a3630]/25">
                <div
                  className={`overflow-hidden border border-[#24211d]/25 bg-white shadow-sm ${previewRadiusClass}`}
                  style={{
                    width: shape === 'circle' ? '108px' : '104px',
                    aspectRatio: shape === 'circle' ? '1 / 1' : aspectRatioCss,
                    maxHeight: '132px',
                  }}
                >
                  <canvas
                    ref={previewCanvasRef}
                    className="w-full h-full object-cover block"
                  />
                </div>
              </div>

              {/* Realistic Mini Document Header Card Preview */}
              <div className="bg-white border border-[#24211d]/18 rounded-md p-3 shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0 flex-1 space-y-1 pt-0.5">
                    <div className="text-xs font-bold text-[#1a1a1a] truncate">
                      {displayName}
                    </div>
                    <div className="text-[10px] text-[#5c564d] truncate">
                      {displaySubtitle}
                    </div>
                    <div className="pt-1.5 space-y-1">
                      <div className="h-1.5 w-11/12 bg-[#e8e3d9] rounded-full" />
                      <div className="h-1.5 w-3/4 bg-[#e8e3d9] rounded-full" />
                    </div>
                  </div>
                  <MiniPreviewMirror
                    sourceCanvasRef={previewCanvasRef}
                    shape={shape}
                    aspectRatioCss={aspectRatioCss}
                    deps={[
                      imgEl,
                      cropRect,
                      offset,
                      zoom,
                      totalRotation,
                      flipH,
                      filterString,
                      shape,
                    ]}
                  />
                </div>
                <div className="pt-1.5 border-t border-[#1e5645]/25 space-y-1">
                  <div className="h-1.5 w-1/3 bg-[#1e5645]/35 rounded-full" />
                  <div className="h-1.5 w-full bg-[#f0ece3] rounded-full" />
                  <div className="h-1.5 w-5/6 bg-[#f0ece3] rounded-full" />
                </div>
              </div>

              <p className="text-[11px] text-[#6f685e] leading-snug mt-auto">
                {isBn
                  ? 'সম্পূর্ণ আপনার ডিভাইসেই প্রসেস হচ্ছে — কোনো ছবি সার্ভারে আপলোড হয় না।'
                  : 'Edited 100% on your device. Your photo never leaves your browser.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Modal Footer */}
        <div className="px-4 sm:px-5 py-3 bg-[#f3ede0] border-t border-[#3a3630]/30 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="sketch-btn px-4 py-2 text-xs sm:text-sm font-semibold bg-[#fffdf8] text-[#24211d] cursor-pointer"
          >
            {isBn ? 'বাতিল' : 'Cancel'}
          </button>

          <button
            type="button"
            disabled={!imgEl || imgError}
            onClick={handleApply}
            className="sketch-btn px-5 py-2 text-xs sm:text-sm font-bold bg-[#1e5645] text-[#fffdf8] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isBn ? 'ডকুমেন্টে বসান' : 'Apply to Document'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Tiny live mirror canvas that renders the exact cropped portrait inside the mini A4 header mockup.
 */
function MiniPreviewMirror({
  sourceCanvasRef,
  shape,
  aspectRatioCss,
  deps,
}: {
  sourceCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  shape: DocCustomization['photoShape'];
  aspectRatioCss: string;
  deps: unknown[];
}) {
  const miniRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      const src = sourceCanvasRef.current;
      const dst = miniRef.current;
      if (!src || !dst || src.width === 0 || src.height === 0) return;
      dst.width = src.width;
      dst.height = src.height;
      const ctx = dst.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, dst.width, dst.height);
      ctx.drawImage(src, 0, 0);
    });
    return () => window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const radiusClass =
    shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-md' : 'rounded-none';

  return (
    <div
      className={`shrink-0 overflow-hidden border border-[#24211d]/25 bg-[#f3ede0] ${radiusClass}`}
      style={{
        width: shape === 'circle' ? '44px' : '42px',
        aspectRatio: shape === 'circle' ? '1 / 1' : aspectRatioCss,
        maxHeight: '54px',
      }}
    >
      <canvas ref={miniRef} className="w-full h-full object-cover block" />
    </div>
  );
}
