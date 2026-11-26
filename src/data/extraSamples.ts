import {
  DocLanguage,
  InvoiceData,
  JobAppData,
  OfficeLetterData,
  PosterData,
} from '../types/builder';

const TODAY_ISO = new Date().toISOString().slice(0, 10);

// =========================================================================
// 1. JOB APPLICATION & COVER LETTER — EMPTY, SAMPLES & 6 PRESETS
// =========================================================================
export const EMPTY_JOB_APP: JobAppData = {
  presetKey: 'bank_mto',
  date: TODAY_ISO,
  referenceNo: '',
  senderName: '',
  senderTitle: '',
  senderPhone: '',
  senderEmail: '',
  senderAddress: '',
  senderPortfolio: '',
  recipientLabel: 'To',
  recipientName: '',
  recipientTitle: '',
  organization: '',
  organizationAddress: '',
  subject: '',
  salutation: 'Dear Sir / Madam,',
  openingParagraph: '',
  bodyParagraph: '',
  closingParagraph: '',
  signOff: 'Sincerely yours,',
  signatureName: '',
  signatureImage: '',
  enclosures: '',
  customSections: [],
};

export const SAMPLE_JOB_APP_EN: JobAppData = {
  presetKey: 'bank_mto',
  date: TODAY_ISO,
  referenceNo: '',
  senderName: 'Tanvir Ahmed Chowdhury',
  senderTitle: 'MBA (Finance), University of Dhaka',
  senderPhone: '+880 1712-485920',
  senderEmail: 'tanvir.chowdhury@example.com',
  senderAddress: 'House 24, Road 9/A, Dhanmondi, Dhaka-1209',
  senderPortfolio: 'linkedin.com/in/tanvir-chowdhury-bd',
  recipientLabel: 'To',
  recipientName: 'Head of Human Resources',
  recipientTitle: 'Human Resources Division',
  organization: 'Eastern Mercantile Bank PLC',
  organizationAddress: 'Head Office, Motijheel C/A, Dhaka-1000',
  subject: 'Application for the position of Management Trainee Officer (MTO)',
  salutation: 'Dear Sir / Madam,',
  openingParagraph:
    'With reference to your recent recruitment announcement, I am writing to express my strong interest in the position of Management Trainee Officer (MTO) at Eastern Mercantile Bank PLC. Having completed my MBA and BBA in Finance from the University of Dhaka with a CGPA of 3.78/4.00, I am eager to contribute analytical rigor and dedicated client service to your banking team.',
  bodyParagraph:
    'During my internship with BRAC Social Innovation & Finance Unit and my academic research on liquidity management in Bangladeshi commercial banks, I gained hands-on experience in credit appraisal, financial modeling in Excel and Power BI, and Bangladesh Bank compliance guidelines. I thrive in fast-paced collaborative environments and take pride in delivering accurate work under strict deadlines.',
  closingParagraph:
    'I would welcome the opportunity to discuss how my academic background, financial skills, and enthusiasm align with your institution. Thank you sincerely for your time and consideration.',
  signOff: 'Sincerely yours,',
  signatureName: 'Tanvir Ahmed Chowdhury',
  signatureImage: '',
  enclosures:
    '1. Curriculum Vitae (CV)\n2. Attested copies of Academic Certificates (SSC, HSC, BBA & MBA)\n3. Two (02) passport-size photographs & NID copy',
  customSections: [],
};

export const SAMPLE_JOB_APP_BN: JobAppData = {
  presetKey: 'bank_mto',
  date: TODAY_ISO,
  referenceNo: '',
  senderName: 'তানভীর আহমেদ চৌধুরী',
  senderTitle: 'এমবিএ (ফিন্যান্স), ঢাকা বিশ্ববিদ্যালয়',
  senderPhone: '০১৭১২-৪৮৫৯২০',
  senderEmail: 'tanvir.chowdhury@example.com',
  senderAddress: 'বাসা ২৪, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯',
  senderPortfolio: '',
  recipientLabel: 'বরাবর',
  recipientName: 'মহাব্যবস্থাপক / প্রধান',
  recipientTitle: 'মানবসম্পদ বিভাগ',
  organization: 'ইস্টার্ন মার্কেন্টাইল ব্যাংক পিএলসি',
  organizationAddress: 'প্রধান কার্যালয়, মতিঝিল বা/এ, ঢাকা-১০০০',
  subject: 'ম্যানেজমেন্ট ট্রেইনি অফিসার (MTO) পদে চাকরির জন্য আবেদন।',
  salutation: 'মহোদয়,',
  openingParagraph:
    'যথাবিহিত সম্মানপূর্বক বিনীত নিবেদন এই যে, সম্প্রতি প্রকাশিত নিয়োগ বিজ্ঞপ্তির মাধ্যমে জানতে পারলাম আপনার স্বনামধন্য প্রতিষ্ঠানে "ম্যানেজমেন্ট ট্রেইনি অফিসার" পদে জনবল নিয়োগ দেওয়া হবে। উক্ত পদের একজন আগ্রহী প্রার্থী হিসেবে আমি আমার জীবনবৃত্তান্ত ও প্রয়োজনীয় তথ্যাদি আপনার সদয় বিবেচনার জন্য পেশ করছি।',
  bodyParagraph:
    'আমি ঢাকা বিশ্ববিদ্যালয়ের ব্যবসায় শিক্ষা অনুষদ থেকে ফিন্যান্স বিষয়ে স্নাতক (সম্মান) ও এমবিএ (সিজিপিএ ৩.৭৮/৪.০০) সম্পন্ন করেছি। পাশাপাশি আর্থিক বিশ্লেষণ, এক্সেল রিপোর্টিং এবং ব্যাংকিং বিধিমালা সম্পর্কে আমার বাস্তব অভিজ্ঞতা রয়েছে। সততা, নিষ্ঠা ও দলগত কাজের মাধ্যমে আপনার প্রতিষ্ঠানের লক্ষ্য অর্জনে ভূমিকা রাখতে আমি দৃঢ়প্রতিজ্ঞ।',
  closingParagraph:
    'অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা এই যে, আমাকে উক্ত পদে সাক্ষাৎকারের সুযোগ প্রদান করে বাধিত করবেন।',
  signOff: 'বিনীত নিবেদক,',
  signatureName: 'তানভীর আহমেদ চৌধুরী',
  signatureImage: '',
  enclosures:
    '১. পূর্ণাঙ্গ জীবনবৃত্তান্ত (CV)\n২. সকল শিক্ষাগত যোগ্যতার সনদের সত্যায়িত অনুলিপি\n৩. সদ্য তোলা ২ কপি পাসপোর্ট সাইজের ছবি ও জাতীয় পরিচয়পত্রের ফটোকপি',
  customSections: [],
};

