import { DocLanguage, InvocationPreset } from '../types/builder';

export interface DocLabels {
  // Document headings (CV)
  curriculumVitae: string;
  careerObjective: string;
  education: string;
  experience: string;
  skills: string;
  technicalSkills: string;
  softwareTools: string;
  languages: string;
  projects: string;
  trainings: string;
  personalInfo: string;
  references: string;
  declaration: string;
  signature: string;
  date: string;
  // Education table columns
  examDegree: string;
  groupMajor: string;
  institution: string;
  boardUniversity: string;
  passingYear: string;
  resultGpa: string;
  // Personal info labels
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  age: string;
  yearsOld: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  gender: string;
  bloodGroup: string;
  permanentAddress: string;
  presentAddress: string;
  nidNumber: string;
  phone: string;
  email: string;
  portfolio: string;
  // Biodata headings & labels
  marriageBiodata: string;
  personalDetails: string;
  height: string;
  complexion: string;
  weight: string;
  lifestylePractice: string;
  educationCareer: string;
  occupation: string;
  workplace: string;
  income: string;
  familyBackground: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  extendedFamily: string;
  familyNote: string;
  addressDetails: string;
  desherBari: string;
  village: string;
  upazila: string;
  district: string;
  aboutMe: string;
  hobbies: string;
  partnerExpectations: string;
  expectedAge: string;
  expectedHeight: string;
  expectedEducation: string;
  expectedProfession: string;
  expectedLocation: string;
  expectedQualities: string;
  guardianContact: string;
  contactPerson: string;
  relationship: string;
  whatsappPhone: string;
  defaultDeclaration: string;
  // UI Navigation & Workbook labels
  ui: {
    brandSub: string;
    cvBuilder: string;
    biodataBuilder: string;
    templatesNav: string;
    downloadPdf: string;
    onDevicePrivacy: string;
    editDetails: string;
    livePreview: string;
    prevStep: string;
    nextStep: string;
    skipStep: string;
    loadSample: string;
    clearAll: string;
    clearEverything: string;
    onePageLabel: string;
    twoPageLabel: string;
    saveBackup: string;
    restoreBackup: string;
    savedLocally: string;
    chooseModeTitle: string;
    chooseModeSubtitle: string;
    docLanguage: string;
    cvCardTitle: string;
    cvCardDesc: string;
    biodataCardTitle: string;
    biodataCardDesc: string;
    privacyTitle: string;
    privacyDesc: string;
    photoUpload: string;
    photoReplace: string;
    photoRemove: string;
    photoVisible: string;
    photoHidden: string;
    addEntry: string;
    remove: string;
    optional: string;
    emptyFieldsNote: string;
    printTip: string;
    fitWidth: string;
    actualSize: string;
    switchTemplate: string;
    confirmClearTitle: string;
    confirmClearBody: string;
    confirmClearYes: string;
    cancel: string;
    allTemplates: string;
    cvSteps1P: string[];
    cvSteps2P: string[];
    biodataSteps1P: string[];
    biodataSteps2P: string[];
    cvCategories: Record<string, string>;
    biodataCategories: Record<string, string>;
  };
}

