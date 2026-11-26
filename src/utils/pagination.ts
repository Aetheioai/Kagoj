import { PageFormat } from '../types/builder';

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

export interface PaginationResult {
  totalPages: number;
  contentHeight: number;
  fitStatus: 'exact' | 'compressed' | 'overflow';
}

/**
 * Resets any previously applied smart page-break margins or 1-page fit adjustments.
 */
export function resetSmartPageBreaks(root: HTMLElement): void {
  const adjusted = root.querySelectorAll<HTMLElement>('[data-kagoj-break-margin="1"]');
  adjusted.forEach((el) => {
    el.style.marginTop = '';
    delete el.dataset.kagojBreakMargin;
  });

  const tightened = root.querySelectorAll<HTMLElement>('[data-kagoj-1p-tight="1"]');
  tightened.forEach((el) => {
    el.style.paddingTop = '';
    el.style.paddingBottom = '';
    el.style.marginTop = '';
    el.style.marginBottom = '';
    el.style.rowGap = '';
    delete el.dataset.kagoj1pTight;
  });

  const sheets = root.querySelectorAll<HTMLElement>('.a4-sheet');
  sheets.forEach((s) => {
    s.style.minHeight = '';
  });

  const asides = root.querySelectorAll<HTMLElement>('aside');
  asides.forEach((a) => {
    a.style.minHeight = '';
  });

  // Remove any previously cloned multi-page ornamental frames
  root
    .querySelectorAll('[data-kagoj-cloned-frame="1"]')
    .forEach((node) => node.remove());

  // Restore original frame positioning if previously constrained
  root
    .querySelectorAll<HTMLElement>('[data-pdf-page-frame="true"]')
    .forEach((frame) => {
      frame.style.top = '';
      frame.style.bottom = '';
      frame.style.height = '';
    });
}

function measureContentBottom(sheet: HTMLElement, getScaleY: () => number): number {
  const scaleY = getScaleY();
  const sheetTop = sheet.getBoundingClientRect().top;
  let maxContentBottom = 0;

  const contentNodes = Array.from(
    sheet.querySelectorAll<HTMLElement>('header, section, aside > div, main')
  );
  for (const node of contentNodes) {
    if (node.dataset.pdfPageFrame === 'true') continue;
    const r = node.getBoundingClientRect();
    const b = (r.bottom - sheetTop) * scaleY;
    if (b > maxContentBottom) {
      maxContentBottom = b;
    }
  }
  return maxContentBottom;
}

/**
 * Measures DOM geometry in unscaled 794px A4 coordinates.
 *
 * - In `1-page` format: guarantees a crisp single-page fit by applying gentle
 *   proportional spacing compression if content is slightly over 1 A4 sheet.
 *   If the user writes far too much for 1 page, cleanly protects every section
 *   with zero split cuts and reports `fitStatus: 'overflow'`.
 * - In `2-page` format: inserts smart margin offsets before any <section> or
 *   .a4-avoid-break block crossing a page boundary so zero sections or lines
 *   are ever sliced in half, and replicates ornamental borders onto every page.
 */
