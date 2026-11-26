import React from 'react';
import { Sparkles, UserCheck } from 'lucide-react';
import { DocLanguage, OfficeLetterData } from '../../types/builder';
import { OFFICE_LETTER_PRESETS } from '../../data/extraSamples';
import { FieldWrapper, PhotoUploader, SketchDivider } from '../SketchChrome';
import { SignatureUploader } from '../SignaturePadModal';

interface OfficeLetterStepsProps {
  step: number; // 1 = Preset & Letterhead, 2 = Recipient, Subject & Body, 3 = Sender, CC & Signature
  data: OfficeLetterData;
  language: DocLanguage;
  hasCvData: boolean;
  onFillFromCv: () => void;
  onChange: (next: OfficeLetterData) => void;
}

export function OfficeLetterSteps({
  step,
  data,
  language,
  hasCvData,
  onFillFromCv,
  onChange,
}: OfficeLetterStepsProps) {
  const isBn = language === 'bn';
  const update = (patch: Partial<OfficeLetterData>) => onChange({ ...data, ...patch });

  const applyPreset = (presetKey: string) => {
    const preset = OFFICE_LETTER_PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;
    const patch = isBn ? preset.patchBn : preset.patchEn;
    update({ presetKey, ...patch });
  };

  // =========================================================================
  // STEP 1: LETTER TYPE PRESET, OPTIONAL LETTERHEAD & MEMO INFO
  // =========================================================================
  if (step === 1) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="sketch-heading text-3xl text-[#24211d]">
              {isBn ? 'দরখাস্তের ধরন ও লেটারহেড' : 'Letter Type & Optional Letterhead'}
            </h2>
            <p className="text-xs text-[#5c564d] mt-1">
              {isBn
                ? 'বাংলাদেশি অফিস, ব্যাংক বা স্কুল-কলেজের প্রস্তুত ফরম্যাট বেছে নিন — প্রতিটি লাইন নিজের মতো বদলানো যাবে।'
                : 'Choose a ready-made Bangladeshi formal preset or start from a blank letter.'}
            </p>
          </div>
          {hasCvData && (
            <button
              type="button"
              onClick={onFillFromCv}
              className="sketch-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#eef6f2] text-[#1e5645] cursor-pointer whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {isBn ? 'সিভি থেকে আমার তথ্য আনুন' : 'Fill from my CV'}
            </button>
          )}
        </div>

        {/* 8 Formal Letter Presets */}
        <div>
          <p className="text-xs font-semibold text-[#5c564d] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1e5645]" />
            {isBn ? 'বাংলা ও ইংরেজি দরখাস্ত প্রিসেট:' : 'Formal application presets:'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {OFFICE_LETTER_PRESETS.map((p) => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FieldWrapper label={isBn ? 'তারিখ' : 'Date'}>
            <input
              type="date"
              value={data.date}
              onChange={(e) => update({ date: e.target.value })}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'স্মারক / সূত্র নং' : 'Memo / Reference No.'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
          >
            <input
              type="text"
              value={data.memoNo}
              onChange={(e) => update({ memoNo: e.target.value })}
              placeholder={isBn ? 'স্মারক নং: ২০২৬/০৪২' : 'Ref: HR/2026/042'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>
        </div>

        <SketchDivider className="my-2" />

        {/* Optional Organization Letterhead */}
        <div className="space-y-3.5">
          <div>
            <h3 className="text-sm font-bold text-[#1e5645]">
              {isBn ? 'প্রাতিষ্ঠানিক লেটারহেড (ঐচ্ছিক)' : 'Official Organization Letterhead (Optional)'}
            </h3>
            <p className="text-xs text-[#6f685e]">
              {isBn
                ? 'অফিসের প্যাডে চিঠি বা নোটিশ তৈরি করতে প্রতিষ্ঠানের নাম ও লোগো দিন; সাধারণ দরখাস্তে খালি রাখুন।'
                : 'Fill only if printing on company/club letterhead or issuing an office circular.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FieldWrapper
              label={isBn ? 'প্রতিষ্ঠানের শিরোনাম' : 'Letterhead Organization Name'}
              optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
            >
              <input
                type="text"
                value={data.orgHeaderName}
                onChange={(e) => update({ orgHeaderName: e.target.value })}
                placeholder={isBn ? 'পদ্মা হরাইজন টেক্সটাইলস লিমিটেড' : 'Padma Horizon Textiles Ltd.'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper
              label={isBn ? 'উপ-শিরোনাম / ঠিকানা' : 'Letterhead Subtitle / Address'}
              optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
            >
              <input
                type="text"
                value={data.orgHeaderSub}
                onChange={(e) => update({ orgHeaderSub: e.target.value })}
                placeholder={isBn ? 'বনানী, ঢাকা-১২১৩ · ফোন: ০১৭১১-০০০০০০' : 'Banani, Dhaka-1213 · info@company.com'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>
          </div>

          <PhotoUploader
            photo={data.orgLogo}
            showPhoto={data.showLogo}
            language={language}
            mode="office_letter"
            personName={data.orgHeaderName}
            photoShape="rounded"
            onPhotoChange={(img) => update({ orgLogo: img, showLogo: true })}
            onToggleShow={() => update({ showLogo: !data.showLogo })}
            onRemove={() => update({ orgLogo: '', showLogo: false })}
            labels={{
              upload: isBn ? 'প্রতিষ্ঠানের লোগো দিন' : 'Upload Org Logo',
              replace: isBn ? 'লোগো বদলান' : 'Replace Logo',
              remove: isBn ? 'মুছুন' : 'Remove',
              visible: isBn ? 'লোগো দৃশ্যমান' : 'Logo Visible',
              hidden: isBn ? 'লোগো লুকানো' : 'Logo Hidden',
              hideAction: isBn ? 'লুকান' : 'Hide',
              showAction: isBn ? 'দেখান' : 'Show',
            }}
            helperText={
              isBn
                ? 'অফিস, স্কুল বা সমিতির লোগো থাকলে দিন — না থাকলে খালি রাখুন।'
                : 'Optional logo for official letterheads, schools, or apartment societies.'
            }
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 2: RECIPIENT (বরাবর), THROUGH (মাধ্যম), SUBJECT & BODY
  // =========================================================================
  if (step === 2) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">
            {isBn ? 'প্রাপক, বিষয় ও মূল দরখাস্ত' : 'Recipient, Subject & Letter Body'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isBn
              ? 'বরাবর, মাধ্যম (প্রয়োজনে), বিষয় এবং আপনার মূল আবেদনটি লিখুন।'
              : 'Enter the addressee, optional Through line, subject, and body paragraphs.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FieldWrapper label={isBn ? 'সম্বোধন (বরাবর / To)' : 'Addressee Label'}>
            <input
              type="text"
              value={data.recipientLabel}
              onChange={(e) => update({ recipientLabel: e.target.value })}
              placeholder={isBn ? 'বরাবর' : 'To'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper label={isBn ? 'প্রাপকের পদবি' : 'Recipient Title / Officer'}>
            <input
              type="text"
              value={data.recipientTitle}
              onChange={(e) => update({ recipientTitle: e.target.value })}
              placeholder={isBn ? 'বিভাগীয় প্রধান / শাখা ব্যবস্থাপক / অধ্যক্ষ' : 'Head of Department / Branch Manager'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper label={isBn ? 'প্রতিষ্ঠানের নাম' : 'Organization / School / Bank'}>
            <input
              type="text"
              value={data.organization}
              onChange={(e) => update({ organization: e.target.value })}
              placeholder={isBn ? 'পদ্মা হরাইজন টেক্সটাইলস লিমিটেড' : 'Padma Horizon Textiles Ltd.'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper label={isBn ? 'প্রতিষ্ঠানের ঠিকানা' : 'Organization Address'}>
            <input
              type="text"
              value={data.organizationAddress}
              onChange={(e) => update({ organizationAddress: e.target.value })}
              placeholder={isBn ? 'বনানী, ঢাকা-১২১৩' : 'Banani, Dhaka-1213'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'মাধ্যম (Through)' : 'Through (Proper Channel)'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
            className="sm:col-span-2"
          >
            <input
              type="text"
              value={data.throughLine}
              onChange={(e) => update({ throughLine: e.target.value })}
              placeholder={isBn ? 'মাধ্যম: যথাযথ কর্তৃপক্ষ' : 'Through: Line Manager / Class Teacher'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>
        </div>

        <FieldWrapper label={isBn ? 'বিষয় (Subject)' : 'Subject'}>
          <input
            type="text"
            value={data.subject}
            onChange={(e) => update({ subject: e.target.value })}
            placeholder={
              isBn
                ? 'তিন (০৩) দিনের নৈমিত্তিক ছুটির জন্য আবেদন।'
                : 'Application for Three (03) Days Casual Leave'
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

        <FieldWrapper
          label={isBn ? 'দরখাস্তের মূল বক্তব্য' : 'Letter Body'}
          hint={
            isBn
              ? 'নতুন অনুচ্ছেদ তৈরি করতে এন্টার দিয়ে ফাঁকা লাইন রাখুন।'
              : 'Leave a blank line between paragraphs for crisp spacing.'
          }
        >
          <textarea
            rows={9}
            value={data.bodyText}
            onChange={(e) => update({ bodyText: e.target.value })}
            placeholder={
              isBn
                ? 'যথাবিহিত সম্মানপূর্বক বিনীত নিবেদন এই যে...'
                : 'With due respect, I would like to inform you that...'
            }
            className="sketch-input w-full px-3 py-2 text-sm leading-relaxed"
          />
        </FieldWrapper>
      </div>
    );
  }

  // =========================================================================
  // STEP 3: SENDER DETAILS, HANDWRITTEN SIGNATURE & CC (অনুলিপি)
  // =========================================================================
  return (
    <div className="space-y-5">
      <div>
        <h2 className="sketch-heading text-3xl text-[#24211d]">
          {isBn ? 'আবেদনকারীর তথ্য, স্বাক্ষর ও অনুলিপি' : 'Sender Details, Signature & CC'}
        </h2>
        <p className="text-xs text-[#5c564d] mt-1">
          {isBn
            ? 'নিচে আপনার নাম, পদবি/রোল, স্বাক্ষর এবং প্রয়োজনে অনুলিপি (CC) যুক্ত করুন।'
            : 'Add signatory information, handwritten signature, and optional copy-to (CC) recipients.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FieldWrapper label={isBn ? 'সমাপনী সম্বোধন' : 'Sign-Off Line'}>
          <input
            type="text"
            value={data.signOff}
            onChange={(e) => update({ signOff: e.target.value })}
            placeholder={isBn ? 'বিনীত নিবেদক,' : 'Yours sincerely,'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'আবেদনকারীর নাম' : 'Sender Full Name'}>
          <input
            type="text"
            value={data.senderName}
            onChange={(e) => update({ senderName: e.target.value })}
            placeholder={isBn ? 'মোঃ মাহমুদুল হাসান' : 'Md. Mahmudul Hasan'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper
          label={isBn ? 'পদবি / শ্রেণি' : 'Designation / Class'}
          optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
        >
          <input
            type="text"
            value={data.senderDesignation}
            onChange={(e) => update({ senderDesignation: e.target.value })}
            placeholder={isBn ? 'সিনিয়র এক্সিকিউটিভ, অপারেশনস' : 'Senior Executive, Operations'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper
          label={isBn ? 'আইডি / রোল / হিসাব নং' : 'Employee ID / Roll / Account No.'}
          optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
        >
          <input
            type="text"
            value={data.senderIdOrDept}
            onChange={(e) => update({ senderIdOrDept: e.target.value })}
            placeholder={isBn ? 'আইডি নং: PHT-1042' : 'Employee ID: PHT-1042'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper
          label={isBn ? 'মোবাইল নম্বর' : 'Phone'}
          optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
        >
          <input
            type="text"
            value={data.senderPhone}
            onChange={(e) => update({ senderPhone: e.target.value })}
            placeholder={isBn ? '০১৭১৫-২২৪৪৮৮' : '+880 1715-224488'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper
          label={isBn ? 'ইমেইল / ঠিকানা' : 'Email / Address'}
          optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
        >
          <input
            type="text"
            value={data.senderEmail || data.senderAddress}
            onChange={(e) => update({ senderEmail: e.target.value, senderAddress: '' })}
            placeholder="name@example.com"
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
        label={isBn ? 'অনুলিপি (সদয় অবগতির জন্য / CC)' : 'Copy To (CC)'}
        optionalText={isBn ? 'ঐচ্ছিক · প্রতি লাইনে ১টি' : 'Optional · One per line'}
      >
        <textarea
          rows={3}
          value={data.ccList}
          onChange={(e) => update({ ccList: e.target.value })}
          placeholder={
            isBn
              ? '১. মানবসম্পদ বিভাগ\n২. সংশ্লিষ্ট বিভাগীয় প্রধান'
              : '1. Human Resources Division\n2. Line Manager (For kind information)'
          }
          className="sketch-input w-full px-3 py-2 text-sm leading-relaxed"
        />
      </FieldWrapper>
    </div>
  );
}
