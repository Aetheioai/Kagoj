export type AppMode =
  | 'cv'
  | 'biodata'
  | 'job_app'
  | 'office_letter'
  | 'poster'
  | 'invoice';
export type DocLanguage = 'en' | 'bn';
export type PageFormat = '1-page' | '2-page';
export type PosterAspectRatio =
  | 'a4-portrait'
  | 'a4-landscape'
  | '1:1'
  | '4:5'
  | '9:16'
  | '16:9';

export interface PosterAspectSpec {
  id: PosterAspectRatio;
  width: number;
  height: number;
  pdfWidthMm: number;
  pdfHeightMm: number;
  shortEn: string;
  shortBn: string;
  labelEn: string;
  labelBn: string;
  hintEn: string;
  hintBn: string;
}

export const POSTER_ASPECT_RATIOS: PosterAspectSpec[] = [
  {
    id: 'a4-portrait',
    width: 794,
    height: 1123,
    pdfWidthMm: 210,
    pdfHeightMm: 297,
    shortEn: 'A4 Portrait',
    shortBn: 'A4 লম্বা',
    labelEn: 'A4 Portrait (Wall Print)',
    labelBn: 'A4 লম্বা (দেয়াল প্রিন্ট)',
    hintEn: 'Standard wall & gate print',
    hintBn: 'দেয়াল ও গেটে লাগানোর প্রিন্ট',
  },
  {
    id: 'a4-landscape',
    width: 1123,
    height: 794,
    pdfWidthMm: 297,
    pdfHeightMm: 210,
    shortEn: 'A4 Wide',
    shortBn: 'A4 আড়াআড়ি',
    labelEn: 'A4 Landscape (Board)',
    labelBn: 'A4 আড়াআড়ি (বোর্ড)',
    hintEn: 'Horizontal gate & lift board',
    hintBn: 'গেট বা লিফট নোটিশ বোর্ড',
  },
  {
    id: '1:1',
    width: 900,
    height: 900,
    pdfWidthMm: 210,
    pdfHeightMm: 210,
    shortEn: '1:1 Square',
    shortBn: '১:১ বর্গ',
    labelEn: '1:1 Square (FB / WhatsApp)',
    labelBn: '১:১ বর্গ (ফেসবুক / হোয়াটসঅ্যাপ)',
    hintEn: 'Facebook To-Let groups & WhatsApp',
    hintBn: 'ফেসবুক টু-লেট গ্রুপ ও হোয়াটসঅ্যাপ',
  },
  {
    id: '4:5',
    width: 864,
    height: 1080,
    pdfWidthMm: 210,
    pdfHeightMm: 262.5,
    shortEn: '4:5 Post',
    shortBn: '৪:৫ পোস্ট',
    labelEn: '4:5 Portrait (FB / IG Feed)',
    labelBn: '৪:৫ পোর্ট্রেট (ফেসবুক ফিড)',
    hintEn: 'Tall mobile feed post',
    hintBn: 'মোবাইল ফিডে বড় দেখায়',
  },
  {
    id: '9:16',
    width: 720,
    height: 1280,
    pdfWidthMm: 168.75,
    pdfHeightMm: 300,
    shortEn: '9:16 Story',
    shortBn: '৯:১৬ স্টোরি',
    labelEn: '9:16 Story / Status',
    labelBn: '৯:১৬ স্টোরি / স্ট্যাটাস',
    hintEn: 'WhatsApp Status, FB & IG Story',
    hintBn: 'হোয়াটসঅ্যাপ ও ফেসবুক স্টোরি',
  },
  {
    id: '16:9',
    width: 1280,
    height: 720,
    pdfWidthMm: 297,
    pdfHeightMm: 167.06,
    shortEn: '16:9 Banner',
    shortBn: '১৬:৯ ব্যানার',
    labelEn: '16:9 Widescreen Banner',
    labelBn: '১৬:৯ ওয়াইড ব্যানার',
    hintEn: 'FB cover, screen & wide banner',
    hintBn: 'ফেসবুক কভার ও ওয়াইড ব্যানার',
  },
];

