import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  BiodataData,
  DocCustomization,
  DocLanguage,
  EducationEntry,
  InvocationPreset,
  PageFormat,
  SiblingEntry,
} from '../../types/builder';
import {
  BD_EXAM_PRESETS,
  BLOOD_GROUPS,
  INVOCATION_OPTIONS,
  LABELS,
} from '../../data/i18n';
import { calculateAgeFromDob, makeId, toBanglaDigits } from '../../utils/storage';
import { FieldWrapper, PhotoUploader, SketchDivider } from '../SketchChrome';

interface BiodataStepsProps {
  step: number; // 1 = Personal & Photo, 2 = Edu & Career, 3 = Family & Address (+Guardian in 1P), 4 = About & Guardian (2P only)
  pageFormat: PageFormat;
  data: BiodataData;
  language: DocLanguage;
  photoShape: DocCustomization['photoShape'];
  onChangePhotoShape: (shape: DocCustomization['photoShape']) => void;
  onChange: (next: BiodataData) => void;
}

export function BiodataSteps({
  step,
  pageFormat,
  data,
  language,
  photoShape,
  onChangePhotoShape,
  onChange,
}: BiodataStepsProps) {
  const L = LABELS[language];
  const isOnePage = pageFormat === '1-page';
  const update = (patch: Partial<BiodataData>) => onChange({ ...data, ...patch });

  // =========================================================================
  // STEP 2: TOP HEADING / INVOCATION, PHOTO & PERSONAL DETAILS
  // =========================================================================
  if (step === 1) {
    const autoAge = calculateAgeFromDob(data.dateOfBirth);

    return (
      <div className="space-y-5">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">
            {isOnePage
              ? language === 'bn'
                ? 'মূল ব্যক্তিগত তথ্য (১ পৃষ্ঠা)'
                : 'Personal Essentials (1-Page)'
              : language === 'bn'
              ? 'ব্যক্তিগত তথ্য ও ছবি (২ পৃষ্ঠা)'
              : 'Header, Photo & Personal Details'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isOnePage
              ? language === 'bn'
                ? '১ পৃষ্ঠার সুন্দর বায়োডাটার জন্য মূল ব্যক্তিগত তথ্যগুলো দিন — খালি ঘর স্বয়ংক্রিয়ভাবে বাদ যাবে।'
                : 'Focused personal essentials arranged in a crisp 2-column grid so your entire biodata fits 1 A4 page.'
              : L.ui.emptyFieldsNote}
          </p>
        </div>

        {/* Optional Religious Invocation / Top Heading */}
        <div className="sketch-box-flat p-4 space-y-3">
          <FieldWrapper
            label={
              language === 'bn'
                ? 'শীর্ষ শিরোনাম / ধর্মীয় সূচনা'
                : 'Top Heading / Religious Invocation'
            }
            optionalText={L.ui.optional}
          >
            <select
              className="sketch-input"
              value={data.invocationPreset}
              onChange={(e) =>
                update({ invocationPreset: e.target.value as InvocationPreset })
              }
            >
              {INVOCATION_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {language === 'bn' ? opt.labelBn : opt.labelEn}
                </option>
              ))}
            </select>
          </FieldWrapper>

          {data.invocationPreset === 'custom' && (
            <FieldWrapper label={language === 'bn' ? 'কাস্টম শিরোনাম লিখুন' : 'Custom Heading Text'}>
              <input
                type="text"
                className="sketch-input"
                value={data.customInvocation}
                onChange={(e) => update({ customInvocation: e.target.value })}
                placeholder={language === 'bn' ? 'আপনার পছন্দের শিরোনাম...' : 'Enter your preferred top heading...'}
              />
            </FieldWrapper>
          )}
        </div>

        {/* Portrait Photo with instant Hide/Show */}
        <PhotoUploader
          photo={data.photo}
          showPhoto={data.showPhoto}
          language={language}
          mode="biodata"
          personName={data.fullName}
          photoShape={photoShape}
          onChangePhotoShape={onChangePhotoShape}
          onPhotoChange={(photo) => update({ photo, showPhoto: true })}
          onToggleShow={() => update({ showPhoto: !data.showPhoto })}
          onRemove={() => update({ photo: '' })}
          labels={{
            upload: L.ui.photoUpload,
            replace: L.ui.photoReplace,
            remove: L.ui.photoRemove,
            visible: L.ui.photoVisible,
            hidden: L.ui.photoHidden,
            hideAction: language === 'bn' ? 'ছবি লুকান' : 'Hide on PDF',
            showAction: language === 'bn' ? 'ছবি দেখান' : 'Show on PDF',
            editAction: language === 'bn' ? 'ক্রপ / এডিট' : 'Crop & Edit',
          }}
          helperText={
            language === 'bn'
              ? 'অনেক পরিবার শুরুতে ছবি ছাড়া বায়োডাটা পাঠাতে পছন্দ করেন — তাই যেকোনো সময় এক ক্লিকে ছবি লুকাতে পারবেন।'
              : 'Many families prefer sharing a biodata without a photo initially — hide or show it anytime with one click.'
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FieldWrapper
            label={language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
            className="sm:col-span-2"
          >
            <input
              type="text"
              className="sketch-input"
              value={data.fullName}
              onChange={(e) => update({ fullName: e.target.value })}
              placeholder={language === 'bn' ? 'যেমন: মাহমুদুল হাসান রাফি' : 'e.g. Mahmudul Hasan Rafi'}
            />
          </FieldWrapper>

          <FieldWrapper label={L.gender} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.gender}
              onChange={(e) => update({ gender: e.target.value })}
              placeholder={language === 'bn' ? 'পাত্র / পাত্রী' : 'Male / Female'}
            />
          </FieldWrapper>

          <FieldWrapper label={L.maritalStatus} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.maritalStatus}
              onChange={(e) => update({ maritalStatus: e.target.value })}
              placeholder={language === 'bn' ? 'অবিবাহিত' : 'Never Married'}
            />
          </FieldWrapper>

          <FieldWrapper
            label={L.dateOfBirth}
            hint={
              autoAge !== null
                ? language === 'bn'
                  ? `স্বয়ংক্রিয় বয়স: ${toBanglaDigits(autoAge)} বছর`
                  : `Auto-calculated age: ${autoAge} years`
                : undefined
            }
          >
            <input
              type="date"
              className="sketch-input"
              value={data.dateOfBirth}
              onChange={(e) => update({ dateOfBirth: e.target.value })}
            />
          </FieldWrapper>

          {!isOnePage && (
            <FieldWrapper
              label={language === 'bn' ? 'বয়স (ইচ্ছা হলে আলাদা লিখুন)' : 'Age Text Override'}
              optionalText={L.ui.optional}
            >
              <input
                type="text"
                className="sketch-input"
                value={data.ageOverride}
                onChange={(e) => update({ ageOverride: e.target.value })}
                placeholder={
                  autoAge !== null
                    ? language === 'bn'
                      ? `${toBanglaDigits(autoAge)} বছর`
                      : `${autoAge} years`
                    : language === 'bn'
                    ? '২৭ বছর'
                    : '27 years'
                }
              />
            </FieldWrapper>
          )}

          <FieldWrapper label={L.height} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.height}
              onChange={(e) => update({ height: e.target.value })}
              placeholder={language === 'bn' ? '৫ ফুট ৯ ইঞ্চি' : `5' 9"`}
            />
          </FieldWrapper>

          <FieldWrapper label={L.bloodGroup} optionalText={L.ui.optional}>
            <select
              className="sketch-input"
              value={data.bloodGroup}
              onChange={(e) => update({ bloodGroup: e.target.value })}
            >
              <option value="">{language === 'bn' ? 'নির্বাচন করুন' : 'Select'}</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper label={L.religion} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.religion}
              onChange={(e) => update({ religion: e.target.value })}
              placeholder={language === 'bn' ? 'ইসলাম (সুন্নি)' : 'Islam (Sunni)'}
            />
          </FieldWrapper>

          {!isOnePage && (
            <>
              <FieldWrapper label={L.nationality} optionalText={L.ui.optional}>
                <input
                  type="text"
                  className="sketch-input"
                  value={data.nationality}
                  onChange={(e) => update({ nationality: e.target.value })}
                  placeholder={language === 'bn' ? 'বাংলাদেশি' : 'Bangladeshi'}
                />
              </FieldWrapper>

              <FieldWrapper label={L.complexion} optionalText={L.ui.optional}>
                <input
                  type="text"
                  className="sketch-input"
                  value={data.complexion}
                  onChange={(e) => update({ complexion: e.target.value })}
                  placeholder={language === 'bn' ? 'উজ্জ্বল শ্যামলা / ফর্সা' : 'Fair / Wheatish'}
                />
              </FieldWrapper>

              <FieldWrapper label={L.weight} optionalText={L.ui.optional}>
                <input
                  type="text"
                  className="sketch-input"
                  value={data.weight}
                  onChange={(e) => update({ weight: e.target.value })}
                  placeholder={language === 'bn' ? '৭০ কেজি' : '70 kg'}
                />
              </FieldWrapper>

              <FieldWrapper
                label={L.lifestylePractice}
                optionalText={L.ui.optional}
                className="sm:col-span-2"
              >
                <input
                  type="text"
                  className="sketch-input"
                  value={data.lifestylePractice}
                  onChange={(e) => update({ lifestylePractice: e.target.value })}
                  placeholder={
                    language === 'bn'
                      ? 'নিয়মিত নামাজি, অধূমপায়ী ও পারিবারিক মূল্যবোধে বিশ্বাসী'
                      : 'Practicing Muslim, non-smoker, family-oriented'
                  }
                />
              </FieldWrapper>
            </>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 3: EDUCATION & CAREER
  // =========================================================================
  if (step === 2) {
    const presets = BD_EXAM_PRESETS[language];

    const addEdu = (examTitle = '', scale = '4.00') => {
      const next: EducationEntry = {
        id: makeId('bio-edu'),
        examTitle,
        groupOrMajor: '',
        institution: '',
        boardOrUniversity: '',
        passingYear: '',
        result: '',
        scale,
      };
      update({ education: [...data.education, next] });
    };

    const updateEdu = (id: string, patch: Partial<EducationEntry>) => {
      update({
        education: data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      });
    };

    const removeEdu = (id: string) => {
      update({ education: data.education.filter((e) => e.id !== id) });
    };

    return (
      <div className="space-y-5">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">{L.educationCareer}</h2>
          <p className="text-xs text-[#5c564d] mt-1">{L.ui.emptyFieldsNote}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FieldWrapper label={L.occupation} className="sm:col-span-2">
            <input
              type="text"
              className="sketch-input"
              value={data.occupation}
              onChange={(e) => update({ occupation: e.target.value })}
              placeholder={
                language === 'bn'
                  ? 'যেমন: সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার / মেডিকেল অফিসার / ব্যাংকার'
                  : 'e.g. Senior Software Engineer / Lecturer / Banker'
              }
            />
          </FieldWrapper>
          <FieldWrapper label={L.workplace} optionalText={L.ui.optional} className="sm:col-span-2">
            <input
              type="text"
              className="sketch-input"
              value={data.workplace}
              onChange={(e) => update({ workplace: e.target.value })}
              placeholder={
                language === 'bn'
                  ? 'প্রতিষ্ঠানের নাম ও এলাকা (যেমন: মহাখালী, ঢাকা)'
                  : 'Organization name & location'
              }
            />
          </FieldWrapper>
          {!isOnePage && (
            <FieldWrapper label={L.income} optionalText={L.ui.optional} className="sm:col-span-2">
              <input
                type="text"
                className="sketch-input"
                value={data.income}
                onChange={(e) => update({ income: e.target.value })}
                placeholder={
                  language === 'bn'
                    ? 'খালি রাখলে প্রিভিউতে দেখাবে না'
                    : 'Leave blank if you prefer to discuss privately'
                }
              />
            </FieldWrapper>
          )}
        </div>

        <SketchDivider className="my-4" />

        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#24211d]">{L.education}</h3>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.examTitle}
                type="button"
                onClick={() => addEdu(p.examTitle, p.scale)}
                className="sketch-btn px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 text-[#1e5645]" />
                {p.examTitle}
              </button>
            ))}
          </div>

          {data.education.map((edu, idx) => (
            <div key={edu.id} className="sketch-box-flat p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-[#3a3630]/25">
                <span className="text-sm font-bold text-[#1e5645]">
                  {edu.examTitle || `${L.examDegree} #${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removeEdu(edu.id)}
                  className="p-1 text-[#9f3324] cursor-pointer"
                  aria-label={L.ui.remove}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldWrapper label={L.examDegree}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={edu.examTitle}
                    onChange={(e) => updateEdu(edu.id, { examTitle: e.target.value })}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.groupMajor} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={edu.groupOrMajor}
                    onChange={(e) => updateEdu(edu.id, { groupOrMajor: e.target.value })}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.institution} className="sm:col-span-2">
                  <input
                    type="text"
                    className="sketch-input"
                    value={edu.institution}
                    onChange={(e) => updateEdu(edu.id, { institution: e.target.value })}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.passingYear} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={edu.passingYear}
                    onChange={(e) => updateEdu(edu.id, { passingYear: e.target.value })}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.resultGpa} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={edu.result}
                    onChange={(e) => updateEdu(edu.id, { result: e.target.value })}
                    placeholder={language === 'bn' ? '৫.০০ / ৩.৭৫' : '5.00 / 3.75'}
                  />
                </FieldWrapper>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 4: FAMILY BACKGROUND & ADDRESS (DESHER BARI)
  // =========================================================================
  if (step === 3) {
    const addSibling = () => {
      const next: SiblingEntry = {
        id: makeId('sib'),
        relation: '',
        details: '',
      };
      update({ siblings: [...data.siblings, next] });
    };

    const updateSibling = (id: string, patch: Partial<SiblingEntry>) => {
      update({
        siblings: data.siblings.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      });
    };

    const removeSibling = (id: string) => {
      update({ siblings: data.siblings.filter((s) => s.id !== id) });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">
            {isOnePage
              ? language === 'bn'
                ? 'পরিবার, ঠিকানা, প্রত্যাশা ও অভিভাবক'
                : 'Family, Address, Expectations & Guardian'
              : language === 'bn'
              ? 'পারিবারিক তথ্য ও ঠিকানা'
              : 'Family Background & Address'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isOnePage
              ? language === 'bn'
                ? '১ পৃষ্ঠায় নিখুঁতভাবে বসার জন্য সংক্ষিপ্ত পারিবারিক তথ্য ও যোগাযোগের নম্বর দিন।'
                : 'Concise family, hometown, partner preference, and guardian contact designed to complete your 1-page biodata.'
              : L.ui.emptyFieldsNote}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FieldWrapper label={L.fatherName}>
            <input
              type="text"
              className="sketch-input"
              value={data.fatherName}
              onChange={(e) => update({ fatherName: e.target.value })}
            />
          </FieldWrapper>
          <FieldWrapper label={L.fatherOccupation} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.fatherOccupation}
              onChange={(e) => update({ fatherOccupation: e.target.value })}
              placeholder={language === 'bn' ? 'অবসরপ্রাপ্ত সরকারি কর্মকর্তা / ব্যবসায়ী' : 'Retired Govt. Officer / Business'}
            />
          </FieldWrapper>
          <FieldWrapper label={L.motherName}>
            <input
              type="text"
              className="sketch-input"
              value={data.motherName}
              onChange={(e) => update({ motherName: e.target.value })}
            />
          </FieldWrapper>
          <FieldWrapper label={L.motherOccupation} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.motherOccupation}
              onChange={(e) => update({ motherOccupation: e.target.value })}
              placeholder={language === 'bn' ? 'গৃহিণী / শিক্ষিকা' : 'Homemaker / Teacher'}
            />
          </FieldWrapper>
        </div>

        {/* Siblings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#24211d]">
              {L.siblings} <span className="text-xs font-normal text-[#7c7468]">({L.ui.optional})</span>
            </h3>
            <button
              type="button"
              onClick={addSibling}
              className="sketch-btn px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#1e5645]" />
              {language === 'bn' ? 'ভাই/বোন যুক্ত করুন' : 'Add Sibling'}
            </button>
          </div>

          {data.siblings.map((s) => (
            <div key={s.id} className="sketch-box-flat p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  className="sketch-input"
                  value={s.relation}
                  onChange={(e) => updateSibling(s.id, { relation: e.target.value })}
                  placeholder={language === 'bn' ? 'যেমন: বড় বোন (১ জন) / ছোট ভাই' : 'e.g. Elder Sister (1) / Younger Brother'}
                />
                <button
                  type="button"
                  onClick={() => removeSibling(s.id)}
                  className="p-1.5 text-[#9f3324] cursor-pointer"
                  aria-label={L.ui.remove}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                className="sketch-input"
                value={s.details}
                onChange={(e) => updateSibling(s.id, { details: e.target.value })}
                placeholder={
                  language === 'bn'
                    ? 'বিবাহিত/অবিবাহিত, পেশা বা পড়াশোনার বিবরণ...'
                    : 'Marital status, occupation, or education details...'
                }
              />
            </div>
          ))}
        </div>

        {!isOnePage && (
          <div className="space-y-3.5">
            <FieldWrapper label={L.extendedFamily} optionalText={L.ui.optional}>
              <textarea
                rows={2}
                className="sketch-input"
                value={data.extendedFamilyNote}
                onChange={(e) => update({ extendedFamilyNote: e.target.value })}
                placeholder={
                  language === 'bn'
                    ? 'চাচা / মামা বা নিকটাত্মীয়দের সংক্ষিপ্ত পরিচিতি (ঐচ্ছিক)...'
                    : 'Brief note on paternal/maternal uncles if desired...'
                }
              />
            </FieldWrapper>
            <FieldWrapper label={L.familyNote} optionalText={L.ui.optional}>
              <textarea
                rows={2}
                className="sketch-input"
                value={data.familyBackgroundNote}
                onChange={(e) => update({ familyBackgroundNote: e.target.value })}
                placeholder={
                  language === 'bn'
                    ? 'পরিবারের ধরন বা সংক্ষিপ্ত পরিচিতি...'
                    : 'Short overview of family background and values...'
                }
              />
            </FieldWrapper>
          </div>
        )}

        <SketchDivider className="my-4" />

        {/* Present & Permanent Address (Desher Bari) */}
        <div className="space-y-3.5">
          <h3 className="text-base font-bold text-[#24211d]">{L.addressDetails}</h3>
          <FieldWrapper label={L.presentAddress}>
            <input
              type="text"
              className="sketch-input"
              value={data.presentAddress}
              onChange={(e) => update({ presentAddress: e.target.value })}
              placeholder={
                language === 'bn'
                  ? 'যেমন: সেক্টর ৭, উত্তরা, ঢাকা-১২৩০'
                  : 'e.g. Sector 7, Uttara, Dhaka-1230'
              }
            />
          </FieldWrapper>

          {isOnePage ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldWrapper label={L.upazila} optionalText={L.ui.optional}>
                <input
                  type="text"
                  className="sketch-input"
                  value={data.permanentUpazila}
                  onChange={(e) => update({ permanentUpazila: e.target.value })}
                />
              </FieldWrapper>
              <FieldWrapper label={`${L.desherBari} (${L.district})`} optionalText={L.ui.optional}>
                <input
                  type="text"
                  className="sketch-input"
                  value={data.permanentDistrict}
                  onChange={(e) => update({ permanentDistrict: e.target.value })}
                  placeholder={language === 'bn' ? 'যেমন: কুমিল্লা / সিলেট' : 'e.g. Cumilla / Sylhet'}
                />
              </FieldWrapper>
            </div>
          ) : (
            <div className="sketch-box-dashed p-3.5 space-y-3">
              <div className="text-xs font-bold text-[#24211d]">{L.desherBari}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <FieldWrapper label={L.village} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={data.permanentVillage}
                    onChange={(e) => update({ permanentVillage: e.target.value })}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.upazila} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={data.permanentUpazila}
                    onChange={(e) => update({ permanentUpazila: e.target.value })}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.district} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={data.permanentDistrict}
                    onChange={(e) => update({ permanentDistrict: e.target.value })}
                    placeholder={language === 'bn' ? 'যেমন: কুমিল্লা / সিলেট' : 'e.g. Cumilla / Sylhet'}
                  />
                </FieldWrapper>
              </div>
            </div>
          )}
        </div>

        {/* 1-Page Concise Expectations + Guardian Contact right inside Step 3 */}
        {isOnePage && (
          <>
            <SketchDivider className="my-4" />

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#24211d]">
                {L.partnerExpectations}{' '}
                <span className="text-xs font-normal text-[#7c7468]">({L.ui.optional})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <FieldWrapper label={L.expectedAge} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={data.expectedAge}
                    onChange={(e) => update({ expectedAge: e.target.value })}
                    placeholder={language === 'bn' ? '২২–২৬ বছর' : '22–26 years'}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.expectedHeight} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={data.expectedHeight}
                    onChange={(e) => update({ expectedHeight: e.target.value })}
                    placeholder={language === 'bn' ? '৫\'২" – ৫\'৬"' : `5'2" – 5'6"`}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.expectedEducation} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={data.expectedEducation}
                    onChange={(e) => update({ expectedEducation: e.target.value })}
                    placeholder={language === 'bn' ? 'স্নাতক / স্নাতকোত্তর' : 'Honours / Masters'}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.expectedQualities} optionalText={L.ui.optional} className="sm:col-span-3">
                  <input
                    type="text"
                    className="sketch-input"
                    value={data.expectedQualities}
                    onChange={(e) => update({ expectedQualities: e.target.value })}
                    placeholder={
                      language === 'bn'
                        ? 'ধর্মপরায়ণ, নম্র, শিক্ষিত ও পারিবারিক মূল্যবোধসম্পন্ন'
                        : 'Kind-hearted, educated, practicing religious & family values'
                    }
                  />
                </FieldWrapper>
              </div>
            </div>

            <div className="sketch-box-flat p-4 space-y-3">
              <h3 className="text-base font-bold text-[#1e5645]">{L.guardianContact}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <FieldWrapper label={L.contactPerson}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={data.guardianName}
                    onChange={(e) => update({ guardianName: e.target.value })}
                    placeholder={language === 'bn' ? 'মোঃ আব্দুল হালিম' : 'Md. Abdul Halim'}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.relationship}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={data.guardianRelation}
                    onChange={(e) => update({ guardianRelation: e.target.value })}
                    placeholder={language === 'bn' ? 'পিতা / মাতা' : 'Father / Mother'}
                  />
                </FieldWrapper>
                <FieldWrapper label={L.whatsappPhone}>
                  <input
                    type="tel"
                    className="sketch-input"
                    value={data.guardianPhone}
                    onChange={(e) => update({ guardianPhone: e.target.value })}
                    placeholder={language === 'bn' ? '০১৭XX-XXXXXX' : '+880 17XX-XXXXXX'}
                  />
                </FieldWrapper>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // =========================================================================
  // STEP 5: ABOUT ME, PARTNER EXPECTATIONS & GUARDIAN CONTACT
  // =========================================================================
  return (
    <div className="space-y-6">
      <div>
        <h2 className="sketch-heading text-3xl text-[#24211d]">
          {language === 'bn' ? 'নিজের কথা, প্রত্যাশা ও অভিভাবকের যোগাযোগ' : 'About Me, Expectations & Guardian'}
        </h2>
        <p className="text-xs text-[#5c564d] mt-1">{L.ui.emptyFieldsNote}</p>
      </div>

      <div className="space-y-3.5">
        <FieldWrapper label={L.aboutMe} optionalText={L.ui.optional}>
          <textarea
            rows={3}
            className="sketch-input"
            value={data.aboutMe}
            onChange={(e) => update({ aboutMe: e.target.value })}
            placeholder={
              language === 'bn'
                ? 'নিজের ব্যক্তিত্ব, মূল্যবোধ বা জীবনযাপন সম্পর্কে সংক্ষেপে লিখুন...'
                : 'Short personal introduction, personality, and values...'
            }
          />
        </FieldWrapper>
        <FieldWrapper label={L.hobbies} optionalText={L.ui.optional}>
          <input
            type="text"
            className="sketch-input"
            value={data.hobbies}
            onChange={(e) => update({ hobbies: e.target.value })}
            placeholder={
              language === 'bn'
                ? 'বই পড়া, ভ্রমণ, ফটোগ্রাফি...'
                : 'Reading, travelling, photography, cooking...'
            }
          />
        </FieldWrapper>
      </div>

      <SketchDivider className="my-4" />

      <div className="space-y-3.5">
        <h3 className="text-base font-bold text-[#24211d]">
          {L.partnerExpectations}{' '}
          <span className="text-xs font-normal text-[#7c7468]">({L.ui.optional})</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FieldWrapper label={L.expectedAge} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.expectedAge}
              onChange={(e) => update({ expectedAge: e.target.value })}
              placeholder={language === 'bn' ? '২২ – ২৬ বছর' : '22 – 26 years'}
            />
          </FieldWrapper>
          <FieldWrapper label={L.expectedHeight} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.expectedHeight}
              onChange={(e) => update({ expectedHeight: e.target.value })}
              placeholder={language === 'bn' ? '৫ ফুট ২ ইঞ্চি – ৫ ফুট ৬ ইঞ্চি' : `5' 2" – 5' 6"`}
            />
          </FieldWrapper>
          <FieldWrapper label={L.expectedEducation} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.expectedEducation}
              onChange={(e) => update({ expectedEducation: e.target.value })}
            />
          </FieldWrapper>
          <FieldWrapper label={L.expectedProfession} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.expectedProfession}
              onChange={(e) => update({ expectedProfession: e.target.value })}
            />
          </FieldWrapper>
          <FieldWrapper label={L.expectedLocation} optionalText={L.ui.optional} className="sm:col-span-2">
            <input
              type="text"
              className="sketch-input"
              value={data.expectedLocation}
              onChange={(e) => update({ expectedLocation: e.target.value })}
            />
          </FieldWrapper>
          <FieldWrapper label={L.expectedQualities} optionalText={L.ui.optional} className="sm:col-span-2">
            <textarea
              rows={2}
              className="sketch-input"
              value={data.expectedQualities}
              onChange={(e) => update({ expectedQualities: e.target.value })}
            />
          </FieldWrapper>
        </div>
      </div>

      <SketchDivider className="my-4" />

      {/* Guardian Contact */}
      <div className="sketch-box-flat p-4 space-y-3.5">
        <h3 className="text-base font-bold text-[#1e5645]">{L.guardianContact}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FieldWrapper label={L.contactPerson}>
            <input
              type="text"
              className="sketch-input"
              value={data.guardianName}
              onChange={(e) => update({ guardianName: e.target.value })}
              placeholder={language === 'bn' ? 'যেমন: মোঃ আব্দুল হালিম' : 'e.g. Md. Abdul Halim'}
            />
          </FieldWrapper>
          <FieldWrapper label={L.relationship}>
            <input
              type="text"
              className="sketch-input"
              value={data.guardianRelation}
              onChange={(e) => update({ guardianRelation: e.target.value })}
              placeholder={language === 'bn' ? 'পিতা / মাতা / বড় ভাই / নিজে' : 'Father / Mother / Elder Brother / Self'}
            />
          </FieldWrapper>
          <FieldWrapper label={L.whatsappPhone}>
            <input
              type="tel"
              className="sketch-input"
              value={data.guardianPhone}
              onChange={(e) => update({ guardianPhone: e.target.value })}
              placeholder={language === 'bn' ? '০১৭XX-XXXXXX (হোয়াটসঅ্যাপ)' : '+880 17XX-XXXXXX (WhatsApp)'}
            />
          </FieldWrapper>
          <FieldWrapper label={L.email} optionalText={L.ui.optional}>
            <input
              type="email"
              className="sketch-input"
              value={data.guardianEmail}
              onChange={(e) => update({ guardianEmail: e.target.value })}
            />
          </FieldWrapper>
        </div>
      </div>
    </div>
  );
}
