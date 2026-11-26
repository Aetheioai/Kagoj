import {
  DEFAULT_BIODATA_SECTION_ORDER,
  DEFAULT_CV_SECTION_ORDER,
  DocCustomization,
  WorkspaceState,
} from '../types/builder';
import { EMPTY_BIODATA, EMPTY_CV } from '../data/samples';

const STORAGE_KEY = 'kagoj_bd_workspace_v1';

export function createDefaultCustomization(mode: 'cv' | 'biodata'): DocCustomization {
  return {
    accentColor: '',
    fontStyle: 'auto',
    fontSize: 'standard',
    spacing: 'balanced',
    photoShape: 'rect',
    photoSize: 'md',
    hiddenSections: [],
    sectionOrder:
      mode === 'cv'
        ? [...DEFAULT_CV_SECTION_ORDER]
        : [...DEFAULT_BIODATA_SECTION_ORDER],
  };
}

export function createDefaultWorkspace(): WorkspaceState {
  return {
    version: 3,
    mode: 'cv',
    language: 'en',
    cvFormat: '1-page',
    biodataFormat: '1-page',
    cvTemplateId: 'bd-classic-formal',
    biodataTemplateId: 'royal-border',
    cvStyle: createDefaultCustomization('cv'),
    biodataStyle: createDefaultCustomization('biodata'),
    cv: structuredClone(EMPTY_CV),
    biodata: structuredClone(EMPTY_BIODATA),
  };
}

function mergeCustomization(
  mode: 'cv' | 'biodata',
  incoming?: Partial<DocCustomization>
): DocCustomization {
  const def = createDefaultCustomization(mode);
  if (!incoming) return def;
  const order = Array.isArray(incoming.sectionOrder)
    ? [
        ...incoming.sectionOrder.filter((id) => def.sectionOrder.includes(id)),
        ...def.sectionOrder.filter((id) => !incoming.sectionOrder?.includes(id)),
      ]
    : def.sectionOrder;

  return {
    accentColor: typeof incoming.accentColor === 'string' ? incoming.accentColor : '',
    fontStyle:
      incoming.fontStyle === 'sans' || incoming.fontStyle === 'serif'
        ? incoming.fontStyle
        : 'auto',
    fontSize:
      incoming.fontSize === 'compact' || incoming.fontSize === 'large'
        ? incoming.fontSize
        : 'standard',
    spacing:
      incoming.spacing === 'tight' || incoming.spacing === 'airy'
        ? incoming.spacing
        : 'balanced',
    photoShape:
      incoming.photoShape === 'rounded' || incoming.photoShape === 'circle'
        ? incoming.photoShape
        : 'rect',
    photoSize:
      incoming.photoSize === 'sm' || incoming.photoSize === 'lg'
        ? incoming.photoSize
        : 'md',
    hiddenSections: Array.isArray(incoming.hiddenSections)
      ? incoming.hiddenSections
      : [],
    sectionOrder: order,
  };
}

export function hydrateWorkspace(parsed: Partial<WorkspaceState>): WorkspaceState {
  const base = createDefaultWorkspace();
  const inferredCvFormat =
    parsed.cvFormat === '1-page' || parsed.cvFormat === '2-page'
      ? parsed.cvFormat
      : (parsed.cv?.references?.length || 0) > 0 || (parsed.cv?.trainings?.length || 0) > 0
      ? '2-page'
      : '1-page';
  const inferredBiodataFormat =
    parsed.biodataFormat === '1-page' || parsed.biodataFormat === '2-page'
      ? parsed.biodataFormat
      : hasText(parsed.biodata?.extendedFamilyNote) || hasText(parsed.biodata?.aboutMe)
      ? '2-page'
      : '1-page';

  return {
    version: 3,
    mode: parsed.mode === 'biodata' ? 'biodata' : 'cv',
    language: parsed.language === 'bn' ? 'bn' : 'en',
    cvFormat: inferredCvFormat,
    biodataFormat: inferredBiodataFormat,
    cvTemplateId: parsed.cvTemplateId || base.cvTemplateId,
    biodataTemplateId: parsed.biodataTemplateId || base.biodataTemplateId,
    cvStyle: mergeCustomization('cv', parsed.cvStyle),
    biodataStyle: mergeCustomization('biodata', parsed.biodataStyle),
    cv: {
      ...base.cv,
      ...(parsed.cv || {}),
      personalInfo: {
        ...base.cv.personalInfo,
        ...(parsed.cv?.personalInfo || {}),
      },
      education: Array.isArray(parsed.cv?.education) ? parsed.cv.education : [],
      experience: Array.isArray(parsed.cv?.experience) ? parsed.cv.experience : [],
      projects: Array.isArray(parsed.cv?.projects) ? parsed.cv.projects : [],
      trainings: Array.isArray(parsed.cv?.trainings) ? parsed.cv.trainings : [],
      references: Array.isArray(parsed.cv?.references) ? parsed.cv.references : [],
      customSections: Array.isArray(parsed.cv?.customSections)
        ? parsed.cv.customSections
        : [],
    },
    biodata: {
      ...base.biodata,
      ...(parsed.biodata || {}),
      education: Array.isArray(parsed.biodata?.education) ? parsed.biodata.education : [],
      siblings: Array.isArray(parsed.biodata?.siblings) ? parsed.biodata.siblings : [],
      customSections: Array.isArray(parsed.biodata?.customSections)
        ? parsed.biodata.customSections
        : [],
    },
  };
}