export function getPosterAspectSpec(ratio?: PosterAspectRatio): PosterAspectSpec {
  return (
    POSTER_ASPECT_RATIOS.find((r) => r.id === ratio) ?? POSTER_ASPECT_RATIOS[0]
  );
}

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
  // Universal & mode-specific customizable controls
  borderStyle?: 'default' | 'clean' | 'framed';
  signatureSize?: 'sm' | 'md' | 'lg';
  showSignatureImage?: boolean;
  // Poster controls
  posterAspectRatio?: PosterAspectRatio;
  showTearOffStrips?: boolean;
  tearOffCount?: number; // 5..8
  showPriceBanner?: boolean;
  // Invoice controls
  currencySymbol?: string; // '৳', 'BDT', '$', etc.
  invoiceStamp?: 'none' | 'paid' | 'due' | 'partial' | 'quotation';
  showLogo?: boolean;
  showPaymentBlock?: boolean;
  showTakaWords?: boolean;
  showUnitCol?: boolean;
  showCustomerSig?: boolean;
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

export const DEFAULT_JOB_APP_SECTION_ORDER = [
  'recipient',
  'subject',
  'body',
  'enclosures',
  'custom',
  'signature',
] as const;

export const DEFAULT_OFFICE_LETTER_SECTION_ORDER = [
  'letterhead',
  'recipient',
  'through',
  'subject',
  'body',
  'cc',
  'custom',
  'signature',
] as const;

export const DEFAULT_POSTER_SECTION_ORDER = [
  'headline',
  'price',
  'details',
  'features',
  'address',
  'custom',
  'strips',
] as const;

export const DEFAULT_INVOICE_SECTION_ORDER = [
  'parties',
  'items',
  'totals',
  'takaWords',
  'payment',
  'notes',
  'custom',
  'signatures',
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
  signatureImage?: string;
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

// =========================================================================
// 3. JOB APPLICATION & COVER LETTER (চাকরির আবেদনপত্র / কভার লেটার)
// =========================================================================
export interface JobAppData {
  presetKey: string;
  date: string;
  referenceNo: string;
  // Applicant (Sender)
  senderName: string;
  senderTitle: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  senderPortfolio: string;
  // Recipient
  recipientLabel: string; // e.g. 'To' / 'বরাবর'
  recipientName: string;
  recipientTitle: string;
  organization: string;
  organizationAddress: string;
  // Letter Body
  subject: string;
  salutation: string;
  openingParagraph: string;
  bodyParagraph: string;
  closingParagraph: string;
  // Closing & Signature
  signOff: string;
  signatureName: string;
  signatureImage: string;
  enclosures: string; // newline-separated list
  customSections: CustomSectionEntry[];
}

// =========================================================================
// 4. OFFICE LETTERS & FORMAL APPLICATIONS (দরখাস্ত ও চিঠি)
// =========================================================================
export interface OfficeLetterData {
  presetKey: string;
  // Optional Official Letterhead
  orgHeaderName: string;
  orgHeaderSub: string;
  orgLogo: string;
  showLogo: boolean;
  memoNo: string; // সূত্র / স্মারক নং
  date: string;
  // Recipient & Hierarchy
  recipientLabel: string; // 'To' / 'বরাবর'
  recipientTitle: string;
  organization: string;
  organizationAddress: string;
  throughLine: string; // মাধ্যম (Through proper channel)
  // Core Letter
  subject: string;
  salutation: string;
  bodyText: string;
  // Sender / Signatory
  signOff: string;
  senderName: string;
  senderDesignation: string;
  senderIdOrDept: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  signatureImage: string;
  ccList: string; // অনুলিপি (newline-separated)
  customSections: CustomSectionEntry[];
}

// =========================================================================
// 5. TO-LET & PRIVATE TUITION POSTERS (টু-লেট / টিউশন পোস্টার)
// =========================================================================
export type PosterKind = 'tolet' | 'tuition' | 'notice';

export interface PosterDetailRow {
  id: string;
  label: string;
  value: string;
}

export interface PosterData {
  kind: PosterKind;
  badgeText: string; // e.g. 'FAMILY FLAT' / 'ফ্যামিলি বাসা' / 'HOME TUTOR'
  headline: string; // e.g. 'TO-LET' / 'টু-লেট' / 'প্রাইভেট পড়ানো হয়'
  subHeadline: string;
  priceLabel: string; // e.g. 'Monthly Rent' / 'মাসিক ভাড়া' / 'Honorarium'
  priceAmount: string; // e.g. '৳ 22,000 / month'
  priceNote: string; // e.g. 'Negotiable · Gas & Water included'
  photo: string;
  showPhoto: boolean;
  details: PosterDetailRow[];
  featuresTitle: string;
  features: string; // newline-separated bullet checklist
  addressTitle: string;
  address: string;
  contactLabel: string;
  contactName: string;
  contactPhone: string;
  contactNote: string;
  tearOffLabel: string; // short label on each vertical tear-off tab
  customSections: CustomSectionEntry[];
}

// =========================================================================
// 6. INVOICE, CASH MEMO & QUOTATION (ইনভয়েস / ক্যাশ মেমো / কোটেশন)
// =========================================================================
export type InvoiceDocKind = 'invoice' | 'cash_memo' | 'quotation' | 'bill';

export interface InvoiceLineItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
}