export function applySmartPageBreaks(
  root: HTMLElement,
  options: { replicatePageFrames?: boolean; pageFormat?: PageFormat } = {}
): PaginationResult {
  resetSmartPageBreaks(root);

  const pageFormat: PageFormat = options.pageFormat ?? '2-page';
  const sheet =
    root.classList.contains('a4-sheet')
      ? root
      : root.querySelector<HTMLElement>('.a4-sheet') || root;

  const hasFrame = Boolean(sheet.querySelector('[data-pdf-page-frame="true"]'));
  const safeTop = hasFrame ? (pageFormat === '1-page' ? 44 : 58) : pageFormat === '1-page' ? 30 : 42;
  const safeBottom = hasFrame ? (pageFormat === '1-page' ? 44 : 58) : pageFormat === '1-page' ? 28 : 42;
  const maxSinglePageHeight = A4_HEIGHT_PX - safeTop - safeBottom;

  const getScaleY = () => {
    const rect = sheet.getBoundingClientRect();
    if (rect.width <= 0) return 1;
    return sheet.offsetWidth / rect.width;
  };

  // =========================================================================
  // 1-PAGE FORMAT SMART FIT ENGINE
  // =========================================================================
  if (pageFormat === '1-page') {
    let bottom = measureContentBottom(sheet, getScaleY);
    const limit = A4_HEIGHT_PX - (hasFrame ? 36 : 20);

    if (bottom <= limit) {
      sheet.style.minHeight = `${A4_HEIGHT_PX}px`;
      const aside = sheet.querySelector<HTMLElement>('aside');
      if (aside) aside.style.minHeight = `${A4_HEIGHT_PX}px`;
      return { totalPages: 1, contentHeight: A4_HEIGHT_PX, fitStatus: 'exact' };
    }

    // Stage 1: Gently compress vertical padding and section spacing to fit 1 page naturally
    const overflowRatio = bottom / limit;
    if (overflowRatio <= 1.2) {
      const factor = Math.max(0.55, 1 - (overflowRatio - 1) * 2.4);

      const padTargets = [
        sheet,
        ...Array.from(sheet.querySelectorAll<HTMLElement>('header, main, aside')),
      ];
      for (const el of padTargets) {
        const cs = window.getComputedStyle(el);
        const pt = parseFloat(cs.paddingTop) || 0;
        const pb = parseFloat(cs.paddingBottom) || 0;
        const gap = parseFloat(cs.rowGap) || 0;
        if (pt > 14) el.style.paddingTop = `${Math.max(12, Math.round(pt * factor))}px`;
        if (pb > 14) el.style.paddingBottom = `${Math.max(12, Math.round(pb * factor))}px`;
        if (gap > 8) el.style.rowGap = `${Math.max(6, Math.round(gap * factor))}px`;
        el.dataset.kagoj1pTight = '1';
      }

      const secEls = Array.from(sheet.querySelectorAll<HTMLElement>('section'));
      for (const sec of secEls) {
        const cs = window.getComputedStyle(sec);
        const mt = parseFloat(cs.marginTop) || 0;
        const mb = parseFloat(cs.marginBottom) || 0;
        if (mt > 6) sec.style.marginTop = `${Math.max(5, Math.round(mt * factor))}px`;
        if (mb > 6) sec.style.marginBottom = `${Math.max(4, Math.round(mb * factor))}px`;
        sec.dataset.kagoj1pTight = '1';
      }

      bottom = measureContentBottom(sheet, getScaleY);
      if (bottom <= A4_HEIGHT_PX - (hasFrame ? 26 : 12)) {
        sheet.style.minHeight = `${A4_HEIGHT_PX}px`;
        const aside = sheet.querySelector<HTMLElement>('aside');
        if (aside) aside.style.minHeight = `${A4_HEIGHT_PX}px`;
        return { totalPages: 1, contentHeight: A4_HEIGHT_PX, fitStatus: 'compressed' };
      }

      // If still overflowing, restore before falling through to zero-cut multi-page protection
      resetSmartPageBreaks(root);
    }
  }

  // =========================================================================
  // MULTI-PAGE ZERO-CUT SMART PAGINATION (2-PAGE FORMAT & 1-PAGE OVERFLOW SAFETY)
  // =========================================================================
  const pushBlockIfCrossing = (el: HTMLElement): boolean => {
    const scaleY = getScaleY();
    const sheetTop = sheet.getBoundingClientRect().top;
    const rect = el.getBoundingClientRect();
    const top = (rect.top - sheetTop) * scaleY;
    const height = rect.height * scaleY;
    if (height <= 1) return false;

    const bottom = top + height;
    const startPage = Math.max(0, Math.floor(top / A4_HEIGHT_PX));
    const pageSafeBottom = (startPage + 1) * A4_HEIGHT_PX - safeBottom;

    if (bottom > pageSafeBottom && height <= maxSinglePageHeight) {
      const targetTop = (startPage + 1) * A4_HEIGHT_PX + safeTop;
      const delta = Math.ceil(targetTop - top);
      if (delta > 0) {
        const currentMt = parseFloat(window.getComputedStyle(el).marginTop) || 0;
        let nextMt = currentMt + delta;
        el.style.marginTop = `${nextMt}px`;
        el.dataset.kagojBreakMargin = '1';

        // Self-correct if CSS margin collapse absorbed part of the offset
        const actualTop =
          (el.getBoundingClientRect().top - sheet.getBoundingClientRect().top) * getScaleY();
        if (actualTop < targetTop - 0.5) {
          nextMt += Math.ceil(targetTop - actualTop);
          el.style.marginTop = `${nextMt}px`;
        }
        return true;
      }
    }
    return false;
  };

  // 1. Handle main document <section> blocks in strict top-to-bottom order
  const sections = Array.from(sheet.querySelectorAll<HTMLElement>('section'));
  for (const sec of sections) {
    const scaleY = getScaleY();
    const sheetTop = sheet.getBoundingClientRect().top;
    const rect = sec.getBoundingClientRect();
    const top = (rect.top - sheetTop) * scaleY;
    const height = rect.height * scaleY;
    if (height <= 1) continue;

    const bottom = top + height;
    const startPage = Math.max(0, Math.floor(top / A4_HEIGHT_PX));
    const pageSafeBottom = (startPage + 1) * A4_HEIGHT_PX - safeBottom;

    if (bottom <= pageSafeBottom) continue;

    // Whole section fits on a single page -> move ENTIRE section cleanly to next page!
    if (height <= maxSinglePageHeight) {
      pushBlockIfCrossing(sec);
      continue;
    }

    // Extra-tall section (taller than a single page):
    const items = Array.from(sec.querySelectorAll<HTMLElement>('.a4-avoid-break'));
    if (items.length > 0) {
      const firstRect = items[0].getBoundingClientRect();
      const firstBottom = (firstRect.bottom - sheetTop) * scaleY;
      if (firstBottom > pageSafeBottom) {
        const targetTop = (startPage + 1) * A4_HEIGHT_PX + safeTop;
        const delta = Math.ceil(targetTop - top);
        if (delta > 0) {
          const currentMt = parseFloat(window.getComputedStyle(sec).marginTop) || 0;
          sec.style.marginTop = `${currentMt + delta}px`;
          sec.dataset.kagojBreakMargin = '1';
        }
      }
    }

    for (const item of items) {
      if (item.tagName === 'TR') continue;
      pushBlockIfCrossing(item);
    }
  }

  // 2. Handle sidebar blocks independently for two-column templates
  const sidebarBlocks = Array.from(
    sheet.querySelectorAll<HTMLElement>('aside [data-pdf-block="true"]')
  );
  for (const blk of sidebarBlocks) {
    pushBlockIfCrossing(blk);
  }

  // 3. Calculate exact true bottom of content
  const maxContentBottom = measureContentBottom(sheet, getScaleY);
  const effectiveBottom = Math.max(maxContentBottom + 16, A4_HEIGHT_PX);
  const totalPages = Math.max(1, Math.ceil((effectiveBottom - 18) / A4_HEIGHT_PX));
  const totalHeight = totalPages * A4_HEIGHT_PX;

  sheet.style.minHeight = `${totalHeight}px`;

  // Extend two-column sidebars cleanly across all pages
  const aside = sheet.querySelector<HTMLElement>('aside');
  if (aside) {
    aside.style.minHeight = `${totalHeight}px`;
  }

  // Replicate Biodata decorative frames cleanly onto each individual A4 page
  if (options.replicatePageFrames && totalPages > 1) {
    const frames = Array.from(
      sheet.querySelectorAll<HTMLElement>('[data-pdf-page-frame="true"]')
    );
    frames.forEach((frame) => {
      frame.style.top = '16px';
      frame.style.bottom = 'auto';
      frame.style.height = `${A4_HEIGHT_PX - 32}px`;

      for (let p = 1; p < totalPages; p++) {
        const clone = frame.cloneNode(true) as HTMLElement;
        clone.dataset.kagojClonedFrame = '1';
        delete clone.dataset.pdfPageFrame;
        clone.style.top = `${p * A4_HEIGHT_PX + 16}px`;
        clone.style.bottom = 'auto';
        clone.style.height = `${A4_HEIGHT_PX - 32}px`;
        sheet.appendChild(clone);
      }
    });
  }

  return {
    totalPages,
    contentHeight: totalHeight,
    fitStatus: pageFormat === '1-page' && totalPages > 1 ? 'overflow' : 'exact',
  };
}
