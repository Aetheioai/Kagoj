import React from 'react';
import { Plus, Scissors, Sparkles, Trash2 } from 'lucide-react';
import {
  DocCustomization,
  DocLanguage,
  POSTER_ASPECT_RATIOS,
  PosterData,
  PosterKind,
  getPosterAspectSpec,
} from '../../types/builder';
import {
  SAMPLE_POSTER_TOLET_BN,
  SAMPLE_POSTER_TOLET_EN,
  SAMPLE_POSTER_TUITION_BN,
  SAMPLE_POSTER_TUITION_EN,
} from '../../data/extraSamples';
import { makeId } from '../../utils/storage';
import { FieldWrapper, PhotoUploader, SketchDivider } from '../SketchChrome';

interface PosterStepsProps {
  step: number; // 1 = Poster Type, Headline & Price, 2 = Key Details, Checklist & Photo, 3 = Location, Contact & Tear-Off Strips
  data: PosterData;
  language: DocLanguage;
  customization: DocCustomization;
  onChangeCustomization: (next: DocCustomization) => void;
  onChange: (next: PosterData) => void;
}

export function PosterSteps({
  step,
  data,
  language,
  customization,
  onChangeCustomization,
  onChange,
}: PosterStepsProps) {
  const isBn = language === 'bn';
  const update = (patch: Partial<PosterData>) => onChange({ ...data, ...patch });

  const loadQuickSample = (kind: PosterKind) => {
    if (kind === 'tolet') {
      onChange(structuredClone(isBn ? SAMPLE_POSTER_TOLET_BN : SAMPLE_POSTER_TOLET_EN));
    } else if (kind === 'tuition') {
      onChange(structuredClone(isBn ? SAMPLE_POSTER_TUITION_BN : SAMPLE_POSTER_TUITION_EN));
    } else {
      update({
        kind: 'notice',
        badgeText: isBn ? 'জরুরি ঘোষণা' : 'PUBLIC NOTICE',
        headline: isBn ? 'বিজ্ঞপ্তি' : 'NOTICE',
        subHeadline: isBn ? 'এলাকাবাসী ও সকলের অবগতির জন্য' : 'Important announcement for all residents',
      });
    }
  };

  // =========================================================================
  // STEP 1: POSTER KIND, HEADLINE & RENT / HONORARIUM BANNER
  // =========================================================================
  if (step === 1) {
    const kindOptions: { id: PosterKind; en: string; bn: string }[] = [
      { id: 'tolet', en: 'To-Let / Rent', bn: 'টু-লেট / বাসা ভাড়া' },
      { id: 'tuition', en: 'Private Tuition', bn: 'প্রাইভেট টিউশন' },
      { id: 'notice', en: 'General Notice', bn: 'সাধারণ বিজ্ঞপ্তি' },
    ];

    return (
      <div className="space-y-5">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">
            {isBn ? 'পোস্টারের শিরোনাম ও ভাড়া / সম্মানী' : 'Poster Headline & Price Banner'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isBn
              ? 'প্রিন্ট (A4) অথবা ফেসবুক/হোয়াটসঅ্যাপ পোস্টের (১:১, ৪:৫, ৯:১৬, ১৬:৯) যেকোনো সাইজে পোস্টার তৈরি করুন।'
              : 'Create crisp posters in any aspect ratio — A4 wall print or social formats (1:1, 4:5, 9:16, 16:9).'}
          </p>
        </div>

        {/* Poster Aspect Ratio / Size Picker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#24211d]">
              {isBn ? 'পোস্টারের সাইজ / অনুপাত (Aspect Ratio)' : 'Poster Size / Aspect Ratio'}
            </span>
            <span className="text-xs text-[#5c564d] tabular-nums">
              {getPosterAspectSpec(customization.posterAspectRatio).width} ×{' '}
              {getPosterAspectSpec(customization.posterAspectRatio).height}px
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {POSTER_ASPECT_RATIOS.map((spec) => {
              const active =
                (customization.posterAspectRatio || 'a4-portrait') === spec.id;
              const maxBox = 20;
              const ratio = spec.width / spec.height;
              const iconW = ratio >= 1 ? maxBox : Math.max(9, Math.round(maxBox * ratio));
              const iconH = ratio >= 1 ? Math.max(9, Math.round(maxBox / ratio)) : maxBox;
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() =>
                    onChangeCustomization({
                      ...customization,
                      posterAspectRatio: spec.id,
                    })
                  }
                  className={`text-left px-2.5 py-2 rounded-lg border cursor-pointer transition-colors flex items-center gap-2.5 ${
                    active
                      ? 'bg-[#24211d] text-[#fffdf8] border-[#24211d]'
                      : 'bg-[#fffdf8] text-[#24211d] border-[#3a3630]/35 hover:border-[#24211d]'
                  }`}
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0">
                    <span
                      className={`block rounded-[2px] border-[1.5px] ${
                        active ? 'border-[#fffdf8] bg-[#1e5645]' : 'border-[#5c564d] bg-[#f3ede0]'
                      }`}
                      style={{ width: `${iconW}px`, height: `${iconH}px` }}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold truncate">
                      {isBn ? spec.shortBn : spec.shortEn}
                    </span>
                    <span
                      className={`block text-[11px] truncate ${
                        active ? 'text-[#fffdf8]/75' : 'text-[#6f685e]'
                      }`}
                    >
                      {isBn ? spec.hintBn : spec.hintEn}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Poster Kind Switcher + Sample Fill */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#5c564d]">
              {isBn ? 'পোস্টারের ধরন:' : 'Poster Category:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => loadQuickSample('tolet')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-[#eef6f2] text-[#1e5645] border border-[#1e5645]/30 hover:border-[#1e5645] cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                {isBn ? 'টু-লেট নমুনা' : 'To-Let Sample'}
              </button>
              <button
                type="button"
                onClick={() => loadQuickSample('tuition')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-[#fdf4e7] text-[#8a4b14] border border-[#8a4b14]/30 hover:border-[#8a4b14] cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                {isBn ? 'টিউশন নমুনা' : 'Tuition Sample'}
              </button>
            </div>
          </div>

          <div className="inline-flex border-[1.5px] border-[#3a3630] rounded-lg overflow-hidden bg-[#f7f2e7]">
            {kindOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update({ kind: opt.id })}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  data.kind === opt.id
                    ? 'bg-[#1e5645] text-[#fffdf8]'
                    : 'text-[#5c564d] hover:text-[#24211d]'
                }`}
              >
                {isBn ? opt.bn : opt.en}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FieldWrapper
            label={isBn ? 'উপরের ছোট ট্যাগ লাইন' : 'Top Tagline / Category'}
            optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
          >
            <input
              type="text"
              value={data.badgeText}
              onChange={(e) => update({ badgeText: e.target.value })}
              placeholder={isBn ? 'ফ্যামিলি ফ্ল্যাট ভাড়া হবে' : 'FAMILY FLAT FOR RENT'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper label={isBn ? 'মূল বড় শিরোনাম' : 'Main Poster Headline'}>
            <input
              type="text"
              value={data.headline}
              onChange={(e) => update({ headline: e.target.value })}
              placeholder={isBn ? 'টু-লেট' : 'TO-LET'}
              className="sketch-input w-full px-3 py-2 text-sm font-bold"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'উপ-শিরোনাম (এক লাইনের সারাংশ)' : 'Sub-Headline'}
            className="sm:col-span-2"
          >
            <input
              type="text"
              value={data.subHeadline}
              onChange={(e) => update({ subHeadline: e.target.value })}
              placeholder={
                isBn
                  ? 'দক্ষিণমুখী ৩ বেডরুমের আধুনিক ফ্ল্যাট · আগামী মাস থেকে'
                  : 'Bright 3-Bedroom South-Facing Flat · Ready from Next Month'
              }
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>
        </div>

        <SketchDivider className="my-2" />

        {/* Price / Rent / Honorarium Callout */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1e5645]">
              {isBn ? 'ভাড়া / সম্মানী বক্স' : 'Rent / Honorarium Callout'}
            </h3>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#24211d] cursor-pointer">
              <input
                type="checkbox"
                checked={customization.showPriceBanner !== false}
                onChange={(e) =>
                  onChangeCustomization({ ...customization, showPriceBanner: e.target.checked })
                }
                className="accent-[#1e5645] w-4 h-4"
              />
              {isBn ? 'পোস্টারে দেখান' : 'Show Price Box'}
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FieldWrapper label={isBn ? 'লেবেল' : 'Price Label'}>
              <input
                type="text"
                value={data.priceLabel}
                onChange={(e) => update({ priceLabel: e.target.value })}
                placeholder={isBn ? 'মাসিক ভাড়া' : 'Monthly Rent'}
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper label={isBn ? 'টাকার পরিমাণ' : 'Amount'}>
              <input
                type="text"
                value={data.priceAmount}
                onChange={(e) => update({ priceAmount: e.target.value })}
                placeholder={isBn ? '৳ ২৪,০০০ / মাস' : '৳ 24,000 / month'}
                className="sketch-input w-full px-3 py-2 text-sm font-bold"
              />
            </FieldWrapper>

            <FieldWrapper
              label={isBn ? 'অতিরিক্ত নোট (সার্ভিস চার্জ / আলোচনা সাপেক্ষে)' : 'Price Note'}
              optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
              className="sm:col-span-2"
            >
              <input
                type="text"
                value={data.priceNote}
                onChange={(e) => update({ priceNote: e.target.value })}
                placeholder={
                  isBn
                    ? 'সার্ভিস চার্জ ৩,৫০০ টাকা · প্রিপেইড গ্যাস ও বিদ্যুৎ'
                    : 'Negotiable · Gas & Water included'
                }
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </FieldWrapper>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 2: KEY SPECS GRID, FEATURES CHECKLIST & OPTIONAL PHOTO
  // =========================================================================
  if (step === 2) {
    const addDetail = () => {
      update({
        details: [...data.details, { id: makeId('pd'), label: '', value: '' }],
      });
    };
    const updateDetail = (id: string, field: 'label' | 'value', val: string) => {
      update({
        details: data.details.map((d) => (d.id === id ? { ...d, [field]: val } : d)),
      });
    };
    const removeDetail = (id: string) => {
      update({ details: data.details.filter((d) => d.id !== id) });
    };

    return (
      <div className="space-y-5">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">
            {isBn ? 'বিস্তারিত তথ্য, সুবিধা ও ছবি' : 'Key Specifications, Features & Photo'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isBn
              ? 'রুমের সংখ্যা, তলা, বিষয় বা এলাকার মতো মূল তথ্যগুলো যোগ করুন।'
              : 'Add crisp spec cards (rooms, floor, subjects, area) and an optional cropped photo.'}
          </p>
        </div>

        {/* Dynamic Key Details Rows */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1e5645]">
              {isBn ? 'মূল তথ্যের ঘরসমূহ' : 'Key Details Grid'}
            </h3>
            <button
              type="button"
              onClick={addDetail}
              className="sketch-btn inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#fffdf8] text-[#1e5645] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {isBn ? 'নতুন ঘর যোগ' : 'Add Spec'}
            </button>
          </div>

          {data.details.length === 0 ? (
            <p className="text-xs text-[#7c7468] italic">
              {isBn
                ? 'কোনো ঘর নেই — "নতুন ঘর যোগ" ক্লিক করুন।'
                : 'No specs yet — click "Add Spec" to add room/subject highlights.'}
            </p>
          ) : (
            <div className="space-y-2">
              {data.details.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => updateDetail(row.id, 'label', e.target.value)}
                    placeholder={isBn ? 'শিরোনাম (যেমন: রুম)' : 'Label (e.g. Rooms)'}
                    className="sketch-input col-span-4 px-2.5 py-1.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => updateDetail(row.id, 'value', e.target.value)}
                    placeholder={isBn ? 'বিবরণ (যেমন: ৩ বেড · ৩ বাথ)' : 'Value (e.g. 3 Bed · 3 Bath)'}
                    className="sketch-input col-span-7 px-2.5 py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeDetail(row.id)}
                    className="col-span-1 flex items-center justify-center p-1.5 text-[#9f3324] hover:bg-[#fdf2f2] rounded cursor-pointer"
                    aria-label={isBn ? 'মুছুন' : 'Remove row'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <SketchDivider className="my-2" />

        {/* Features Checklist */}
        <div className="space-y-3">
          <FieldWrapper label={isBn ? 'সুবিধা তালিকার শিরোনাম' : 'Highlights Section Title'}>
            <input
              type="text"
              value={data.featuresTitle}
              onChange={(e) => update({ featuresTitle: e.target.value })}
              placeholder={isBn ? 'ফ্ল্যাটের সুবিধাসমূহ' : 'Flat Facilities & Highlights'}
              className="sketch-input w-full px-3 py-2 text-sm"
            />
          </FieldWrapper>

          <FieldWrapper
            label={isBn ? 'সুবিধা / বৈশিষ্ট্য তালিকা' : 'Features Checklist'}
            optionalText={isBn ? 'প্রতি লাইনে ১টি পয়েন্ট' : 'One bullet per line'}
          >
            <textarea
              rows={5}
              value={data.features}
              onChange={(e) => update({ features: e.target.value })}
              placeholder={
                isBn
                  ? '২৪ ঘণ্টা লিফট ও জেনারেটর\nপ্রিপেইড গ্যাস ও নিরবচ্ছিন্ন পানি\nসিসিটিভি নিরাপত্তা ব্যবস্থা'
                  : '24/7 Lift & Standby Generator\nDirect Gas & Uninterrupted Water\nCCTV Security & Garage Parking'
              }
              className="sketch-input w-full px-3 py-2 text-sm leading-relaxed"
            />
          </FieldWrapper>
        </div>

        <SketchDivider className="my-2" />

        {/* Optional Photo */}
        <PhotoUploader
          photo={data.photo}
          showPhoto={data.showPhoto}
          language={language}
          mode="poster"
          personName={data.headline}
          photoShape={customization.photoShape}
          onChangePhotoShape={(shape) =>
            onChangeCustomization({ ...customization, photoShape: shape })
          }
          onPhotoChange={(img) => update({ photo: img, showPhoto: true })}
          onToggleShow={() => update({ showPhoto: !data.showPhoto })}
          onRemove={() => update({ photo: '', showPhoto: false })}
          labels={{
            upload: isBn ? 'ফ্ল্যাট / টিউটরের ছবি দিন (ঐচ্ছিক)' : 'Add Flat / Tutor Photo (Optional)',
            replace: isBn ? 'ছবি বদলান' : 'Replace Photo',
            remove: isBn ? 'মুছুন' : 'Remove',
            visible: isBn ? 'ছবি পোস্টারে দেখানো হচ্ছে' : 'Photo Shown on Poster',
            hidden: isBn ? 'ছবি লুকানো' : 'Photo Hidden',
          }}
          helperText={
            isBn
              ? 'ছবি দিলে ক্রপ ও ফ্রেম ঠিক করার এডিটর খুলে যাবে। সাদাকালো প্রিন্টের জন্য ছবি বাদও রাখতে পারেন।'
              : 'Optional photo opens the crop & outline editor first. Skip for ultra-crisp B&W photocopy flyers.'
          }
        />
      </div>
    );
  }

  // =========================================================================
  // STEP 3: LOCATION, CONTACT PHONE & OPTIONAL TEAR-OFF PHONE STRIPS
  // =========================================================================
  const tearOffEnabled = Boolean(customization.showTearOffStrips);
  const tearOffCount = Math.min(8, Math.max(5, customization.tearOffCount ?? 6));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="sketch-heading text-3xl text-[#24211d]">
          {isBn ? 'ঠিকানা ও যোগাযোগের তথ্য' : 'Location & Contact Details'}
        </h2>
        <p className="text-xs text-[#5c564d] mt-1">
          {isBn
            ? 'বাসার ঠিকানা ও যোগাযোগের ফোন নম্বর দিন। নিচের কাটার স্লিপ সম্পূর্ণ ঐচ্ছিক (ডিফল্ট বন্ধ)।'
            : 'Add your address and contact phone number. Bottom tear-off phone tabs are strictly optional (off by default).'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FieldWrapper label={isBn ? 'ঠিকানার শিরোনাম' : 'Location Heading'}>
          <input
            type="text"
            value={data.addressTitle}
            onChange={(e) => update({ addressTitle: e.target.value })}
            placeholder={isBn ? 'বাসার ঠিকানা' : 'House Location'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'যোগাযোগের শিরোনাম' : 'Contact Callout Label'}>
          <input
            type="text"
            value={data.contactLabel}
            onChange={(e) => update({ contactLabel: e.target.value })}
            placeholder={isBn ? 'সরাসরি যোগাযোগ' : 'Call Directly for Visit'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'সম্পূর্ণ ঠিকানা' : 'Full Address / Area'} className="sm:col-span-2">
          <textarea
            rows={2}
            value={data.address}
            onChange={(e) => update({ address: e.target.value })}
            placeholder={
              isBn
                ? 'বাসা ১৮, রোড ৬, সেক্টর ৭, উত্তরা, ঢাকা-১২৩০'
                : 'House 18, Road 6, Sector 7, Uttara, Dhaka-1230'
            }
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper label={isBn ? 'যোগাযোগের ফোন নম্বর' : 'Contact Phone Number'}>
          <input
            type="text"
            value={data.contactPhone}
            onChange={(e) => update({ contactPhone: e.target.value })}
            placeholder={isBn ? '০১৭১১-২৩৪৫৬৭' : '01711-234567'}
            className="sketch-input w-full px-3 py-2 text-sm font-bold"
          />
        </FieldWrapper>

        <FieldWrapper
          label={isBn ? 'যোগাযোগকারীর নাম / পরিচয়' : 'Contact Name'}
          optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
        >
          <input
            type="text"
            value={data.contactName}
            onChange={(e) => update({ contactName: e.target.value })}
            placeholder={isBn ? 'বাড়িওয়ালা / তানভীর স্যার' : 'House Owner / Tanvir Sir'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>

        <FieldWrapper
          label={isBn ? 'কল করার সময় / নোট' : 'Contact Timing / Note'}
          optionalText={isBn ? 'ঐচ্ছিক' : 'Optional'}
          className="sm:col-span-2"
        >
          <input
            type="text"
            value={data.contactNote}
            onChange={(e) => update({ contactNote: e.target.value })}
            placeholder={isBn ? 'সকাল ১০টা থেকে রাত ৯টার মধ্যে কল করুন' : 'Call between 10 AM – 9 PM (No Broker)'}
            className="sketch-input w-full px-3 py-2 text-sm"
          />
        </FieldWrapper>
      </div>

      <SketchDivider className="my-2" />

      {/* Tear-Off Phone Number Strips Config */}
      <div className="sketch-box-dashed p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-[#1e5645]" />
            <div>
              <p className="text-sm font-bold text-[#24211d]">
                {isBn
                  ? 'ঐচ্ছিক: নিচের কাটার ফোন নম্বর স্লিপ (ডিফল্ট বন্ধ)'
                  : 'Optional: Bottom Tear-Off Phone Strips (Off by default)'}
              </p>
              <p className="text-xs text-[#6f685e]">
                {isBn
                  ? 'প্রয়োজন হলে তবেই চালু করুন — সাধারণত দেয়াল বা ফেসবুক পোস্টারের জন্য বন্ধ রাখাই ভালো।'
                  : 'Turn on only if you want cut-here paper phone tabs along the bottom edge.'}
              </p>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1e5645] cursor-pointer">
            <input
              type="checkbox"
              checked={tearOffEnabled}
              onChange={(e) =>
                onChangeCustomization({
                  ...customization,
                  showTearOffStrips: e.target.checked,
                })
              }
              className="accent-[#1e5645] w-4 h-4"
            />
            {tearOffEnabled ? (isBn ? 'চালু আছে' : 'Enabled') : isBn ? 'বন্ধ' : 'Off'}
          </label>
        </div>

        {tearOffEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <FieldWrapper label={isBn ? 'প্রতিটি স্লিপের সংক্ষিপ্ত শিরোনাম' : 'Short Tab Label'}>
              <input
                type="text"
                value={data.tearOffLabel}
                onChange={(e) => update({ tearOffLabel: e.target.value })}
                placeholder={isBn ? 'টু-লেট (উত্তরা)' : 'TO-LET (Uttara)'}
                className="sketch-input w-full px-3 py-2 text-xs"
              />
            </FieldWrapper>

            <div>
              <span className="block text-sm font-semibold text-[#24211d] mb-1">
                {isBn ? 'স্লিপের সংখ্যা' : 'Number of Tear-Off Tabs'}
              </span>
              <div className="inline-flex border-[1.5px] border-[#3a3630] rounded-lg overflow-hidden bg-[#fffdf8]">
                {[5, 6, 7, 8].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() =>
                      onChangeCustomization({ ...customization, tearOffCount: n })
                    }
                    className={`px-3.5 py-1.5 text-xs font-bold tabular-nums cursor-pointer transition-colors ${
                      tearOffCount === n
                        ? 'bg-[#1e5645] text-[#fffdf8]'
                        : 'text-[#5c564d] hover:text-[#24211d]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