export interface JobAppPreset {
  key: string;
  labelEn: string;
  labelBn: string;
  patchEn: Partial<JobAppData>;
  patchBn: Partial<JobAppData>;
}

export const JOB_APP_PRESETS: JobAppPreset[] = [
  {
    key: 'bank_mto',
    labelEn: 'Bank / MTO',
    labelBn: 'ব্যাংক / এমটিও',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'Head of Human Resources',
      subject: 'Application for the position of Management Trainee Officer (MTO)',
      salutation: 'Dear Sir / Madam,',
      openingParagraph: SAMPLE_JOB_APP_EN.openingParagraph,
      bodyParagraph: SAMPLE_JOB_APP_EN.bodyParagraph,
      closingParagraph: SAMPLE_JOB_APP_EN.closingParagraph,
      signOff: 'Sincerely yours,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'মহাব্যবস্থাপক, মানবসম্পদ বিভাগ',
      subject: 'ম্যানেজমেন্ট ট্রেইনি অফিসার (MTO) পদে চাকরির জন্য আবেদন।',
      salutation: 'মহোদয়,',
      openingParagraph: SAMPLE_JOB_APP_BN.openingParagraph,
      bodyParagraph: SAMPLE_JOB_APP_BN.bodyParagraph,
      closingParagraph: SAMPLE_JOB_APP_BN.closingParagraph,
      signOff: 'বিনীত নিবেদক,',
    },
  },
  {
    key: 'corporate_mnc',
    labelEn: 'Corporate / MNC',
    labelBn: 'কর্পোরেট / মাল্টিন্যাশনাল',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'Talent Acquisition Manager',
      subject: 'Application for Executive — Business Operations',
      salutation: 'Dear Hiring Manager,',
      openingParagraph:
        'I am excited to apply for the Executive — Business Operations role at your organization. With strong analytical training, cross-functional communication skills, and proven experience streamlining reporting workflows, I am confident in my ability to add immediate value to your team.',
      bodyParagraph:
        'In my previous engagements, I collaborated across sales, finance, and operations teams to track KPIs, reduce turnaround time, and prepare executive presentations. I am particularly drawn to your organization’s reputation for operational excellence in Bangladesh.',
      closingParagraph:
        'Thank you for considering my application. I look forward to the opportunity to speak with you in an interview.',
      signOff: 'Best regards,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'ব্যবস্থাপক, মানবসম্পদ বিভাগ',
      subject: 'এক্সিকিউটিভ (অপারেশনস) পদে নিয়োগের জন্য আবেদন।',
      salutation: 'জনাব,',
      openingParagraph:
        'বিনীত নিবেদন এই যে, আপনার স্বনামধন্য প্রতিষ্ঠানে "এক্সিকিউটিভ" পদে নিয়োগ বিজ্ঞপ্তির পরিপ্রেক্ষিতে আমি একজন আগ্রহী প্রার্থী হিসেবে আবেদন করছি।',
      bodyParagraph:
        'প্রাতিষ্ঠানিক কাজের অভিজ্ঞতা, কম্পিউটার ও অফিস সফটওয়্যারে দক্ষতা এবং সময়নিষ্ঠার মাধ্যমে আমি দ্রুত যেকোনো দায়িত্ব গ্রহণে সক্ষম। আপনার প্রতিষ্ঠানের মানসম্মত কর্মপরিবেশে কাজ করে নিজের দক্ষতা কাজে লাগাতে আমি অত্যন্ত আগ্রহী।',
      closingParagraph:
        'অতএব, আমাকে সাক্ষাৎকারের সুযোগ দিয়ে বাধিত করার জন্য বিনীত অনুরোধ জানাচ্ছি।',
      signOff: 'বিনীত নিবেদক,',
    },
  },
  {
    key: 'software_tech',
    labelEn: 'Software / IT',
    labelBn: 'সফটওয়্যার ও আইটি',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'Engineering Manager / HR Lead',
      subject: 'Application for Software Engineer (Full-Stack)',
      salutation: 'Dear Hiring Team,',
      openingParagraph:
        'I am writing to apply for the Software Engineer position. As a developer passionate about building fast, reliable web applications with TypeScript, React, and modern backend tooling, I admire the products your engineering team ships.',
      bodyParagraph:
        'Across academic and production projects, I have designed responsive interfaces, optimized API performance, and written clean, maintainable code under agile release cycles. I enjoy solving real user problems and collaborating closely with designers and product engineers.',
      closingParagraph:
        'I have attached my CV and portfolio links for your review and would love to discuss how I can contribute to your engineering roadmap.',
      signOff: 'Warm regards,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'প্রধান প্রকৌশলী / মানবসম্পদ বিভাগ',
      subject: 'সফটওয়্যার ইঞ্জিনিয়ার পদে চাকরির জন্য আবেদন।',
      salutation: 'মহোদয়,',
      openingParagraph:
        'সবিনয় নিবেদন এই যে, আপনার প্রতিষ্ঠানের "সফটওয়্যার ইঞ্জিনিয়ার" পদে চাকরির বিজ্ঞপ্তি দেখে আমি আবেদন করছি। আধুনিক ওয়েব ও সফটওয়্যার ডেভেলপমেন্টে আমার দৃঢ় ভিত্তি ও বাস্তব প্রজেক্ট অভিজ্ঞতা রয়েছে।',
      bodyParagraph:
        'পরিচ্ছন্ন কোড লেখা, দ্রুত সমস্যা সমাধান এবং দলগতভাবে কাজ করাই আমার মূল শক্তি। আমার পোর্টফোলিও ও জীবনবৃত্তান্ত সংযুক্ত করা হলো।',
      closingParagraph:
        'আশা করি আমাকে একটি কারিগরি সাক্ষাৎকারের সুযোগ দিয়ে বাধিত করবেন।',
      signOff: 'বিনীত নিবেদক,',
    },
  },
  {
    key: 'ngo_dev',
    labelEn: 'NGO / Development',
    labelBn: 'এনজিও ও উন্নয়ন সংস্থা',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'Human Resources & People Division',
      subject: 'Application for Programme Officer — Community Development',
      salutation: 'Dear Sir / Madam,',
      openingParagraph:
        'I am writing to apply for the position of Programme Officer with your organization. Deeply committed to inclusive community development in Bangladesh, I bring practical fieldwork experience, strong report-writing ability in both Bangla and English, and data-driven monitoring skills.',
      bodyParagraph:
        'I have coordinated field surveys across multiple districts, compiled donor compliance reports, and worked directly with local stakeholders. I am eager to bring this ground-level insight and dedication to your ongoing programmes.',
      closingParagraph:
        'Thank you for your valuable time. I would be honored to discuss my qualifications in greater detail.',
      signOff: 'Yours faithfully,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'পরিচালক, মানবসম্পদ বিভাগ',
      subject: 'প্রোগ্রাম অফিসার পদে চাকরির জন্য আবেদন।',
      salutation: 'মহোদয়,',
      openingParagraph:
        'যথাবিহিত সম্মানপূর্বক নিবেদন এই যে, বাংলাদেশের সামাজিক উন্নয়নমূলক কর্মকাণ্ডে সম্পৃক্ত হওয়ার আগ্রহ থেকে আপনার সংস্থার "প্রোগ্রাম অফিসার" পদে আবেদন করছি।',
      bodyParagraph:
        'মাঠপর্যায়ে জরিপ পরিচালনা, বাংলা ও ইংরেজিতে প্রতিবেদন তৈরি এবং স্থানীয় জনগোষ্ঠীর সাথে সমন্বয় করে কাজ করার বাস্তব অভিজ্ঞতা আমার রয়েছে।',
      closingParagraph:
        'আমাকে উক্ত পদে বিবেচনা ও সাক্ষাৎকারের সুযোগ প্রদানের জন্য বিনীত অনুরোধ জানাচ্ছি।',
      signOff: 'বিনীত নিবেদক,',
    },
  },
  {
    key: 'teaching',
    labelEn: 'Teaching / Lecturer',
    labelBn: 'শিক্ষকতা / প্রভাষক',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'The Principal / Chairman',
      subject: 'Application for the post of Lecturer',
      salutation: 'Respected Sir / Madam,',
      openingParagraph:
        'With due respect, I wish to offer myself as a candidate for the post of Lecturer at your esteemed institution. Holding a strong academic record and a deep passion for mentoring students, I am eager to contribute to your department.',
      bodyParagraph:
        'My academic journey has equipped me with clear subject mastery, structured lesson planning, and a student-centered teaching approach that encourages curiosity and disciplined learning.',
      closingParagraph:
        'I kindly request you to grant me an opportunity for a demonstration class and interview at your convenience.',
      signOff: 'Yours obediently,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'অধ্যক্ষ / প্রধান শিক্ষক',
      subject: 'সহকারী শিক্ষক / প্রভাষক পদে চাকরির জন্য আবেদন।',
      salutation: 'মহোদয়,',
      openingParagraph:
        'যথাবিহিত সম্মানপূর্বক বিনীত নিবেদন এই যে, আপনার স্বনামধন্য শিক্ষা প্রতিষ্ঠানে শিক্ষক/প্রভাষক পদে নিয়োগ বিজ্ঞপ্তির পরিপ্রেক্ষিতে আমি একজন আগ্রহী প্রার্থী হিসেবে আবেদন করছি।',
      bodyParagraph:
        'স্নাতক ও স্নাতকোত্তর পর্যায়ে ভালো ফলাফলের পাশাপাশি শিক্ষার্থীদের সহজবোধ্যভাবে পাঠদানের প্রতি আমার গভীর আগ্রহ ও অভিজ্ঞতা রয়েছে।',
      closingParagraph:
        'অতএব, মহোদয়ের নিকট বিনীত আবেদন আমাকে একটি সাক্ষাৎকার ও ডেমো ক্লাসের সুযোগ দিয়ে বাধিত করবেন।',
      signOff: 'বিনীত নিবেদক,',
    },
  },
  {
    key: 'fresher',
    labelEn: 'Fresh Graduate',
    labelBn: 'ফ্রেশ গ্র্যাজুয়েট',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'Human Resources Department',
      subject: 'Application for Entry-Level / Internship Position',
      salutation: 'Dear Sir / Madam,',
      openingParagraph:
        'As a recent university graduate eager to launch my professional career, I am writing to apply for an entry-level position at your respected organization.',
      bodyParagraph:
        'Though early in my career, I bring a solid academic foundation, strong proficiency in MS Office and digital tools, quick adaptability, and genuine enthusiasm to learn from experienced professionals while delivering dependable work.',
      closingParagraph:
        'I would greatly appreciate the opportunity to prove my dedication in an interview. Thank you for your time.',
      signOff: 'Sincerely yours,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'মানবসম্পদ বিভাগ',
      subject: 'শিক্ষানবিশ / জুনিয়র অফিসার পদে চাকরির আবেদন।',
      salutation: 'মহোদয়,',
      openingParagraph:
        'সবিনয় নিবেদন এই যে, সদ্য স্নাতক সম্পন্নকারী একজন উদ্যমী তরুণ হিসেবে আপনার স্বনামধন্য প্রতিষ্ঠানে কর্মজীবন শুরু করার আগ্রহ থেকে আবেদন করছি।',
      bodyParagraph:
        'দৃঢ় একাডেমিক ভিত্তি, দ্রুত শেখার আগ্রহ, কম্পিউটার দক্ষতা এবং দায়িত্বশীল মানসিকতার মাধ্যমে আমি প্রতিষ্ঠানের উন্নয়নে কার্যকর ভূমিকা রাখতে পারব বলে বিশ্বাস করি।',
      closingParagraph:
        'আমাকে আপনার প্রতিষ্ঠানে কাজের ও সাক্ষাৎকারের সুযোগ দিয়ে বাধিত করবেন।',
      signOff: 'বিনীত নিবেদক,',
    },
  },
];

