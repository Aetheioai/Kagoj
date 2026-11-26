import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import {
  CVData,
  DocCustomization,
  DocLanguage,
  EducationEntry,
  ExperienceEntry,
  PageFormat,
  ProjectEntry,
  ReferenceEntry,
  TrainingEntry,
} from '../../types/builder';
import { BD_EXAM_PRESETS, BLOOD_GROUPS, LABELS } from '../../data/i18n';
import { makeId } from '../../utils/storage';
import { FieldWrapper, PhotoUploader, SketchDivider } from '../SketchChrome';
import { SignatureUploader } from '../SignaturePadModal';

interface CVStepsProps {
  step: number; // 1 = Basics, 2 = Education, 3 = Exp & Skills, 4 = Personal & Refs (2-page only)
  pageFormat: PageFormat;
  data: CVData;
  language: DocLanguage;
  photoShape: DocCustomization['photoShape'];
  onChangePhotoShape: (shape: DocCustomization['photoShape']) => void;
  onChange: (next: CVData) => void;
}

export function CVSteps({
  step,
  pageFormat,
  data,
  language,
  photoShape,
  onChangePhotoShape,
  onChange,
}: CVStepsProps) {
  const L = LABELS[language];
  const isOnePage = pageFormat === '1-page';
  const [showProjects, setShowProjects] = useState(
    data.projects.length > 0 || (!isOnePage && data.trainings.length > 0)
  );

  const update = (patch: Partial<CVData>) => onChange({ ...data, ...patch });
  const updatePersonal = (patch: Partial<CVData['personalInfo']>) => {
    update({ personalInfo: { ...data.personalInfo, ...patch } });
  };

  // =========================================================================
  // STEP 2: BASICS, PHOTO & CAREER OBJECTIVE
  // =========================================================================
  if (step === 1) {
    const objectivePresets = isOnePage
      ? language === 'bn'
        ? [
            {
              label: 'ফ্রেশ গ্র্যাজুয়েট (১ পৃষ্ঠা)',
              text: 'শক্তিশালী একাডেমিক ভিত্তি, দ্রুত শেখার আগ্রহ ও দলগত দক্ষতাসম্পন্ন তরুণ স্নাতক; একটি স্বনামধন্য প্রতিষ্ঠানে কার্যকর অবদান রাখতে আগ্রহী।',
            },
            {
              label: 'কর্পোরেট ও টেক (১ পৃষ্ঠা)',
              text: 'বিশ্লেষণধর্মী ও লক্ষ্যনিষ্ঠ পেশাজীবী; ডেটা-নির্ভর সিদ্ধান্ত, আধুনিক সফটওয়্যার ও সময়ানুবর্তিতার মাধ্যমে প্রাতিষ্ঠানিক প্রবৃদ্ধি অর্জনে আগ্রহী।',
            },
          ]
        : [
            {
              label: 'Fresh Graduate (Short)',
              text: 'Motivated graduate with a strong academic record and quick adaptability seeking an entry-level role to deliver measurable value from day one.',
            },
            {
              label: 'Corporate / Tech (Short)',
              text: 'Analytical professional skilled in problem-solving, reporting, and modern tools, looking to drive impact at a growth-focused Bangladeshi organization.',
            },
          ]
      : language === 'bn'
      ? [
          {
            label: 'ফ্রেশ গ্র্যাজুয়েট',
            text: 'একটি স্বনামধন্য প্রতিষ্ঠানে কর্মজীবন শুরু করতে আগ্রহী, যেখানে আমার শিক্ষাগত জ্ঞান, শেখার আগ্রহ এবং দায়িত্বশীল মনোভাব প্রতিষ্ঠানের উন্নয়নে অবদান রাখবে।',
          },
          {
            label: 'ব্যাংক ও ফাইন্যান্স',
            text: 'দেশের একটি শীর্ষস্থানীয় ব্যাংক বা আর্থিক প্রতিষ্ঠানে কাজ করতে আগ্রহী, যেখানে আর্থিক বিশ্লেষণ, গ্রাহক সেবা ও নির্ভুল প্রতিবেদন তৈরির দক্ষতা প্রয়োগ করা যাবে।',
          },
        ]
      : [
          {
            label: 'Fresh Graduate',
            text: 'Motivated graduate seeking an entry-level opportunity in a reputed Bangladeshi organization where strong academic foundation, adaptability, and teamwork can contribute to organizational goals.',
          },
          {
            label: 'Bank & Corporate',
            text: 'Analytical and detail-oriented professional aiming to contribute to a leading commercial bank or corporate team through strong financial literacy, disciplined execution, and clear communication.',
          },
        ];

    return (
      <div className="space-y-5">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">
            {isOnePage
              ? language === 'bn'
                ? 'প্রাথমিক তথ্য ও সংক্ষিপ্ত পরিচিতি'
                : 'Basics & Short Summary (1-Page)'
              : language === 'bn'
              ? 'প্রাথমিক তথ্য ও ছবি'
              : 'Header, Contact & Photo (2-Page)'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isOnePage
              ? language === 'bn'
                ? '১ পৃষ্ঠার সিভির জন্য সংক্ষিপ্ত ও কার্যকর তথ্য দিন — খালি ঘর স্বয়ংক্রিয়ভাবে বাদ যাবে।'
                : 'Keep details crisp so your entire CV fits handsomely on 1 single A4 page.'
              : L.ui.emptyFieldsNote}
          </p>
        </div>

        <PhotoUploader
          photo={data.photo}
          showPhoto={data.showPhoto}
          language={language}
          mode="cv"
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
              ? 'পাসপোর্ট সাইজের ফর্মাল ছবি যুক্ত করুন। এক ক্লিকে ছবি লুকাতে বা দেখাতে পারবেন।'
              : 'Optional passport-size formal photo. Toggle it on or off for international vs. local Bangladeshi applications.'
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldWrapper
            label={language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
            className="sm:col-span-2"
          >
            <input
              type="text"
              className="sketch-input"
              value={data.fullName}
              onChange={(e) => update({ fullName: e.target.value })}
              placeholder={language === 'bn' ? 'যেমন: তানভীর আহমেদ চৌধুরী' : 'e.g. Tanvir Ahmed Chowdhury'}
            />
          </FieldWrapper>

          <FieldWrapper
            label={language === 'bn' ? 'পেশাগত পরিচিতি / পদবি' : 'Headline / Role'}
            optionalText={L.ui.optional}
            className="sm:col-span-2"
          >
            <input
              type="text"
              className="sketch-input"
              value={data.headline}
              onChange={(e) => update({ headline: e.target.value })}
              placeholder={
                language === 'bn'
                  ? 'যেমন: এমবিএ (ফাইন্যান্স), ঢাকা বিশ্ববিদ্যালয়'
                  : 'e.g. Business & Financial Analyst | BBA, University of Dhaka'
              }
            />
          </FieldWrapper>

          <FieldWrapper label={L.phone}>
            <input
              type="tel"
              className="sketch-input"
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder={language === 'bn' ? '০১৭XX-XXXXXX' : '+880 17XX-XXXXXX'}
            />
          </FieldWrapper>

          <FieldWrapper label={L.email}>
            <input
              type="email"
              className="sketch-input"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="name@example.com"
            />
          </FieldWrapper>

          <FieldWrapper label={L.presentAddress} className="sm:col-span-2">
            <input
              type="text"
              className="sketch-input"
              value={data.presentAddress}
              onChange={(e) => update({ presentAddress: e.target.value })}
              placeholder={
                language === 'bn'
                  ? 'বাড়ি ২৪, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯'
                  : 'House 24, Road 9/A, Dhanmondi, Dhaka-1209'
              }
            />
          </FieldWrapper>

          <FieldWrapper
            label={L.portfolio}
            optionalText={L.ui.optional}
            className="sm:col-span-2"
          >
            <input
              type="text"
              className="sketch-input"
              value={data.portfolioLink}
              onChange={(e) => update({ portfolioLink: e.target.value })}
              placeholder="linkedin.com/in/your-profile"
            />
          </FieldWrapper>
        </div>

        <SketchDivider className="my-4" />

        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[#24211d]">
              {L.careerObjective} <span className="text-xs font-normal text-[#7c7468]">({L.ui.optional})</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {objectivePresets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => update({ careerObjective: p.text })}
                  className="px-2.5 py-1 text-xs font-medium text-[#1e5645] bg-[#eef5f2] border border-[#1e5645]/35 rounded-md hover:border-[#1e5645] cursor-pointer whitespace-nowrap"
                >
                  + {p.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            rows={isOnePage ? 2 : 4}
            className="sketch-input"
            value={data.careerObjective}
            onChange={(e) => update({ careerObjective: e.target.value })}
            placeholder={
              isOnePage
                ? language === 'bn'
                  ? '১–২ লাইনের সংক্ষিপ্ত ক্যারিয়ার সারাংশ লিখুন (১ পৃষ্ঠায় নিখুঁতভাবে বসার জন্য)...'
                  : 'Write a crisp 1–2 line summary tailored for a 1-page CV...'
                : language === 'bn'
                ? 'সংক্ষেপে আপনার ক্যারিয়ারের লক্ষ্য লিখুন...'
                : 'Write a concise 2–3 line professional objective...'
            }
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 3: EDUCATIONAL QUALIFICATIONS (BD FORMAT)
  // =========================================================================
  if (step === 2) {
    const presets = BD_EXAM_PRESETS[language];

    const addEdu = (examTitle = '', scale = '4.00') => {
      const next: EducationEntry = {
        id: makeId('edu'),
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

    const moveEdu = (index: number, dir: -1 | 1) => {
      const target = index + dir;
      if (target < 0 || target >= data.education.length) return;
      const arr = [...data.education];
      [arr[index], arr[target]] = [arr[target], arr[index]];
      update({ education: arr });
    };

    return (
      <div className="space-y-5">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">{L.education}</h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isOnePage
              ? language === 'bn'
                ? '১ পৃষ্ঠার জন্য সাম্প্রতিক ২–৩টি ডিগ্রি (যেমন: মাস্টার্স/অনার্স ও এইচএসসি) যুক্ত করাই যথেষ্ট।'
                : 'For a crisp 1-page CV, list your latest 2–3 qualifications (e.g., Masters/Honours & HSC).'
              : language === 'bn'
              ? 'সর্বশেষ ডিগ্রি সবার উপরে রাখুন (যেমন: মাস্টার্স → অনার্স → এইচএসসি → এসএসসি)।'
              : 'List your latest degree first (e.g., Masters → Honours/BSc → HSC → SSC).'}
          </p>
        </div>

        {/* Quick-add BD exam buttons */}
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.examTitle}
              type="button"
              onClick={() => addEdu(preset.examTitle, preset.scale)}
              className="sketch-btn px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#1e5645]" />
              {preset.examTitle}
            </button>
          ))}
        </div>

        {data.education.length === 0 ? (
          <div className="sketch-box-dashed p-6 text-center space-y-2">
            <p className="text-sm font-semibold text-[#24211d]">
              {language === 'bn' ? 'এখনো কোনো শিক্ষাগত যোগ্যতা যুক্ত করা হয়নি' : 'No education rows added yet'}
            </p>
            <p className="text-xs text-[#5c564d]">
              {language === 'bn'
                ? 'উপরের বাটন থেকে এসএসসি, এইচএসসি, অনার্স বা মাস্টার্স যুক্ত করুন।'
                : 'Click any preset button above to add SSC, HSC, Honours/BSc, Diploma, or Masters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="sketch-box-flat p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-[#3a3630]/25">
                  <span className="text-sm font-bold text-[#1e5645]">
                    {edu.examTitle || `${L.examDegree} #${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveEdu(idx, -1)}
                      className="p-1 text-[#5c564d] hover:text-[#24211d] disabled:opacity-30 cursor-pointer"
                      aria-label="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.education.length - 1}
                      onClick={() => moveEdu(idx, 1)}
                      className="p-1 text-[#5c564d] hover:text-[#24211d] disabled:opacity-30 cursor-pointer"
                      aria-label="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeEdu(edu.id)}
                      className="p-1 text-[#9f3324] hover:opacity-75 cursor-pointer"
                      aria-label={L.ui.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldWrapper label={L.examDegree}>
                    <input
                      type="text"
                      className="sketch-input"
                      value={edu.examTitle}
                      onChange={(e) => updateEdu(edu.id, { examTitle: e.target.value })}
                      placeholder={language === 'bn' ? 'এসএসসি / এইচএসসি / বিএসসি' : 'SSC / HSC / BSc / MBA'}
                    />
                  </FieldWrapper>
                  <FieldWrapper label={L.groupMajor}>
                    <input
                      type="text"
                      className="sketch-input"
                      value={edu.groupOrMajor}
                      onChange={(e) => updateEdu(edu.id, { groupOrMajor: e.target.value })}
                      placeholder={language === 'bn' ? 'বিজ্ঞান / ব্যবসায় শিক্ষা / সিএসই' : 'Science / Business / CSE'}
                    />
                  </FieldWrapper>
                  <FieldWrapper label={L.institution} className="sm:col-span-2">
                    <input
                      type="text"
                      className="sketch-input"
                      value={edu.institution}
                      onChange={(e) => updateEdu(edu.id, { institution: e.target.value })}
                      placeholder={
                        language === 'bn'
                          ? 'যেমন: নটর ডেম কলেজ / ঢাকা বিশ্ববিদ্যালয়'
                          : 'e.g. Notre Dame College / University of Dhaka'
                      }
                    />
                  </FieldWrapper>
                  <FieldWrapper label={L.boardUniversity}>
                    <input
                      type="text"
                      className="sketch-input"
                      value={edu.boardOrUniversity}
                      onChange={(e) => updateEdu(edu.id, { boardOrUniversity: e.target.value })}
                      placeholder={
                        language === 'bn'
                          ? 'ঢাকা বোর্ড / জাতীয় বিশ্ববিদ্যালয়'
                          : 'Dhaka Board / National University'
                      }
                    />
                  </FieldWrapper>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <FieldWrapper label={L.passingYear}>
                      <input
                        type="text"
                        className="sketch-input"
                        value={edu.passingYear}
                        onChange={(e) => updateEdu(edu.id, { passingYear: e.target.value })}
                        placeholder={language === 'bn' ? '২০২৪' : '2024'}
                      />
                    </FieldWrapper>
                    <FieldWrapper label={language === 'bn' ? 'জিপিএ' : 'GPA'}>
                      <input
                        type="text"
                        className="sketch-input"
                        value={edu.result}
                        onChange={(e) => updateEdu(edu.id, { result: e.target.value })}
                        placeholder={language === 'bn' ? '৫.০০' : '5.00'}
                      />
                    </FieldWrapper>
                    <FieldWrapper label={language === 'bn' ? 'স্কেল' : 'Out of'}>
                      <input
                        type="text"
                        className="sketch-input"
                        value={edu.scale}
                        onChange={(e) => updateEdu(edu.id, { scale: e.target.value })}
                        placeholder={language === 'bn' ? '৫.০০' : '5.00'}
                      />
                    </FieldWrapper>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // STEP 4: WORK EXPERIENCE, SKILLS, PROJECTS & TRAINING
  // =========================================================================
  if (step === 3) {
    const addExp = () => {
      const next: ExperienceEntry = {
        id: makeId('exp'),
        role: '',
        organization: '',
        location: '',
        duration: '',
        bullets: '',
      };
      update({ experience: [...data.experience, next] });
    };

    const updateExp = (id: string, patch: Partial<ExperienceEntry>) => {
      update({
        experience: data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      });
    };

    const removeExp = (id: string) => {
      update({ experience: data.experience.filter((e) => e.id !== id) });
    };

    const addProject = () => {
      const next: ProjectEntry = {
        id: makeId('proj'),
        title: '',
        subtitle: '',
        year: '',
        description: '',
        link: '',
      };
      update({ projects: [...data.projects, next] });
    };

    const updateProject = (id: string, patch: Partial<ProjectEntry>) => {
      update({
        projects: data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      });
    };

    const removeProject = (id: string) => {
      update({ projects: data.projects.filter((p) => p.id !== id) });
    };

    const addTraining = () => {
      const next: TrainingEntry = {
        id: makeId('trn'),
        title: '',
        organization: '',
        year: '',
        duration: '',
      };
      update({ trainings: [...data.trainings, next] });
    };

    const updateTraining = (id: string, patch: Partial<TrainingEntry>) => {
      update({
        trainings: data.trainings.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      });
    };

    const removeTraining = (id: string) => {
      update({ trainings: data.trainings.filter((t) => t.id !== id) });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="sketch-heading text-3xl text-[#24211d]">
            {isOnePage
              ? language === 'bn'
                ? 'অভিজ্ঞতা, দক্ষতা ও মূল তথ্য'
                : 'Experience, Skills & Highlights'
              : language === 'bn'
              ? 'অভিজ্ঞতা, দক্ষতা ও প্রশিক্ষণ'
              : 'Experience, Skills & Projects'}
          </h2>
          <p className="text-xs text-[#5c564d] mt-1">
            {isOnePage
              ? language === 'bn'
                ? '১ পৃষ্ঠায় সুন্দরভাবে বসানোর জন্য ১–২টি মূল অভিজ্ঞতা ও প্রতিটিতে ২টি করে পয়েন্ট লিখুন।'
                : 'For 1-page fit, keep 1–2 recent roles with 2–3 concise bullet points each. Freshers can leave experience blank.'
              : language === 'bn'
              ? 'ফ্রেশ গ্র্যাজুয়েট হলে কর্মঅভিজ্ঞতা খালি রাখুন — প্রিভিউ থেকে তা স্বয়ংক্রিয়ভাবে বাদ যাবে।'
              : 'Fresh graduate? Leave Work Experience blank — the section automatically hides itself.'}
          </p>
        </div>

        {/* Work Experience */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[#24211d]">
              {L.experience}{' '}
              <span className="text-xs font-normal text-[#7c7468]">({L.ui.optional})</span>
            </h3>
            <button
              type="button"
              onClick={addExp}
              className="sketch-btn px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#1e5645]" />
              {language === 'bn' ? 'অভিজ্ঞতা যুক্ত করুন' : 'Add Experience'}
            </button>
          </div>

          {data.experience.map((exp, idx) => (
            <div key={exp.id} className="sketch-box-flat p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-[#3a3630]/25">
                <span className="text-sm font-bold text-[#1e5645]">
                  {exp.role || `${language === 'bn' ? 'অভিজ্ঞতা' : 'Role'} #${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removeExp(exp.id)}
                  className="p-1 text-[#9f3324] hover:opacity-75 cursor-pointer"
                  aria-label={L.ui.remove}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldWrapper label={language === 'bn' ? 'পদবি' : 'Job Title / Role'}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={exp.role}
                    onChange={(e) => updateExp(exp.id, { role: e.target.value })}
                    placeholder={language === 'bn' ? 'যেমন: ম্যানেজমেন্ট ট্রেইনি' : 'e.g. Management Trainee / Intern'}
                  />
                </FieldWrapper>
                <FieldWrapper label={language === 'bn' ? 'সময়কাল' : 'Duration'}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={exp.duration}
                    onChange={(e) => updateExp(exp.id, { duration: e.target.value })}
                    placeholder={language === 'bn' ? 'জানুয়ারি ২০২৫ – বর্তমান' : 'Jan 2025 – Present'}
                  />
                </FieldWrapper>
                <FieldWrapper label={language === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Organization'}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={exp.organization}
                    onChange={(e) => updateExp(exp.id, { organization: e.target.value })}
                    placeholder={language === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Company / Bank / NGO name'}
                  />
                </FieldWrapper>
                <FieldWrapper label={language === 'bn' ? 'অবস্থান' : 'Location'} optionalText={L.ui.optional}>
                  <input
                    type="text"
                    className="sketch-input"
                    value={exp.location}
                    onChange={(e) => updateExp(exp.id, { location: e.target.value })}
                    placeholder={language === 'bn' ? 'মতিঝিল, ঢাকা' : 'Motijheel, Dhaka'}
                  />
                </FieldWrapper>
                <FieldWrapper
                  label={language === 'bn' ? 'মূল দায়িত্বসমূহ (প্রতি লাইনে একটি পয়েন্ট)' : 'Key Responsibilities (one bullet per line)'}
                  className="sm:col-span-2"
                >
                  <textarea
                    rows={3}
                    className="sketch-input"
                    value={exp.bullets}
                    onChange={(e) => updateExp(exp.id, { bullets: e.target.value })}
                    placeholder={
                      language === 'bn'
                        ? 'প্রতিটি কাজের বিবরণ নতুন লাইনে লিখুন...'
                        : 'Write each achievement or responsibility on a new line...'
                    }
                  />
                </FieldWrapper>
              </div>
            </div>
          ))}
        </div>

        <SketchDivider className="my-4" />

        {/* Skills & Languages */}
        <div className="space-y-3.5">
          <h3 className="text-base font-bold text-[#24211d]">{L.skills}</h3>
          <FieldWrapper label={L.technicalSkills} optionalText={L.ui.optional}>
            <textarea
              rows={2}
              className="sketch-input"
              value={data.technicalSkills}
              onChange={(e) => update({ technicalSkills: e.target.value })}
              placeholder={
                language === 'bn'
                  ? 'আর্থিক বিশ্লেষণ, প্রতিবেদন তৈরি, প্রজেক্ট ম্যানেজমেন্ট...'
                  : 'Financial Modeling, Credit Appraisal, Data Analysis, React, SQL...'
              }
            />
          </FieldWrapper>
          <FieldWrapper label={L.softwareTools} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.softwareTools}
              onChange={(e) => update({ softwareTools: e.target.value })}
              placeholder={
                language === 'bn'
                  ? 'এমএস ওয়ার্ড, এক্সেল, পাওয়ারপয়েন্ট, বিজয় ও অভ্র টাইপিং'
                  : 'MS Excel, MS Word, PowerPoint, Power BI, Bijoy & Avro Bangla Typing'
              }
            />
          </FieldWrapper>
          <FieldWrapper label={L.languages} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.languages}
              onChange={(e) => update({ languages: e.target.value })}
              placeholder={
                language === 'bn'
                  ? 'বাংলা (মাতৃভাষা), ইংরেজি (বলা ও লেখায় দক্ষ)'
                  : 'Bangla (Native), English (Fluent in reading, writing & speaking)'
              }
            />
          </FieldWrapper>
        </div>

        <SketchDivider className="my-4" />

        {/* Collapsible Optional Projects (& Training in 2-Page Format) */}
        <div className="sketch-box-dashed p-4 space-y-4">
          <button
            type="button"
            onClick={() => setShowProjects((v) => !v)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div>
              <div className="text-sm font-bold text-[#24211d]">
                {isOnePage
                  ? language === 'bn'
                    ? 'উল্লেখযোগ্য প্রজেক্ট বা অর্জন (ঐচ্ছিক)'
                    : 'Key Project or Achievement (Optional)'
                  : language === 'bn'
                  ? 'প্রজেক্ট, প্রশিক্ষণ ও সার্টিফিকেশন (ঐচ্ছিক)'
                  : 'Projects, Training & Certifications (Optional)'}
              </div>
              <div className="text-xs text-[#5c564d]">
                {isOnePage
                  ? language === 'bn'
                    ? '১ পৃষ্ঠার সিভিতে ১টি সেরা প্রজেক্ট বা থিসিস যুক্ত করতে পারেন।'
                    : 'Highlight 1 top project, thesis, or key achievement.'
                  : language === 'bn'
                  ? 'থিসিস, প্রজেক্ট, ওয়ার্কশপ বা কোর্স যুক্ত করতে চাইলে খুলুন।'
                  : 'Add thesis projects, workshops, courses, or achievements.'}
              </div>
            </div>
            {showProjects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showProjects && (
            <div className="space-y-4 pt-2 border-t border-dashed border-[#3a3630]/25">
              {/* Projects */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#24211d]">{L.projects}</span>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#fffdf8] border border-[#595248] rounded-md inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> {L.ui.addEntry}
                  </button>
                </div>
                {data.projects.map((p) => (
                  <div key={p.id} className="p-3 bg-[#fffdf8] border border-[#3a3630]/35 rounded-lg space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        className="sketch-input"
                        value={p.title}
                        onChange={(e) => updateProject(p.id, { title: e.target.value })}
                        placeholder={language === 'bn' ? 'প্রজেক্ট বা গবেষণার শিরোনাম' : 'Project or Thesis Title'}
                      />
                      <button
                        type="button"
                        onClick={() => removeProject(p.id)}
                        className="p-1.5 text-[#9f3324] cursor-pointer"
                        aria-label={L.ui.remove}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        className="sketch-input"
                        value={p.subtitle}
                        onChange={(e) => updateProject(p.id, { subtitle: e.target.value })}
                        placeholder={language === 'bn' ? 'ধরন (যেমন: গবেষণা প্রবন্ধ)' : 'Role / Type (e.g. Thesis)'}
                      />
                      <input
                        type="text"
                        className="sketch-input"
                        value={p.year}
                        onChange={(e) => updateProject(p.id, { year: e.target.value })}
                        placeholder={language === 'bn' ? 'সাল (২০২৪)' : 'Year (2024)'}
                      />
                    </div>
                    <textarea
                      rows={2}
                      className="sketch-input"
                      value={p.description}
                      onChange={(e) => updateProject(p.id, { description: e.target.value })}
                      placeholder={language === 'bn' ? 'সংক্ষিপ্ত বিবরণ...' : 'Brief description...'}
                    />
                  </div>
                ))}
              </div>

              {/* Training (2-Page Format only) */}
              {!isOnePage && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#24211d]">{L.trainings}</span>
                    <button
                      type="button"
                      onClick={addTraining}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#fffdf8] border border-[#595248] rounded-md inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> {L.ui.addEntry}
                    </button>
                  </div>
                  {data.trainings.map((t) => (
                    <div key={t.id} className="p-3 bg-[#fffdf8] border border-[#3a3630]/35 rounded-lg space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          className="sketch-input"
                          value={t.title}
                          onChange={(e) => updateTraining(t.id, { title: e.target.value })}
                          placeholder={language === 'bn' ? 'প্রশিক্ষণ / কোর্সের নাম' : 'Course or Workshop Title'}
                        />
                        <button
                          type="button"
                          onClick={() => removeTraining(t.id)}
                          className="p-1.5 text-[#9f3324] cursor-pointer"
                          aria-label={L.ui.remove}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          className="sketch-input sm:col-span-2"
                          value={t.organization}
                          onChange={(e) => updateTraining(t.id, { organization: e.target.value })}
                          placeholder={language === 'bn' ? 'প্রতিষ্ঠান (যেমন: বিআইবিএম)' : 'Institute (e.g. BIBM / IBA)'}
                        />
                        <input
                          type="text"
                          className="sketch-input"
                          value={t.year}
                          onChange={(e) => updateTraining(t.id, { year: e.target.value })}
                          placeholder={language === 'bn' ? 'সাল' : 'Year'}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 1-Page Compact Personal Snapshot (Replaces bulky Step 4 in 1-page format) */}
        {isOnePage && (
          <div className="sketch-box-flat p-4 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-[#1e5645]">
                {language === 'bn'
                  ? 'সংক্ষিপ্ত ব্যক্তিগত তথ্য (১ লাইন · ঐচ্ছিক)'
                  : 'Quick Personal Snapshot (1-Line · Optional)'}
              </h3>
              <p className="text-xs text-[#5c564d] mt-0.5">
                {language === 'bn'
                  ? 'পূর্ণাঙ্গ ব্যক্তিগত তথ্য, রেফারেন্স ও স্বাক্ষরের জন্য ২ পৃষ্ঠার ফরম্যাট বেছে নিন।'
                  : 'Shown as a sleek single line at the bottom. Switch to 2-Page Format for full personal table, references & signature.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <FieldWrapper label={L.dateOfBirth} optionalText={L.ui.optional}>
                <input
                  type="date"
                  className="sketch-input"
                  value={data.personalInfo.dateOfBirth}
                  onChange={(e) => updatePersonal({ dateOfBirth: e.target.value })}
                />
              </FieldWrapper>
              <FieldWrapper label={L.bloodGroup} optionalText={L.ui.optional}>
                <select
                  className="sketch-input"
                  value={data.personalInfo.bloodGroup}
                  onChange={(e) => updatePersonal({ bloodGroup: e.target.value })}
                >
                  <option value="">{language === 'bn' ? 'নির্বাচন' : 'Select'}</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </FieldWrapper>
              <FieldWrapper label={language === 'bn' ? 'নিজ জেলা' : 'Home District'} optionalText={L.ui.optional}>
                <input
                  type="text"
                  className="sketch-input"
                  value={data.personalInfo.permanentAddress}
                  onChange={(e) => updatePersonal({ permanentAddress: e.target.value })}
                  placeholder={language === 'bn' ? 'যেমন: সিলেট' : 'e.g. Sylhet'}
                />
              </FieldWrapper>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // STEP 5 (2-PAGE FORMAT ONLY): PERSONAL INFO, REFERENCES & DECLARATION
  // =========================================================================

  const addReference = () => {
    const next: ReferenceEntry = {
      id: makeId('ref'),
      name: '',
      designation: '',
      organization: '',
      phone: '',
      email: '',
      relationship: '',
    };
    update({ references: [...data.references, next] });
  };

  const updateReference = (id: string, patch: Partial<ReferenceEntry>) => {
    update({
      references: data.references.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  };

  const removeReference = (id: string) => {
    update({ references: data.references.filter((r) => r.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="sketch-heading text-3xl text-[#24211d]">
          {language === 'bn' ? 'ব্যক্তিগত তথ্য, রেফারেন্স ও ঘোষণা' : 'Personal Info, References & Declaration'}
        </h2>
        <p className="text-xs text-[#5c564d] mt-1">
          {language === 'bn'
            ? 'এখানকার প্রতিটি ঘরই ঐচ্ছিক — যেগুলো শেয়ার করতে চান কেবল সেগুলোই পূরণ করুন।'
            : 'Every single field here is optional — only fill out what you want shown on your CV.'}
        </p>
      </div>

      {/* Personal Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FieldWrapper label={L.fatherName} optionalText={L.ui.optional}>
          <input
            type="text"
            className="sketch-input"
            value={data.personalInfo.fatherName}
            onChange={(e) => updatePersonal({ fatherName: e.target.value })}
          />
        </FieldWrapper>
        <FieldWrapper label={L.motherName} optionalText={L.ui.optional}>
          <input
            type="text"
            className="sketch-input"
            value={data.personalInfo.motherName}
            onChange={(e) => updatePersonal({ motherName: e.target.value })}
          />
        </FieldWrapper>
        <FieldWrapper label={L.dateOfBirth} optionalText={L.ui.optional}>
          <input
            type="date"
            className="sketch-input"
            value={data.personalInfo.dateOfBirth}
            onChange={(e) => updatePersonal({ dateOfBirth: e.target.value })}
          />
        </FieldWrapper>
        <FieldWrapper label={L.nationality} optionalText={L.ui.optional}>
          <input
            type="text"
            className="sketch-input"
            value={data.personalInfo.nationality}
            onChange={(e) => updatePersonal({ nationality: e.target.value })}
            placeholder={language === 'bn' ? 'বাংলাদেশি (জন্মসূত্রে)' : 'Bangladeshi (by birth)'}
          />
        </FieldWrapper>
        <FieldWrapper label={L.religion} optionalText={L.ui.optional}>
          <input
            type="text"
            className="sketch-input"
            value={data.personalInfo.religion}
            onChange={(e) => updatePersonal({ religion: e.target.value })}
            placeholder={language === 'bn' ? 'ইসলাম / সনাতন / খ্রিস্টান / বৌদ্ধ' : 'Islam / Hinduism / Christianity / Buddhism'}
          />
        </FieldWrapper>
        <FieldWrapper label={L.maritalStatus} optionalText={L.ui.optional}>
          <input
            type="text"
            className="sketch-input"
            value={data.personalInfo.maritalStatus}
            onChange={(e) => updatePersonal({ maritalStatus: e.target.value })}
            placeholder={language === 'bn' ? 'অবিবাহিত / বিবাহিত' : 'Unmarried / Married'}
          />
        </FieldWrapper>
        <FieldWrapper label={L.gender} optionalText={L.ui.optional}>
          <input
            type="text"
            className="sketch-input"
            value={data.personalInfo.gender}
            onChange={(e) => updatePersonal({ gender: e.target.value })}
            placeholder={language === 'bn' ? 'পুরুষ / নারী' : 'Male / Female'}
          />
        </FieldWrapper>
        <FieldWrapper label={L.bloodGroup} optionalText={L.ui.optional}>
          <select
            className="sketch-input"
            value={data.personalInfo.bloodGroup}
            onChange={(e) => updatePersonal({ bloodGroup: e.target.value })}
          >
            <option value="">{language === 'bn' ? 'নির্বাচন করুন (ঐচ্ছিক)' : 'Select (Optional)'}</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </FieldWrapper>
        <FieldWrapper label={L.nidNumber} optionalText={L.ui.optional} className="sm:col-span-2">
          <input
            type="text"
            className="sketch-input"
            value={data.personalInfo.nidNumber}
            onChange={(e) => updatePersonal({ nidNumber: e.target.value })}
            placeholder={language === 'bn' ? 'প্রয়োজন হলে কেবল তখনই লিখুন' : 'Leave blank unless specifically requested'}
          />
        </FieldWrapper>
        <FieldWrapper label={L.permanentAddress} optionalText={L.ui.optional} className="sm:col-span-2">
          <input
            type="text"
            className="sketch-input"
            value={data.personalInfo.permanentAddress}
            onChange={(e) => updatePersonal({ permanentAddress: e.target.value })}
            placeholder={
              language === 'bn'
                ? 'গ্রাম, ডাকঘর, উপজেলা, জেলা'
                : 'Village, Post Office, Upazila, District'
            }
          />
        </FieldWrapper>
      </div>

      <SketchDivider className="my-4" />

      {/* References */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#24211d]">
            {L.references}{' '}
            <span className="text-xs font-normal text-[#7c7468]">({L.ui.optional})</span>
          </h3>
          {data.references.length < 2 && (
            <button
              type="button"
              onClick={addReference}
              className="sketch-btn px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#1e5645]" />
              {language === 'bn' ? 'রেফারেন্স যুক্ত করুন' : 'Add Reference'}
            </button>
          )}
        </div>

        {data.references.map((r, idx) => (
          <div key={r.id} className="sketch-box-flat p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#1e5645]">
                {language === 'bn' ? `রেফারেন্স ${idx + 1}` : `Reference ${idx + 1}`}
              </span>
              <button
                type="button"
                onClick={() => removeReference(r.id)}
                className="p-1 text-[#9f3324] cursor-pointer"
                aria-label={L.ui.remove}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldWrapper label={language === 'bn' ? 'নাম' : 'Name'}>
                <input
                  type="text"
                  className="sketch-input"
                  value={r.name}
                  onChange={(e) => updateReference(r.id, { name: e.target.value })}
                />
              </FieldWrapper>
              <FieldWrapper label={language === 'bn' ? 'পদবি' : 'Designation'}>
                <input
                  type="text"
                  className="sketch-input"
                  value={r.designation}
                  onChange={(e) => updateReference(r.id, { designation: e.target.value })}
                />
              </FieldWrapper>
              <FieldWrapper label={language === 'bn' ? 'প্রতিষ্ঠান' : 'Organization'}>
                <input
                  type="text"
                  className="sketch-input"
                  value={r.organization}
                  onChange={(e) => updateReference(r.id, { organization: e.target.value })}
                />
              </FieldWrapper>
              <FieldWrapper label={L.relationship} optionalText={L.ui.optional}>
                <input
                  type="text"
                  className="sketch-input"
                  value={r.relationship}
                  onChange={(e) => updateReference(r.id, { relationship: e.target.value })}
                  placeholder={language === 'bn' ? 'শিক্ষক / ম্যানেজার' : 'Academic / Professional'}
                />
              </FieldWrapper>
              <FieldWrapper label={L.phone}>
                <input
                  type="tel"
                  className="sketch-input"
                  value={r.phone}
                  onChange={(e) => updateReference(r.id, { phone: e.target.value })}
                />
              </FieldWrapper>
              <FieldWrapper label={L.email} optionalText={L.ui.optional}>
                <input
                  type="email"
                  className="sketch-input"
                  value={r.email}
                  onChange={(e) => updateReference(r.id, { email: e.target.value })}
                />
              </FieldWrapper>
            </div>
          </div>
        ))}
      </div>

      <SketchDivider className="my-4" />

      {/* Declaration & Signature */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#24211d]">
            {L.declaration} &amp; {L.signature}
          </h3>
          <button
            type="button"
            onClick={() =>
              update({
                declaration: L.defaultDeclaration,
                signatureName: data.signatureName || data.fullName,
              })
            }
            className="px-2.5 py-1 text-xs font-semibold text-[#1e5645] bg-[#eef5f2] border border-[#1e5645]/35 rounded-md hover:border-[#1e5645] cursor-pointer whitespace-nowrap"
          >
            + {language === 'bn' ? 'প্রচলিত ঘোষণা বসান' : 'Insert Standard Declaration'}
          </button>
        </div>

        <textarea
          rows={2}
          className="sketch-input"
          value={data.declaration}
          onChange={(e) => update({ declaration: e.target.value })}
          placeholder={L.defaultDeclaration}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FieldWrapper label={L.date} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.declarationDate}
              onChange={(e) => update({ declarationDate: e.target.value })}
              placeholder={language === 'bn' ? '২৫ নভেম্বর ২০২৬' : 'November 25, 2026'}
            />
          </FieldWrapper>
          <FieldWrapper label={language === 'bn' ? 'স্বাক্ষরের নিচে নাম' : 'Name Under Signature'} optionalText={L.ui.optional}>
            <input
              type="text"
              className="sketch-input"
              value={data.signatureName}
              onChange={(e) => update({ signatureName: e.target.value })}
              placeholder={data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
            />
          </FieldWrapper>
        </div>

        <SignatureUploader
          signature={data.signatureImage || ''}
          language={language}
          onChange={(sig) => update({ signatureImage: sig })}
        />
      </div>
    </div>
  );
}