export const LABELS: Record<DocLanguage, DocLabels> = {
  en: {
    curriculumVitae: 'Curriculum Vitae',
    careerObjective: 'Career Objective',
    education: 'Educational Qualifications',
    experience: 'Work Experience & Internships',
    skills: 'Skills & Languages',
    technicalSkills: 'Core & Technical Skills',
    softwareTools: 'Office & Software Tools',
    languages: 'Language Proficiency',
    projects: 'Projects & Achievements',
    trainings: 'Training & Certifications',
    personalInfo: 'Personal Information',
    references: 'References',
    declaration: 'Declaration',
    signature: 'Signature',
    date: 'Date',
    examDegree: 'Exam / Degree',
    groupMajor: 'Group / Major',
    institution: 'Institution',
    boardUniversity: 'Board / University',
    passingYear: 'Year',
    resultGpa: 'GPA / CGPA',
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    dateOfBirth: 'Date of Birth',
    age: 'Age',
    yearsOld: 'years',
    nationality: 'Nationality',
    religion: 'Religion',
    maritalStatus: 'Marital Status',
    gender: 'Gender',
    bloodGroup: 'Blood Group',
    permanentAddress: 'Permanent Address',
    presentAddress: 'Present Address',
    nidNumber: 'NID / Birth Reg. No.',
    phone: 'Phone',
    email: 'Email',
    portfolio: 'LinkedIn / Portfolio',
    marriageBiodata: 'Marriage Biodata',
    personalDetails: 'Personal Information',
    height: 'Height',
    complexion: 'Complexion',
    weight: 'Weight',
    lifestylePractice: 'Religious & Lifestyle Practice',
    educationCareer: 'Education & Career',
    occupation: 'Occupation / Designation',
    workplace: 'Organization / Workplace',
    income: 'Monthly / Annual Income',
    familyBackground: 'Family Background',
    fatherOccupation: "Father's Occupation",
    motherOccupation: "Mother's Occupation",
    siblings: 'Siblings',
    extendedFamily: 'Extended Family',
    familyNote: 'Family Overview',
    addressDetails: 'Address Details',
    desherBari: 'Permanent Address (Hometown)',
    village: 'Village / Area',
    upazila: 'Upazila / Thana',
    district: 'District',
    aboutMe: 'About Me',
    hobbies: 'Hobbies & Interests',
    partnerExpectations: 'Partner Expectations',
    expectedAge: 'Preferred Age',
    expectedHeight: 'Preferred Height',
    expectedEducation: 'Education',
    expectedProfession: 'Profession',
    expectedLocation: 'District / Location',
    expectedQualities: 'Values & Qualities',
    guardianContact: 'Guardian / Contact Information',
    contactPerson: 'Contact Person',
    relationship: 'Relationship',
    whatsappPhone: 'Phone / WhatsApp',
    defaultDeclaration:
      'I hereby declare that all the information stated above is true and accurate to the best of my knowledge and belief.',
    ui: {
      brandSub: 'Bangladeshi CV & Biodata Workbook',
      cvBuilder: 'CV Builder',
      biodataBuilder: 'Marriage Biodata',
      templatesNav: 'Templates',
      downloadPdf: 'Export A4 PDF',
      onDevicePrivacy: '100% On-Device',
      editDetails: 'Edit Workbook',
      livePreview: 'Live A4 Preview',
      prevStep: 'Back',
      nextStep: 'Continue',
      skipStep: 'Skip this step',
      loadSample: 'Load Sample Data',
      clearAll: 'Clear All Data',
      clearEverything: 'Clear Everything',
      onePageLabel: '1-Page Format',
      twoPageLabel: '2-Page Format',
      saveBackup: 'Save Backup (.json)',
      restoreBackup: 'Restore Backup',
      savedLocally: 'Auto-saved on this device',
      chooseModeTitle: 'What are we creating today?',
      chooseModeSubtitle:
        'Pick a workbook below. Everything stays privately inside your browser — no sign-up, no uploads, no compose shop fees.',
      docLanguage: 'Document & Form Language',
      cvCardTitle: 'Bangladeshi CV',
      cvCardDesc:
        'Structured for local banks, private companies, NGOs, government jobs, and universities with SSC/HSC/Honours tables.',
      biodataCardTitle: 'Marriage Biodata',
      biodataCardDesc:
        'Dignified Biye / Bibaho biodata layouts designed for printing or sharing cleanly with families over WhatsApp.',
      privacyTitle: 'Your personal details never leave this device',
      privacyDesc:
        'There is no server or cloud account. Your photos, phone numbers, and family details remain strictly in your browser storage. Use Clear Everything anytime on a shared computer.',
      photoUpload: 'Upload Photo',
      photoReplace: 'Change Photo',
      photoRemove: 'Remove',
      photoVisible: 'Photo shown on sheet',
      photoHidden: 'Photo hidden on sheet',
      addEntry: 'Add Entry',
      remove: 'Remove',
      optional: 'Optional',
      emptyFieldsNote: 'Blank fields disappear automatically from your A4 sheet.',
      printTip: 'Choose "Save as PDF" and enable Background Graphics in the print dialog.',
      fitWidth: 'Fit',
      actualSize: '100%',
      switchTemplate: 'Change Template',
      confirmClearTitle: 'Clear everything from this browser?',
      confirmClearBody:
        'This immediately wipes all CV details, Marriage Biodata entries, custom sections, style overrides, and uploaded photos from this device. Save a private backup first if you want a copy.',
      confirmClearYes: 'Yes, Clear Everything',
      cancel: 'Cancel',
      allTemplates: 'All',
      cvSteps1P: [
        'Basics & Summary',
        'Education',
        'Experience & Skills',
        'Customize & Export',
      ],
      cvSteps2P: [
        'Basics & Objective',
        'Education',
        'Experience & Training',
        'Personal & Refs',
        'Customize & Export',
      ],
      biodataSteps1P: [
        'Personal Essentials',
        'Career & Education',
        'Family & Guardian',
        'Customize & Export',
      ],
      biodataSteps2P: [
        'Personal & Photo',
        'Education & Career',
        'Family & Address',
        'About & Guardian',
        'Customize & Export',
      ],
      cvCategories: {
        all: 'All (22)',
        formal: 'Formal & Govt',
        corporate: 'Corporate & Exec',
        sidebar: 'Sidebar & Split',
        tech: 'Tech & Creative',
        compact: 'Academic & Fresher',
      },
      biodataCategories: {
        all: 'All (37)',
        royal: 'Royal & Luxury',
        floral: 'Floral & Botanical',
        islamic: 'Islamic & Heritage',
        hindu: 'Hindu / Sanatan',
        christian_buddhist: 'Christian & Buddhist',
        modern: 'Modern & Editorial',
        whatsapp: 'WhatsApp & Print',
      },
    },
  },
  bn: {
    curriculumVitae: 'জীবনবৃত্তান্ত (Curriculum Vitae)',
    careerObjective: 'ক্যারিয়ারের লক্ষ্য',
    education: 'শিক্ষাগত যোগ্যতা',
    experience: 'কর্মঅভিজ্ঞতা ও ইন্টার্নশিপ',
    skills: 'দক্ষতা ও ভাষা',
    technicalSkills: 'পেশাগত ও কারিগরি দক্ষতা',
    softwareTools: 'কম্পিউটার ও সফটওয়্যার দক্ষতা',
    languages: 'ভাষাগত দক্ষতা',
    projects: 'প্রজেক্ট ও অর্জনসমূহ',
    trainings: 'প্রশিক্ষণ ও সার্টিফিকেশন',
    personalInfo: 'ব্যক্তিগত তথ্য',
    references: 'রেফারেন্স',
    declaration: 'ঘোষণা',
    signature: 'স্বাক্ষর',
    date: 'তারিখ',
    examDegree: 'পরীক্ষা / ডিগ্রি',
    groupMajor: 'বিভাগ / বিষয়',
    institution: 'প্রতিষ্ঠান',
    boardUniversity: 'বোর্ড / বিশ্ববিদ্যালয়',
    passingYear: 'পাসের সন',
    resultGpa: 'ফলাফল (GPA/CGPA)',
    fatherName: 'পিতার নাম',
    motherName: 'মাতার নাম',
    dateOfBirth: 'জন্ম তারিখ',
    age: 'বয়স',
    yearsOld: 'বছর',
    nationality: 'জাতীয়তা',
    religion: 'ধর্ম',
    maritalStatus: 'বৈবাহিক অবস্থা',
    gender: 'লিঙ্গ',
    bloodGroup: 'রক্তের গ্রুপ',
    permanentAddress: 'স্থায়ী ঠিকানা',
    presentAddress: 'বর্তমান ঠিকানা',
    nidNumber: 'জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং',
    phone: 'মোবাইল',
    email: 'ইমেইল',
    portfolio: 'লিংকডইন / পোর্টফোলিও',
    marriageBiodata: 'বিবাহের বায়োডাটা',
    personalDetails: 'ব্যক্তিগত তথ্য',
    height: 'উচ্চতা',
    complexion: 'গায়ের রঙ',
    weight: 'ওজন',
    lifestylePractice: 'ধর্মীয় ও জীবনযাপন',
    educationCareer: 'শিক্ষাগত যোগ্যতা ও পেশা',
    occupation: 'বর্তমান পেশা / পদবি',
    workplace: 'কর্মস্থল / প্রতিষ্ঠান',
    income: 'মাসিক / বার্ষিক আয়',
    familyBackground: 'পারিবারিক তথ্য',
    fatherOccupation: 'পিতার পেশা',
    motherOccupation: 'মাতার পেশা',
    siblings: 'ভাই-বোনদের বিবরণ',
    extendedFamily: 'আত্মীয়-স্বজন (চাচা / মামা)',
    familyNote: 'পারিবারিক পরিচিতি',
    addressDetails: 'ঠিকানা',
    desherBari: 'স্থায়ী ঠিকানা (দেশের বাড়ি)',
    village: 'গ্রাম / এলাকা',
    upazila: 'উপজেলা / থানা',
    district: 'জেলা',
    aboutMe: 'নিজের সম্পর্কে',
    hobbies: 'শখ ও পছন্দ',
    partnerExpectations: 'জীবনসঙ্গীর প্রত্যাশা',
    expectedAge: 'প্রত্যাশিত বয়স',
    expectedHeight: 'প্রত্যাশিত উচ্চতা',
    expectedEducation: 'শিক্ষাগত যোগ্যতা',
    expectedProfession: 'পেশা',
    expectedLocation: 'জেলা / এলাকা',
    expectedQualities: 'পছন্দ ও গুণাবলি',
    guardianContact: 'অভিভাবক ও যোগাযোগের তথ্য',
    contactPerson: 'যোগাযোগকারী',
    relationship: 'সম্পর্ক',
    whatsappPhone: 'মোবাইল / হোয়াটসঅ্যাপ',
    defaultDeclaration:
      'আমি এই মর্মে ঘোষণা করছি যে, উপরে প্রদত্ত সকল তথ্য আমার জানামতে সম্পূর্ণ সত্য ও সঠিক।',
    ui: {
      brandSub: 'বাংলাদেশি সিভি ও বায়োডাটা খাতা',
      cvBuilder: 'সিভি তৈরি',
      biodataBuilder: 'বিবাহের বায়োডাটা',
      templatesNav: 'টেমপ্লেট',
      downloadPdf: 'A4 PDF ডাউনলোড',
      onDevicePrivacy: '১০০% আপনার ডিভাইসে',
      editDetails: 'তথ্য লিখুন',
      livePreview: 'লাইভ A4 প্রিভিউ',
      prevStep: 'পেছনে',
      nextStep: 'পরবর্তী ধাপ',
      skipStep: 'এই ধাপ এড়িয়ে যান',
      loadSample: 'নমুনা তথ্য দেখুন',
      clearAll: 'সব তথ্য মুছুন',
      clearEverything: 'সব মুছুন',
      onePageLabel: '১ পৃষ্ঠার ফরম্যাট',
      twoPageLabel: '২ পৃষ্ঠার ফরম্যাট',
      saveBackup: 'ব্যাকআপ সংরক্ষণ (.json)',
      restoreBackup: 'ব্যাকআপ ফিরিয়ে আনুন',
      savedLocally: 'আপনার ডিভাইসে স্বয়ংক্রিয়ভাবে সংরক্ষিত',
      chooseModeTitle: 'আজ কী তৈরি করতে চান?',
      chooseModeSubtitle:
        'নিচ থেকে একটি বেছে নিন। আপনার কোনো তথ্য ইন্টারনেটে পাঠানো হয় না — কোনো অ্যাকাউন্ট বা কম্পোজ দোকানের খরচ নেই।',
      docLanguage: 'ডকুমেন্ট ও ফর্মের ভাষা',
      cvCardTitle: 'বাংলাদেশি সিভি (CV)',
      cvCardDesc:
        'ব্যাংক, বেসরকারি প্রতিষ্ঠান, এনজিও, সরকারি চাকরি ও বিশ্ববিদ্যালয়ের উপযোগী SSC/HSC/Honours ছকসহ সিভি।',
      biodataCardTitle: 'বিবাহের বায়োডাটা',
      biodataCardDesc:
        'প্রিন্ট করা বা পরিবারের সাথে হোয়াটসঅ্যাপে শেয়ার করার জন্য মার্জিত ও সুন্দর বিবাহের বায়োডাটা।',
      privacyTitle: 'আপনার ব্যক্তিগত তথ্য কখনোই এই ডিভাইসের বাইরে যায় না',
      privacyDesc:
        'কোনো সার্ভার বা ক্লাউড স্টোরেজ নেই। আপনার ছবি, ফোন নম্বর ও পারিবারিক তথ্য কেবল আপনার ব্রাউজারেই থাকে। অন্যের কম্পিউটার ব্যবহার করলে কাজ শেষে "সব মুছুন" বাটনে চাপ দিন।',
      photoUpload: 'ছবি যুক্ত করুন',
      photoReplace: 'ছবি পরিবর্তন',
      photoRemove: 'মুছুন',
      photoVisible: 'পৃষ্ঠায় ছবি দেখাচ্ছে',
      photoHidden: 'পৃষ্ঠায় ছবি লুকানো আছে',
      addEntry: 'নতুন যুক্ত করুন',
      remove: 'বাদ দিন',
      optional: 'ঐচ্ছিক',
      emptyFieldsNote: 'খালি ঘরগুলো প্রিভিউ এবং PDF থেকে স্বয়ংক্রিয়ভাবে বাদ যাবে।',
      printTip: 'প্রিন্ট অপশনে "Save as PDF" এবং "Background graphics" চালু রাখুন।',
      fitWidth: 'ফিট',
      actualSize: '১০০%',
      switchTemplate: 'টেমপ্লেট বদলান',
      confirmClearTitle: 'এই ব্রাউজার থেকে সবকিছু মুছে ফেলবেন?',
      confirmClearBody:
        'এতে আপনার লেখা সিভি, বায়োডাটা, কাস্টমাইজেশন এবং ছবি এই ডিভাইস থেকে সম্পূর্ণ মুছে যাবে। সংরক্ষণ করতে চাইলে আগে ব্যাকআপ ডাউনলোড করে নিন।',
      confirmClearYes: 'হ্যাঁ, সব মুছে ফেলুন',
      cancel: 'বাতিল',
      allTemplates: 'সবগুলো',
      cvSteps1P: [
        'প্রাথমিক তথ্য',
        'শিক্ষাগত যোগ্যতা',
        'অভিজ্ঞতা ও দক্ষতা',
        'কাস্টমাইজ ও PDF',
      ],
      cvSteps2P: [
        'প্রাথমিক তথ্য ও ছবি',
        'শিক্ষাগত যোগ্যতা',
        'অভিজ্ঞতা ও প্রশিক্ষণ',
        'ব্যক্তিগত ও রেফারেন্স',
        'কাস্টমাইজ ও PDF',
      ],
      biodataSteps1P: [
        'মূল ব্যক্তিগত তথ্য',
        'পেশা ও শিক্ষা',
        'পরিবার ও অভিভাবক',
        'কাস্টমাইজ ও PDF',
      ],
      biodataSteps2P: [
        'ব্যক্তিগত তথ্য ও ছবি',
        'শিক্ষা ও পেশা',
        'পরিবার ও ঠিকানা',
        'প্রত্যাশা ও অভিভাবক',
        'কাস্টমাইজ ও PDF',
      ],
      cvCategories: {
        all: 'সব (২২)',
        formal: 'ফর্মাল ও সরকারি',
        corporate: 'কর্পোরেট ও এক্সিকিউটিভ',
        sidebar: 'সাইডবার ও স্প্লিট',
        tech: 'টেক ও ক্রিয়েটিভ',
        compact: 'একাডেমিক ও ফ্রেশার',
      },
      biodataCategories: {
        all: 'সব (৩৭)',
        royal: 'রয়্যাল ও অভিজাত',
        floral: 'ফ্লোরাল ও বোটানিক্যাল',
        islamic: 'ইসলামিক ও ঐতিহ্য',
        hindu: 'সনাতন (হিন্দু)',
        christian_buddhist: 'খ্রিস্টান ও বৌদ্ধ',
        modern: 'আধুনিক ও এডিটোরিয়াল',
        whatsapp: 'হোয়াটসঅ্যাপ ও প্রিন্ট',
      },
    },
  },
};