// =========================================================================
// 2. OFFICE LETTERS & FORMAL APPLICATIONS — EMPTY, SAMPLES & 8 PRESETS
// =========================================================================
export const EMPTY_OFFICE_LETTER: OfficeLetterData = {
  presetKey: 'leave',
  orgHeaderName: '',
  orgHeaderSub: '',
  orgLogo: '',
  showLogo: false,
  memoNo: '',
  date: TODAY_ISO,
  recipientLabel: 'To',
  recipientTitle: '',
  organization: '',
  organizationAddress: '',
  throughLine: '',
  subject: '',
  salutation: 'Dear Sir / Madam,',
  bodyText: '',
  signOff: 'Yours obediently,',
  senderName: '',
  senderDesignation: '',
  senderIdOrDept: '',
  senderPhone: '',
  senderEmail: '',
  senderAddress: '',
  signatureImage: '',
  ccList: '',
  customSections: [],
};

export const SAMPLE_OFFICE_LETTER_EN: OfficeLetterData = {
  presetKey: 'leave',
  orgHeaderName: '',
  orgHeaderSub: '',
  orgLogo: '',
  showLogo: false,
  memoNo: '',
  date: TODAY_ISO,
  recipientLabel: 'To',
  recipientTitle: 'Head of Department / HR Manager',
  organization: 'Padma Horizon Textiles Ltd.',
  organizationAddress: 'Banani, Dhaka-1213',
  throughLine: 'Through: Team Lead, Operations',
  subject: 'Application for Three (03) Days Casual Leave',
  salutation: 'Dear Sir,',
  bodyText:
    'With due respect, I would like to inform you that due to an urgent family commitment at my hometown, I will not be able to attend the office from 02 December 2026 to 04 December 2026 (three working days).\n\nI have coordinated my ongoing tasks with my colleague Mr. Rafiqul Islam so that all daily deliverables remain uninterrupted during my absence. I will remain reachable by phone in case of any urgent matter.\n\nTherefore, I kindly request you to grant me three (03) days of casual leave and oblige thereby.',
  signOff: 'Yours sincerely,',
  senderName: 'Md. Mahmudul Hasan',
  senderDesignation: 'Senior Executive, Operations',
  senderIdOrDept: 'Employee ID: PHT-1042',
  senderPhone: '+880 1715-224488',
  senderEmail: 'mahmudul@example.com',
  senderAddress: '',
  signatureImage: '',
  ccList: '1. Human Resources Division\n2. Line Manager (For kind information)',
  customSections: [],
};

