import React from 'react';
import { Sparkles, UserCheck } from 'lucide-react';
import { DocLanguage, JobAppData } from '../../types/builder';
import { JOB_APP_PRESETS } from '../../data/extraSamples';
import { FieldWrapper, SketchDivider } from '../SketchChrome';
import { SignatureUploader } from '../SignaturePadModal';

interface JobAppStepsProps {
  step: number; // 1 = Sender & Recipient, 2 = Subject & Letter Body, 3 = Enclosures & Signature
  data: JobAppData;
  language: DocLanguage;
  hasCvData: boolean;
  onFillFromCv: () => void;
  onChange: (next: JobAppData) => void;
}

export function JobAppSteps({
  step,
  data,
  language,
  hasCvData,
  onFillFromCv,
  onChange,
}: JobAppStepsProps) {
  const isBn = language === 'bn';
  const update = (patch: Partial<JobAppData>) => onChange({ ...data, ...patch });

  const applyPreset = (presetKey: string) => {
    const preset = JOB_APP_PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;
    const patch = isBn ? preset.patchBn : preset.patchEn;
    update({ presetKey, ...patch });
  };

  // =========================================================================
  // STEP 1: PRESET, CV AUTO-FILL, APPLICANT & RECIPIENT
  // =========================================================================
  if (step === 1) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="sketch-heading text-3xl text-[#24211d]">
              {isBn ? 'আবেদনকারী ও প্রাপকের তথ্য' : 'Applicant & Recipient Details'}
            </h2>
            <p className="text-xs text-[#5c564d] mt-1">
              {isBn
                ? 'চাকরির ধরন বেছে নিন, তারপর আপনার ও প্রতিষ্ঠানের তথ্য দিন। খালি ঘর পিডিএফে স্বয়ংক্রিয়ভাবে বাদ যাবে।'
                : 'Pick a job preset to start quickly, then fill your details and the employer address.'}
            </p>
          </div>
          {hasCvData && (
            <button
              type="button"
              onClick={onFillFromCv}
              className="sketch-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#eef6f2] text-[#1e5645] cursor-pointer whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {isBn ? 'আমার সিভি থেকে তথ্য আনুন' : 'Fill from my CV'}
            </button>
          )}
        </div>

        {/* Job Role Presets */}
        <div>
          <p className="text-xs font-semibold text-[#5c564d] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1e5645]" />
            {isBn ? 'দ্রুত টেমপ্লেট ড্রাফট বেছে নিন:' : 'Quick role letter presets:'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {JOB_APP_PRESETS.map((p) => {
              const active = data.presetKey === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => applyPreset(p.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border-[1.5px] cursor-pointer transition-colors ${
                    active
                      ? 'bg-[#1e5645] text-[#fffdf8] border-[#24211d]'
                      : 'bg-[#fffdf8] text-[#4a453e] border-[#c8c0b2] hover:border-[#24211d]'
                  }`}
                >
                  {isBn ? p.labelBn : p.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        <SketchDivider className="my-2" />

        {/* Applicant (Sender) */}
        <div className="space-y-3.5">
          <h3 className="text-sm font-bold text-[#1e5645]">
            {isBn ? 'আপনার তথ্য (আবেদনকারী)' : 'Your Information (Applicant)'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FieldWrapper label={isBn ? 'পূর্ণ নাম' : 'Full Name'}>
              <input
                type="text"
                value={data.senderName}
                onChange={(e) =>
                  update({
                    senderName: e.target.value,
                    signatureName:
                      !data.signatureName || data.signatureName === data.senderName
                        ? e.target.value
                        : data.signatureName,
                  })
                }
                placeholder={isBn ? 'তানভীর আহমেদ চৌধুরী' : 'Tanvir Ahmed Chowdhury'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper
              label={isBn ? 'যোগ্যতা / পদবি' : 'Headline / Degree'}
              optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
            >
              <input
                type="text"
                value={data.senderTitle}
                onChange={(e) => update({ senderTitle: e.target.value })}
                placeholder={isBn ? 'এমবিএ (ফিন্যান্স), ঢাকা বিশ্ববিদ্যালয়' : 'MBA (Finance), University of Dhaka'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper label={isBn ? 'মোবাইল নম্বর' : 'Phone Number'}>
              <input
                type="text"
                value={data.senderPhone}
                onChange={(e) => update({ senderPhone: e.target.value })}
                placeholder={isBn ? '০১৭১২-৪৮৫৯২০' : '+880 1712-485920'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper label={isBn ? 'ইমেইল' : 'Email'}>
              <input
                type="email"
                value={data.senderEmail}
                onChange={(e) => update({ senderEmail: e.target.value })}
                placeholder="name@example.com"
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper label={isBn ? 'ঠিকানা' : 'Present Address'} className="sm:col-span-2">
              <input
                type="text"
                value={data.senderAddress}
                onChange={(e) => update({ senderAddress: e.target.value })}
                placeholder={isBn ? 'বাসা ২৪, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯' : 'House 24, Road 9/A, Dhanmondi, Dhaka-1209'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper
              label={isBn ? 'লিঙ্কডইন / পোর্টফোলিও' : 'LinkedIn / Portfolio'}
              optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
            >
              <input
                type="text"
                value={data.senderPortfolio}
                onChange={(e) => update({ senderPortfolio: e.target.value })}
                placeholder="linkedin.com/in/yourname"
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper label={isBn ? 'তারিখ' : 'Date'}>
              <input
                type="date"
                value={data.date}
                onChange={(e) => update({ date: e.target.value })}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>
          </div>
        </div>

        <SketchDivider className="my-2" />

        {/* Recipient (Employer) */}
        <div className="space-y-3.5">
          <h3 className="text-sm font-bold text-[#1e5645]">
            {isBn ? 'প্রাপকের তথ্য (বরাবর)' : 'Recipient / Employer Details'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FieldWrapper label={isBn ? 'সম্বোধন শীর্ষক' : 'Recipient Label'}>
              <input
                type="text"
                value={data.recipientLabel}
                onChange={(e) => update({ recipientLabel: e.target.value })}
                placeholder={isBn ? 'বরাবর' : 'To'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper
              label={isBn ? 'বিজ্ঞপ্তি / রেফারেন্স নং' : 'Job Ref / Circular No.'}
              optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
            >
              <input
                type="text"
                value={data.referenceNo}
                onChange={(e) => update({ referenceNo: e.target.value })}
                placeholder={isBn ? 'যেমন: HRD/2026/14' : 'e.g. HRD/2026/14'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper label={isBn ? 'প্রাপকের পদবি / নাম' : 'Recipient Name / Title'}>
              <input
                type="text"
                value={data.recipientName}
                onChange={(e) => update({ recipientName: e.target.value })}
                placeholder={isBn ? 'মহাব্যবস্থাপক / প্রধান' : 'Head of Human Resources'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper
              label={isBn ? 'বিভাগ' : 'Department / Division'}
              optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
            >
              <input
                type="text"
                value={data.recipientTitle}
                onChange={(e) => update({ recipientTitle: e.target.value })}
                placeholder={isBn ? 'মানবসম্পদ বিভাগ' : 'Human Resources Division'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper label={isBn ? 'প্রতিষ্ঠানের নাম' : 'Company / Organization'}>
              <input
                type="text"
                value={data.organization}
                onChange={(e) => update({ organization: e.target.value })}
                placeholder={isBn ? 'ইস্টার্ন মার্কেন্টাইল ব্যাংক পিএলসি' : 'Eastern Mercantile Bank PLC'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper label={isBn ? 'প্রতিষ্ঠানের ঠিকানা' : 'Organization Address'}>
              <input
                type="text"
                value={data.organizationAddress}
                onChange={(e) => update({ organizationAddress: e.target.value })}
                placeholder={isBn ? 'প্রধান কার্যালয়, মতিঝিল বা/এ, ঢাকা-১০০০' : 'Head Office, Motijheel C/A, Dhaka-1000'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 2: SUBJECT, SALUTATION & LETTER BODY
  // =========================================================================
  if (step === 2) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">
            {isBn ? 'বিষয় ও আবেদনের মূল বক্তব্য' : 'Subject & Letter Body'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isBn
              ? 'বিষয় ও তিনটি অনুচ্ছেদে আপনার আগ্রহ, দক্ষতা এবং সাক্ষাৎকারের অনুরোধ পরিষ্কারভাবে লিখুন।'
              : 'Write a sharp subject line followed by your opening, qualifications, and closing request.'}
          </p>
        </div>

        <FieldWrapper label={isBn ? 'বিষয় (Subject)' : 'Subject Line'}>
          <input
            type="text"
            value={data.subject}
            onChange={(e) => update({ subject: e.target.value })}
            placeholder={
              isBn
                ? 'ম্যানেজমেন্ট ট্রেইনি অফিসার পদে চাকরির জন্য আবেদন।'
                : 'Application for the position of Management Trainee Officer (MTO)'
            }
            className="sketch-input w-full px-3 py-2 text-sm font-medium"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'সম্বোধন (Salutation)' : 'Salutation'}>
          <input
            type="text"
            value={data.salutation}
            onChange={(e) => update({ salutation: e.target.value })}
            placeholder={isBn ? 'মহোদয়,' : 'Dear Sir / Madam,'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? '১ম অনুচ্ছেদ (সূচনা ও পদের উল্লেখ)' : 'Opening Paragraph'}>
          <textarea
            rows={4}
            value={data.openingParagraph}
            onChange={(e) => update({ openingParagraph: e.target.value })}
            placeholder={
              isBn
                ? 'যথাবিহিত সম্মানপূর্বক বিনীত নিবেদন এই যে...'
                : 'With reference to your recent recruitment announcement...'
            }
            className="sketch-input w-full px-3 py-2 text-sm leading-relaxed"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? '২য় অনুচ্ছেদ (যোগ্যতা ও অভিজ্ঞতা)' : 'Qualifications & Experience'}>
          <textarea
            rows={5}
            value={data.bodyParagraph}
            onChange={(e) => update({ bodyParagraph: e.target.value })}
            placeholder={
              isBn
                ? 'আপনার শিক্ষাগত যোগ্যতা, দক্ষতা ও কাজের অভিজ্ঞতা সংক্ষেপে তুলে ধরুন...'
                : 'Highlight your education, relevant skills, internships, or achievements...'
            }
            className="sketch-input w-full px-3 py-2 text-sm leading-relaxed"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? '৩য় অনুচ্ছেদ (উপসংহার ও অনুরোধ)' : 'Closing Paragraph'}>
          <textarea
            rows={3}
            value={data.closingParagraph}
            onChange={(e) => update({ closingParagraph: e.target.value })}
            placeholder={
              isBn
                ? 'অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা এই যে...'
                : 'I would welcome the opportunity to discuss my qualifications in an interview...'
            }
            className="sketch-input w-full px-3 py-2 text-sm leading-relaxed"
          />
        </FieldWrapper>
      </div>
    );
  }

  // =========================================================================
  // STEP 3: ENCLOSURES & HANDWRITTEN SIGNATURE
  // =========================================================================
  return (
    <div className="space-y-5">
      <div>
        <h2 className="sketch-heading text-3xl text-[#24211d]">
          {isBn ? 'সংযুক্তি ও স্বাক্ষর' : 'Enclosures & Signature'}
        </h2>
        <p className="text-xs text-[#5c564d] mt-1">
          {isBn
            ? 'সিভিসহ কী কী কাগজপত্র সংযুক্ত করছেন তা লিখুন এবং চাইলে আপনার হাতের স্বাক্ষর যুক্ত করুন।'
            : 'List attached documents and optionally add your handwritten signature for ready-to-send PDFs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FieldWrapper label={isBn ? 'সমাপনী সম্বোধন' : 'Sign-Off Phrase'}>
          <input
            type="text"
            value={data.signOff}
            onChange={(e) => update({ signOff: e.target.value })}
            placeholder={isBn ? 'বিনীত নিবেদক,' : 'Sincerely yours,'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'স্বাক্ষরের নিচে নাম' : 'Printed Signature Name'}>
          <input
            type="text"
            value={data.signatureName}
            onChange={(e) => update({ signatureName: e.target.value })}
            placeholder={data.senderName || (isBn ? 'তানভীর আহমেদ চৌধুরী' : 'Tanvir Ahmed Chowdhury')}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>
      </div>

      <SignatureUploader
        signature={data.signatureImage}
        language={language}
        onChange={(sig) => update({ signatureImage: sig })}
      />

      <FieldWrapper
        label={isBn ? 'সংযুক্তি (Enclosures)' : 'Enclosures / Attachments'}
        optionalText={isBn ? 'প্রতি লাইনে ১টি' : 'One per line'}
      >
        <textarea
          rows={4}
          value={data.enclosures}
          onChange={(e) => update({ enclosures: e.target.value })}
          placeholder={
            isBn
              ? '১. পূর্ণাঙ্গ জীবনবৃত্তান্ত (CV)\n২. সকল শিক্ষাগত সনদের সত্যায়িত ফটোকপি\n৩. ২ কপি পাসপোর্ট সাইজ ছবি ও এনআইডি'
              : '1. Curriculum Vitae (CV)\n2. Attested copies of Academic Certificates\n3. Two passport-size photographs & NID copy'
          }
          className="sketch-input w-full px-3 py-2 text-sm leading-relaxed"
        />
      </FieldWrapper>
    </div>
  );
}
