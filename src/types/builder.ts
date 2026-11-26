export type AppMode = 'cv' | 'biodata';
export type DocLanguage = 'en' | 'bn';
export type PageFormat = '1-page' | '2-page';

export interface CustomSectionEntry {
  id: string;
  title: string;
  content: string;
}

export interface DocCustomization {
  accentColor: string; // '' means template default
  fontStyle: 'auto' | 'sans' | 'serif';
  fontSize: 'compact' | 'standard' | 'large';
  spacing: 'tight' | 'balanced' | 'airy';
  photoShape: 'rect' | 'rounded' | 'circle';
  photoSize: 'sm' | 'md' | 'lg';
  hiddenSections: string[];
  sectionOrder: string[];
}

export const DEFAULT_CV_SECTION_ORDER = [
  'objective',
  'experience',
  'education',
  'skills',
  'projects',
  'trainings',
  'custom',
  'personal',
  'references',
  'declaration',
] as const;

export const DEFAULT_BIODATA_SECTION_ORDER = [
  'personal',
  'careerEducation',
  'family',
  'address',
  'about',
  'expectations',
  'custom',
  'guardian',
] as const;

export interface EducationEntry {
  id: string;
  examTitle: string;
  groupOrMajor: string;
  institution: string;
  boardOrUniversity: string;
  passingYear: string;
  result: string;
  scale: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  location: string;
  duration: string;
  bullets: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  link: string;
}

export interface TrainingEntry {
  id: string;
  title: string;
  organization: string;
  year: string;
  duration: string;
}

export interface ReferenceEntry {
  id: string;
  name: string;
  designation: string;
  organization: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface CVPersonalInfo {
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  gender: string;
  bloodGroup: string;
  permanentAddress: string;
  nidNumber: string;
}

export interface CVData {
  fullName: string;
  headline: string;
  phone: string;
  email: string;
  presentAddress: string;
  portfolioLink: string;
  photo: string;
  showPhoto: boolean;
  careerObjective: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  technicalSkills: string;
  softwareTools: string;
  languages: string;
  projects: ProjectEntry[];
  trainings: TrainingEntry[];
  personalInfo: CVPersonalInfo;
  references: ReferenceEntry[];
  declaration: string;
  declarationDate: string;
  signatureName: string;
  customSections: CustomSectionEntry[];
}

export type InvocationPreset =
  | 'bismillah_ar_en'
  | 'bismillah_ar_bn'
  | 'bismillah_ar'
  | 'om'
  | 'shri_durga_bn'
  | 'christian_blessing'
  | 'buddhist_namo'
  | 'neutral'
  | 'custom'
  | 'none';

export interface SiblingEntry {
  id: string;
  relation: string;
  details: string;
}

export interface BiodataData {
  invocationPreset: InvocationPreset;
  customInvocation: string;
  photo: string;
  showPhoto: boolean;
  // Personal
  fullName: string;
  gender: string;
  dateOfBirth: string;
  ageOverride: string;
  height: string;
  bloodGroup: string;
  maritalStatus: string;
  religion: string;
  nationality: string;
  complexion: string;
  weight: string;
  lifestylePractice: string;
  // Education & Career
  occupation: string;
  workplace: string;
  income: string;
  education: EducationEntry[];
  // Family
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: SiblingEntry[];
  extendedFamilyNote: string;
  familyBackgroundNote: string;
  // Address
  presentAddress: string;
  permanentVillage: string;
  permanentUpazila: string;
  permanentDistrict: string;
  // About & Expectations
  aboutMe: string;
  hobbies: string;
  expectedAge: string;
  expectedHeight: string;
  expectedEducation: string;
  expectedProfession: string;
  expectedLocation: string;
  expectedQualities: string;
  // Guardian
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  customSections: CustomSectionEntry[];
}

export type CVTemplateCategory =
  | 'all'
  | 'formal'
  | 'corporate'
  | 'sidebar'
  | 'tech'
  | 'compact';

export type BiodataTemplateCategory =
  | 'all'
  | 'royal'
  | 'floral'
  | 'islamic'
  | 'hindu'
  | 'christian_buddhist'
  | 'modern'
  | 'whatsapp';

export interface TemplateMeta {
  id: string;
  mode: AppMode;
  name: string;
  nameBn: string;
  category: CVTemplateCategory | BiodataTemplateCategory;
  description: string;
  descriptionBn: string;
  accent: string;
  secondary: string;
  paperTint: string;
  serif?: boolean;
}

export interface WorkspaceState {
  version: number;
  mode: AppMode;
  language: DocLanguage;
  cvFormat: PageFormat;
  biodataFormat: PageFormat;
  cvTemplateId: string;
  biodataTemplateId: string;
  cvStyle: DocCustomization;
  biodataStyle: DocCustomization;
  cv: CVData;
  biodata: BiodataData;
}