export const SAMPLE_OFFICE_LETTER_BN: OfficeLetterData = {
  presetKey: 'leave',
  orgHeaderName: '',
  orgHeaderSub: '',
  orgLogo: '',
  showLogo: false,
  memoNo: '',
  date: TODAY_ISO,
  recipientLabel: 'বরাবর',
  recipientTitle: 'বিভাগীয় প্রধান / মানবসম্পদ ব্যবস্থাপক',
  organization: 'পদ্মা হরাইজন টেক্সটাইলস লিমিটেড',
  organizationAddress: 'বনানী, ঢাকা-১২১৩',
  throughLine: 'মাধ্যম: যথাযথ কর্তৃপক্ষ',
  subject: 'তিন (০৩) দিনের নৈমিত্তিক ছুটির জন্য আবেদন।',
  salutation: 'মহোদয়,',
  bodyText:
    'যথাবিহিত সম্মানপূর্বক বিনীত নিবেদন এই যে, জরুরি পারিবারিক প্রয়োজনে দেশের বাড়িতে যাওয়ার কারণে আগামী ০২ ডিসেম্বর ২০২৬ থেকে ০৪ ডিসেম্বর ২০২৬ তারিখ পর্যন্ত মোট ০৩ (তিন) দিন আমার পক্ষে অফিসে উপস্থিত থাকা সম্ভব নয়।\n\nআমার অনুপস্থিতিতে চলমান দাপ্তরিক কাজগুলো সহকর্মী জনাব রফিকুল ইসলামের সাথে সমন্বয় করে রেখেছি, যাতে কোনো কাজের বিঘ্ন না ঘটে। জরুরি প্রয়োজনে ফোনে আমাকে পাওয়া যাবে।\n\nঅতএব, মহোদয়ের নিকট বিনীত প্রার্থনা এই যে, উক্ত ০৩ (তিন) দিনের নৈমিত্তিক ছুটি মঞ্জুর করে বাধিত করবেন।',
  signOff: 'বিনীত নিবেদক,',
  senderName: 'মোঃ মাহমুদুল হাসান',
  senderDesignation: 'সিনিয়র এক্সিকিউটিভ, অপারেশনস বিভাগ',
  senderIdOrDept: 'আইডি নং: PHT-1042',
  senderPhone: '০১৭১৫-২২৪৪৮৮',
  senderEmail: '',
  senderAddress: '',
  signatureImage: '',
  ccList: '১. মানবসম্পদ বিভাগ\n২. সংশ্লিষ্ট বিভাগীয় প্রধান (সদয় অবগতির জন্য)',
  customSections: [],
};

export interface OfficeLetterPreset {
  key: string;
  labelEn: string;
  labelBn: string;
  patchEn: Partial<OfficeLetterData>;
  patchBn: Partial<OfficeLetterData>;
}

