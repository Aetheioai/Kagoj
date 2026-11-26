import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { PageFormat } from '../types/builder';
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  applySmartPageBreaks,
} from './pagination';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/**
 * Clones the live unscaled A4 document into an isolated container, runs our
 * DOM-aware smart pagination (guaranteeing zero split sections and clean top/bottom
 * margins on every page), captures at high DPI, and downloads a crisp multi-page A4 PDF.
 */
export async function exportElementToA4Pdf(
  sourceElement: HTMLElement,
  filename: string,
  pageFormat: PageFormat = '2-page'
): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // Create an isolated offscreen clone so we never disturb React's live DOM
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
  clone.style.width = `${A4_WIDTH_PX}px`;
  clone.style.transform = 'none';
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    // Wait for all images inside the clone to load
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

    // Run smart section-aware pagination matching the selected 1-page or 2-page format
    const { totalPages, contentHeight } = applySmartPageBreaks(clone, {
      replicatePageFrames: true,
      pageFormat,
    });

    const sheetEl = clone.querySelector<HTMLElement>('.a4-sheet') || clone;
    const sheetBg = window.getComputedStyle(sheetEl).backgroundColor || '#ffffff';

    const isCompactDevice =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    const captureOptions = {
      width: A4_WIDTH_PX,
      height: contentHeight,
      pixelRatio: isCompactDevice ? (totalPages > 1 ? 1.65 : 1.9) : 2.2,
      backgroundColor: sheetBg,
      cacheBust: false,
      preferredFontFormat: 'woff2' as const,
      filter: (node: HTMLElement) => {
        if (node instanceof HTMLElement && node.classList.contains('a4-page-guide')) {
          return false;
        }
        return true;
      },
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
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = safeName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
  } finally {
    document.body.removeChild(host);
  }
}