export function loadWorkspaceFromStorage(): WorkspaceState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultWorkspace();
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
    return hydrateWorkspace(parsed);
  } catch {
    return createDefaultWorkspace();
  }
}

export function saveWorkspaceToStorage(state: WorkspaceState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearWorkspaceStorage(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage error
  }
}

export function hasText(val: string | undefined | null): boolean {
  return Boolean(val && val.trim().length > 0);
}

export function makeId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function calculateAgeFromDob(dob: string): number | null {
  if (!dob) return null;
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const m = today.getMonth() - parsed.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < parsed.getDate())) {
    age -= 1;
  }
  return age >= 0 && age < 120 ? age : null;
}

export function formatDisplayDate(isoDate: string, lang: 'en' | 'bn'): string {
  if (!isoDate) return '';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  try {
    return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsed);
  } catch {
    return isoDate;
  }
}

export function toBanglaDigits(value: string | number): string {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(value).replace(/\d/g, (d) => bn[Number(d)] ?? d);
}

export function tintHex(hex: string, alpha = 0.08): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return '#f5f5f5';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return '#f5f5f5';
  const mix = (c: number) => Math.round(c * alpha + 255 * (1 - alpha));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/**
 * Resizes and compresses an uploaded photo strictly on-device via Canvas
 * so localStorage remains fast and under quota.
 */
export function processUploadedPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const maxSide = 480;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxSide) {
          height = Math.round((height * maxSide) / width);
          width = maxSide;
        } else if (height >= width && height > maxSide) {
          width = Math.round((width * maxSide) / height);
          height = maxSide;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function downloadWorkspaceBackup(state: WorkspaceState): void {
  const payload = {
    ...state,
    exportedAt: new Date().toISOString(),
    app: 'Kagoj Bangladeshi CV & Biodata Builder',
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const datePart = new Date().toISOString().slice(0, 10);
  const nameRaw =
    state.mode === 'cv'
      ? state.cv.fullName || 'cv'
      : state.biodata.fullName || 'biodata';
  const safeName = nameRaw
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09ff]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32);
  a.href = url;
  a.download = `kagoj-${state.mode}-${safeName || 'backup'}-${datePart}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseBackupFile(file: File): Promise<WorkspaceState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read backup file.'));
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<WorkspaceState>;
        if (!parsed || (!parsed.cv && !parsed.biodata)) {
          reject(new Error('This file is not a valid Kagoj backup.'));
          return;
        }
        resolve(hydrateWorkspace(parsed));
      } catch {
        reject(new Error('Invalid JSON backup format.'));
      }
    };
    reader.readAsText(file);
  });
}

export function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

export function hasAnyCVData(cv: WorkspaceState['cv']): boolean {
  return Boolean(
    hasText(cv.fullName) ||
      hasText(cv.phone) ||
      hasText(cv.email) ||
      hasText(cv.careerObjective) ||
      cv.education.length > 0 ||
      cv.experience.length > 0
  );
}

export function hasAnyBiodataData(b: WorkspaceState['biodata']): boolean {
  return Boolean(
    hasText(b.fullName) ||
      hasText(b.occupation) ||
      hasText(b.fatherName) ||
      hasText(b.motherName) ||
      b.education.length > 0 ||
      hasText(b.guardianPhone)
  );
}