export const OFFICE_LETTER_PRESETS: OfficeLetterPreset[] = [
  {
    key: 'leave',
    labelEn: 'Leave Application',
    labelBn: 'ছুটির আবেদন',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'Head of Department / HR Manager',
      throughLine: 'Through: Proper Channel',
      subject: 'Application for Three (03) Days Casual / Sick Leave',
      salutation: 'Dear Sir / Madam,',
      bodyText: SAMPLE_OFFICE_LETTER_EN.bodyText,
      signOff: 'Yours sincerely,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'বিভাগীয় প্রধান / মানবসম্পদ ব্যবস্থাপক',
      throughLine: 'মাধ্যম: যথাযথ কর্তৃপক্ষ',
      subject: 'তিন (০৩) দিনের নৈমিত্তিক / অসুস্থতাজনিত ছুটির আবেদন।',
      salutation: 'মহোদয়,',
      bodyText: SAMPLE_OFFICE_LETTER_BN.bodyText,
      signOff: 'বিনীত নিবেদক,',
    },
  },
  {
    key: 'resignation',
    labelEn: 'Resignation Letter',
    labelBn: 'পদত্যাগপত্র',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'Head of Human Resources',
      throughLine: 'Through: Department Head',
      subject: 'Formal Resignation from the Post of Senior Executive',
      salutation: 'Dear Sir / Madam,',
      bodyText:
        'Please accept this letter as formal notice of my resignation from my position, effective 30 days from today in accordance with company policy.\n\nI am deeply grateful for the opportunities, guidance, and support I have received during my tenure here. Over the remaining notice period, I am fully committed to completing my pending responsibilities and ensuring a smooth handover to the team.\n\nKindly accept my resignation and arrange for my release letter and final settlement upon completion of my notice period.',
      signOff: 'Sincerely yours,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'প্রধান, মানবসম্পদ বিভাগ',
      throughLine: 'মাধ্যম: বিভাগীয় প্রধান',
      subject: 'চাকরি হতে অব্যাহতি / পদত্যাগের আবেদন।',
      salutation: 'মহোদয়,',
      bodyText:
        'যথাবিহিত সম্মানপূর্বক নিবেদন এই যে, ব্যক্তিগত ও পেশাগত কারণে আমি প্রতিষ্ঠানের নীতিমালা অনুযায়ী আগামী ৩০ দিন নোটিশ সময় শেষে আমার বর্তমান পদ থেকে অব্যাহতি নিতে ইচ্ছুক।\n\nএখানে কর্মরত থাকাকালীন সকলের আন্তরিক সহযোগিতা ও শেখার সুযোগের জন্য আমি কৃতজ্ঞ। নোটিশ সময়ের মধ্যে আমার দায়িত্বসমূহ সঠিকভাবে হস্তান্তর করতে আমি সম্পূর্ণ প্রস্তুত আছি।\n\nঅতএব, আমার পদত্যাগপত্র গ্রহণপূর্বক ছাড়পত্র ও প্রাপ্য পাওনাদি প্রদানের ব্যবস্থা করে বাধিত করবেন।',
      signOff: 'বিনীত নিবেদক,',
    },
  },
  {
    key: 'bank',
    labelEn: 'Bank Request',
    labelBn: 'ব্যাংক আবেদন',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'The Branch Manager',
      throughLine: '',
      subject: 'Request for New Cheque Book / Bank Statement / Debit Card',
      salutation: 'Dear Sir,',
      bodyText:
        'With due respect, I would like to inform you that I hold a Savings Account with your esteemed branch (Account Name: [Your Name], Account No: [XXXXXXXXXXX]).\n\nI urgently require an updated Bank Statement / new Cheque Book / Debit Card replacement for official purposes. All required account verification details are provided below.\n\nI therefore kindly request you to take necessary steps to issue the same at your earliest convenience.',
      signOff: 'Yours faithfully,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'শাখা ব্যবস্থাপক',
      throughLine: '',
      subject: 'নতুন চেক বই / ব্যাংক স্টেটমেন্ট / ডেবিট কার্ডের জন্য আবেদন।',
      salutation: 'মহোদয়,',
      bodyText:
        'সবিনয় নিবেদন এই যে, আমি আপনার শাখার একজন নিয়মিত সঞ্চয়ী হিসাবধারী (হিসাবের নাম: [আপনার নাম], হিসাব নং: [XXXXXXXXXXX])।\n\nজরুরি ব্যক্তিগত ও দাপ্তরিক প্রয়োজনে আমার উক্ত হিসাবের একটি সত্যায়িত ব্যাংক স্টেটমেন্ট / নতুন চেক বই / ডেবিট কার্ড প্রয়োজন।\n\nঅতএব, মহোদয়ের নিকট বিনীত আবেদন এই যে, প্রয়োজনীয় ব্যবস্থা গ্রহণ করে আমাকে বাধিত করবেন।',
      signOff: 'বিনীত নিবেদক,',
    },
  },
  {
    key: 'noc',
    labelEn: 'NOC / Experience Letter',
    labelBn: 'অনাপত্তিপত্র (NOC) / প্রত্যয়ন',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'Head of Human Resources / Admin',
      throughLine: 'Through: Line Manager',
      subject: 'Request for No Objection Certificate (NOC) / Employment Certificate',
      salutation: 'Dear Sir / Madam,',
      bodyText:
        'With due respect, I am writing to request a No Objection Certificate (NOC) / Employment Verification Certificate confirming my current position and tenure at the organization for passport / visa / official documentation purposes.\n\nI assure you that all company guidelines will be strictly respected. Kindly issue the certificate at your earliest convenience.',
      signOff: 'Yours sincerely,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'প্রধান, প্রশাসন ও মানবসম্পদ বিভাগ',
      throughLine: 'মাধ্যম: বিভাগীয় প্রধান',
      subject: 'অনাপত্তিপত্র (NOC) / চাকরির প্রত্যয়নপত্র প্রদানের আবেদন।',
      salutation: 'মহোদয়,',
      bodyText:
        'যথাবিহিত সম্মানপূর্বক বিনীত নিবেদন এই যে, পাসপোর্ট নবায়ন / ভিসা / দাপ্তরিক প্রয়োজনে আমার বর্তমান চাকরির একটি প্রত্যয়নপত্র ও অনাপত্তিপত্র (NOC) প্রয়োজন।\n\nঅতএব, আমাকে উক্ত অনাপত্তিপত্র / প্রত্যয়নপত্র প্রদান করে বাধিত করার জন্য বিনীত অনুরোধ জানাচ্ছি।',
      signOff: 'বিনীত নিবেদক,',
    },
  },
  {
    key: 'campus_tc',
    labelEn: 'School / College TC & Testimonial',
    labelBn: 'স্কুল-কলেজ প্রশংসাপত্র / টিসি',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'The Principal / Headmaster',
      throughLine: 'Through: Class Teacher / Department Chairman',
      subject: 'Application for Testimonial / Transfer Certificate (TC)',
      salutation: 'Respected Sir / Madam,',
      bodyText:
        'With due respect and humble submission, I beg to state that I was a regular student of your esteemed institution (Class/Department: ______, Roll: ______, Session: ______).\n\nFor my higher studies / university admission, I urgently need a Testimonial / Transfer Certificate from the institution. I have cleared all tuition fees and library dues.\n\nI therefore pray and hope that you would be kind enough to issue me the certificate and oblige thereby.',
      signOff: 'Your most obedient student,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'অধ্যক্ষ / প্রধান শিক্ষক',
      throughLine: '',
      subject: 'প্রশংসাপত্র / ছাড়পত্র (TC) প্রদানের জন্য আবেদন।',
      salutation: 'মহোদয়,',
      bodyText:
        'সবিনয় নিবেদন এই যে, আমি আপনার ঐতিহ্যবাহী শিক্ষা প্রতিষ্ঠানের একজন নিয়মিত শিক্ষার্থী (শ্রেণি/বিভাগ: ______, রোল: ______, শিক্ষাবর্ষ: ______)। উচ্চশিক্ষা / ভর্তি কার্যক্রমের জন্য আমার একটি প্রশংসাপত্র / ছাড়পত্র অত্যন্ত জরুরি। প্রতিষ্ঠানের সকল বেতন ও পাওনাদি আমি ইতিমধ্যে পরিশোধ করেছি।\n\nঅতএব, মহোদয়ের নিকট বিনীত প্রার্থনা এই যে, আমাকে প্রশংসাপত্র / ছাড়পত্র প্রদান করে বাধিত করবেন।',
      signOff: 'আপনার একান্ত অনুগত শিক্ষার্থী,',
    },
  },
  {
    key: 'utility_society',
    labelEn: 'Utility / Society Request',
    labelBn: 'সেবা / সমিতি আবেদন',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: 'The President / General Secretary',
      throughLine: '',
      subject: 'Request for Maintenance / Utility Connection Assistance',
      salutation: 'Dear Sir,',
      bodyText:
        'I am a resident of Flat No. ___ in your building/society. I would like to bring to your kind attention an urgent maintenance issue regarding water/electricity/intercom service in our unit.\n\nKindly arrange for the technical staff to inspect and resolve this issue at the earliest possible time.',
      signOff: 'With thanks and regards,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: 'সভাপতি / সাধারণ সম্পাদক',
      throughLine: '',
      subject: 'ফ্ল্যাট রক্ষণাবেক্ষণ / ইউটিলিটি সেবা সংক্রান্ত আবেদন।',
      salutation: 'জনাব,',
      bodyText:
        'বিনীত নিবেদন এই যে, আমি অত্র ভবনের ফ্ল্যাট নং ___ -এর একজন বাসিন্দা। আমাদের ফ্ল্যাটে পানি / বিদ্যুৎ / ইন্টারকম সংযোগ সংক্রান্ত একটি জরুরি সমস্যা দেখা দিয়েছে।\n\nঅনুগ্রহপূর্বক দ্রুত টেকনিশিয়ান পাঠিয়ে সমস্যাটি সমাধানের ব্যবস্থা করে বাধিত করবেন।',
      signOff: 'ধন্যবাদান্তে,',
    },
  },
  {
    key: 'office_notice',
    labelEn: 'Official Notice / Circular',
    labelBn: 'অফিস নোটিশ / বিজ্ঞপ্তি',
    patchEn: {
      recipientLabel: 'Notice To',
      recipientTitle: 'All Staff Members / Residents',
      throughLine: '',
      subject: 'OFFICE NOTICE — Holiday Schedule & Updated Timing',
      salutation: 'Attention All Concerned,',
      bodyText:
        'This is to inform all concerned that the office will remain closed on [Date] on account of [Occasion]. Regular operations will resume on [Next Working Day] at 9:30 AM.\n\nAll department heads are requested to complete urgent deliverables beforehand. Emergency contacts will remain active throughout the holiday.',
      signOff: 'By order of the Management,',
    },
    patchBn: {
      recipientLabel: 'সকলের অবগতির জন্য',
      recipientTitle: 'সকল কর্মকর্তা, কর্মচারী / ফ্ল্যাট মালিকবৃন্দ',
      throughLine: '',
      subject: 'জরুরি বিজ্ঞপ্তি — অফিস বন্ধ / সময়সূচি সংক্রান্ত।',
      salutation: 'সংশ্লিষ্ট সকলের প্রতি,',
      bodyText:
        'এতদ্বারা সংশ্লিষ্ট সকলের অবগতির জন্য জানানো যাচ্ছে যে, আগামী [তারিখ] [উপলক্ষ] উপলক্ষে অফিস / কার্যক্রম বন্ধ থাকবে। পরবর্তী কর্মদিবস [তারিখ] সকাল ৯:৩০ ঘটিকা হতে যথারীতি কার্যক্রম পুনরায় চালু হবে।\n\nসকলকে যথাসময়ে জরুরি কাজ সম্পন্ন করার জন্য অনুরোধ করা হলো।',
      signOff: 'কর্তৃপক্ষের আদেশক্রমে,',
    },
  },
  {
    key: 'blank',
    labelEn: 'Custom Blank Letter',
    labelBn: 'নিজস্ব খালি দরখাস্ত',
    patchEn: {
      recipientLabel: 'To',
      recipientTitle: '',
      throughLine: '',
      subject: '',
      salutation: 'Dear Sir / Madam,',
      bodyText: '',
      signOff: 'Sincerely yours,',
    },
    patchBn: {
      recipientLabel: 'বরাবর',
      recipientTitle: '',
      throughLine: '',
      subject: '',
      salutation: 'মহোদয়,',
      bodyText: '',
      signOff: 'বিনীত নিবেদক,',
    },
  },
];

