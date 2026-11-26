import React from 'react';
import {
  CVData,
  DEFAULT_CV_SECTION_ORDER,
  DocCustomization,
  DocLanguage,
  PageFormat,
} from '../../types/builder';
import { LABELS } from '../../data/i18n';
import { getTemplateById } from '../../data/templates';
import { formatDisplayDate, hasText, splitLines, tintHex } from '../../utils/storage';
import { MonogramSeal } from './Ornaments';

interface CVRendererProps {
  data: CVData;
  templateId: string;
  language: DocLanguage;
  customization?: DocCustomization;
  pageFormat?: PageFormat;
}

const DISPLAY_SERIF = '"Cormorant Garamond", "Noto Serif Bengali", Georgia, serif';

export function CVTemplateRenderer({
  data,
  templateId,
  language,
  customization,
  pageFormat = '2-page',
}: CVRendererProps) {
  const L = LABELS[language];
  const meta = getTemplateById('cv', templateId);
  const isOnePage = pageFormat === '1-page';

  const hasCustomAccent = Boolean(customization?.accentColor);
  const accent = hasCustomAccent ? customization!.accentColor : meta.accent;
  const secondary = hasCustomAccent ? tintHex(accent, 0.07) : meta.secondary;

  const fontStyle = customization?.fontStyle ?? 'auto';
  const useSerif = fontStyle === 'serif' || (fontStyle === 'auto' && Boolean(meta.serif));

  const fontSize = customization?.fontSize ?? 'standard';
  const baseFontScale = fontSize === 'compact' ? 0.92 : fontSize === 'large' ? 1.08 : 1;
  const fontScale = isOnePage ? baseFontScale * 0.92 : baseFontScale;
  const fs = (px: number) => `${(px * fontScale).toFixed(1)}px`;

  const spacing = customization?.spacing ?? 'balanced';
  const sectionGapClass = isOnePage
    ? spacing === 'airy'
      ? 'space-y-3.5'
      : 'space-y-2.5'
    : spacing === 'tight'
    ? 'space-y-3.5'
    : spacing === 'airy'
    ? 'space-y-6'
    : 'space-y-5';
  const pagePadY = isOnePage
    ? spacing === 'airy'
      ? 30
      : 22
    : spacing === 'tight'
    ? 30
    : spacing === 'airy'
    ? 46
    : 38;
  const pagePadX = isOnePage
    ? spacing === 'airy'
      ? 40
      : 34
    : spacing === 'tight'
    ? 36
    : spacing === 'airy'
    ? 50
    : 44;

  const photoShape = customization?.photoShape ?? 'rect';
  const photoSize = customization?.photoSize ?? 'md';
  const photoScale = isOnePage ? 0.84 : 1;
  const photoRadius =
    photoShape === 'circle' ? '9999px' : photoShape === 'rounded' ? '10px' : '2px';
  const rawPhotoDims =
    photoShape === 'circle'
      ? photoSize === 'sm'
        ? { width: 82, height: 82 }
        : photoSize === 'lg'
        ? { width: 114, height: 114 }
        : { width: 96, height: 96 }
      : photoSize === 'sm'
      ? { width: 78, height: 96 }
      : photoSize === 'lg'
      ? { width: 110, height: 136 }
      : { width: 94, height: 116 };
  const photoDims = {
    width: Math.round(rawPhotoDims.width * photoScale),
    height: Math.round(rawPhotoDims.height * photoScale),
  };

  const hidden = new Set(customization?.hiddenSections ?? []);
  const isShown = (key: string) => !hidden.has(key);

  const showPhoto = Boolean(data.showPhoto && hasText(data.photo));
  const education = data.education.filter(
    (e) => hasText(e.examTitle) || hasText(e.institution) || hasText(e.result)
  );
  const experience = data.experience.filter(
    (e) => hasText(e.role) || hasText(e.organization) || hasText(e.bullets)
  );
  const projects = data.projects.filter((p) => hasText(p.title) || hasText(p.description));
  const trainings = data.trainings.filter((t) => hasText(t.title) || hasText(t.organization));
  const references = data.references.filter((r) => hasText(r.name) || hasText(r.organization));
  const customSections = (data.customSections || []).filter(
    (c) => hasText(c.title) || hasText(c.content)
  );

  const personalRows: Array<[string, string]> = (
    isOnePage
      ? [
          [
            L.dateOfBirth,
            data.personalInfo.dateOfBirth
              ? formatDisplayDate(data.personalInfo.dateOfBirth, language)
              : '',
          ],
          [L.bloodGroup, data.personalInfo.bloodGroup],
          [L.permanentAddress, data.personalInfo.permanentAddress],
        ]
      : [
          [L.fatherName, data.personalInfo.fatherName],
          [L.motherName, data.personalInfo.motherName],
          [
            L.dateOfBirth,
            data.personalInfo.dateOfBirth
              ? formatDisplayDate(data.personalInfo.dateOfBirth, language)
              : '',
          ],
          [L.nationality, data.personalInfo.nationality],
          [L.religion, data.personalInfo.religion],
          [L.maritalStatus, data.personalInfo.maritalStatus],
          [L.gender, data.personalInfo.gender],
          [L.bloodGroup, data.personalInfo.bloodGroup],
          [L.nidNumber, data.personalInfo.nidNumber],
          [L.permanentAddress, data.personalInfo.permanentAddress],
        ]
  ).filter(([, val]) => hasText(val)) as Array<[string, string]>;

  const hasSkills =
    hasText(data.technicalSkills) || hasText(data.softwareTools) || hasText(data.languages);
  const hasDeclaration = !isOnePage && (hasText(data.declaration) || hasText(data.signatureName));

  const contactItems = [
    hasText(data.phone) ? { label: L.phone, value: data.phone } : null,
    hasText(data.email) ? { label: L.email, value: data.email } : null,
    hasText(data.presentAddress) ? { label: L.presentAddress, value: data.presentAddress } : null,
    hasText(data.portfolioLink) ? { label: L.portfolio, value: data.portfolioLink } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const formatResult = (result: string, scale: string) => {
    if (!hasText(result)) return '';
    if (hasText(scale)) {
      return language === 'bn' ? `${result} / ${scale}` : `${result} / ${scale}`;
    }
    return result;
  };

  const renderPhoto = (borderColor = '#cbd5e1', outerFrame = false) => {
    if (!showPhoto) return null;
    const img = (
      <img
        src={data.photo}
        alt={data.fullName || 'Candidate'}
        referrerPolicy="no-referrer"
        className="object-cover object-top shrink-0 block"
        style={{
          width: `${photoDims.width}px`,
          height: `${photoDims.height}px`,
          borderRadius: photoRadius,
          border: outerFrame ? 'none' : `1.5px solid ${borderColor}`,
        }}
      />
    );
    if (!outerFrame) return img;
    return (
      <div
        className="p-1 bg-white shrink-0"
        style={{
          border: `1.5px solid ${borderColor}`,
          borderRadius:
            photoShape === 'circle' ? '9999px' : photoShape === 'rounded' ? '12px' : '2px',
        }}
      >
        {img}
      </div>
    );
  };

  // Refined Editorial vs Institutional Education Tables
  const renderEducationTable = (style: 'institutional' | 'editorial' | 'mono' = 'editorial') => {
    if (education.length === 0) return null;

    if (style === 'editorial') {
      return (
        <table className="w-full border-collapse text-left" style={{ fontSize: fs(11.3) }}>
          <thead>
            <tr
              style={{
                borderTop: `1.5px solid ${accent}`,
                borderBottom: `1px solid ${accent}45`,
                backgroundColor: secondary,
              }}
            >
              <th className="py-2 px-2.5 font-bold" style={{ color: accent }}>
                {L.examDegree}
              </th>
              <th className="py-2 px-2.5 font-bold" style={{ color: accent }}>
                {L.groupMajor}
              </th>
              <th className="py-2 px-2.5 font-bold" style={{ color: accent }}>
                {L.institution}
              </th>
              <th className="py-2 px-2.5 font-bold text-center whitespace-nowrap" style={{ color: accent }}>
                {L.passingYear}
              </th>
              <th className="py-2 px-2.5 font-bold text-right whitespace-nowrap" style={{ color: accent }}>
                {L.resultGpa}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {education.map((edu, idx) => (
              <tr
                key={edu.id}
                className="a4-avoid-break"
                style={{ backgroundColor: idx % 2 === 1 ? '#fafafa' : '#ffffff' }}
              >
                <td className="py-2 px-2.5 font-semibold text-neutral-950">{edu.examTitle}</td>
                <td className="py-2 px-2.5 text-neutral-700">{edu.groupOrMajor}</td>
                <td className="py-2 px-2.5 text-neutral-800">
                  <div>{edu.institution}</div>
                  {hasText(edu.boardOrUniversity) &&
                    edu.boardOrUniversity !== edu.institution && (
                      <div className="text-neutral-500" style={{ fontSize: fs(10.2) }}>
                        {edu.boardOrUniversity}
                      </div>
                    )}
                </td>
                <td className="py-2 px-2.5 text-center tabular-nums text-neutral-700">
                  {edu.passingYear}
                </td>
                <td
                  className="py-2 px-2.5 text-right tabular-nums font-bold"
                  style={{ color: accent }}
                >
                  {formatResult(edu.result, edu.scale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    const isMonoTable = style === 'mono';
    return (
      <table className="w-full border-collapse text-left" style={{ fontSize: fs(11.2) }}>
        <thead>
          <tr
            style={{
              backgroundColor: isMonoTable ? '#ffffff' : secondary,
              borderTop: `2px solid ${isMonoTable ? '#111111' : accent}`,
              borderBottom: `1.5px solid ${isMonoTable ? '#111111' : accent}`,
            }}
          >
            <th className="py-2 px-2 font-bold border-x border-neutral-300" style={{ color: isMonoTable ? '#111' : accent }}>
              {L.examDegree}
            </th>
            <th className="py-2 px-2 font-bold border-x border-neutral-300" style={{ color: isMonoTable ? '#111' : accent }}>
              {L.groupMajor}
            </th>
            <th className="py-2 px-2 font-bold border-x border-neutral-300" style={{ color: isMonoTable ? '#111' : accent }}>
              {L.institution}
            </th>
            <th className="py-2 px-2 font-bold border-x border-neutral-300" style={{ color: isMonoTable ? '#111' : accent }}>
              {L.boardUniversity}
            </th>
            <th className="py-2 px-2 font-bold border-x border-neutral-300 text-center whitespace-nowrap" style={{ color: isMonoTable ? '#111' : accent }}>
              {L.passingYear}
            </th>
            <th className="py-2 px-2 font-bold border-x border-neutral-300 text-center whitespace-nowrap" style={{ color: isMonoTable ? '#111' : accent }}>
              {L.resultGpa}
            </th>
          </tr>
        </thead>
        <tbody>
          {education.map((edu) => (
            <tr key={edu.id} className="a4-avoid-break border-b border-neutral-300">
              <td className="py-2 px-2 border-x border-neutral-300 font-semibold text-neutral-950">
                {edu.examTitle}
              </td>
              <td className="py-2 px-2 border-x border-neutral-300 text-neutral-800">
                {edu.groupOrMajor}
              </td>
              <td className="py-2 px-2 border-x border-neutral-300 text-neutral-800">
                {edu.institution}
              </td>
              <td className="py-2 px-2 border-x border-neutral-300 text-neutral-700">
                {edu.boardOrUniversity}
              </td>
              <td className="py-2 px-2 border-x border-neutral-300 text-center tabular-nums text-neutral-800">
                {edu.passingYear}
              </td>
              <td className="py-2 px-2 border-x border-neutral-300 text-center tabular-nums font-bold text-neutral-950">
                {formatResult(edu.result, edu.scale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderEducationList = (timeline = false) => {
    if (education.length === 0) return null;
    return (
      <div
        className={timeline ? 'relative pl-5 space-y-3 border-l-2' : 'space-y-3'}
        style={timeline ? { borderColor: `${accent}35` } : undefined}
      >
        {education.map((edu) => (
          <div key={edu.id} className="a4-avoid-break relative">
            {timeline && (
              <span
                className="w-2.5 h-2.5 rounded-full absolute -left-[26px] top-1.5 ring-2 ring-white"
                style={{ backgroundColor: accent }}
              />
            )}
            <div className="flex items-baseline justify-between gap-3">
              <div className="font-bold text-neutral-950" style={{ fontSize: fs(12.2) }}>
                {edu.examTitle}
                {hasText(edu.groupOrMajor) && (
                  <span className="font-normal text-neutral-600"> — {edu.groupOrMajor}</span>
                )}
              </div>
              {hasText(edu.passingYear) && (
                <span
                  className="font-semibold tabular-nums text-neutral-500 shrink-0"
                  style={{ fontSize: fs(11) }}
                >
                  {edu.passingYear}
                </span>
              )}
            </div>
            <div
              className="flex items-baseline justify-between gap-3 text-neutral-700 mt-0.5"
              style={{ fontSize: fs(11.3) }}
            >
              <span>{[edu.institution, edu.boardOrUniversity].filter(hasText).join(' · ')}</span>
              {hasText(edu.result) && (
                <span className="font-bold tabular-nums shrink-0" style={{ color: accent }}>
                  {formatResult(edu.result, edu.scale)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExperience = (timeline = false) => {
    if (experience.length === 0) return null;
    return (
      <div
        className={timeline ? 'relative pl-5 space-y-4 border-l-2' : 'space-y-4'}
        style={timeline ? { borderColor: `${accent}35` } : undefined}
      >
        {experience.map((exp) => {
          const bullets = splitLines(exp.bullets);
          return (
            <div key={exp.id} className="a4-avoid-break relative">
              {timeline && (
                <span
                  className="w-2.5 h-2.5 rounded-full absolute -left-[26px] top-1.5 ring-2 ring-white"
                  style={{ backgroundColor: accent }}
                />
              )}
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-bold text-neutral-950" style={{ fontSize: fs(12.6) }}>
                  {exp.role}
                </div>
                {hasText(exp.duration) && (
                  <div
                    className="font-semibold tabular-nums text-neutral-500 shrink-0"
                    style={{ fontSize: fs(10.8) }}
                  >
                    {exp.duration}
                  </div>
                )}
              </div>
              {(hasText(exp.organization) || hasText(exp.location)) && (
                <div
                  className="font-semibold mt-0.5"
                  style={{ color: accent, fontSize: fs(11.4) }}
                >
                  {[exp.organization, exp.location].filter(hasText).join(' · ')}
                </div>
              )}
              {bullets.length > 0 && (
                <ul
                  className="mt-1.5 space-y-1 list-disc pl-4 leading-[1.52] text-neutral-700"
                  style={{ fontSize: fs(11.4) }}
                >
                  {bullets.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSkills = (modeStyle: 'rows' | 'matrix' | 'chips' = 'rows') => {
    if (!hasSkills) return null;
    const rows = [
      hasText(data.technicalSkills) ? { label: L.technicalSkills, value: data.technicalSkills } : null,
      hasText(data.softwareTools) ? { label: L.softwareTools, value: data.softwareTools } : null,
      hasText(data.languages) ? { label: L.languages, value: data.languages } : null,
    ].filter(Boolean) as Array<{ label: string; value: string }>;

    if (modeStyle === 'chips') {
      return (
        <div className="space-y-2.5" style={{ fontSize: fs(11.2) }}>
          {rows.map((r) => {
            const parts = r.value
              .split(/[,;]+/)
              .map((s) => s.trim())
              .filter(Boolean);
            return (
              <div key={r.label} className="a4-avoid-break">
                <div className="font-bold uppercase tracking-wider mb-1" style={{ color: accent, fontSize: fs(10) }}>
                  {r.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {parts.map((item, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 border text-neutral-800"
                      style={{
                        backgroundColor: secondary,
                        borderColor: `${accent}25`,
                        borderRadius: '4px',
                        fontSize: fs(10.8),
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (modeStyle === 'matrix') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ fontSize: fs(11.2) }}>
          {rows.map((r) => (
            <div
              key={r.label}
              className="p-3 border a4-avoid-break"
              style={{ backgroundColor: secondary, borderColor: `${accent}22` }}
            >
              <div className="font-bold mb-1" style={{ color: accent, fontSize: fs(10.8) }}>
                {r.label}
              </div>
              <div className="text-neutral-800 leading-relaxed">{r.value}</div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-1.5 leading-[1.52]" style={{ fontSize: fs(11.4) }}>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[175px_1fr] gap-3 a4-avoid-break">
            <span className="font-bold text-neutral-900">{r.label}</span>
            <span className="text-neutral-700">{r.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <div className="space-y-2.5" style={{ fontSize: fs(11.4) }}>
        {projects.map((p) => (
          <div key={p.id} className="a4-avoid-break">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-bold text-neutral-950">
                {p.title}
                {hasText(p.subtitle) && (
                  <span className="font-normal text-neutral-600"> — {p.subtitle}</span>
                )}
              </span>
              {hasText(p.year) && (
                <span className="tabular-nums font-medium text-neutral-500 shrink-0" style={{ fontSize: fs(10.8) }}>
                  {p.year}
                </span>
              )}
            </div>
            {hasText(p.description) && (
              <p className="text-neutral-700 mt-0.5 leading-[1.48]">{p.description}</p>
            )}
            {hasText(p.link) && (
              <p className="mt-0.5 font-medium" style={{ color: accent, fontSize: fs(10.8) }}>
                {p.link}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTrainings = () => {
    if (trainings.length === 0) return null;
    return (
      <ul className="space-y-1.5" style={{ fontSize: fs(11.4) }}>
        {trainings.map((t) => (
          <li key={t.id} className="a4-avoid-break flex items-baseline justify-between gap-3">
            <div>
              <span className="font-bold text-neutral-900">{t.title}</span>
              {hasText(t.organization) && (
                <span className="text-neutral-700"> · {t.organization}</span>
              )}
              {hasText(t.duration) && (
                <span className="text-neutral-500"> ({t.duration})</span>
              )}
            </div>
            {hasText(t.year) && (
              <span className="tabular-nums font-medium text-neutral-500 shrink-0" style={{ fontSize: fs(10.8) }}>
                {t.year}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const renderPersonalInfo = (twoCol = false) => {
    if (personalRows.length === 0) return null;
    if (isOnePage) {
      return (
        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-1 text-neutral-800 a4-avoid-break"
          style={{ fontSize: fs(10.8) }}
        >
          {personalRows.map(([k, v]) => (
            <div key={k}>
              <span className="font-semibold text-neutral-600">{k}: </span>
              <span className="font-medium text-neutral-950">{v}</span>
            </div>
          ))}
        </div>
      );
    }
    if (twoCol) {
      return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5" style={{ fontSize: fs(11.3) }}>
          {personalRows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[125px_1fr] gap-2 a4-avoid-break leading-[1.45]">
              <span className="font-semibold text-neutral-600">{k}</span>
              <span className="text-neutral-950 font-medium">{v}</span>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-1" style={{ fontSize: fs(11.4) }}>
        {personalRows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[175px_12px_1fr] a4-avoid-break leading-[1.48]">
            <span className="font-semibold text-neutral-700">{k}</span>
            <span className="text-neutral-400">:</span>
            <span className="text-neutral-950">{v}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderReferences = () => {
    if (references.length === 0) return null;
    return (
      <div
        className={`grid gap-6 ${references.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}
        style={{ fontSize: fs(11.3) }}
      >
        {references.map((r) => (
          <div key={r.id} className="a4-avoid-break leading-[1.5]">
            <div className="font-bold text-neutral-950">{r.name}</div>
            {hasText(r.designation) && <div className="text-neutral-800">{r.designation}</div>}
            {hasText(r.organization) && (
              <div className="font-medium" style={{ color: accent }}>
                {r.organization}
              </div>
            )}
            {hasText(r.phone) && (
              <div className="text-neutral-600 tabular-nums mt-0.5">
                {L.phone}: {r.phone}
              </div>
            )}
            {hasText(r.email) && (
              <div className="text-neutral-600">
                {L.email}: {r.email}
              </div>
            )}
            {hasText(r.relationship) && (
              <div className="text-neutral-500 italic" style={{ fontSize: fs(10.5) }}>
                {r.relationship}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderDeclaration = () => {
    if (!hasDeclaration) return null;
    return (
      <div className="a4-avoid-break leading-[1.52]" style={{ fontSize: fs(11.3) }}>
        {hasText(data.declaration) && <p className="text-neutral-700">{data.declaration}</p>}
        <div className="mt-7 flex items-end justify-between gap-6">
          <div className="text-neutral-700">
            {hasText(data.declarationDate) && (
              <div>
                <span className="font-semibold text-neutral-900">{L.date}:</span> {data.declarationDate}
              </div>
            )}
          </div>
          <div className="text-center min-w-[185px]">
            <div className="border-t border-neutral-800 pt-1.5 font-bold text-neutral-950">
              {hasText(data.signatureName) ? data.signatureName : L.signature}
            </div>
            {hasText(data.signatureName) && (
              <div className="text-neutral-500" style={{ fontSize: fs(10.2) }}>
                {L.signature}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  type TitleStyle =
    | 'gold-rule'
    | 'double'
    | 'editorial-kicker'
    | 'accent-pill-bar'
    | 'underline'
    | 'mono'
    | 'centered-serif'
    | 'left-rail';

  const SectionHeading = ({ title, style }: { title: string; style: TitleStyle }) => {
    if (style === 'gold-rule') {
      return (
        <div className="flex items-center gap-3 mb-3">
          <h2
            className="font-bold uppercase tracking-[0.12em] whitespace-nowrap"
            style={{ color: accent, fontSize: fs(11.5) }}
          >
            {title}
          </h2>
          <div className="h-[1px] flex-1" style={{ backgroundColor: '#c9a14a' }} />
        </div>
      );
    }
    if (style === 'double') {
      return (
        <h2
          className="font-bold uppercase tracking-[0.09em] py-1.5 px-3 mb-3 border-y"
          style={{
            color: accent,
            borderTopColor: accent,
            borderTopWidth: '2px',
            borderBottomColor: `${accent}45`,
            backgroundColor: secondary,
            fontSize: fs(11.5),
          }}
        >
          {title}
        </h2>
      );
    }
    if (style === 'centered-serif') {
      return (
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[1px] flex-1" style={{ backgroundColor: `${accent}35` }} />
          <h2
            className="font-bold uppercase tracking-[0.14em] whitespace-nowrap"
            style={{ color: accent, fontSize: fs(11.8) }}
          >
            {title}
          </h2>
          <div className="h-[1px] flex-1" style={{ backgroundColor: `${accent}35` }} />
        </div>
      );
    }
    if (style === 'accent-pill-bar') {
      return (
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
          <h2
            className="font-bold uppercase tracking-[0.09em]"
            style={{ color: accent, fontSize: fs(11.6) }}
          >
            {title}
          </h2>
          <div className="h-[1px] flex-1 bg-neutral-200" />
        </div>
      );
    }
    if (style === 'underline') {
      return (
        <h2
          className="font-bold uppercase tracking-[0.09em] pb-1.5 mb-3 border-b-2"
          style={{ color: accent, borderColor: accent, fontSize: fs(11.6) }}
        >
          {title}
        </h2>
      );
    }
    if (style === 'mono') {
      return (
        <h2
          className="font-bold uppercase tracking-[0.11em] pb-1 mb-3 border-b-[1.5px] border-neutral-950 text-neutral-950"
          style={{ fontSize: fs(11.8) }}
        >
          {title}
        </h2>
      );
    }
    return (
      <h2
        className="font-bold uppercase tracking-[0.11em] pb-1.5 mb-3 border-b border-neutral-200"
        style={{ color: accent, fontSize: fs(11.5) }}
      >
        {title}
      </h2>
    );
  };

  const baseOrder = customization?.sectionOrder?.length
    ? customization.sectionOrder
    : [...DEFAULT_CV_SECTION_ORDER];
  const isDefaultOrder = baseOrder.join(',') === DEFAULT_CV_SECTION_ORDER.join(',');

  const renderOrderedSections = (opts: {
    order: string[];
    titleStyle: TitleStyle;
    eduMode: 'editorial' | 'institutional' | 'mono' | 'list' | 'timeline';
    skillsMode?: 'rows' | 'matrix' | 'chips';
    expTimeline?: boolean;
    twoColPersonal?: boolean;
    modularCard?: boolean;
    leftRail?: boolean;
    excludeKeys?: string[];
  }) => {
    const excluded = new Set(opts.excludeKeys ?? []);

    const wrap = (key: string, title: string, content: React.ReactNode) => {
      if (opts.leftRail) {
        return (
          <section
            key={key}
            className="grid grid-cols-[155px_1fr] gap-6 pt-3.5 border-t border-neutral-200 items-start"
          >
            <h2
              className="font-bold uppercase tracking-[0.1em] pt-0.5 leading-snug"
              style={{ color: accent, fontSize: fs(10.6) }}
            >
              {title}
            </h2>
            <div>{content}</div>
          </section>
        );
      }
      if (opts.modularCard) {
        return (
          <section
            key={key}
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
          >
            <SectionHeading title={title} style={opts.titleStyle} />
            {content}
          </section>
        );
      }
      return (
        <section key={key}>
          <SectionHeading title={title} style={opts.titleStyle} />
          {content}
        </section>
      );
    };

    return opts.order.map((key) => {
      if (excluded.has(key) || !isShown(key)) return null;

      if (key === 'objective' && hasText(data.careerObjective)) {
        return wrap(
          'objective',
          L.careerObjective,
          <p className="leading-[1.58] text-neutral-700 text-justify" style={{ fontSize: fs(11.6) }}>
            {data.careerObjective}
          </p>
        );
      }
      if (key === 'education' && education.length > 0) {
        return wrap(
          'education',
          L.education,
          opts.eduMode === 'list' || opts.eduMode === 'timeline'
            ? renderEducationList(opts.eduMode === 'timeline')
            : renderEducationTable(opts.eduMode)
        );
      }
      if (key === 'experience' && experience.length > 0) {
        return wrap('experience', L.experience, renderExperience(opts.expTimeline));
      }
      if (key === 'skills' && hasSkills) {
        return wrap('skills', L.skills, renderSkills(opts.skillsMode));
      }
      if (key === 'projects' && projects.length > 0) {
        return wrap('projects', L.projects, renderProjects());
      }
      if (key === 'trainings' && !isOnePage && trainings.length > 0) {
        return wrap('trainings', L.trainings, renderTrainings());
      }
      if (key === 'custom' && customSections.length > 0) {
        return (
          <React.Fragment key="custom">
            {customSections.map((cs) => {
              const lines = splitLines(cs.content);
              return wrap(
                cs.id,
                cs.title || (language === 'bn' ? 'অতিরিক্ত তথ্য' : 'Additional Details'),
                lines.length > 1 ? (
                  <ul
                    className="list-disc pl-4 space-y-1 leading-[1.52] text-neutral-700"
                    style={{ fontSize: fs(11.4) }}
                  >
                    {lines.map((ln, idx) => (
                      <li key={idx}>{ln}</li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="leading-[1.55] text-neutral-700 whitespace-pre-line"
                    style={{ fontSize: fs(11.4) }}
                  >
                    {cs.content}
                  </p>
                )
              );
            })}
          </React.Fragment>
        );
      }
      if (key === 'personal' && personalRows.length > 0) {
        return wrap('personal', L.personalInfo, renderPersonalInfo(opts.twoColPersonal));
      }
      if (key === 'references' && !isOnePage && references.length > 0) {
        return wrap('references', L.references, renderReferences());
      }
      if (key === 'declaration' && !isOnePage && hasDeclaration) {
        return wrap('declaration', L.declaration, renderDeclaration());
      }
      return null;
    });
  };

  // =========================================================================
  // 1. ROYAL NAVY LEFT SIDEBAR (two-col-sidebar-navy)
  // =========================================================================
  if (templateId === 'two-col-sidebar-navy') {
    return (
      <div className={`a4-sheet grid grid-cols-[258px_1fr] bg-white ${useSerif ? 'a4-sheet-serif' : ''}`}>
        <aside
          className="p-7 text-white flex flex-col gap-5"
          style={{ backgroundColor: accent, minHeight: '1123px' }}
        >
          {showPhoto && <div className="flex justify-center pt-1">{renderPhoto('#d6b16a', true)}</div>}

          <div className="pb-4 border-b border-white/20">
            <h1
              className="font-bold leading-snug text-white"
              style={{ fontSize: fs(21), fontFamily: useSerif ? DISPLAY_SERIF : undefined }}
            >
              {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
            </h1>
            {hasText(data.headline) && (
              <p className="text-[#e6c989] mt-1.5 leading-relaxed font-medium" style={{ fontSize: fs(11) }}>
                {data.headline}
              </p>
            )}
          </div>

          {contactItems.length > 0 && (
            <div data-pdf-block="true" className="space-y-2 text-white/90" style={{ fontSize: fs(10.8) }}>
              <h2 className="font-bold uppercase tracking-[0.14em] text-[#e6c989] pb-1 border-b border-white/15" style={{ fontSize: fs(10) }}>
                {language === 'bn' ? 'যোগাযোগ' : 'Contact'}
              </h2>
              {contactItems.map((c) => (
                <div key={c.label}>
                  <div className="text-white/55" style={{ fontSize: fs(9.5) }}>{c.label}</div>
                  <div className="break-words leading-snug">{c.value}</div>
                </div>
              ))}
            </div>
          )}

          {isShown('skills') && hasSkills && (
            <div data-pdf-block="true" className="space-y-2.5 text-white/90" style={{ fontSize: fs(10.8) }}>
              <h2 className="font-bold uppercase tracking-[0.14em] text-[#e6c989] pb-1 border-b border-white/15" style={{ fontSize: fs(10) }}>
                {L.skills}
              </h2>
              {hasText(data.technicalSkills) && (
                <div>
                  <div className="font-semibold text-white mb-0.5">{L.technicalSkills}</div>
                  <p className="text-white/80 leading-relaxed">{data.technicalSkills}</p>
                </div>
              )}
              {hasText(data.softwareTools) && (
                <div>
                  <div className="font-semibold text-white mb-0.5">{L.softwareTools}</div>
                  <p className="text-white/80 leading-relaxed">{data.softwareTools}</p>
                </div>
              )}
              {hasText(data.languages) && (
                <div>
                  <div className="font-semibold text-white mb-0.5">{L.languages}</div>
                  <p className="text-white/80 leading-relaxed">{data.languages}</p>
                </div>
              )}
            </div>
          )}

          {isShown('personal') && personalRows.length > 0 && (
            <div data-pdf-block="true" className="space-y-1.5 text-white/90" style={{ fontSize: fs(10.6) }}>
              <h2 className="font-bold uppercase tracking-[0.14em] text-[#e6c989] pb-1 border-b border-white/15" style={{ fontSize: fs(10) }}>
                {L.personalInfo}
              </h2>
              {personalRows.map(([k, v]) => (
                <div key={k} className="leading-snug">
                  <span className="text-white/60">{k}: </span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        <main className={`p-8 ${sectionGapClass}`}>
          {renderOrderedSections({
            order: baseOrder,
            titleStyle: 'gold-rule',
            eduMode: 'list',
            excludeKeys: ['skills', 'personal'],
          })}
        </main>
      </div>
    );
  }

  // =========================================================================
  // 2. SAGE RIGHT SIDEBAR (emerald-sidebar-split) — Inverted Editorial Split
  // =========================================================================
  if (templateId === 'emerald-sidebar-split') {
    return (
      <div className={`a4-sheet grid grid-cols-[1fr_252px] bg-white ${useSerif ? 'a4-sheet-serif' : ''}`}>
        <main className={`p-8 ${sectionGapClass}`}>
          <header className="pb-4 border-b-2" style={{ borderColor: accent }}>
            <h1 className="font-bold tracking-tight leading-tight text-neutral-950" style={{ fontSize: fs(26) }}>
              {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
            </h1>
            {hasText(data.headline) && (
              <p className="font-medium mt-1" style={{ color: accent, fontSize: fs(12) }}>
                {data.headline}
              </p>
            )}
          </header>

          {renderOrderedSections({
            order: baseOrder,
            titleStyle: 'accent-pill-bar',
            eduMode: 'list',
            excludeKeys: ['skills', 'personal'],
          })}
        </main>

        <aside
          className="p-6 flex flex-col gap-5 border-l"
          style={{ backgroundColor: secondary, borderColor: `${accent}25`, minHeight: '1123px' }}
        >
          {showPhoto && <div className="flex justify-center pt-1">{renderPhoto(`${accent}55`, true)}</div>}

          {contactItems.length > 0 && (
            <div data-pdf-block="true" className="space-y-2 text-neutral-800" style={{ fontSize: fs(10.8) }}>
              <h2 className="font-bold uppercase tracking-[0.12em] pb-1 border-b" style={{ color: accent, borderColor: `${accent}35`, fontSize: fs(10.2) }}>
                {language === 'bn' ? 'যোগাযোগ' : 'Contact'}
              </h2>
              {contactItems.map((c) => (
                <div key={c.label}>
                  <div className="text-neutral-500 font-medium" style={{ fontSize: fs(9.5) }}>{c.label}</div>
                  <div className="break-words text-neutral-900">{c.value}</div>
                </div>
              ))}
            </div>
          )}

          {isShown('skills') && hasSkills && (
            <div data-pdf-block="true" className="space-y-2.5 text-neutral-800" style={{ fontSize: fs(10.8) }}>
              <h2 className="font-bold uppercase tracking-[0.12em] pb-1 border-b" style={{ color: accent, borderColor: `${accent}35`, fontSize: fs(10.2) }}>
                {L.skills}
              </h2>
              {hasText(data.technicalSkills) && (
                <div>
                  <div className="font-bold text-neutral-900 mb-0.5">{L.technicalSkills}</div>
                  <p className="text-neutral-700 leading-relaxed">{data.technicalSkills}</p>
                </div>
              )}
              {hasText(data.softwareTools) && (
                <div>
                  <div className="font-bold text-neutral-900 mb-0.5">{L.softwareTools}</div>
                  <p className="text-neutral-700 leading-relaxed">{data.softwareTools}</p>
                </div>
              )}
              {hasText(data.languages) && (
                <div>
                  <div className="font-bold text-neutral-900 mb-0.5">{L.languages}</div>
                  <p className="text-neutral-700 leading-relaxed">{data.languages}</p>
                </div>
              )}
            </div>
          )}

          {isShown('personal') && personalRows.length > 0 && (
            <div data-pdf-block="true" className="space-y-1.5 text-neutral-800" style={{ fontSize: fs(10.5) }}>
              <h2 className="font-bold uppercase tracking-[0.12em] pb-1 border-b" style={{ color: accent, borderColor: `${accent}35`, fontSize: fs(10.2) }}>
                {L.personalInfo}
              </h2>
              {personalRows.map(([k, v]) => (
                <div key={k} className="leading-snug">
                  <span className="font-semibold text-neutral-600">{k}: </span>
                  <span className="text-neutral-950">{v}</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    );
  }

  // =========================================================================
  // 3. CHARCOAL & GOLD PRESTIGE (charcoal-gold-luxe)
  // =========================================================================
  if (templateId === 'charcoal-gold-luxe') {
    const gold = '#d4af65';
    return (
      <div className={`a4-sheet bg-white ${useSerif ? 'a4-sheet-serif' : ''}`}>
        <header
          className="px-11 py-8 text-white relative"
          style={{ backgroundColor: accent, borderBottom: `3px solid ${gold}` }}
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="uppercase tracking-[0.22em] mb-1.5" style={{ color: gold, fontSize: fs(10) }}>
                {L.curriculumVitae}
              </div>
              <h1
                className="font-bold leading-tight text-white"
                style={{ fontSize: fs(30), fontFamily: DISPLAY_SERIF }}
              >
                {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
              </h1>
              {hasText(data.headline) && (
                <p className="text-white/80 mt-1.5" style={{ fontSize: fs(12) }}>
                  {data.headline}
                </p>
              )}
              {contactItems.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap gap-x-5 gap-y-1 text-white/85" style={{ fontSize: fs(10.8) }}>
                  {contactItems.map((c) => (
                    <span key={c.label}>{c.value}</span>
                  ))}
                </div>
              )}
            </div>
            {renderPhoto(gold, true)}
          </div>
        </header>

        <div className={`px-11 py-8 ${sectionGapClass}`}>
          {renderOrderedSections({
            order: baseOrder,
            titleStyle: 'gold-rule',
            eduMode: 'editorial',
            twoColPersonal: true,
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. DEEP FOREST BANNER & MEDICAL CLINICAL BANNER
  // =========================================================================
  if (templateId === 'bold-header-accent' || templateId === 'medical-doctor-cv') {
    const isMedical = templateId === 'medical-doctor-cv';
    return (
      <div className={`a4-sheet bg-white ${useSerif ? 'a4-sheet-serif' : ''}`}>
        <header
          className="px-10 py-7 text-white flex items-center justify-between gap-6"
          style={{
            backgroundColor: accent,
            borderBottom: isMedical ? '4px solid #67e8f9' : '3px solid #c9a14a',
          }}
        >
          <div className="flex-1 min-w-0">
            <h1 className="font-bold tracking-tight leading-tight" style={{ fontSize: fs(27) }}>
              {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
            </h1>
            {hasText(data.headline) && (
              <p className="text-white/90 mt-1 font-medium" style={{ fontSize: fs(12.2) }}>
                {data.headline}
              </p>
            )}
            {contactItems.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1 text-white/90" style={{ fontSize: fs(10.8) }}>
                {contactItems.map((c) => (
                  <span key={c.label}>
                    <strong className="font-semibold text-white/70">{c.label}:</strong> {c.value}
                  </span>
                ))}
              </div>
            )}
          </div>
          {renderPhoto('#ffffff', true)}
        </header>

        <div className={`px-10 py-7 ${sectionGapClass}`}>
          {renderOrderedSections({
            order: baseOrder,
            titleStyle: isMedical ? 'accent-pill-bar' : 'double',
            eduMode: 'editorial',
            twoColPersonal: true,
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. EXECUTIVE CRIMSON SPLIT HEADER (split-banner-crimson)
  // =========================================================================
  if (templateId === 'split-banner-crimson') {
    return (
      <div className={`a4-sheet bg-white ${useSerif ? 'a4-sheet-serif' : ''}`}>
        <header className="grid grid-cols-[1fr_265px] border-b-2" style={{ borderColor: accent }}>
          <div className="px-10 py-8 flex flex-col justify-center">
            <div className="uppercase tracking-[0.18em] font-bold mb-1.5" style={{ color: accent, fontSize: fs(10) }}>
              {L.curriculumVitae}
            </div>
            <h1 className="font-bold text-neutral-950 leading-tight" style={{ fontSize: fs(27) }}>
              {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
            </h1>
            {hasText(data.headline) && (
              <p className="text-neutral-600 mt-1.5" style={{ fontSize: fs(12) }}>
                {data.headline}
              </p>
            )}
          </div>
          <div
            className="px-6 py-6 flex flex-col justify-center gap-3 border-l"
            style={{ backgroundColor: secondary, borderColor: `${accent}25` }}
          >
            {showPhoto && <div className="flex justify-center">{renderPhoto(accent, true)}</div>}
            <div className="space-y-1 text-neutral-800" style={{ fontSize: fs(10.5) }}>
              {contactItems.map((c) => (
                <div key={c.label} className="leading-snug break-words">
                  <span className="font-bold" style={{ color: accent }}>{c.label}: </span>
                  <span>{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className={`px-10 py-7 ${sectionGapClass}`}>
          {renderOrderedSections({
            order: baseOrder,
            titleStyle: 'underline',
            eduMode: 'editorial',
            twoColPersonal: true,
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. SWISS EDITORIAL SPLIT (modern-minimalist) — Left Section Rail
  // =========================================================================
  if (templateId === 'modern-minimalist') {
    return (
      <div
        className={`a4-sheet bg-white ${useSerif ? 'a4-sheet-serif' : ''}`}
        style={{ padding: `${pagePadY}px ${pagePadX}px` }}
      >
        <header className="flex items-start justify-between gap-6 pb-6">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {!showPhoto && <MonogramSeal name={data.fullName || 'CV'} color={accent} size={48} />}
            <div className="min-w-0">
              <h1 className="font-bold tracking-tight text-neutral-950 leading-tight" style={{ fontSize: fs(27) }}>
                {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
              </h1>
              {hasText(data.headline) && (
                <p className="text-neutral-600 mt-1" style={{ fontSize: fs(12.2) }}>
                  {data.headline}
                </p>
              )}
              {contactItems.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-neutral-600" style={{ fontSize: fs(10.8) }}>
                  {contactItems.map((c) => (
                    <span key={c.label}>{c.value}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {renderPhoto('#d4d4d8')}
        </header>

        <div className="space-y-4">
          {renderOrderedSections({
            order: baseOrder,
            titleStyle: 'left-rail',
            eduMode: 'list',
            twoColPersonal: true,
            leftRail: true,
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. ALL REMAINING 15 HIGH-CRAFT SPECIALIZED CV TEMPLATES
  // =========================================================================
  const isClassic = templateId === 'bd-classic-formal';
  const isBankGovt = templateId === 'bank-govt-standard';
  const isMono = templateId === 'monochrome-inksaver';
  const isLegal = templateId === 'legal-advocate-cv';
  const isExec = templateId === 'corporate-executive';
  const isNGO = templateId === 'ngo-development';
  const isRMG = templateId === 'garments-merchandiser';
  const isTimeline = templateId === 'timeline-career';
  const isGrid = templateId === 'structured-grid';
  const isTech = templateId === 'tech-startup';
  const isEng = templateId === 'engineering-buet-pro';
  const isEditorial = templateId === 'creative-editorial';
  const isModular = templateId === 'modern-slate-cards';
  const isCompact = templateId === 'compact-fresher';
  const isAcademic = templateId === 'academic-university';

  let effectiveOrder = baseOrder;
  if (isDefaultOrder) {
    if (isCompact || isAcademic || isClassic || isBankGovt || isLegal) {
      effectiveOrder = [
        'objective',
        'education',
        'experience',
        'skills',
        'projects',
        'trainings',
        'custom',
        'personal',
        'references',
        'declaration',
      ];
    } else if (isTech || isEng) {
      effectiveOrder = [
        'objective',
        'skills',
        'experience',
        'projects',
        'education',
        'trainings',
        'custom',
        'personal',
        'references',
        'declaration',
      ];
    }
  }

  const titleStyle: TitleStyle = isBankGovt
    ? 'double'
    : isMono
    ? 'mono'
    : isLegal || isAcademic
    ? 'centered-serif'
    : isExec
    ? 'gold-rule'
    : isTech || isEng || isModular || isNGO
    ? 'accent-pill-bar'
    : isClassic || isRMG || isTimeline
    ? 'underline'
    : 'editorial-kicker';

  const eduMode: 'editorial' | 'institutional' | 'mono' | 'list' | 'timeline' = isTimeline
    ? 'timeline'
    : isMono
    ? 'mono'
    : isClassic || isBankGovt
    ? 'institutional'
    : isAcademic || isLegal
    ? 'list'
    : 'editorial';

  const skillsMode: 'rows' | 'matrix' | 'chips' =
    isTech || isEng ? 'chips' : isGrid || isRMG ? 'matrix' : 'rows';

  const effectivePadY = isCompact && spacing === 'balanced' ? 28 : pagePadY;
  const effectivePadX = isCompact && spacing === 'balanced' ? 36 : pagePadX;

  return (
    <div
      className={`a4-sheet ${useSerif ? 'a4-sheet-serif' : ''}`}
      style={{
        backgroundColor: meta.paperTint,
        padding: `${effectivePadY}px ${effectivePadX}px`,
        borderTop:
          isBankGovt
            ? `8px solid ${accent}`
            : isNGO || isTech || isEng || isRMG
            ? `5px solid ${accent}`
            : undefined,
      }}
    >
      {/* Classic / Bank / Legal Centered Masthead Ribbon */}
      {(isClassic || isBankGovt || isMono) && (
        <div className="text-center mb-4">
          <div
            className="font-bold tracking-[0.2em] uppercase inline-block pb-1 border-b-2"
            style={{ color: isMono ? '#111' : accent, borderColor: isBankGovt ? '#c9a14a' : accent, fontSize: fs(13.5) }}
          >
            {L.curriculumVitae}
          </div>
        </div>
      )}

      {/* Bespoke Header per Template */}
      {isEditorial ? (
        <header
          className="p-6 mb-6 flex items-center justify-between gap-6 border-b-2"
          style={{ backgroundColor: secondary, borderColor: accent }}
        >
          <div className="flex-1 min-w-0">
            <h1
              className="font-bold tracking-tight leading-tight"
              style={{ color: accent, fontSize: fs(29), fontFamily: DISPLAY_SERIF }}
            >
              {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
            </h1>
            {hasText(data.headline) && (
              <p className="text-neutral-700 mt-1 font-medium" style={{ fontSize: fs(12) }}>
                {data.headline}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-neutral-700" style={{ fontSize: fs(10.8) }}>
              {contactItems.map((c) => (
                <span key={c.label}>{c.value}</span>
              ))}
            </div>
          </div>
          {renderPhoto(accent, true)}
        </header>
      ) : isLegal || isAcademic ? (
        <header className="pb-5 mb-6 border-b-2" style={{ borderColor: accent }}>
          <div className={`flex items-center ${showPhoto ? 'justify-between gap-6' : 'justify-center text-center'}`}>
            <div className={showPhoto ? 'flex-1' : 'max-w-xl'}>
              <h1
                className="font-bold leading-tight"
                style={{ color: accent, fontSize: fs(29), fontFamily: DISPLAY_SERIF }}
              >
                {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
              </h1>
              {hasText(data.headline) && (
                <p className="text-neutral-600 mt-1 italic" style={{ fontSize: fs(12.2) }}>
                  {data.headline}
                </p>
              )}
              <div
                className={`mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-neutral-700 ${
                  showPhoto ? '' : 'justify-center'
                }`}
                style={{ fontSize: fs(10.8) }}
              >
                {contactItems.map((c, idx) => (
                  <React.Fragment key={c.label}>
                    {idx > 0 && <span className="text-neutral-400">·</span>}
                    <span>{c.value}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            {renderPhoto(`${accent}55`, true)}
          </div>
        </header>
      ) : isGrid ? (
        <header className="grid grid-cols-[1fr_auto] gap-6 pb-5 mb-6 border-b-2 border-neutral-900 items-start">
          <div>
            <h1 className="font-bold text-neutral-950 tracking-tight leading-tight" style={{ fontSize: fs(27) }}>
              {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
            </h1>
            {hasText(data.headline) && (
              <p className="text-neutral-600 mt-1" style={{ fontSize: fs(12) }}>
                {data.headline}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-neutral-700" style={{ fontSize: fs(10.8) }}>
              {contactItems.map((c) => (
                <div key={c.label}>
                  <span className="font-bold text-neutral-900">{c.label}: </span>
                  <span>{c.value}</span>
                </div>
              ))}
            </div>
          </div>
          {renderPhoto('#18181b', true)}
        </header>
      ) : (
        <header
          className={`flex items-start justify-between gap-6 ${
            isCompact ? 'pb-3.5 mb-4' : 'pb-5 mb-5'
          } border-b`}
          style={{ borderColor: isMono ? '#111111' : `${accent}35` }}
        >
          <div className="flex-1 min-w-0">
            <h1
              className="font-bold leading-tight"
              style={{
                color: isMono ? '#000000' : accent,
                fontSize: fs(isCompact ? 23 : isExec ? 29 : 26),
                fontFamily: isExec ? DISPLAY_SERIF : undefined,
              }}
            >
              {data.fullName || (language === 'bn' ? 'আপনার নাম' : 'Your Full Name')}
            </h1>
            {hasText(data.headline) && (
              <p
                className={`text-neutral-700 mt-1 ${isExec ? 'italic' : 'font-medium'}`}
                style={{ fontSize: fs(12) }}
              >
                {data.headline}
              </p>
            )}
            {contactItems.length > 0 && (
              <div
                className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-neutral-700"
                style={{ fontSize: fs(11) }}
              >
                {contactItems.map((c) => (
                  <span key={c.label}>
                    <span className="font-semibold text-neutral-900">{c.label}: </span>
                    {c.value}
                  </span>
                ))}
              </div>
            )}
          </div>
          {renderPhoto(isMono ? '#27272a' : `${accent}60`, true)}
        </header>
      )}

      {/* Main Content Sections */}
      <div className={isCompact && spacing === 'balanced' ? 'space-y-3.5' : sectionGapClass}>
        {renderOrderedSections({
          order: effectiveOrder,
          titleStyle,
          eduMode,
          skillsMode,
          expTimeline: isTimeline,
          twoColPersonal: isCompact || isTech || isEng || isModular || isGrid || isRMG,
          modularCard: isModular,
        })}
      </div>
    </div>
  );
}