export interface InvoiceData {
  docKind: InvoiceDocKind;
  customDocTitle: string;
  // Seller / Business
  businessName: string;
  businessTagline: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite: string;
  businessRegNo: string; // BIN / TIN / Trade License
  logo: string;
  showLogo: boolean;
  // Document Metadata
  invoiceNo: string;
  date: string;
  dueDate: string;
  orderRef: string;
  // Buyer / Client
  clientName: string;
  clientCompany: string;
  clientPhone: string;
  clientAddress: string;
  // Line Items
  items: InvoiceLineItem[];
  // Adjustments & Totals
  discountType: 'percent' | 'fixed';
  discountValue: number;
  vatPercent: number;
  shippingCharge: number;
  advancePaid: number;
  takaWordsOverride: string;
  // Bangladeshi Payment Block
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  bankDetails: string;
  // Notes & Signatures
  notes: string;
  terms: string;
  authorizedName: string;
  authorizedTitle: string;
  signatureImage: string;
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

export type JobAppTemplateCategory =
  | 'all'
  | 'formal_bn'
  | 'corporate'
  | 'modern'
  | 'sidebar'
  | 'ngo_academic';

export type OfficeLetterTemplateCategory =
  | 'all'
  | 'bangla_dorokhasto'
  | 'corporate_hr'
  | 'bank_institutional'
  | 'campus'
  | 'notice';

export type PosterTemplateCategory =
  | 'all'
  | 'family_tolet'
  | 'bachelor_sublet'
  | 'commercial'
  | 'tuition'
  | 'notice';

export type InvoiceTemplateCategory =
  | 'all'
  | 'cash_memo'
  | 'corporate_vat'
  | 'fcommerce'
  | 'freelancer'
  | 'quotation';

export type AnyTemplateCategory =
  | CVTemplateCategory
  | BiodataTemplateCategory
  | JobAppTemplateCategory
  | OfficeLetterTemplateCategory
  | PosterTemplateCategory
  | InvoiceTemplateCategory;

export interface TemplateMeta {
  id: string;
  mode: AppMode;
  name: string;
  nameBn: string;
  category: AnyTemplateCategory;
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
  // Selected template per mode
  cvTemplateId: string;
  biodataTemplateId: string;
  jobAppTemplateId: string;
  officeLetterTemplateId: string;
  posterTemplateId: string;
  invoiceTemplateId: string;
  // Customization per mode
  cvStyle: DocCustomization;
  biodataStyle: DocCustomization;
  jobAppStyle: DocCustomization;
  officeLetterStyle: DocCustomization;
  posterStyle: DocCustomization;
  invoiceStyle: DocCustomization;
  // Document drafts per mode
  cv: CVData;
  biodata: BiodataData;
  jobApp: JobAppData;
  officeLetter: OfficeLetterData;
  poster: PosterData;
  invoice: InvoiceData;
}