// =========================================================================
// 3. TO-LET & PRIVATE TUITION POSTERS — EMPTY, SAMPLES & PRESETS
// =========================================================================
export const EMPTY_POSTER: PosterData = {
  kind: 'tolet',
  badgeText: '',
  headline: '',
  subHeadline: '',
  priceLabel: '',
  priceAmount: '',
  priceNote: '',
  photo: '',
  showPhoto: false,
  details: [],
  featuresTitle: '',
  features: '',
  addressTitle: '',
  address: '',
  contactLabel: '',
  contactName: '',
  contactPhone: '',
  contactNote: '',
  tearOffLabel: '',
  customSections: [],
};

export const SAMPLE_POSTER_TOLET_EN: PosterData = {
  kind: 'tolet',
  badgeText: 'FAMILY FLAT FOR RENT',
  headline: 'TO-LET',
  subHeadline: 'Bright 3-Bedroom South-Facing Flat · Ready from Next Month',
  priceLabel: 'Monthly Rent',
  priceAmount: '৳ 24,000 / month',
  priceNote: 'Service Charge ৳ 3,500 · Prepaid Gas & Electricity',
  photo: '',
  showPhoto: false,
  details: [
    { id: 'pd-1', label: 'Rooms', value: '3 Bed · 3 Bath · 2 Verandas' },
    { id: 'pd-2', label: 'Floor & Area', value: '5th Floor (Lift Available) · 1,350 sft' },
    { id: 'pd-3', label: 'Tenant Type', value: 'Small Family Only' },
    { id: 'pd-4', label: 'Available From', value: '1st of Next Month' },
  ],
  featuresTitle: 'Flat Facilities & Highlights',
  features:
    '24/7 Lift, Standby Generator & CCTV Security\nDirect Titas / Prepaid Gas & Uninterrupted WASA Water\nSpacious Drawing-Dining with Natural Sunlight\nDedicated Bike/Car Garage Available on Ground Floor',
  addressTitle: 'House Location',
  address: 'House 18, Road 6, Sector 7, Uttara, Dhaka-1230 (5 min walk from Metro Station)',
  contactLabel: 'Call Directly for Visit',
  contactName: 'House Owner',
  contactPhone: '01711-234567',
  contactNote: 'Call between 10:00 AM – 9:00 PM (No Broker)',
  tearOffLabel: 'TO-LET (Uttara)',
  customSections: [],
};