export interface InvocationOption {
  key: InvocationPreset;
  labelEn: string;
  labelBn: string;
  arabic?: string;
  subtitleEn?: string;
  subtitleBn?: string;
}

export const INVOCATION_OPTIONS: InvocationOption[] = [
  {
    key: 'bismillah_ar_en',
    labelEn: 'Bismillah (Arabic + English)',
    labelBn: 'বিসমিল্লাহ (আরবি + ইংরেজি)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    subtitleEn: 'In the name of Allah, the Most Gracious, the Most Merciful',
    subtitleBn: 'In the name of Allah, the Most Gracious, the Most Merciful',
  },
  {
    key: 'bismillah_ar_bn',
    labelEn: 'Bismillah (Arabic + Bangla)',
    labelBn: 'বিসমিল্লাহ (আরবি + বাংলা)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    subtitleEn: 'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি',
    subtitleBn: 'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি',
  },
  {
    key: 'bismillah_ar',
    labelEn: 'Bismillah (Arabic Calligraphy Only)',
    labelBn: 'বিসমিল্লাহ (শুধু আরবি)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  },
  {
    key: 'om',
    labelEn: 'Hindu — Sri Sri Ganeshaya Namah / Om',
    labelBn: 'সনাতন — শ্রীশ্রী গণেশায় নমঃ / ওঁ',
    arabic: 'ॐ',
    subtitleEn: 'Sri Sri Ganeshaya Namah',
    subtitleBn: 'শ্রীশ্রী গণেশায় নমঃ',
  },
  {
    key: 'shri_durga_bn',
    labelEn: 'Hindu — Sri Sri Durga Sahay / Om',
    labelBn: 'সনাতন — শ্রীশ্রী দুর্গা সহায় / ওঁ',
    arabic: 'ॐ',
    subtitleEn: 'Sri Sri Durga Sahay',
    subtitleBn: 'শ্রীশ্রী দুর্গা সহায়',
  },
  {
    key: 'christian_blessing',
    labelEn: 'Christian — In the Grace of Our Lord',
    labelBn: 'খ্রিস্টান — প্রভু যীশুর আশীর্বাদে শুরু করছি',
    arabic: '✝',
    subtitleEn: 'In the Grace and Blessing of Our Lord Jesus Christ',
    subtitleBn: 'পরম করুণাময় প্রভু যীশুর আশীর্বাদে শুরু করছি',
  },
  {
    key: 'buddhist_namo',
    labelEn: 'Buddhist — Namo Tassa Bhagavato (Dharmachakra)',
    labelBn: 'বৌদ্ধ — নমো তস্স ভগবতো অরহতো সম্মাসম্বুদ্ধস্স',
    arabic: '☸',
    subtitleEn: 'Namo Tassa Bhagavato Arahato Samma Sambuddhassa',
    subtitleBn: 'নমো তস্স ভগবতো অরহতো সম্মাসম্বুদ্ধস্স',
  },
  {
    key: 'neutral',
    labelEn: 'Neutral Heading (Marriage Biodata)',
    labelBn: 'সাধারণ শিরোনাম (বিবাহের বায়োডাটা)',
    subtitleEn: 'Marriage Biodata',
    subtitleBn: 'বিবাহের বায়োডাটা',
  },
  {
    key: 'custom',
    labelEn: 'Custom Top Heading',
    labelBn: 'নিজের মতো শিরোনাম লিখুন',
  },
  {
    key: 'none',
    labelEn: 'No Top Heading (Hidden)',
    labelBn: 'কোনো শিরোনাম নয় (লুকানো)',
  },
];

export const BD_EXAM_PRESETS = {
  en: [
    { examTitle: 'MSc / MBA / Masters', scale: '4.00' },
    { examTitle: 'BSc / BBA / Honours', scale: '4.00' },
    { examTitle: 'Diploma in Engineering', scale: '4.00' },
    { examTitle: 'HSC / Alim', scale: '5.00' },
    { examTitle: 'SSC / Dakhil', scale: '5.00' },
  ],
  bn: [
    { examTitle: 'স্নাতকোত্তর (মাস্টার্স / এমবিএ)', scale: '৪.০০' },
    { examTitle: 'স্নাতক (অনার্স / বিএসসি / বিবিএ)', scale: '৪.০০' },
    { examTitle: 'ডিপ্লোমা ইন ইঞ্জিনিয়ারিং', scale: '৪.০০' },
    { examTitle: 'এইচএসসি / আলিম', scale: '৫.০০' },
    { examTitle: 'এসএসসি / দাখিল', scale: '৫.০০' },
  ],
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
