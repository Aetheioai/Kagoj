import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { PageFormat } from '../types/builder';
import { A4_WIDTH_PX, applySmartPageBreaks } from './pagination';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export interface CustomSinglePageSize {
  widthPx: number;
  heightPx: number;
  widthMm: number;
  heightMm: number;
}

async function waitForCloneAssets(clone: HTMLElement): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  const imgs = Array.from(clone.querySelectorAll('img'));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
        window.setTimeout(resolve, 2500);
      });
    })
  );
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
}

/**
 * Clones the live unscaled document into an isolated container, runs DOM-aware smart pagination
 * (or exact single-page capture for multi-aspect-ratio posters), captures at high DPI,
 * and downloads a crisp PDF matching the exact page dimensions and orientation.
 */
export async function exportElementToA4Pdf(
  sourceElement: HTMLElement,
  filename: string,
  pageFormat: PageFormat = '2-page',
  customSize?: CustomSinglePageSize
): Promise<void> {
  const targetWidthPx = customSize ? customSize.widthPx : A4_WIDTH_PX;

  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '0';
  host.style.top = '0';
  host.style.width = '0';
  host.style.height = '0';
  host.style.overflow = 'hidden';
  host.style.pointerEvents = 'none';
  host.style.zIndex = '-1';

  const clone = sourceElement.cloneNode(true) as HTMLElement;
  clone.style.width = `${targetWidthPx}px`;
  clone.style.transform = 'none';
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    await waitForCloneAssets(clone);

    const sheetEl = clone.querySelector<HTMLElement>('.a4-sheet') || clone;
    const sheetBg = window.getComputedStyle(sheetEl).backgroundColor || '#ffffff';

    const isCompactDevice =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    // Exact custom aspect-ratio single-page PDF (used for Posters in A4/1:1/4:5/9:16/16:9/Landscape)
    if (customSize) {
      const captureOptions = {
        width: customSize.widthPx,
        height: customSize.heightPx,
        pixelRatio: isCompactDevice ? 1.85 : 2.1,
        backgroundColor: sheetBg,
        cacheBust: false,
        preferredFontFormat: 'woff2' as const,
        filter: (node: HTMLElement) =>
          !(node instanceof HTMLElement && node.classList.contains('a4-page-guide')),
      };

      let canvas: HTMLCanvasElement;
      try {
        canvas = await toCanvas(clone, captureOptions);
      } catch {
        canvas = await toCanvas(clone, { ...captureOptions, skipFonts: true });
      }

      const orientation =
        customSize.widthMm > customSize.heightMm ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: [customSize.widthMm, customSize.heightMm],
        compress: true,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.96);
      pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        customSize.widthMm,
        customSize.heightMm,
        undefined,
        'FAST'
      );

      const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      triggerBlobDownload(pdf.output('blob'), safeName);
      return;
    }

    // Standard multi-page A4 export with zero-cut smart pagination
    const { totalPages, contentHeight } = applySmartPageBreaks(clone, {
      replicatePageFrames: true,
      pageFormat,
    });

    const captureOptions = {
      width: A4_WIDTH_PX,
      height: contentHeight,
      pixelRatio: isCompactDevice ? (totalPages > 1 ? 1.65 : 1.9) : 2.2,
      backgroundColor: sheetBg,
      cacheBust: false,
      preferredFontFormat: 'woff2' as const,
      filter: (node: HTMLElement) =>
        !(node instanceof HTMLElement && node.classList.contains('a4-page-guide')),
    };

    let canvas: HTMLCanvasElement;
    try {
      canvas = await toCanvas(clone, captureOptions);
    } catch {
      canvas = await toCanvas(clone, { ...captureOptions, skipFonts: true });
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pagePixelHeight = Math.round(canvas.height / totalPages);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const sy = pageIndex * pagePixelHeight;
      const sh = Math.min(pagePixelHeight, canvas.height - sy);
      if (sh <= 4) break;

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pagePixelHeight;
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) continue;

      ctx.fillStyle = sheetBg;
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);

      const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
      if (pageIndex > 0) {
        pdf.addPage('a4', 'portrait');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');
    }

    const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    triggerBlobDownload(pdf.output('blob'), safeName);
  } finally {
    document.body.removeChild(host);
  }
}

/**
 * Exports a single-sheet element (ideal for To-Let / Tuition Posters in 1:1, 4:5, 9:16, 16:9, A4)
 * directly to a high-resolution PNG image ready for Facebook groups & WhatsApp sharing.
 */
export async function exportElementToPng(
  sourceElement: HTMLElement,
  filename: string,
  widthPx: number,
  heightPx: number
): Promise<void> {
  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '0';
  host.style.top = '0';
  host.style.width = '0';
  host.style.height = '0';
  host.style.overflow = 'hidden';
  host.style.pointerEvents = 'none';
  host.style.zIndex = '-1';

  const clone = sourceElement.cloneNode(true) as HTMLElement;
  clone.style.width = `${widthPx}px`;
  clone.style.transform = 'none';
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    await waitForCloneAssets(clone);

    const sheetEl = clone.querySelector<HTMLElement>('.a4-sheet') || clone;
    const sheetBg = window.getComputedStyle(sheetEl).backgroundColor || '#ffffff';

    const captureOptions = {
      width: widthPx,
      height: heightPx,
      pixelRatio: 2,
      backgroundColor: sheetBg,
      cacheBust: false,
      preferredFontFormat: 'woff2' as const,
      filter: (node: HTMLElement) =>
        !(node instanceof HTMLElement && node.classList.contains('a4-page-guide')),
    };

    let canvas: HTMLCanvasElement;
    try {
      canvas = await toCanvas(clone, captureOptions);
    } catch {
      canvas = await toCanvas(clone, { ...captureOptions, skipFonts: true });
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png')
    );
    if (!blob) throw new Error('Could not generate PNG image.');

    const safeName = filename.endsWith('.png') ? filename : `${filename}.png`;
    triggerBlobDownload(blob, safeName);
  } finally {
    document.body.removeChild(host);
  }
}