export const SAMPLE_POSTER_TOLET_BN: PosterData = {
  kind: 'tolet',
  badgeText: 'ফ্যামিলি ফ্ল্যাট ভাড়া হবে',
  headline: 'টু-লেট',
  subHeadline: 'দক্ষিণমুখী খোলামেলা ৩ বেডরুমের আধুনিক ফ্ল্যাট · আগামী মাস থেকে',
  priceLabel: 'মাসিক ভাড়া',
  priceAmount: '৳ ২৪,০০০ / মাস',
  priceNote: 'সার্ভিস চার্জ ৩,৫০০ টাকা · প্রিপেইড গ্যাস ও বিদ্যুৎ',
  photo: '',
  showPhoto: false,
  details: [
    { id: 'pd-1', label: 'রুম সংখ্যা', value: '৩ বেড · ৩ বাথ · ২ বারান্দা' },
    { id: 'pd-2', label: 'তলা ও আয়তন', value: '৫ম তলা (লিফট আছে) · ১,৩৫০ বর্গফুট' },
    { id: 'pd-3', label: 'ভাড়াটিয়ার ধরন', value: 'শুধুমাত্র ছোট ফ্যামিলি' },
    { id: 'pd-4', label: 'ওঠার সময়', value: 'আগামী মাসের ১ তারিখ থেকে' },
  ],
  featuresTitle: 'ফ্ল্যাটের সুবিধাসমূহ',
  features:
    '২৪ ঘণ্টা লিফট, জেনারেটর ও সিসিটিভি নিরাপত্তা ব্যবস্থা\nতিতাস / প্রিপেইড গ্যাস ও নিরবচ্ছিন্ন পানির সুব্যবস্থা\nপ্রশস্ত ড্রয়িং-ডাইনিং ও পর্যাপ্ত আলো-বাতাস\nনিচতলায় গ্যারেজ পার্কিং সুবিধা রয়েছে',
  addressTitle: 'বাসার ঠিকানা',
  address: 'বাসা ১৮, রোড ৬, সেক্টর ৭, উত্তরা, ঢাকা-১২৩০ (মেট্রো স্টেশন থেকে ৫ মিনিট হাঁটা পথ)',
  contactLabel: 'বাসা দেখার জন্য সরাসরি যোগাযোগ',
  contactName: 'বাড়িওয়ালা',
  contactPhone: '০১৭১১-২৩৪৫৬৭',
  contactNote: 'সকাল ১০টা থেকে রাত ৯টার মধ্যে কল করুন',
  tearOffLabel: 'টু-লেট (উত্তরা)',
  customSections: [],
};

export const SAMPLE_POSTER_TUITION_EN: PosterData = {
  kind: 'tuition',
  badgeText: 'EXPERIENCED HOME TUTOR',
  headline: 'PRIVATE TUITION',
  subHeadline: 'Class 8 to HSC · Science, Math, Physics, Chemistry & ICT',
  priceLabel: 'Monthly Honorarium',
  priceAmount: '৳ 6,000 – 8,000',
  priceNote: '4 Days / Week · 2 Free Demo Classes',
  photo: '',
  showPhoto: false,
  details: [
    { id: 'pt-1', label: 'Tutor Background', value: 'B.Sc in CSE, BUET / Dhaka University' },
    { id: 'pt-2', label: 'Medium / Version', value: 'Bangla Medium & English Version (NCTB)' },
    { id: 'pt-3', label: 'Subjects', value: 'Higher Math, Physics, Chemistry, General Math, ICT' },
    { id: 'pt-4', label: 'Preferred Areas', value: 'Dhanmondi, Mohammadpur, Lalmatia, Mirpur' },
  ],
  featuresTitle: 'Teaching Approach',
  features:
    'Chapter-wise clear concept building with handwritten notes\nWeekly MCQ & CQ model tests for SSC & HSC Board exams\nRegular progress updates to parents\n4+ years of home tutoring experience with Golden A+ students',
  addressTitle: 'Location / Online Option',
  address: 'Home Visit across Dhanmondi & nearby areas · Online 1-on-1 also available',
  contactLabel: 'Call / WhatsApp for Demo Class',
  contactName: 'Tanvir Sir',
  contactPhone: '01819-654321',
  contactNote: 'Guardians may call or message on WhatsApp anytime',
  tearOffLabel: 'Home Tutor',
  customSections: [],
};

export const SAMPLE_POSTER_TUITION_BN: PosterData = {
  kind: 'tuition',
  badgeText: 'অভিজ্ঞ হোম টিউটর',
  headline: 'প্রাইভেট পড়ানো হয়',
  subHeadline: 'অষ্টম থেকে দ্বাদশ শ্রেণি (বিজ্ঞান বিভাগ) · বাংলা ও ইংলিশ ভার্সন',
  priceLabel: 'সম্মানী (মাসিক)',
  priceAmount: '৳ ৬,০০০ – ৮,০০০',
  priceNote: 'সপ্তাহে ৪ দিন · ২টি ফ্রি ডেমো ক্লাসের সুযোগ',
  photo: '',
  showPhoto: false,
  details: [
    { id: 'pt-1', label: 'শিক্ষকের পরিচয়', value: 'বিএসসি (সম্মান), ঢাকা বিশ্ববিদ্যালয় / বুয়েট' },
    { id: 'pt-2', label: 'পড়ানোর বিষয়', value: 'গণিত, উচ্চতর গণিত, পদার্থ, রসায়ন ও আইসিটি' },
    { id: 'pt-3', label: 'শ্রেণি ও মাধ্যম', value: '৮ম – এইচএসসি (বাংলা ও ইংলিশ ভার্সন)' },
    { id: 'pt-4', label: 'এলাকা', value: 'ধানমন্ডি, মোহাম্মদপুর, লালমাটিয়া ও মিরপুর' },
  ],
  featuresTitle: 'পড়ানোর বিশেষত্ব',
  features:
    'প্রতিটি অধ্যায়ের বেসিক কনসেপ্ট পরিষ্কার করা ও হাতে লেখা নোট প্রদান\nবোর্ড পরীক্ষার আদলে সাপ্তাহিক সৃজনশীল (CQ) ও বহুনির্বাচনি (MCQ) পরীক্ষা\nঅভিভাবকদের নিয়মিত অগ্রগতির রিপোর্ট প্রদান\n৪+ বছরের টিউশন অভিজ্ঞতা',
  addressTitle: 'অবস্থান',
  address: 'বাসায় গিয়ে পড়ানো হয় (ধানমন্ডি ও আশপাশের এলাকা) · অনলাইনেও পড়ানো হয়',
  contactLabel: 'যোগাযোগ (কল / হোয়াটসঅ্যাপ)',
  contactName: 'তানভীর স্যার',
  contactPhone: '০১৮১৯-৬৫৪৩২১',
  contactNote: 'অভিভাবকগণ সকাল ৯টা থেকে রাত ১০টার মধ্যে কল করতে পারেন',
  tearOffLabel: 'হোম টিউটর',
  customSections: [],
};

// =========================================================================
// 4. INVOICE, CASH MEMO & QUOTATION — EMPTY, SAMPLES & PRESETS
// =========================================================================
export const EMPTY_INVOICE: InvoiceData = {
  docKind: 'cash_memo',
  customDocTitle: '',
  businessName: '',
  businessTagline: '',
  businessAddress: '',
  businessPhone: '',
  businessEmail: '',
  businessWebsite: '',
  businessRegNo: '',
  logo: '',
  showLogo: true,
  invoiceNo: 'INV-2026-001',
  date: TODAY_ISO,
  dueDate: '',
  orderRef: '',
  clientName: '',
  clientCompany: '',
  clientPhone: '',
  clientAddress: '',
  items: [],
  discountType: 'fixed',
  discountValue: 0,
  vatPercent: 0,
  shippingCharge: 0,
  advancePaid: 0,
  takaWordsOverride: '',
  bkashNumber: '',
  nagadNumber: '',
  rocketNumber: '',
  bankDetails: '',
  notes: '',
  terms: '',
  authorizedName: '',
  authorizedTitle: '',
  signatureImage: '',
  customSections: [],
};

