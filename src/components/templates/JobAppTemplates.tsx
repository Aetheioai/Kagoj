import React from 'react';
import {
  DEFAULT_JOB_APP_SECTION_ORDER,
  DocCustomization,
  DocLanguage,
  JobAppData,
} from '../../types/builder';
import { getTemplateById } from '../../data/templates';
import { formatDisplayDate, hasText, splitLines, tintHex } from '../../utils/storage';

interface JobAppRendererProps {
  data: JobAppData;
  templateId: string;
  language: DocLanguage;
  customization?: DocCustomization;
}

const DISPLAY_SERIF = '"Cormorant Garamond", "Noto Serif Bengali", Georgia, serif';

export function JobAppTemplateRenderer({
  data,
  templateId,
  language,
  customization,
}: JobAppRendererProps) {
  const isBn = language === 'bn';
  const meta = getTemplateById('job_app', templateId);
  const hasCustomAccent = Boolean(customization?.accentColor);
  const accent = hasCustomAccent ? customization!.accentColor : meta.accent;
  const secondary = hasCustomAccent ? tintHex(accent, 0.07) : meta.secondary;

  const fontStyle = customization?.fontStyle ?? 'auto';
  const useSerif = fontStyle === 'serif' || (fontStyle === 'auto' && Boolean(meta.serif));

  const fontSize = customization?.fontSize ?? 'standard';
  const scale = fontSize === 'compact' ? 0.92 : fontSize === 'large' ? 1.08 : 1;
  const fs = (px: number) => `${(px * scale).toFixed(1)}px`;

  const spacing = customization?.spacing ?? 'balanced';
  const padX = spacing === 'tight' ? 42 : spacing === 'airy' ? 58 : 50;
  const padY = spacing === 'tight' ? 36 : spacing === 'airy' ? 54 : 44;
  const paraGap = spacing === 'tight' ? 'space-y-2.5' : spacing === 'airy' ? 'space-y-4.5' : 'space-y-3.5';

  const borderStyle = customization?.borderStyle ?? 'default';
  const sigSize = customization?.signatureSize ?? 'md';
  const sigHeight = sigSize === 'sm' ? 36 : sigSize === 'lg' ? 62 : 48;
  const showSigImg = customization?.showSignatureImage !== false && hasText(data.signatureImage);

  const hidden = new Set(customization?.hiddenSections ?? []);
  const isShown = (key: string) => !hidden.has(key);

  const formattedDate = hasText(data.date) ? formatDisplayDate(data.date, language) : '';
  const enclosuresList = splitLines(data.enclosures);
  const customSections = (data.customSections || []).filter(
    (s) => hasText(s.title) || hasText(s.content)
  );

  const contactBits = [
    data.senderPhone,
    data.senderEmail,
    data.senderPortfolio,
    data.senderAddress,
  ].filter(hasText);

  const bodyParagraphs = [
    data.openingParagraph,
    data.bodyParagraph,
    data.closingParagraph,
  ].filter(hasText);

  const rootStyle: React.CSSProperties = {
    fontFamily: useSerif
      ? DISPLAY_SERIF
      : language === 'bn'
      ? '"Noto Sans Bengali", sans-serif'
      : '"Plus Jakarta Sans", "Noto Sans Bengali", sans-serif',
    backgroundColor: meta.paperTint || '#ffffff',
    color: '#1e1c1a',
    fontSize: fs(13.2),
    lineHeight: isBn ? 1.72 : 1.62,
  };

  // Layout flags per template ID
  const isSidebar = templateId === 'ja-slate-left-rail';
  const isDarkBanner =
    templateId === 'ja-gulshan-banner' ||
    templateId === 'ja-dhaka-bank-exec' ||
    templateId === 'ja-burgundy-leadership';
  const isDoubleFrame =
    borderStyle === 'framed' ||
    (borderStyle === 'default' && templateId === 'ja-bcs-govt-official');
  const isPureBW = templateId === 'ja-pure-inksaver';
  const isCenteredAcademic = templateId === 'ja-university-serif';
  const isSplitContact =
    templateId === 'ja-split-contact' || templateId === 'ja-navy-prestige';
  const isTopBar =
    templateId === 'ja-emerald-accent' || templateId === 'ja-ngo-development';
  const isDevBar = templateId === 'ja-dev-accent-bar';
  const isClassicBorabor =
    templateId === 'ja-borabor-classic' || templateId === 'ja-pure-inksaver';
  const isGoldTrim =
    templateId === 'ja-dhaka-bank-exec' ||
    templateId === 'ja-navy-prestige' ||
    templateId === 'ja-warm-ivory-editorial';

  const effectiveAccent = isPureBW && !hasCustomAccent ? '#111111' : accent;
  const goldColor = '#c59b43';

  const sectionOrder =
    customization?.sectionOrder?.length
      ? customization.sectionOrder
      : [...DEFAULT_JOB_APP_SECTION_ORDER];

  const renderRecipient = () => {
    if (!isShown('recipient')) return null;
    const hasRec =
      hasText(data.recipientName) ||
      hasText(data.recipientTitle) ||
      hasText(data.organization) ||
      hasText(data.organizationAddress);
    if (!hasRec && !hasText(formattedDate)) return null;
    return (
      <section className="a4-avoid-break">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-0.5">
            {hasText(data.recipientLabel) && (
              <p className="font-semibold" style={{ color: effectiveAccent }}>
                {data.recipientLabel}
              </p>
            )}
            {hasText(data.recipientName) && (
              <p className="font-bold text-[#141414]">{data.recipientName}</p>
            )}
            {hasText(data.recipientTitle) && <p>{data.recipientTitle}</p>}
            {hasText(data.organization) && (
              <p className="font-semibold text-[#1a1a1a]">{data.organization}</p>
            )}
            {hasText(data.organizationAddress) && (
              <p className="text-[#4a4845]">{data.organizationAddress}</p>
            )}
          </div>
          {!isSidebar && (hasText(formattedDate) || hasText(data.referenceNo)) && (
            <div className="text-right shrink-0 space-y-0.5" style={{ fontSize: fs(12.2) }}>
              {hasText(formattedDate) && (
                <p>
                  <span className="font-semibold text-[#4a4845]">
                    {isBn ? 'তারিখ: ' : 'Date: '}
                  </span>
                  <span>{formattedDate}</span>
                </p>
              )}
              {hasText(data.referenceNo) && (
                <p className="text-[#4a4845]">
                  <span className="font-semibold">{isBn ? 'সূত্র: ' : 'Ref: '}</span>
                  {data.referenceNo}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderSubject = () => {
    if (!isShown('subject') || !hasText(data.subject)) return null;
    const label = isBn ? 'বিষয়:' : 'Subject:';
    if (isPureBW || isClassicBorabor) {
      return (
        <section className="a4-avoid-break">
          <p className="font-bold text-[#111]" style={{ fontSize: fs(13.5) }}>
            <span className="underline underline-offset-4 mr-1.5">{label}</span>
            <span>{data.subject}</span>
          </p>
        </section>
      );
    }
    return (
      <section className="a4-avoid-break">
        <div
          className="px-3.5 py-2.5"
          style={{
            backgroundColor: secondary,
            borderLeft: `3.5px solid ${effectiveAccent}`,
          }}
        >
          <p className="font-bold text-[#141414]" style={{ fontSize: fs(13.4) }}>
            <span style={{ color: effectiveAccent }} className="mr-1.5">
              {label}
            </span>
            {data.subject}
          </p>
        </div>
      </section>
    );
  };

  const renderBody = () => {
    if (!isShown('body')) return null;
    if (!hasText(data.salutation) && bodyParagraphs.length === 0) return null;
    return (
      <section className={paraGap}>
        {hasText(data.salutation) && (
          <p className="font-semibold text-[#1a1a1a]">{data.salutation}</p>
        )}
        {bodyParagraphs.map((para, idx) => (
          <p key={idx} className="text-justify whitespace-pre-line text-[#23211e]">
            {para}
          </p>
        ))}
      </section>
    );
  };

  const renderEnclosures = () => {
    if (!isShown('enclosures') || enclosuresList.length === 0) return null;
    return (
      <section
        className="a4-avoid-break pt-3"
        style={{ borderTop: `1px dashed ${isPureBW ? '#999' : '#d6d0c6'}` }}
      >
        <p
          className="font-bold mb-1.5"
          style={{ color: effectiveAccent, fontSize: fs(12.2) }}
        >
          {isBn ? 'সংযুক্তি (Enclosures):' : 'Enclosures:'}
        </p>
        <ul className="space-y-0.5 text-[#383530]" style={{ fontSize: fs(12) }}>
          {enclosuresList.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    );
  };

  const renderCustom = () => {
    if (!isShown('custom') || customSections.length === 0) return null;
    return (
      <>
        {customSections.map((sec) => (
          <section key={sec.id} className="a4-avoid-break space-y-1">
            {hasText(sec.title) && (
              <h4
                className="font-bold"
                style={{ color: effectiveAccent, fontSize: fs(13) }}
              >
                {sec.title}
              </h4>
            )}
            {hasText(sec.content) && (
              <p className="whitespace-pre-line text-[#2a2825]">{sec.content}</p>
            )}
          </section>
        ))}
      </>
    );
  };

  const renderSignature = () => {
    if (!isShown('signature')) return null;
    return (
      <section className="a4-avoid-break pt-2">
        {hasText(data.signOff) && <p className="mb-2">{data.signOff}</p>}
        <div className="min-h-[44px] flex items-end mb-1.5">
          {showSigImg ? (
            <img
              src={data.signatureImage}
              alt="Applicant signature"
              referrerPolicy="no-referrer"
              style={{ height: `${sigHeight}px` }}
              className="w-auto max-w-[210px] object-contain"
            />
          ) : (
            <div className="h-9" />
          )}
        </div>
        <div
          className="inline-block pt-1.5 min-w-[200px]"
          style={{ borderTop: `1px solid ${effectiveAccent}` }}
        >
          <p className="font-bold text-[#141414]">
            {data.signatureName || data.senderName}
          </p>
          {hasText(data.senderTitle) && (
            <p className="text-[#524e48]" style={{ fontSize: fs(11.8) }}>
              {data.senderTitle}
            </p>
          )}
          {!isSidebar && isClassicBorabor && hasText(data.senderPhone) && (
            <p className="text-[#524e48]" style={{ fontSize: fs(11.6) }}>
              {isBn ? 'মোবাইল: ' : 'Phone: '}
              {data.senderPhone}
            </p>
          )}
        </div>
      </section>
    );
  };

  const renderSectionByKey = (key: string) => {
    switch (key) {
      case 'recipient':
        return <React.Fragment key={key}>{renderRecipient()}</React.Fragment>;
      case 'subject':
        return <React.Fragment key={key}>{renderSubject()}</React.Fragment>;
      case 'body':
        return <React.Fragment key={key}>{renderBody()}</React.Fragment>;
      case 'enclosures':
        return <React.Fragment key={key}>{renderEnclosures()}</React.Fragment>;
      case 'custom':
        return <React.Fragment key={key}>{renderCustom()}</React.Fragment>;
      case 'signature':
        return <React.Fragment key={key}>{renderSignature()}</React.Fragment>;
      default:
        return null;
    }
  };

  // =========================================================================
  // SIDEBAR LAYOUT (ja-slate-left-rail)
  // =========================================================================
  if (isSidebar) {
    return (
      <div className="a4-sheet flex" style={rootStyle}>
        <aside
          className="w-[235px] shrink-0 text-white flex flex-col justify-between"
          style={{
            backgroundColor: effectiveAccent,
            padding: `${padY}px 24px`,
          }}
        >
          <div className="space-y-6">
            <div>
              <h1
                className="font-bold leading-tight text-white"
                style={{ fontSize: fs(21), fontFamily: useSerif ? DISPLAY_SERIF : undefined }}
              >
                {data.senderName || (isBn ? 'আপনার নাম' : 'Your Name')}
              </h1>
              {hasText(data.senderTitle) && (
                <p className="mt-1.5 text-white/80" style={{ fontSize: fs(11.8) }}>
                  {data.senderTitle}
                </p>
              )}
              <div className="w-10 h-0.5 bg-white/40 mt-4" />
            </div>

            <div className="space-y-2.5 text-white/90" style={{ fontSize: fs(11.5) }}>
              <p className="font-bold uppercase tracking-wider text-white/60 text-[10px]">
                {isBn ? 'যোগাযোগ' : 'Contact'}
              </p>
              {hasText(data.senderPhone) && <p className="break-words">{data.senderPhone}</p>}
              {hasText(data.senderEmail) && <p className="break-all">{data.senderEmail}</p>}
              {hasText(data.senderPortfolio) && (
                <p className="break-all text-white/80">{data.senderPortfolio}</p>
              )}
              {hasText(data.senderAddress) && (
                <p className="text-white/80 leading-snug">{data.senderAddress}</p>
              )}
            </div>

            {(hasText(formattedDate) || hasText(data.referenceNo)) && (
              <div className="space-y-1.5 text-white/85 pt-3 border-t border-white/15" style={{ fontSize: fs(11.5) }}>
                {hasText(formattedDate) && (
                  <p>
                    <span className="text-white/60 block text-[10px] uppercase tracking-wider">
                      {isBn ? 'তারিখ' : 'Date'}
                    </span>
                    {formattedDate}
                  </p>
                )}
                {hasText(data.referenceNo) && (
                  <p>
                    <span className="text-white/60 block text-[10px] uppercase tracking-wider">
                      {isBn ? 'রেফারেন্স' : 'Reference'}
                    </span>
                    {data.referenceNo}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="text-[10px] text-white/50 pt-6">
            {isBn ? 'চাকরির আবেদনপত্র' : 'Job Application'}
          </div>
        </aside>

        <main
          className={`flex-1 min-w-0 ${paraGap}`}
          style={{ padding: `${padY}px ${padX - 8}px` }}
        >
          {sectionOrder.map(renderSectionByKey)}
        </main>
      </div>
    );
  }

  // =========================================================================
  // STANDARD / BANNER / FRAMED / EDITORIAL / ACADEMIC LAYOUTS (14 TEMPLATES)
  // =========================================================================
  return (
    <div className="a4-sheet relative flex flex-col" style={rootStyle}>
      {/* Optional Top Accent Bar */}
      {isTopBar && (
        <div className="h-2.5 w-full shrink-0" style={{ backgroundColor: effectiveAccent }} />
      )}

      {/* Dark Full-Width Header Banner */}
      {isDarkBanner && (
        <header
          className="text-white shrink-0"
          style={{
            backgroundColor: effectiveAccent,
            padding: `${Math.max(24, padY - 12)}px ${padX}px`,
            borderBottom: isGoldTrim ? `3px solid ${goldColor}` : undefined,
          }}
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1
                className="font-bold tracking-tight leading-tight text-white"
                style={{ fontSize: fs(24), fontFamily: useSerif ? DISPLAY_SERIF : undefined }}
              >
                {data.senderName || (isBn ? 'আবেদনকারীর নাম' : 'Applicant Name')}
              </h1>
              {hasText(data.senderTitle) && (
                <p className="text-white/85 mt-1" style={{ fontSize: fs(12.5) }}>
                  {data.senderTitle}
                </p>
              )}
            </div>
            <div className="text-right text-white/85 space-y-0.5" style={{ fontSize: fs(11.4) }}>
              {hasText(data.senderPhone) && <p>{data.senderPhone}</p>}
              {hasText(data.senderEmail) && <p>{data.senderEmail}</p>}
              {hasText(data.senderPortfolio) && <p>{data.senderPortfolio}</p>}
              {hasText(data.senderAddress) && <p>{data.senderAddress}</p>}
            </div>
          </div>
        </header>
      )}

      {/* Inner Sheet Container */}
      <div
        className="flex-1 flex flex-col"
        style={{
          padding: isDoubleFrame ? '24px' : `${padY}px ${padX}px`,
        }}
      >
        <div
          className={`flex-1 flex flex-col ${paraGap}`}
          style={
            isDoubleFrame
              ? {
                  border: `3px double ${effectiveAccent}`,
                  padding: `${padY - 10}px ${padX - 12}px`,
                }
              : undefined
          }
        >
          {/* Non-Banner Headers */}
          {!isDarkBanner && (
            <header
              className="a4-avoid-break pb-4"
              style={{
                borderBottom: isCenteredAcademic
                  ? `3px double ${effectiveAccent}`
                  : isGoldTrim
                  ? `2px solid ${goldColor}`
                  : isPureBW
                  ? '1.5px solid #111111'
                  : `2px solid ${effectiveAccent}`,
              }}
            >
              {isCenteredAcademic ? (
                <div className="text-center space-y-1">
                  <h1
                    className="font-bold tracking-tight"
                    style={{
                      fontSize: fs(25),
                      color: effectiveAccent,
                      fontFamily: DISPLAY_SERIF,
                    }}
                  >
                    {data.senderName || (isBn ? 'আবেদনকারীর নাম' : 'Applicant Name')}
                  </h1>
                  {hasText(data.senderTitle) && (
                    <p className="text-[#4a4845]" style={{ fontSize: fs(12.6) }}>
                      {data.senderTitle}
                    </p>
                  )}
                  {contactBits.length > 0 && (
                    <p className="text-[#5c5852] pt-1" style={{ fontSize: fs(11.5) }}>
                      {contactBits.join('  ·  ')}
                    </p>
                  )}
                </div>
              ) : isSplitContact ? (
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h1
                      className="font-bold leading-tight"
                      style={{
                        fontSize: fs(23),
                        color: effectiveAccent,
                        fontFamily: useSerif ? DISPLAY_SERIF : undefined,
                      }}
                    >
                      {data.senderName || (isBn ? 'আবেদনকারীর নাম' : 'Applicant Name')}
                    </h1>
                    {hasText(data.senderTitle) && (
                      <p className="text-[#4a4845] mt-1" style={{ fontSize: fs(12.4) }}>
                        {data.senderTitle}
                      </p>
                    )}
                  </div>
                  <div
                    className="px-3.5 py-2 text-right space-y-0.5 shrink-0 max-w-[300px]"
                    style={{
                      backgroundColor: templateId === 'ja-split-contact' ? secondary : 'transparent',
                      fontSize: fs(11.4),
                    }}
                  >
                    {hasText(data.senderPhone) && <p className="font-medium">{data.senderPhone}</p>}
                    {hasText(data.senderEmail) && <p>{data.senderEmail}</p>}
                    {hasText(data.senderPortfolio) && (
                      <p style={{ color: effectiveAccent }}>{data.senderPortfolio}</p>
                    )}
                    {hasText(data.senderAddress) && (
                      <p className="text-[#524e48]">{data.senderAddress}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={
                    isDevBar
                      ? { borderLeft: `4px solid ${effectiveAccent}`, paddingLeft: '14px' }
                      : undefined
                  }
                >
                  <h1
                    className="font-bold leading-tight"
                    style={{
                      fontSize: fs(23),
                      color: isPureBW ? '#111111' : effectiveAccent,
                      fontFamily: useSerif ? DISPLAY_SERIF : undefined,
                    }}
                  >
                    {data.senderName || (isBn ? 'আবেদনকারীর নাম' : 'Applicant Name')}
                  </h1>
                  {hasText(data.senderTitle) && (
                    <p className="text-[#4a4845] mt-0.5" style={{ fontSize: fs(12.5) }}>
                      {data.senderTitle}
                    </p>
                  )}
                  {contactBits.length > 0 && (
                    <p className="text-[#524e48] mt-1.5" style={{ fontSize: fs(11.5) }}>
                      {contactBits.join('  |  ')}
                    </p>
                  )}
                </div>
              )}
            </header>
          )}

          {/* Main ordered sections */}
          <div className={`flex-1 ${paraGap}`}>
            {sectionOrder.map(renderSectionByKey)}
          </div>
        </div>
      </div>
    </div>
  );
}
