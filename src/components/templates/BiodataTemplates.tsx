import React from 'react';
import {
  BiodataData,
  DEFAULT_BIODATA_SECTION_ORDER,
  DocCustomization,
  DocLanguage,
  PageFormat,
} from '../../types/builder';
import { INVOCATION_OPTIONS, LABELS } from '../../data/i18n';
import { getTemplateById } from '../../data/templates';
import {
  calculateAgeFromDob,
  formatDisplayDate,
  hasText,
  splitLines,
  tintHex,
  toBanglaDigits,
} from '../../utils/storage';
import {
  AndalusianArchHeader,
  BanarasiZariBand,
  ChristianCrestHeader,
  DharmachakraHeader,
  FourCornerFrame,
  HillLoomBand,
  JamdaniBand,
  LotusMandalaHeader,
  MonogramSeal,
  MughalArchHeader,
  OrnamentalDivider,
} from './Ornaments';

interface BiodataRendererProps {
  data: BiodataData;
  templateId: string;
  language: DocLanguage;
  customization?: DocCustomization;
  pageFormat?: PageFormat;
}

const DISPLAY_SERIF = '"Cormorant Garamond", "Noto Serif Bengali", Georgia, serif';

export function BiodataTemplateRenderer({
  data,
  templateId,
  language,
  customization,
  pageFormat = '2-page',
}: BiodataRendererProps) {
  const L = LABELS[language];
  const meta = getTemplateById('biodata', templateId);
  const isOnePage = pageFormat === '1-page';

  const hasCustomAccent = Boolean(customization?.accentColor);
  const accent = hasCustomAccent ? customization!.accentColor : meta.accent;
  const secondary = hasCustomAccent ? tintHex(accent, 0.08) : meta.secondary;

  const fontStyle = customization?.fontStyle ?? 'auto';
  const useSerif = fontStyle === 'serif' || (fontStyle === 'auto' && Boolean(meta.serif));

  // Identify template style families (37 distinct templates)
  const isRoyal = templateId === 'royal-border';
  const isMughalArch = templateId === 'mughal-arch-palace';
  const isEmeraldCanopy = templateId === 'emerald-velvet-banner';
  const isArtDeco = templateId === 'art-deco-gold';
  const isNawabNavy = templateId === 'nawab-navy-gold';

  const isFloral = templateId === 'classic-floral';
  const isBlushGarden = templateId === 'blush-rose-garden';
  const isBotanical = templateId === 'soft-botanical';
  const isPastel = templateId === 'warm-pastel-heritage';
  const isLavender = templateId === 'lavender-mist-modern';

  const isIslamic = templateId === 'islamic-geometric';
  const isAlpona = templateId === 'classic-bengali-traditional';
  const isJamdani = templateId === 'jamdani-loom-heritage';
  const isParchment = templateId === 'heritage-parchment';
  const isAndalusian = templateId === 'andalusian-zellij-arch';

  // Hindu / Sanatan
  const isSindoorHindu = templateId === 'sindoor-alpona-hindu';
  const isBanarasiBanner = templateId === 'banarasi-crimson-gold';
  const isMarigoldHolud = templateId === 'marigold-gaye-holud';
  const isShantiniketan = templateId === 'shantiniketan-lotus';
  const isKalighatDossier = templateId === 'kalighat-ivory-vermilion';

  // Christian
  const isCathedralGold = templateId === 'cathedral-ivory-gold';
  const isOliveChapel = templateId === 'olive-chapel-sage';
  const isSapphireChristian = templateId === 'midnight-stella-christian';
  const isDovePearlMinimal = templateId === 'dove-pearl-minimal';

  // Buddhist
  const isSaffronDharma = templateId === 'saffron-dharmachakra';
  const isBodhiJade = templateId === 'bodhi-serenity-jade';
  const isHillLoom = templateId === 'chittagong-hill-weave';
  const isWhiteLotusStupa = templateId === 'lotus-stupa-ivory';

  const isMinimalSplit = templateId === 'minimal-modern' || isDovePearlMinimal;
  const isMagazine = templateId === 'two-col-magazine';
  const isCrimsonMagazine = templateId === 'crimson-velvet-magazine';
  const isAcademic = templateId === 'clean-academic-pro';
  const isExecutive = templateId === 'executive-modern';

  const isWhatsApp = templateId === 'whatsapp-easy-read';
  const isWhatsAppCards = templateId === 'dhaka-modern-whatsapp';
  const isMono = templateId === 'formal-monochrome';
  const isFamilyCard = templateId === 'family-tree-structured';

  const fontSize = customization?.fontSize ?? 'standard';
  const baseFontScale = fontSize === 'compact' ? 0.92 : fontSize === 'large' ? 1.12 : 1;
  const fontScale = isOnePage ? baseFontScale * 0.91 : baseFontScale;
  const fs = (px: number) => `${(px * fontScale).toFixed(1)}px`;

  const spacing = customization?.spacing ?? 'balanced';
  const sectionGapClass = isOnePage
    ? spacing === 'airy'
      ? 'space-y-3.5'
      : 'space-y-2.5'
    : spacing === 'tight'
    ? 'space-y-3'
    : spacing === 'airy'
    ? 'space-y-6'
    : isWhatsApp || isWhatsAppCards
    ? 'space-y-4.5'
    : 'space-y-4';

  const photoShape = customization?.photoShape ?? 'rect';
  const photoSize = customization?.photoSize ?? 'md';
  const photoScale = isOnePage ? 0.84 : 1;
  const photoRadius =
    photoShape === 'circle' ? '9999px' : photoShape === 'rounded' ? '10px' : '2px';
  const rawPhotoDims =
    photoShape === 'circle'
      ? photoSize === 'sm'
        ? { width: 88, height: 88 }
        : photoSize === 'lg'
        ? { width: 124, height: 124 }
        : { width: 104, height: 104 }
      : photoSize === 'sm'
      ? { width: 82, height: 102 }
      : photoSize === 'lg'
      ? { width: 116, height: 144 }
      : { width: 100, height: 124 };
  const photoDims = {
    width: Math.round(rawPhotoDims.width * photoScale),
    height: Math.round(rawPhotoDims.height * photoScale),
  };

  const hidden = new Set(customization?.hiddenSections ?? []);
  const isShown = (key: string) => !hidden.has(key);
  const showPhoto = Boolean(data.showPhoto && hasText(data.photo));

  const invocationOption = INVOCATION_OPTIONS.find((o) => o.key === data.invocationPreset);
  const getInvocationBlock = () => {
    if (data.invocationPreset === 'none') return null;
    if (data.invocationPreset === 'custom') {
      return hasText(data.customInvocation) ? { arabic: '', subtitle: data.customInvocation } : null;
    }
    if (!invocationOption) return null;
    const subtitle =
      language === 'bn' ? invocationOption.subtitleBn : invocationOption.subtitleEn;
    return {
      arabic: invocationOption.arabic || '',
      subtitle: subtitle || '',
    };
  };
  const invocation = getInvocationBlock();

  const computedAge = calculateAgeFromDob(data.dateOfBirth);
  const ageDisplay = hasText(data.ageOverride)
    ? data.ageOverride
    : computedAge !== null
    ? `${language === 'bn' ? toBanglaDigits(computedAge) : computedAge} ${L.yearsOld}`
    : '';
  const dobDisplay = hasText(data.dateOfBirth)
    ? formatDisplayDate(data.dateOfBirth, language)
    : '';

  const personalRows: Array<[string, string]> = (
    isOnePage
      ? [
          [L.gender, data.gender],
          [L.dateOfBirth, dobDisplay],
          [L.age, ageDisplay],
          [L.height, data.height],
          [L.bloodGroup, data.bloodGroup],
          [L.maritalStatus, data.maritalStatus],
          [L.religion, data.religion],
        ]
      : [
          [L.gender, data.gender],
          [L.dateOfBirth, dobDisplay],
          [L.age, ageDisplay],
          [L.height, data.height],
          [L.weight, data.weight],
          [L.bloodGroup, data.bloodGroup],
          [L.complexion, data.complexion],
          [L.maritalStatus, data.maritalStatus],
          [L.religion, data.religion],
          [L.nationality, data.nationality],
          [L.lifestylePractice, data.lifestylePractice],
        ]
  ).filter(([, v]) => hasText(v)) as Array<[string, string]>;

  const careerRows: Array<[string, string]> = (
    isOnePage
      ? [
          [L.occupation, data.occupation],
          [L.workplace, data.workplace],
        ]
      : [
          [L.occupation, data.occupation],
          [L.workplace, data.workplace],
          [L.income, data.income],
        ]
  ).filter(([, v]) => hasText(v)) as Array<[string, string]>;

  const education = data.education.filter(
    (e) => hasText(e.examTitle) || hasText(e.institution) || hasText(e.result)
  );
  const siblings = data.siblings.filter((s) => hasText(s.relation) || hasText(s.details));

  const familyRows: Array<[string, string]> = [
    [L.fatherName, data.fatherName],
    [L.fatherOccupation, data.fatherOccupation],
    [L.motherName, data.motherName],
    [L.motherOccupation, data.motherOccupation],
  ].filter(([, v]) => hasText(v)) as Array<[string, string]>;

  const hasFamily =
    familyRows.length > 0 ||
    siblings.length > 0 ||
    (!isOnePage && (hasText(data.extendedFamilyNote) || hasText(data.familyBackgroundNote)));

  const desherBariFull = isOnePage
    ? [data.permanentUpazila, data.permanentDistrict].filter(hasText).join(', ')
    : [
        hasText(data.permanentVillage) ? `${L.village}: ${data.permanentVillage}` : '',
        hasText(data.permanentUpazila) ? `${L.upazila}: ${data.permanentUpazila}` : '',
        hasText(data.permanentDistrict) ? `${L.district}: ${data.permanentDistrict}` : '',
      ]
        .filter(Boolean)
        .join(', ');

  const hasAddress = hasText(data.presentAddress) || hasText(desherBariFull);
  const hasAbout = !isOnePage && (hasText(data.aboutMe) || hasText(data.hobbies));

  const expectationRows: Array<[string, string]> = (
    isOnePage
      ? [
          [L.expectedAge, data.expectedAge],
          [L.expectedHeight, data.expectedHeight],
          [L.expectedEducation, data.expectedEducation],
          [L.expectedQualities, data.expectedQualities],
        ]
      : [
          [L.expectedAge, data.expectedAge],
          [L.expectedHeight, data.expectedHeight],
          [L.expectedEducation, data.expectedEducation],
          [L.expectedProfession, data.expectedProfession],
          [L.expectedLocation, data.expectedLocation],
          [L.expectedQualities, data.expectedQualities],
        ]
  ).filter(([, v]) => hasText(v)) as Array<[string, string]>;

  const guardianRows: Array<[string, string]> = [
    [
      L.contactPerson,
      [data.guardianName, hasText(data.guardianRelation) ? `(${data.guardianRelation})` : '']
        .filter(hasText)
        .join(' '),
    ],
    [L.whatsappPhone, data.guardianPhone],
    ...(isOnePage ? [] : [[L.email, data.guardianEmail] as [string, string]]),
  ].filter(([, v]) => hasText(v)) as Array<[string, string]>;

  const customSections = (data.customSections || []).filter(
    (c) => hasText(c.title) || hasText(c.content)
  );

  const baseTextSize = fs(isWhatsApp || isWhatsAppCards ? (isOnePage ? 12.2 : 13.4) : 11.8);
  const goldAccent = '#c59b45';

  const renderPhoto = (frameColor: string) => {
    if (!showPhoto) return null;
    return (
      <div
        className="shrink-0 p-1 bg-white shadow-xs"
        style={{
          border: `1.5px solid ${frameColor}`,
          borderRadius:
            photoShape === 'circle' ? '9999px' : photoShape === 'rounded' ? '12px' : '2px',
        }}
      >
        <img
          src={data.photo}
          alt={data.fullName || 'Portrait'}
          referrerPolicy="no-referrer"
          className="object-cover object-top block"
          style={{
            width: `${photoDims.width}px`,
            height: `${photoDims.height}px`,
            borderRadius: photoRadius,
          }}
        />
      </div>
    );
  };

  const renderRows = (
    rows: Array<[string, string]>,
    labelWidth = isWhatsApp || isWhatsAppCards ? '195px' : '178px',
    bordered = false
  ) => (
    <div
      className={bordered ? 'divide-y divide-neutral-200/80' : 'space-y-1.5'}
      style={{ fontSize: baseTextSize }}
    >
      {rows.map(([k, v]) => (
        <div
          key={k}
          className={`grid gap-2 a4-avoid-break ${bordered ? 'py-1.5 px-3' : 'leading-[1.54]'}`}
          style={{ gridTemplateColumns: `${labelWidth} 10px 1fr` }}
        >
          <span className="font-semibold text-neutral-700">{k}</span>
          <span className="text-neutral-400">:</span>
          <span className="text-neutral-950 font-medium">{v}</span>
        </div>
      ))}
    </div>
  );

  const renderEducationBlock = (asTable = false) => {
    if (education.length === 0) return null;
    if (asTable) {
      return (
        <table className="w-full border-collapse text-left mt-2.5" style={{ fontSize: fs(11.3) }}>
          <thead>
            <tr
              style={{
                backgroundColor: isMono ? '#ffffff' : secondary,
                borderTop: `1.5px solid ${accent}`,
                borderBottom: `1px solid ${accent}45`,
              }}
            >
              <th className="py-1.5 px-2.5 font-bold" style={{ color: accent }}>
                {L.examDegree}
              </th>
              <th className="py-1.5 px-2.5 font-bold" style={{ color: accent }}>
                {L.institution}
              </th>
              <th className="py-1.5 px-2.5 font-bold text-center" style={{ color: accent }}>
                {L.passingYear}
              </th>
              <th className="py-1.5 px-2.5 font-bold text-right" style={{ color: accent }}>
                {L.resultGpa}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {education.map((edu) => (
              <tr key={edu.id} className="a4-avoid-break">
                <td className="py-1.5 px-2.5 font-semibold text-neutral-950">
                  {edu.examTitle}
                  {hasText(edu.groupOrMajor) ? ` (${edu.groupOrMajor})` : ''}
                </td>
                <td className="py-1.5 px-2.5 text-neutral-800">
                  {[edu.institution, edu.boardOrUniversity].filter(hasText).join(', ')}
                </td>
                <td className="py-1.5 px-2.5 text-center tabular-nums text-neutral-700">
                  {edu.passingYear}
                </td>
                <td className="py-1.5 px-2.5 text-right tabular-nums font-bold" style={{ color: accent }}>
                  {hasText(edu.result)
                    ? hasText(edu.scale)
                      ? `${edu.result}/${edu.scale}`
                      : edu.result
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <div className="space-y-1.5 mt-2.5" style={{ fontSize: baseTextSize }}>
        {education.map((edu) => (
          <div key={edu.id} className="a4-avoid-break leading-[1.52] flex items-baseline justify-between gap-3">
            <div>
              <span className="font-bold text-neutral-950">{edu.examTitle}</span>
              {hasText(edu.groupOrMajor) && (
                <span className="text-neutral-700"> ({edu.groupOrMajor})</span>
              )}
              {hasText(edu.institution) && (
                <span className="text-neutral-800"> — {edu.institution}</span>
              )}
            </div>
            {(hasText(edu.passingYear) || hasText(edu.result)) && (
              <span className="text-neutral-600 tabular-nums shrink-0 font-medium" style={{ fontSize: fs(11) }}>
                {[
                  edu.passingYear,
                  hasText(edu.result)
                    ? `${edu.result}${hasText(edu.scale) ? `/${edu.scale}` : ''}`
                    : '',
                ]
                  .filter(hasText)
                  .join(' · ')}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFamilyContent = (bordered = false, labelWidth = isWhatsApp || isWhatsAppCards ? '195px' : '178px') => (
    <div className={isOnePage ? 'space-y-1.5' : 'space-y-2'} style={{ fontSize: baseTextSize }}>
      {familyRows.length > 0 &&
        (isOnePage && !bordered ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {familyRows.map(([k, v]) => (
              <div key={k} className="leading-[1.46] a4-avoid-break">
                <span className="font-semibold text-neutral-600">{k}: </span>
                <span className="text-neutral-950 font-medium">{v}</span>
              </div>
            ))}
          </div>
        ) : (
          renderRows(familyRows, labelWidth, bordered)
        ))}
      {siblings.length > 0 && (
        <div
          className={`grid gap-2 a4-avoid-break ${bordered ? 'py-1.5 px-3 border-t border-neutral-200/80' : ''}`}
          style={{ gridTemplateColumns: `${isOnePage ? '120px' : labelWidth} 10px 1fr` }}
        >
          <span className="font-semibold text-neutral-700">{L.siblings}</span>
          <span className="text-neutral-400">:</span>
          <div className="space-y-0.5 text-neutral-950">
            {siblings.map((s) => (
              <div key={s.id}>
                {hasText(s.relation) && <span className="font-semibold">{s.relation}: </span>}
                <span>{s.details}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {!isOnePage &&
        hasText(data.extendedFamilyNote) &&
        renderRows([[L.extendedFamily, data.extendedFamilyNote]], labelWidth, bordered)}
      {!isOnePage &&
        hasText(data.familyBackgroundNote) &&
        renderRows([[L.familyNote, data.familyBackgroundNote]], labelWidth, bordered)}
    </div>
  );

  const SectionBar = ({ title }: { title: string }) => {
    if (isWhatsApp) {
      return (
        <h2
          className="font-bold py-1.5 px-3.5 mb-2.5 rounded-md"
          style={{ backgroundColor: secondary, color: accent, fontSize: fs(13.8) }}
        >
          {title}
        </h2>
      );
    }
    if (isMono) {
      return (
        <h2
          className="font-bold uppercase tracking-[0.12em] pb-1 mb-2.5 border-b-[1.5px] border-neutral-950 text-neutral-950"
          style={{ fontSize: fs(12.2) }}
        >
          {title}
        </h2>
      );
    }
    if (
      isRoyal ||
      isMughalArch ||
      isNawabNavy ||
      isArtDeco ||
      isParchment ||
      isSindoorHindu ||
      isCathedralGold ||
      isSaffronDharma ||
      isAndalusian ||
      isWhiteLotusStupa
    ) {
      return (
        <div className="flex items-center gap-3 mb-2.5">
          <h2
            className="font-bold uppercase tracking-[0.11em] whitespace-nowrap"
            style={{ color: accent, fontSize: fs(12) }}
          >
            {title}
          </h2>
          <div className="h-[1px] flex-1" style={{ backgroundColor: goldAccent, opacity: 0.7 }} />
          <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ backgroundColor: accent }} />
        </div>
      );
    }
    if (
      isFloral ||
      isBlushGarden ||
      isPastel ||
      isAlpona ||
      isIslamic ||
      isJamdani ||
      isLavender ||
      isMarigoldHolud ||
      isOliveChapel ||
      isBodhiJade ||
      isHillLoom
    ) {
      return (
        <h2
          className="font-bold py-1.5 px-3 mb-2.5 border-b"
          style={{
            backgroundColor: secondary,
            color: accent,
            borderColor: `${accent}35`,
            fontSize: fs(12.8),
          }}
        >
          {title}
        </h2>
      );
    }
    if (isBotanical || isShantiniketan) {
      return (
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
          <h2 className="font-bold uppercase tracking-[0.1em]" style={{ color: accent, fontSize: fs(11.8) }}>
            {title}
          </h2>
          <div className="h-[1px] flex-1" style={{ backgroundColor: `${accent}30` }} />
        </div>
      );
    }
    return (
      <h2
        className="font-bold uppercase tracking-[0.09em] pb-1.5 mb-2.5 border-b-2"
        style={{ color: accent, borderColor: accent, fontSize: fs(12) }}
      >
        {title}
      </h2>
    );
  };

  const sectionOrder = customization?.sectionOrder?.length
    ? customization.sectionOrder
    : [...DEFAULT_BIODATA_SECTION_ORDER];

  const renderOrderedBiodataSections = (opts: {
    excludeKeys?: string[];
    labelWidth?: string;
    asFamilyCard?: boolean;
    asRoundedCard?: boolean;
    leftRail?: boolean;
    eduTable?: boolean;
    twoColPersonal?: boolean;
  }) => {
    const excluded = new Set(opts.excludeKeys ?? []);
    const lw = opts.labelWidth ?? (isWhatsApp || isWhatsAppCards ? '195px' : '178px');
    const cardWrap = Boolean(opts.asFamilyCard);
    const roundedWrap = Boolean(opts.asRoundedCard);

    const wrap = (key: string, title: string, body: React.ReactNode) => {
      if (opts.leftRail) {
        return (
          <section
            key={key}
            className="grid grid-cols-[155px_1fr] gap-6 pt-3.5 border-t border-neutral-200 items-start"
          >
            <h2
              className="font-bold uppercase tracking-[0.1em] pt-0.5 leading-snug"
              style={{ color: accent, fontSize: fs(10.8) }}
            >
              {title}
            </h2>
            <div>{body}</div>
          </section>
        );
      }
      if (roundedWrap) {
        return (
          <section
            key={key}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: '#ffffff', borderColor: `${accent}25`, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
          >
            <h2
              className="font-bold pb-2 mb-2.5 border-b"
              style={{ color: accent, borderColor: `${accent}20`, fontSize: fs(13.2) }}
            >
              {title}
            </h2>
            {body}
          </section>
        );
      }
      if (cardWrap) {
        return (
          <section key={key} className="border border-neutral-300 overflow-hidden">
            <div
              className="py-1.5 px-3 font-bold border-b border-neutral-300"
              style={{ backgroundColor: secondary, color: accent, fontSize: fs(12.4) }}
            >
              {title}
            </div>
            {body}
          </section>
        );
      }
      return (
        <section key={key}>
          <SectionBar title={title} />
          {body}
        </section>
      );
    };

    return sectionOrder.map((key) => {
      if (excluded.has(key) || !isShown(key)) return null;

      if (key === 'personal' && personalRows.length > 0) {
        if (opts.twoColPersonal || (isOnePage && !cardWrap)) {
          return wrap(
            'personal',
            L.personalDetails,
            <div className="grid grid-cols-2 gap-x-6 gap-y-1" style={{ fontSize: baseTextSize }}>
              {personalRows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[118px_1fr] gap-1.5 a4-avoid-break leading-[1.45]">
                  <span className="font-semibold text-neutral-600">{k}:</span>
                  <span className="text-neutral-950 font-medium">{v}</span>
                </div>
              ))}
            </div>
          );
        }
        return wrap('personal', L.personalDetails, renderRows(personalRows, lw, cardWrap));
      }

      if (key === 'careerEducation' && (careerRows.length > 0 || education.length > 0)) {
        return wrap(
          'careerEducation',
          L.educationCareer,
          <>
            {careerRows.length > 0 && renderRows(careerRows, isOnePage ? '150px' : lw, cardWrap)}
            <div className={cardWrap ? 'p-2.5' : ''}>{renderEducationBlock(opts.eduTable)}</div>
          </>
        );
      }

      if (key === 'family' && hasFamily) {
        return wrap('family', L.familyBackground, renderFamilyContent(cardWrap, lw));
      }

      if (key === 'address' && hasAddress) {
        const addrRows = [
          [L.presentAddress, data.presentAddress],
          [L.desherBari, desherBariFull],
        ].filter(([, v]) => hasText(v)) as Array<[string, string]>;
        return wrap(
          'address',
          L.addressDetails,
          isOnePage && !cardWrap ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1" style={{ fontSize: baseTextSize }}>
              {addrRows.map(([k, v]) => (
                <div key={k} className="leading-[1.46] a4-avoid-break">
                  <span className="font-semibold text-neutral-600">{k}: </span>
                  <span className="text-neutral-950 font-medium">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            renderRows(addrRows, lw, cardWrap)
          )
        );
      }

      if (key === 'about' && !isOnePage && hasAbout) {
        return wrap(
          'about',
          L.aboutMe,
          <div className={cardWrap ? 'p-3' : ''} style={{ fontSize: baseTextSize }}>
            {hasText(data.aboutMe) && (
              <p className="leading-[1.6] text-neutral-800">{data.aboutMe}</p>
            )}
            {hasText(data.hobbies) && (
              <p className="text-neutral-800 mt-1.5">
                <span className="font-semibold text-neutral-950">{L.hobbies}: </span>
                {data.hobbies}
              </p>
            )}
          </div>
        );
      }

      if (key === 'expectations' && expectationRows.length > 0) {
        return wrap(
          'expectations',
          L.partnerExpectations,
          isOnePage && !cardWrap ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1" style={{ fontSize: baseTextSize }}>
              {expectationRows.map(([k, v]) => (
                <div
                  key={k}
                  className={`leading-[1.46] a4-avoid-break ${
                    k === L.expectedQualities ? 'col-span-2' : ''
                  }`}
                >
                  <span className="font-semibold text-neutral-600">{k}: </span>
                  <span className="text-neutral-950 font-medium">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            renderRows(expectationRows, lw, cardWrap)
          )
        );
      }

      if (key === 'custom' && customSections.length > 0) {
        return (
          <React.Fragment key="custom">
            {customSections.map((cs) => {
              const lines = splitLines(cs.content);
              return wrap(
                cs.id,
                cs.title || (language === 'bn' ? 'অতিরিক্ত তথ্য' : 'Additional Details'),
                <div className={cardWrap ? 'p-3' : ''} style={{ fontSize: baseTextSize }}>
                  {lines.length > 1 ? (
                    <ul className="list-disc pl-4 space-y-1 text-neutral-800">
                      {lines.map((ln, i) => (
                        <li key={i}>{ln}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="leading-[1.58] text-neutral-800 whitespace-pre-line">
                      {cs.content}
                    </p>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        );
      }

      if (key === 'guardian' && guardianRows.length > 0) {
        return (
          <section
            key="guardian"
            className={`a4-avoid-break ${isOnePage ? 'p-3' : 'p-4'} border ${roundedWrap ? 'rounded-xl' : ''}`}
            style={{
              backgroundColor: isMono ? '#ffffff' : secondary,
              borderColor: isMono ? '#27272a' : `${accent}45`,
            }}
          >
            <div
              className="font-bold uppercase tracking-[0.09em] mb-1.5"
              style={{ color: isMono ? '#111111' : accent, fontSize: fs(11.8) }}
            >
              {L.guardianContact}
            </div>
            {isOnePage ? (
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1" style={{ fontSize: baseTextSize }}>
                {guardianRows.map(([k, v]) => (
                  <div key={k}>
                    <span className="font-semibold text-neutral-700">{k}: </span>
                    <span className="font-bold text-neutral-950">{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              renderRows(guardianRows, isWhatsApp || isWhatsAppCards ? '185px' : '168px', false)
            )}
          </section>
        );
      }

      return null;
    });
  };

  // =========================================================================
  // 1. EDITORIAL MAGAZINE SPLITS (two-col-magazine & crimson-velvet-magazine)
  // =========================================================================
  if (isMagazine || isCrimsonMagazine) {
    const darkRail = isCrimsonMagazine;
    return (
      <div className={`a4-sheet grid grid-cols-[268px_1fr] bg-white ${useSerif ? 'a4-sheet-serif' : ''}`}>
        <aside
          className={`p-7 flex flex-col gap-5 ${darkRail ? 'text-white' : 'border-r border-neutral-200'}`}
          style={{
            backgroundColor: darkRail ? accent : secondary,
            minHeight: '1123px',
            borderRight: darkRail ? `3px solid ${goldAccent}` : undefined,
          }}
        >
          {invocation && (
            <div
              className={`text-center pb-3 border-b ${
                darkRail ? 'border-white/20' : 'border-neutral-300/70'
              }`}
            >
              {invocation.arabic && (
                <div
                  className="font-serif"
                  style={{ color: darkRail ? '#ebd299' : accent, fontSize: fs(16) }}
                >
                  {invocation.arabic}
                </div>
              )}
              {invocation.subtitle && (
                <div
                  className={`mt-0.5 ${darkRail ? 'text-white/80' : 'text-neutral-600'}`}
                  style={{ fontSize: fs(10.2) }}
                >
                  {invocation.subtitle}
                </div>
              )}
            </div>
          )}

          {showPhoto && (
            <div className="flex justify-center">
              {renderPhoto(darkRail ? goldAccent : '#ffffff')}
            </div>
          )}

          <div className="text-center">
            <h1
              className="font-bold leading-snug"
              style={{
                color: darkRail ? '#ffffff' : accent,
                fontSize: fs(22),
                fontFamily: DISPLAY_SERIF,
              }}
            >
              {data.fullName || (language === 'bn' ? 'পাত্র / পাত্রীর নাম' : 'Full Name')}
            </h1>
            {hasText(data.occupation) && (
              <p
                className={`mt-1 font-medium ${darkRail ? 'text-[#ebd299]' : 'text-neutral-700'}`}
                style={{ fontSize: fs(11.3) }}
              >
                {data.occupation}
              </p>
            )}
          </div>

          {isShown('personal') && personalRows.length > 0 && (
            <div data-pdf-block="true" className="space-y-1.5" style={{ fontSize: fs(10.9) }}>
              <h2
                className={`font-bold uppercase tracking-[0.12em] pb-1 border-b ${
                  darkRail ? 'border-white/25' : 'border-neutral-300'
                }`}
                style={{ color: darkRail ? '#ebd299' : accent, fontSize: fs(10.2) }}
              >
                {L.personalDetails}
              </h2>
              {personalRows.map(([k, v]) => (
                <div key={k} className="leading-snug">
                  <span className={`font-semibold ${darkRail ? 'text-white/75' : 'text-neutral-600'}`}>
                    {k}:{' '}
                  </span>
                  <span className={`font-medium ${darkRail ? 'text-white' : 'text-neutral-950'}`}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          )}

          {isShown('guardian') && guardianRows.length > 0 && (
            <div
              data-pdf-block="true"
              className={`mt-auto p-3.5 border space-y-1.5 ${
                darkRail ? 'bg-white/10 border-white/25' : 'bg-white border-neutral-300/80'
              }`}
              style={{ fontSize: fs(10.8) }}
            >
              <h2
                className="font-bold uppercase tracking-[0.11em]"
                style={{ color: darkRail ? '#ebd299' : accent, fontSize: fs(10.2) }}
              >
                {L.guardianContact}
              </h2>
              {guardianRows.map(([k, v]) => (
                <div key={k} className="leading-snug">
                  <span className={`font-semibold ${darkRail ? 'text-white/75' : 'text-neutral-600'}`}>
                    {k}:{' '}
                  </span>
                  <span className={darkRail ? 'text-white font-medium' : 'text-neutral-950'}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        <main className={`p-8 ${sectionGapClass}`}>
          {renderOrderedBiodataSections({
            excludeKeys: ['personal', 'guardian'],
            labelWidth: '155px',
            eduTable: darkRail,
          })}
        </main>
      </div>
    );
  }

  // =========================================================================
  // 2. FULL-BLEED PRESTIGE BANNERS
  //    (emerald-velvet-banner, executive-modern, banarasi-crimson-gold, midnight-stella-christian)
  // =========================================================================
  if (isEmeraldCanopy || isExecutive || isBanarasiBanner || isSapphireChristian) {
    const hasGoldTrim = isEmeraldCanopy || isBanarasiBanner || isSapphireChristian;
    return (
      <div
        className={`a4-sheet ${useSerif ? 'a4-sheet-serif' : ''}`}
        style={{ backgroundColor: meta.paperTint }}
      >
        <header
          className="px-10 py-8 text-white"
          style={{
            backgroundColor: accent,
            borderBottom: isBanarasiBanner
              ? 'none'
              : hasGoldTrim
              ? `3.5px solid ${goldAccent}`
              : '3px solid rgba(255,255,255,0.25)',
          }}
        >
          {isSapphireChristian && (
            <div className="flex justify-center mb-2" aria-hidden="true">
              <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
                <circle cx="18" cy="18" r="16" stroke="#ebd299" strokeWidth="1" strokeOpacity="0.65" />
                <line x1="18" y1="7" x2="18" y2="29" stroke="#ebd299" strokeWidth="1.9" strokeLinecap="round" />
                <line x1="11" y1="14.5" x2="25" y2="14.5" stroke="#ebd299" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </div>
          )}
          {invocation && (
            <div className="text-center mb-4 pb-3 border-b border-white/18">
              {invocation.arabic && (
                <div
                  className="font-serif"
                  style={{ color: hasGoldTrim ? '#ebd299' : '#ffffff', fontSize: fs(18) }}
                >
                  {invocation.arabic}
                </div>
              )}
              {invocation.subtitle && (
                <div className="text-white/85 mt-0.5" style={{ fontSize: fs(10.8) }}>
                  {invocation.subtitle}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-6">
            <div>
              <div
                className="uppercase tracking-[0.2em] mb-1"
                style={{
                  color: hasGoldTrim ? '#ebd299' : 'rgba(255,255,255,0.72)',
                  fontSize: fs(10.5),
                }}
              >
                {L.marriageBiodata}
              </div>
              <h1
                className="font-bold leading-tight"
                style={{
                  fontSize: fs(29),
                  fontFamily: hasGoldTrim ? DISPLAY_SERIF : undefined,
                }}
              >
                {data.fullName || (language === 'bn' ? 'পাত্র / পাত্রীর নাম' : 'Full Name')}
              </h1>
              {hasText(data.occupation) && (
                <p className="text-white/90 mt-1" style={{ fontSize: fs(12.5) }}>
                  {[data.occupation, data.workplace].filter(hasText).join(' · ')}
                </p>
              )}
            </div>
            {renderPhoto(hasGoldTrim ? goldAccent : '#ffffff')}
          </div>
        </header>

        {/* Woven Banarasi Gold Zari Brocade Band directly beneath crimson banner */}
        {isBanarasiBanner && <BanarasiZariBand color="#6e0d1a" gold="#e4be6c" />}

        <div className={`px-10 py-7 ${sectionGapClass}`}>
          {renderOrderedBiodataSections({
            eduTable: true,
            twoColPersonal: true,
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MINIMAL EDITORIAL SPLIT (minimal-modern & dove-pearl-minimal)
  // =========================================================================
  if (isMinimalSplit) {
    return (
      <div className={`a4-sheet bg-white px-11 py-10 ${useSerif ? 'a4-sheet-serif' : ''}`}>
        {isDovePearlMinimal && (
          <ChristianCrestHeader color={accent} secondary={goldAccent} compact />
        )}
        {invocation && (
          <div className="text-center mb-5 pb-3 border-b border-neutral-200">
            {invocation.arabic && (
              <div className="font-serif" style={{ color: accent, fontSize: fs(17) }}>
                {invocation.arabic}
              </div>
            )}
            {invocation.subtitle && (
              <div className="text-neutral-500 mt-0.5" style={{ fontSize: fs(10.8) }}>
                {invocation.subtitle}
              </div>
            )}
          </div>
        )}

        <header className="flex items-start justify-between gap-6 pb-6">
          <div className="flex items-start gap-4 flex-1">
            {!showPhoto && <MonogramSeal name={data.fullName || 'MB'} color={accent} size={46} />}
            <div>
              <div className="uppercase tracking-[0.18em] text-neutral-500 font-semibold mb-1" style={{ fontSize: fs(10) }}>
                {L.marriageBiodata}
              </div>
              <h1 className="font-bold text-neutral-950 leading-tight" style={{ fontSize: fs(27) }}>
                {data.fullName || (language === 'bn' ? 'পাত্র / পাত্রীর নাম' : 'Full Name')}
              </h1>
              {(hasText(data.occupation) || hasText(data.workplace)) && (
                <p className="text-neutral-600 mt-1" style={{ fontSize: fs(12) }}>
                  {[data.occupation, data.workplace].filter(hasText).join(' · ')}
                </p>
              )}
            </div>
          </div>
          {renderPhoto('#cbd5e1')}
        </header>

        <div className="space-y-4">
          {renderOrderedBiodataSections({
            leftRail: true,
            labelWidth: '155px',
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. MODERN WHATSAPP CARDS (dhaka-modern-whatsapp)
  // =========================================================================
  if (isWhatsAppCards) {
    return (
      <div className={`a4-sheet px-9 py-8 ${useSerif ? 'a4-sheet-serif' : ''}`} style={{ backgroundColor: '#f8fafc' }}>
        <header
          className="p-6 rounded-xl mb-5 border flex items-center justify-between gap-6"
          style={{ backgroundColor: '#ffffff', borderColor: `${accent}28` }}
        >
          <div className="flex-1">
            {invocation && (
              <div className="mb-2">
                {invocation.arabic && (
                  <div className="font-serif" style={{ color: accent, fontSize: fs(16) }}>
                    {invocation.arabic}
                  </div>
                )}
                {invocation.subtitle && (
                  <div className="text-neutral-500" style={{ fontSize: fs(10.5) }}>
                    {invocation.subtitle}
                  </div>
                )}
              </div>
            )}
            <h1 className="font-bold text-neutral-950 leading-tight" style={{ fontSize: fs(26) }}>
              {data.fullName || (language === 'bn' ? 'পাত্র / পাত্রীর নাম' : 'Full Name')}
            </h1>
            {(hasText(data.occupation) || hasText(data.workplace)) && (
              <p className="font-medium mt-1" style={{ color: accent, fontSize: fs(12.5) }}>
                {[data.occupation, data.workplace].filter(hasText).join(' · ')}
              </p>
            )}
          </div>
          {renderPhoto(`${accent}45`)}
        </header>

        <div className={sectionGapClass}>
          {renderOrderedBiodataSections({
            asRoundedCard: true,
            labelWidth: '185px',
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. FRAMED LUXURY, FLORAL, ISLAMIC, HINDU, CHRISTIAN, BUDDHIST & HERITAGE TEMPLATES
  // =========================================================================
  const cornerVariant = isRoyal
    ? 'royal'
    : isFloral
    ? 'floral'
    : isIslamic || isAndalusian
    ? 'islamic'
    : isAlpona
    ? 'alpona'
    : isArtDeco
    ? 'artdeco'
    : isBotanical
    ? 'botanical'
    : isSindoorHindu || isKalighatDossier
    ? 'kalka'
    : isMarigoldHolud || isSaffronDharma
    ? 'lotus'
    : isCathedralGold || isOliveChapel
    ? 'olive'
    : isBodhiJade
    ? 'bodhi'
    : null;

  const hasOuterDoubleBorder =
    isRoyal ||
    isMughalArch ||
    isNawabNavy ||
    isIslamic ||
    isAndalusian ||
    isMono ||
    isParchment ||
    isPastel ||
    isAlpona ||
    isArtDeco ||
    isSindoorHindu ||
    isMarigoldHolud ||
    isCathedralGold ||
    isSaffronDharma ||
    isWhiteLotusStupa;

  const hasTopWovenBand = isJamdani || isHillLoom;

  const padY =
    spacing === 'tight'
      ? cornerVariant || hasOuterDoubleBorder
        ? 42
        : 32
      : spacing === 'airy'
      ? 56
      : cornerVariant || hasOuterDoubleBorder
      ? 50
      : 42;
  const padX =
    spacing === 'tight'
      ? cornerVariant || hasOuterDoubleBorder
        ? 46
        : 38
      : spacing === 'airy'
      ? 60
      : cornerVariant || hasOuterDoubleBorder
      ? 54
      : 46;

  const renderInvocationInner = () =>
    invocation ? (
      <div>
        {invocation.arabic && (
          <div className="font-serif leading-relaxed" style={{ color: accent, fontSize: fs(19) }}>
            {invocation.arabic}
          </div>
        )}
        {invocation.subtitle && (
          <div className="text-neutral-600 mt-0.5" style={{ fontSize: fs(11) }}>
            {invocation.subtitle}
          </div>
        )}
      </div>
    ) : (
      <div className="uppercase tracking-[0.2em] font-bold" style={{ color: accent, fontSize: fs(11.5) }}>
        {L.marriageBiodata}
      </div>
    );

  return (
    <div
      className={`a4-sheet relative ${useSerif ? 'a4-sheet-serif' : ''}`}
      style={{
        backgroundColor: meta.paperTint,
        padding: hasTopWovenBand ? '24px 48px 34px' : `${padY}px ${padX}px`,
      }}
    >
      {/* Full-Perimeter Double Frame (replicated automatically per page!) */}
      {hasOuterDoubleBorder && (
        <div
          data-pdf-page-frame="true"
          className="pointer-events-none absolute inset-4"
          style={{
            border: `${isMono || isNawabNavy ? '2px' : '1.6px'} solid ${accent}`,
            padding: '4px',
          }}
          aria-hidden="true"
        >
          <div
            className="w-full h-full"
            style={{
              border: `1px ${isPastel ? 'dashed' : 'solid'} ${
                isMono
                  ? '#404040'
                  : isNawabNavy ||
                    isRoyal ||
                    isMughalArch ||
                    isArtDeco ||
                    isSindoorHindu ||
                    isCathedralGold ||
                    isSaffronDharma ||
                    isAndalusian ||
                    isWhiteLotusStupa
                  ? goldAccent
                  : `${accent}66`
              }`,
            }}
          />
        </div>
      )}

      {/* 4-Corner Rich Vector Ornament Frame */}
      {cornerVariant && (
        <FourCornerFrame
          variant={cornerVariant}
          color={accent}
          secondary={
            isRoyal ||
            isIslamic ||
            isAndalusian ||
            isAlpona ||
            isArtDeco ||
            isSindoorHindu ||
            isKalighatDossier ||
            isMarigoldHolud ||
            isCathedralGold ||
            isSaffronDharma ||
            isBodhiJade
              ? goldAccent
              : isFloral
              ? '#4f7359'
              : accent
          }
        />
      )}

      {/* Dhakai Jamdani or Chittagong Hill-Loom Top Woven Band */}
      {isJamdani && (
        <div className="mb-5">
          <JamdaniBand color={accent} secondary="#a32638" gold={goldAccent} />
        </div>
      )}
      {isHillLoom && (
        <div className="mb-5">
          <HillLoomBand indigo={accent} terracotta="#b43b2a" gold={goldAccent} />
        </div>
      )}

      <div className="relative z-10">
        {/* Bespoke Multi-Faith & Heritage Header Crowns */}
        {isMughalArch ? (
          <MughalArchHeader color={accent} secondary={goldAccent}>
            {renderInvocationInner()}
          </MughalArchHeader>
        ) : isAndalusian ? (
          <AndalusianArchHeader color={accent} secondary={goldAccent}>
            {renderInvocationInner()}
          </AndalusianArchHeader>
        ) : isCathedralGold ? (
          <ChristianCrestHeader color={accent} secondary={goldAccent}>
            {renderInvocationInner()}
          </ChristianCrestHeader>
        ) : isSaffronDharma ? (
          <DharmachakraHeader color={accent} secondary={goldAccent}>
            {renderInvocationInner()}
          </DharmachakraHeader>
        ) : isSindoorHindu || isShantiniketan || isWhiteLotusStupa ? (
          <LotusMandalaHeader color={accent} secondary={goldAccent}>
            {invocation && (
              <div>
                {invocation.arabic && (
                  <div className="font-serif leading-relaxed" style={{ color: accent, fontSize: fs(19) }}>
                    {invocation.arabic}
                  </div>
                )}
                {invocation.subtitle && (
                  <div className="text-neutral-700 mt-0.5" style={{ fontSize: fs(11.2) }}>
                    {invocation.subtitle}
                  </div>
                )}
              </div>
            )}
          </LotusMandalaHeader>
        ) : (
          invocation && (
            <div
              className={`text-center mb-4 ${
                isPastel || isBlushGarden || isLavender || isMarigoldHolud
                  ? 'py-3.5 px-5 rounded-md'
                  : ''
              }`}
              style={
                isPastel || isBlushGarden || isLavender || isMarigoldHolud
                  ? { backgroundColor: secondary }
                  : undefined
              }
            >
              {invocation.arabic && (
                <div
                  className="font-serif leading-relaxed"
                  style={{ color: isMono ? '#111111' : accent, fontSize: fs(19.5) }}
                >
                  {invocation.arabic}
                </div>
              )}
              {invocation.subtitle && (
                <div className="text-neutral-700 mt-0.5" style={{ fontSize: fs(11.2) }}>
                  {invocation.subtitle}
                </div>
              )}
              {(isRoyal ||
                isParchment ||
                isIslamic ||
                isAlpona ||
                isNawabNavy ||
                isArtDeco ||
                isKalighatDossier) && (
                <OrnamentalDivider color={accent} secondary={goldAccent} style="diamond" />
              )}
              {(isFloral || isBlushGarden || isBotanical) && (
                <OrnamentalDivider color={accent} secondary="#4f7359" style="floral" />
              )}
              {(isMarigoldHolud || isBodhiJade) && (
                <OrnamentalDivider color={accent} secondary={goldAccent} style="lotus" />
              )}
              {isOliveChapel && (
                <OrnamentalDivider color={accent} secondary={goldAccent} style="cross" />
              )}
            </div>
          )
        )}

        {/* Dignified Name & Portrait Lockup */}
        <header
          className="flex items-start justify-between gap-6 mb-5 pb-4 border-b"
          style={{ borderColor: isMono ? '#27272a' : `${accent}30` }}
        >
          <div
            className={`flex-1 ${
              !showPhoto &&
              (isRoyal ||
                isMughalArch ||
                isAndalusian ||
                isFloral ||
                isBlushGarden ||
                isIslamic ||
                isAlpona ||
                isJamdani ||
                isHillLoom ||
                isParchment ||
                isNawabNavy ||
                isArtDeco ||
                isSindoorHindu ||
                isMarigoldHolud ||
                isShantiniketan ||
                isCathedralGold ||
                isOliveChapel ||
                isSaffronDharma ||
                isBodhiJade ||
                isWhiteLotusStupa)
                ? 'text-center'
                : ''
            }`}
          >
            <div
              className="font-bold uppercase tracking-[0.18em] mb-1"
              style={{ color: isMono ? '#3f3f46' : accent, fontSize: fs(10.6) }}
            >
              {L.marriageBiodata}
            </div>
            <h1
              className="font-bold leading-tight text-neutral-950"
              style={{
                fontSize: fs(isWhatsApp ? 27 : useSerif ? 29 : 26),
                fontFamily: useSerif ? DISPLAY_SERIF : undefined,
              }}
            >
              {data.fullName || (language === 'bn' ? 'পাত্র / পাত্রীর নাম' : 'Full Name')}
            </h1>
            {(hasText(data.occupation) || hasText(data.workplace)) && (
              <p className="text-neutral-700 mt-1 font-medium" style={{ fontSize: fs(12.2) }}>
                {[data.occupation, data.workplace].filter(hasText).join(' · ')}
              </p>
            )}
            {hasText(data.presentAddress) && isWhatsApp && (
              <p className="text-neutral-600 mt-1" style={{ fontSize: fs(11.8) }}>
                {data.presentAddress}
              </p>
            )}
          </div>

          {renderPhoto(
            isMono
              ? '#27272a'
              : isRoyal ||
                isMughalArch ||
                isAndalusian ||
                isNawabNavy ||
                isArtDeco ||
                isSindoorHindu ||
                isCathedralGold ||
                isSaffronDharma
              ? goldAccent
              : `${accent}60`
          )}
        </header>

        {/* Main Sections */}
        <div className={sectionGapClass}>
          {renderOrderedBiodataSections({
            asFamilyCard: isFamilyCard || isKalighatDossier,
            eduTable: isAcademic || isFamilyCard || isKalighatDossier || isCathedralGold,
          })}
        </div>
      </div>

      {/* Bottom Woven Band for Jamdani & Hill-Loom */}
      {isJamdani && (
        <div className="mt-6">
          <JamdaniBand color={accent} secondary="#a32638" gold={goldAccent} />
        </div>
      )}
      {isHillLoom && (
        <div className="mt-6">
          <HillLoomBand indigo={accent} terracotta="#b43b2a" gold={goldAccent} />
        </div>
      )}
    </div>
  );
}