export const SAMPLE_INVOICE_EN: InvoiceData = {
  docKind: 'invoice',
  customDocTitle: '',
  businessName: 'Bengal Craft & Tech Studio',
  businessTagline: 'Web Design, Branding & Print Solutions · Dhaka',
  businessAddress: 'Level 4, House 12, Road 11, Banani, Dhaka-1213',
  businessPhone: '+880 1712-908070',
  businessEmail: 'billing@bengalcraft.example.com',
  businessWebsite: 'bengalcraft.example.com',
  businessRegNo: 'BIN: 002489105-0102 · Trade Lic: TRAD/DNCC/04192',
  logo: '',
  showLogo: true,
  invoiceNo: 'INV-2026-104',
  date: TODAY_ISO,
  dueDate: '',
  orderRef: 'PO-8841',
  clientName: 'Mr. Rafiqul Islam',
  clientCompany: 'GreenDelta Agro Foods Ltd.',
  clientPhone: '+880 1811-445566',
  clientAddress: 'Plot 27, Gulshan Avenue, Dhaka-1212',
  items: [
    {
      id: 'it-1',
      description: 'Company Website UI Design & Bilingual Development (EN/BN)',
      qty: 1,
      unit: 'project',
      rate: 35000,
    },
    {
      id: 'it-2',
      description: 'Product Packaging & Corporate Stationery Kit (Logo, Letterhead)',
      qty: 1,
      unit: 'set',
      rate: 12000,
    },
    {
      id: 'it-3',
      description: 'Domain & Cloud Hosting Setup (1 Year)',
      qty: 1,
      unit: 'year',
      rate: 4500,
    },
  ],
  discountType: 'fixed',
  discountValue: 1500,
  vatPercent: 5,
  shippingCharge: 0,
  advancePaid: 20000,
  takaWordsOverride: '',
  bkashNumber: '01712-908070 (Merchant / Personal)',
  nagadNumber: '01712-908070',
  rocketNumber: '',
  bankDetails: 'City Bank PLC · A/C: Bengal Craft Studio · No: 1402984512001 · Banani Branch',
  notes: 'Thank you for your business! Please mention the Invoice No. as reference when paying via bKash/Bank.',
  terms: 'Balance due within 7 working days of delivery. Goods/services once accepted are non-refundable.',
  authorizedName: 'Tanvir Ahmed',
  authorizedTitle: 'Proprietor / Accounts',
  signatureImage: '',
  customSections: [],
};

export const SAMPLE_INVOICE_BN: InvoiceData = {
  docKind: 'cash_memo',
  customDocTitle: '',
  businessName: 'রূপসী বাংলা শাড়ি ও বুটিক হাউস',
  businessTagline: 'তাঁতের শাড়ি, পাঞ্জাবি ও ঐতিহ্যবাহী পোশাকের বিশ্বস্ত প্রতিষ্ঠান',
  businessAddress: 'দোকান ১৪, ২য় তলা, গাউছিয়া মার্কেট, নিউ মার্কেট, ঢাকা-১২০৫',
  businessPhone: '০১৭১২-৯০৮০৭০',
  businessEmail: 'shop@ruposhibangla.example.com',
  businessWebsite: 'fb.com/ruposhibanglashop',
  businessRegNo: 'ট্রেড লাইসেন্স: DSCC-০৪১৯২২',
  logo: '',
  showLogo: true,
  invoiceNo: 'CM-২০২৬-২০৮',
  date: TODAY_ISO,
  dueDate: '',
  orderRef: 'ORD-৪১২',
  clientName: 'জনাবা নুসরাত জাহান',
  clientCompany: '',
  clientPhone: '০১৮১১-৪৪৫৫৬৬',
  clientAddress: 'বাসা ৯, রোড ৪, ধানমন্ডি, ঢাকা-১২০৯',
  items: [
    {
      id: 'it-1',
      description: 'ঢাকাই জামদানি শাড়ি (হাফ সিল্ক · পেস্টাল গোল্ড)',
      qty: 1,
      unit: 'পিস',
      rate: 6500,
    },
    {
      id: 'it-2',
      description: 'রাজশাহী সিল্ক পাঞ্জাবি (পান্না সবুজ · সাইজ L)',
      qty: 2,
      unit: 'পিস',
      rate: 2400,
    },
    {
      id: 'it-3',
      description: 'উপহারের বক্স ও প্রিমিয়াম প্যাকেজিং',
      qty: 1,
      unit: 'সেট',
      rate: 350,
    },
  ],
  discountType: 'fixed',
  discountValue: 450,
  vatPercent: 0,
  shippingCharge: 120,
  advancePaid: 2000,
  takaWordsOverride: '',
  bkashNumber: '০১৭১২-৯০৮০৭০ (মার্চেন্ট / সেন্ড মানি)',
  nagadNumber: '০১৭১২-৯০৮০৭০',
  rocketNumber: '',
  bankDetails: 'ইসলামী ব্যাংক বাংলাদেশ · হিসাব নং: ২০৫০২১৪০২০০৮৪১৫ · নিউ মার্কেট শাখা',
  notes: 'আমাদের শপ থেকে কেনাকাটার জন্য আন্তরিক ধন্যবাদ!',
  terms: 'বিক্রীত পণ্য ৩ দিনের মধ্যে ক্যাশ মেমোসহ পরিবর্তনযোগ্য (অব্যবহৃত অবস্থায়)।',
  authorizedName: 'মোঃ কামরুল হাসান',
  authorizedTitle: 'স্বত্বাধিকারী / ক্যাশিয়ার',
  signatureImage: '',
  customSections: [],
};

export function getSampleForExtraMode(
  mode: 'job_app' | 'office_letter' | 'poster' | 'invoice',
  language: DocLanguage
): JobAppData | OfficeLetterData | PosterData | InvoiceData {
  if (mode === 'job_app') {
    return structuredClone(language === 'bn' ? SAMPLE_JOB_APP_BN : SAMPLE_JOB_APP_EN);
  }
  if (mode === 'office_letter') {
    return structuredClone(language === 'bn' ? SAMPLE_OFFICE_LETTER_BN : SAMPLE_OFFICE_LETTER_EN);
  }
  if (mode === 'poster') {
    return structuredClone(language === 'bn' ? SAMPLE_POSTER_TOLET_BN : SAMPLE_POSTER_TOLET_EN);
  }
  return structuredClone(language === 'bn' ? SAMPLE_INVOICE_BN : SAMPLE_INVOICE_EN);
}
