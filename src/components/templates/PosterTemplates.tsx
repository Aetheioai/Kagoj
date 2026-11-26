import React from 'react';
import { Check, MapPin, Phone, Scissors } from 'lucide-react';
import {
  DocCustomization,
  DocLanguage,
  PosterData,
  getPosterAspectSpec,
} from '../../types/builder';
import { getTemplateById } from '../../data/templates';
import { hasText, splitLines, tintHex } from '../../utils/storage';

interface PosterRendererProps {
  data: PosterData;
  templateId: string;
  language: DocLanguage;
  customization?: DocCustomization;
}

const DISPLAY_SERIF = '"Cormorant Garamond", "Noto Serif Bengali", Georgia, serif';

export function PosterTemplateRenderer({
  data,
  templateId,
  language,
  customization,
}: PosterRendererProps) {
  const isBn = language === 'bn';
  const meta = getTemplateById('poster', templateId);
  const hasCustomAccent = Boolean(customization?.accentColor);
  const accent = hasCustomAccent ? customization!.accentColor : meta.accent;
  const secondary = hasCustomAccent ? tintHex(accent, 0.08) : meta.secondary;

  const aspectSpec = getPosterAspectSpec(customization?.posterAspectRatio);
  const ratio = aspectSpec.id;
  const isLandscape = ratio === 'a4-landscape' || ratio === '16:9';
  const isWide16x9 = ratio === '16:9';
  const isSquare = ratio === '1:1';
  const isStory = ratio === '9:16';

  const fontStyle = customization?.fontStyle ?? 'auto';
  const useSerif = fontStyle === 'serif' || (fontStyle === 'auto' && Boolean(meta.serif));

  const fontSize = customization?.fontSize ?? 'standard';
  const baseScale = fontSize === 'compact' ? 0.91 : fontSize === 'large' ? 1.08 : 1;
  const ratioScale = isWide16x9 ? 0.9 : isSquare ? 0.94 : isStory ? 0.97 : 1;
  const scale = baseScale * ratioScale;
  const fs = (px: number) => `${(px * scale).toFixed(1)}px`;

  const spacing = customization?.spacing ?? 'balanced';
  const padX = isWide16x9
    ? 34
    : isLandscape
    ? 36
    : spacing === 'tight'
    ? 28
    : spacing === 'airy'
    ? 40
    : 34;
  const padY = isWide16x9
    ? 16
    : isLandscape
    ? 20
    : isSquare
    ? 20
    : spacing === 'tight'
    ? 20
    : spacing === 'airy'
    ? 30
    : 26;

  const borderStyle = customization?.borderStyle ?? 'default';
  const showPriceBanner = customization?.showPriceBanner !== false && hasText(data.priceAmount);
  // Tear-off strips are strictly OPTIONAL (OFF by default)
  const showTearOff = Boolean(customization?.showTearOffStrips && hasText(data.contactPhone));
  const tearOffCount = Math.min(8, Math.max(5, customization?.tearOffCount ?? 6));

  const hidden = new Set(customization?.hiddenSections ?? []);
  const isShown = (key: string) => !hidden.has(key);

  const details = (data.details || []).filter((d) => hasText(d.label) || hasText(d.value));
  const features = splitLines(data.features);
  const customSections = (data.customSections || []).filter(
    (s) => hasText(s.title) || hasText(s.content)
  );
  const showPhoto = Boolean(data.showPhoto && hasText(data.photo));

  // Layout flags for all 15 distinct poster templates
  const isPhotocopyBW = templateId === 'ps-high-contrast-bw';
  const isGoldDouble = templateId === 'ps-royal-gold-flat';
  const isDoubleBorder =
    borderStyle === 'framed' ||
    (borderStyle === 'default' &&
      (templateId === 'ps-double-border-flyer' ||
        templateId === 'ps-royal-gold-flat' ||
        templateId === 'ps-architectural-mono' ||
        templateId === 'ps-compact-board' ||
        templateId === 'ps-high-contrast-bw'));
  const isSplitLeftBand = templateId === 'ps-modern-split';
  const isChalkboard = templateId === 'ps-chalkboard-classic';
  const isAmberWarm = templateId === 'ps-amber-hostel' || templateId === 'ps-ochre-batch';
  const isCardGrid =
    templateId === 'ps-navy-sublet' ||
    templateId === 'ps-dhaka-emerald' ||
    templateId === 'ps-corporate-space';

  const effectiveAccent = isPhotocopyBW && !hasCustomAccent ? '#111111' : accent;
  const effectiveSecondary = isPhotocopyBW && !hasCustomAccent ? '#f3f3f3' : secondary;
  const goldColor = '#c59b43';

  const photoRadius =
    customization?.photoShape === 'circle'
      ? '9999px'
      : customization?.photoShape === 'rounded'
      ? '12px'
      : '4px';

  const rootStyle: React.CSSProperties = {
    fontFamily: useSerif
      ? DISPLAY_SERIF
      : language === 'bn'
      ? '"Hind Siliguri", sans-serif'
      : '"Plus Jakarta Sans", "Hind Siliguri", sans-serif',
    backgroundColor: '#ffffff',
    color: '#171717',
    width: `${aspectSpec.width}px`,
    minWidth: `${aspectSpec.width}px`,
    height: `${aspectSpec.height}px`,
    minHeight: `${aspectSpec.height}px`,
    maxHeight: `${aspectSpec.height}px`,
    overflow: 'hidden',
  };

  const tabShortLabel =
    data.tearOffLabel.trim() ||
    data.headline.trim() ||
    (isBn ? 'যোগাযোগ' : 'CALL');

  const headlineFontPx = isWide16x9
    ? isBn
      ? 42
      : 48
    : isLandscape
    ? isBn
      ? 46
      : 52
    : isSquare
    ? isBn
      ? 48
      : 54
    : isStory
    ? isBn
      ? 60
      : 66
    : isBn
    ? 60
    : 68;

  const renderPriceBox = () => {
    if (!isShown('price') || !showPriceBanner) return null;
    return (
      <div
        className={`flex items-center justify-between gap-4 shrink-0 ${
          isWide16x9 ? 'px-4 py-2' : 'px-5 py-3'
        }`}
        style={{
          backgroundColor: isPhotocopyBW ? '#ffffff' : effectiveSecondary,
          border: `2px solid ${effectiveAccent}`,
        }}
      >
        <div>
          {hasText(data.priceLabel) && (
            <p
              className="font-bold uppercase tracking-wider"
              style={{ fontSize: fs(11.5), color: effectiveAccent }}
            >
              {data.priceLabel}
            </p>
          )}
          <p
            className="font-black leading-tight tabular-nums"
            style={{ fontSize: fs(isWide16x9 ? 22 : 27), color: '#111111' }}
          >
            {data.priceAmount}
          </p>
        </div>
        {hasText(data.priceNote) && (
          <p
            className="text-right font-semibold text-[#3a3733] max-w-[300px] leading-snug"
            style={{ fontSize: fs(12.5) }}
          >
            {data.priceNote}
          </p>
        )}
      </div>
    );
  };

  const renderDetailsAndPhoto = () => {
    if (!isShown('details') || (details.length === 0 && !showPhoto)) return null;
    const photoDim = isWide16x9 ? 132 : isLandscape ? 148 : isSquare ? 148 : 172;
    return (
      <div
        className={`grid gap-3.5 items-center ${
          showPhoto ? `grid-cols-[1fr_${photoDim + 6}px]` : 'grid-cols-1'
        }`}
      >
        {details.length > 0 && (
          <div className={`grid gap-2.5 ${isStory ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {details.map((row) => (
              <div
                key={row.id}
                className={isWide16x9 ? 'px-3 py-2' : 'px-3.5 py-2.5'}
                style={{
                  backgroundColor:
                    isCardGrid && !isPhotocopyBW ? effectiveSecondary : '#ffffff',
                  border: `1.5px solid ${
                    isPhotocopyBW ? '#111111' : `${effectiveAccent}40`
                  }`,
                  borderLeft: `4px solid ${effectiveAccent}`,
                }}
              >
                <p
                  className="font-bold uppercase tracking-wide"
                  style={{ fontSize: fs(11), color: effectiveAccent }}
                >
                  {row.label}
                </p>
                <p
                  className="font-bold text-[#141414] mt-0.5 leading-snug"
                  style={{ fontSize: fs(14) }}
                >
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {showPhoto && (
          <div
            className="overflow-hidden shrink-0 mx-auto"
            style={{
              width: `${photoDim}px`,
              height: `${photoDim}px`,
              border: `2.5px solid ${effectiveAccent}`,
              borderRadius: photoRadius,
            }}
          >
            <img
              src={data.photo}
              alt={data.headline || 'Poster visual'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    );
  };

  const renderFeatures = () => {
    if (!isShown('features') || features.length === 0) return null;
    return (
      <div className="space-y-1.5">
        {hasText(data.featuresTitle) && (
          <h2
            className="font-extrabold pb-1"
            style={{
              fontSize: fs(15),
              color: effectiveAccent,
              borderBottom: `2px solid ${
                isPhotocopyBW ? '#111111' : `${effectiveAccent}35`
              }`,
            }}
          >
            {data.featuresTitle}
          </h2>
        )}
        <ul
          className={`grid gap-1.5 pt-0.5 ${
            isSquare && features.length >= 4 ? 'grid-cols-2 gap-x-4' : 'grid-cols-1'
          }`}
        >
          {features.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 font-medium text-[#1e1c1a] leading-snug"
              style={{ fontSize: fs(isWide16x9 ? 13.4 : 14.2) }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: isPhotocopyBW ? '#111111' : effectiveAccent,
                  color: '#ffffff',
                }}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCustomSections = () => {
    if (!isShown('custom') || customSections.length === 0) return null;
    return (
      <div className="space-y-1.5">
        {customSections.map((sec) => (
          <div key={sec.id}>
            {hasText(sec.title) && (
              <p
                className="font-bold"
                style={{ fontSize: fs(13.5), color: effectiveAccent }}
              >
                {sec.title}
              </p>
            )}
            {hasText(sec.content) && (
              <p
                className="text-[#262626] whitespace-pre-line"
                style={{ fontSize: fs(13) }}
              >
                {sec.content}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderAddressAndContact = () => {
    if (!isShown('address')) return null;
    return (
      <div className="space-y-2.5 shrink-0">
        {hasText(data.address) && (
          <div
            className="flex items-start gap-2.5 px-4 py-2.5"
            style={{
              backgroundColor: isPhotocopyBW ? '#f5f5f5' : effectiveSecondary,
              border: `1.5px solid ${isPhotocopyBW ? '#111' : `${effectiveAccent}45`}`,
            }}
          >
            <MapPin
              className="w-5 h-5 shrink-0 mt-0.5"
              style={{ color: effectiveAccent }}
            />
            <div>
              {hasText(data.addressTitle) && (
                <span
                  className="font-bold mr-1.5"
                  style={{ color: effectiveAccent, fontSize: fs(13) }}
                >
                  {data.addressTitle}:
                </span>
              )}
              <span
                className="font-semibold text-[#171717]"
                style={{ fontSize: fs(13.8) }}
              >
                {data.address}
              </span>
            </div>
          </div>
        )}

        {hasText(data.contactPhone) && (
          <div
            className={`${isWide16x9 ? 'px-4 py-3' : 'px-5 py-4'} text-center`}
            style={{
              backgroundColor: isAmberWarm
                ? '#1c1917'
                : isPhotocopyBW
                ? '#111111'
                : effectiveAccent,
              color: '#ffffff',
              borderTop: isGoldDouble ? `3px solid ${goldColor}` : undefined,
            }}
          >
            {hasText(data.contactLabel) && (
              <p
                className="font-semibold uppercase tracking-wider text-white/85"
                style={{ fontSize: fs(12) }}
              >
                {data.contactLabel}
                {hasText(data.contactName) ? ` — ${data.contactName}` : ''}
              </p>
            )}
            <div className="flex items-center justify-center gap-3 mt-1">
              <Phone className="w-7 h-7 shrink-0 text-white" />
              <span
                className="font-black tracking-wide tabular-nums text-white"
                style={{ fontSize: fs(isWide16x9 ? 30 : 36) }}
              >
                {data.contactPhone}
              </span>
            </div>
            {hasText(data.contactNote) && (
              <p
                className="text-white/85 mt-1 font-medium"
                style={{ fontSize: fs(12.2) }}
              >
                {data.contactNote}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="a4-sheet flex flex-col justify-between" style={rootStyle}>
      {/* Main Poster Body */}
      <div
        className="flex-1 min-h-0 flex flex-col"
        style={{
          padding: isDoubleBorder ? (showTearOff ? '16px 20px 8px' : '18px 20px') : '0',
        }}
      >
        <div
          className="flex-1 min-h-0 flex flex-col overflow-hidden"
          style={
            isDoubleBorder
              ? {
                  border: isGoldDouble
                    ? `4px double ${goldColor}`
                    : templateId === 'ps-architectural-mono' || isPhotocopyBW
                    ? `4px solid ${effectiveAccent}`
                    : `3px double ${effectiveAccent}`,
                }
              : isSplitLeftBand
              ? { borderLeft: `14px solid ${effectiveAccent}` }
              : undefined
          }
        >
          {/* 1. HEADLINE BANNER */}
          {isShown('headline') && (
            <header
              className={`shrink-0 ${
                isLandscape
                  ? 'flex items-center justify-between gap-6 text-left'
                  : 'text-center'
              }`}
              style={{
                backgroundColor: isSplitLeftBand ? effectiveSecondary : effectiveAccent,
                color: isSplitLeftBand ? effectiveAccent : '#ffffff',
                padding: `${padY}px ${padX}px`,
                borderBottom: isGoldDouble
                  ? `4px solid ${goldColor}`
                  : isSplitLeftBand
                  ? `3px solid ${effectiveAccent}`
                  : isChalkboard
                  ? '4px dashed rgba(255,255,255,0.35)'
                  : undefined,
              }}
            >
              <div className={isLandscape ? 'min-w-0' : ''}>
                {hasText(data.badgeText) && (
                  <p
                    className="font-bold tracking-[0.2em] uppercase mb-1"
                    style={{
                      fontSize: fs(12.5),
                      color: isSplitLeftBand
                        ? '#333'
                        : isGoldDouble
                        ? '#fde68a'
                        : 'rgba(255,255,255,0.88)',
                    }}
                  >
                    {data.badgeText}
                  </p>
                )}
                <h1
                  className="font-black leading-none tracking-tight"
                  style={{
                    fontSize: fs(headlineFontPx),
                    fontFamily: useSerif ? DISPLAY_SERIF : undefined,
                    color: isSplitLeftBand ? effectiveAccent : '#ffffff',
                  }}
                >
                  {data.headline || (isBn ? 'টু-লেট' : 'TO-LET')}
                </h1>
              </div>

              {hasText(data.subHeadline) && (
                <p
                  className={`font-semibold leading-snug ${
                    isLandscape
                      ? 'max-w-[460px] text-right'
                      : 'mt-2.5 max-w-[650px] mx-auto'
                  }`}
                  style={{
                    fontSize: fs(isLandscape ? 16 : 17),
                    color: isSplitLeftBand ? '#262626' : 'rgba(255,255,255,0.95)',
                  }}
                >
                  {data.subHeadline}
                </p>
              )}
            </header>
          )}

          {/* 2. ADAPTIVE CONTENT AREA (2-column for Landscape/16:9, Vertical for Portrait/Square/Story) */}
          {isLandscape ? (
            <div
              className="flex-1 min-h-0 grid grid-cols-12 gap-6 items-stretch"
              style={{ padding: `${Math.max(16, padY)}px ${padX}px` }}
            >
              <div className="col-span-7 flex flex-col justify-between gap-3.5 min-w-0">
                {renderPriceBox()}
                {renderDetailsAndPhoto()}
                {renderCustomSections()}
              </div>
              <div className="col-span-5 flex flex-col justify-between gap-3.5 min-w-0">
                {renderFeatures()}
                {renderAddressAndContact()}
              </div>
            </div>
          ) : (
            <div
              className="flex-1 min-h-0 flex flex-col justify-between gap-3.5"
              style={{ padding: `${Math.max(18, padY)}px ${padX}px` }}
            >
              {renderPriceBox()}
              {renderDetailsAndPhoto()}
              {renderFeatures()}
              {renderCustomSections()}
              {renderAddressAndContact()}
            </div>
          )}
        </div>
      </div>

      {/* 3. OPTIONAL CUT-HERE TEAR-OFF PHONE STRIPS (OFF BY DEFAULT) */}
      {isShown('strips') && showTearOff && (
        <div className="shrink-0 pt-1">
          <div className="flex items-center gap-2 px-5 pb-1 text-[#525252]">
            <Scissors className="w-3.5 h-3.5 shrink-0" />
            <div className="flex-1 border-t-[1.5px] border-dashed border-[#444]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {isBn ? 'কাঁচি দিয়ে কেটে নম্বর নিন' : 'CUT HERE & TAKE A NUMBER'}
            </span>
            <div className="flex-1 border-t-[1.5px] border-dashed border-[#444]" />
            <Scissors className="w-3.5 h-3.5 shrink-0" />
          </div>

          <div
            className="grid border-t-[1.5px] border-dashed border-[#333]"
            style={{
              gridTemplateColumns: `repeat(${tearOffCount}, minmax(0, 1fr))`,
              height: isLandscape ? '104px' : '124px',
            }}
          >
            {Array.from({ length: tearOffCount }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center overflow-hidden px-1 py-1.5"
                style={{
                  borderRight:
                    idx < tearOffCount - 1 ? '1.5px dashed #444444' : undefined,
                }}
              >
                <div
                  className="flex flex-col items-center justify-center whitespace-nowrap"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                  }}
                >
                  <span
                    className="font-bold text-[#4a4845]"
                    style={{ fontSize: '10px' }}
                  >
                    {tabShortLabel}
                  </span>
                  <span
                    className="font-black tracking-wide tabular-nums mt-0.5"
                    style={{
                      fontSize: '13px',
                      color: isPhotocopyBW ? '#111111' : effectiveAccent,
                    }}
                  >
                    {data.contactPhone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
