import React from 'react';
import {
  DEFAULT_OFFICE_LETTER_SECTION_ORDER,
  DocCustomization,
  DocLanguage,
  OfficeLetterData,
} from '../../types/builder';
import { getTemplateById } from '../../data/templates';
import { formatDisplayDate, hasText, splitLines, tintHex } from '../../utils/storage';

interface OfficeLetterRendererProps {
  data: OfficeLetterData;
  templateId: string;
  language: DocLanguage;
  customization?: DocCustomization;
}

const DISPLAY_SERIF = '"Cormorant Garamond", "Noto Serif Bengali", Georgia, serif';

export function OfficeLetterTemplateRenderer({
  data,
  templateId,
  language,
  customization,
}: OfficeLetterRendererProps) {
  const isBn = language === 'bn';
  const meta = getTemplateById('office_letter', templateId);
  const hasCustomAccent = Boolean(customization?.accentColor);
  const accent = hasCustomAccent ? customization!.accentColor : meta.accent;
  const secondary = hasCustomAccent ? tintHex(accent, 0.07) : meta.secondary;

  const fontStyle = customization?.fontStyle ?? 'auto';
  const useSerif = fontStyle === 'serif' || (fontStyle === 'auto' && Boolean(meta.serif));

  const fontSize = customization?.fontSize ?? 'standard';
  const scale = fontSize === 'compact' ? 0.92 : fontSize === 'large' ? 1.08 : 1;
  const fs = (px: number) => `${(px * scale).toFixed(1)}px`;

  const spacing = customization?.spacing ?? 'balanced';
  const padX = spacing === 'tight' ? 44 : spacing === 'airy' ? 60 : 52;
  const padY = spacing === 'tight' ? 36 : spacing === 'airy' ? 54 : 46;
  const stackGap = spacing === 'tight' ? 'space-y-3' : spacing === 'airy' ? 'space-y-5' : 'space-y-4';

  const borderStyle = customization?.borderStyle ?? 'default';
  const sigSize = customization?.signatureSize ?? 'md';
  const sigHeight = sigSize === 'sm' ? 36 : sigSize === 'lg' ? 62 : 48;
  const showSigImg = customization?.showSignatureImage !== false && hasText(data.signatureImage);
  const showOrgLogo = Boolean(data.showLogo && hasText(data.orgLogo));

  const hidden = new Set(customization?.hiddenSections ?? []);
  const isShown = (key: string) => !hidden.has(key);

  const formattedDate = hasText(data.date) ? formatDisplayDate(data.date, language) : '';
  const bodyParagraphs = (data.bodyText || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const ccLines = splitLines(data.ccList);
  const customSections = (data.customSections || []).filter(
    (s) => hasText(s.title) || hasText(s.content)
  );

  // Layout flags for all 15 distinct office letter templates
  const isPureBW = templateId === 'ol-minimal-bw';
  const isMemoGrid = templateId === 'ol-clean-slate-memo';
  const isNotice =
    templateId === 'ol-office-circular' || templateId === 'ol-bold-announcement';
  const isNavyBanner = templateId === 'ol-executive-navy';
  const isTopStrip =
    templateId === 'ol-emerald-modern' || templateId === 'ol-corporate-hr';
  const isFramed =
    borderStyle === 'framed' ||
    (borderStyle === 'default' &&
      (templateId === 'ol-bank-framed' ||
        templateId === 'ol-bold-announcement' ||
        templateId === 'ol-dual-rule-inst'));
  const isCenteredHeader =
    templateId === 'ol-university-crest' ||
    templateId === 'ol-dual-rule-inst' ||
    templateId === 'ol-office-circular' ||
    templateId === 'ol-bold-announcement';

  const effectiveAccent = isPureBW && !hasCustomAccent ? '#111111' : accent;

  const rootStyle: React.CSSProperties = {
    fontFamily: useSerif
      ? DISPLAY_SERIF
      : language === 'bn'
      ? '"Hind Siliguri", sans-serif'
      : '"Plus Jakarta Sans", "Hind Siliguri", sans-serif',
    backgroundColor: meta.paperTint || '#ffffff',
    color: '#1b1a18',
    fontSize: fs(13.4),
    lineHeight: isBn ? 1.75 : 1.65,
  };

  const sectionOrder =
    customization?.sectionOrder?.length
      ? customization.sectionOrder
      : [...DEFAULT_OFFICE_LETTER_SECTION_ORDER];

  const hasLetterhead = hasText(data.orgHeaderName) || showOrgLogo || isNotice;

  const renderLetterhead = () => {
    if (!isShown('letterhead')) return null;

    if (isNotice) {
      return (
        <header className="a4-avoid-break text-center space-y-2 pb-4" style={{ borderBottom: `2px solid ${effectiveAccent}` }}>
          {showOrgLogo && (
            <img
              src={data.orgLogo}
              alt="Organization logo"
              referrerPolicy="no-referrer"
              className="h-14 w-auto mx-auto object-contain mb-1"
            />
          )}
          {hasText(data.orgHeaderName) && (
            <h1
              className="font-bold tracking-tight"
              style={{ fontSize: fs(21), color: effectiveAccent }}
            >
              {data.orgHeaderName}
            </h1>
          )}
          {hasText(data.orgHeaderSub) && (
            <p className="text-[#524e48]" style={{ fontSize: fs(11.8) }}>
              {data.orgHeaderSub}
            </p>
          )}
          <div className="pt-2">
            <span
              className="inline-block px-6 py-1 font-bold tracking-widest uppercase"
              style={{
                backgroundColor: templateId === 'ol-bold-announcement' ? effectiveAccent : secondary,
                color: templateId === 'ol-bold-announcement' ? '#ffffff' : effectiveAccent,
                border: `1.5px solid ${effectiveAccent}`,
                fontSize: fs(15),
              }}
            >
              {isBn ? 'বিজ্ঞপ্তি / নোটিশ' : 'OFFICIAL NOTICE'}
            </span>
          </div>
          {(hasText(data.memoNo) || hasText(formattedDate)) && (
            <div
              className="flex items-center justify-between pt-3 text-[#3a3733]"
              style={{ fontSize: fs(12) }}
            >
              <span>
                {hasText(data.memoNo)
                  ? `${isBn ? 'স্মারক নং: ' : 'Memo No: '}${data.memoNo}`
                  : ''}
              </span>
              <span>
                {hasText(formattedDate)
                  ? `${isBn ? 'তারিখ: ' : 'Date: '}${formattedDate}`
                  : ''}
              </span>
            </div>
          )}
        </header>
      );
    }

    if (!hasLetterhead) {
      // Standard Dorokhasto top date + optional memo line
      if (!hasText(formattedDate) && !hasText(data.memoNo)) return null;
      return (
        <header className="a4-avoid-break flex items-center justify-between pb-1" style={{ fontSize: fs(12.6) }}>
          <div>
            {hasText(data.memoNo) && (
              <p className="font-medium text-[#3a3733]">
                <span className="font-semibold">{isBn ? 'স্মারক / সূত্র নং: ' : 'Ref No: '}</span>
                {data.memoNo}
              </p>
            )}
          </div>
          {hasText(formattedDate) && (
            <p className="font-medium text-[#222]">
              <span className="font-semibold">{isBn ? 'তারিখ: ' : 'Date: '}</span>
              {formattedDate}
            </p>
          )}
        </header>
      );
    }

    // Organization Letterhead
    return (
      <header className="a4-avoid-break space-y-3">
        <div
          className={`pb-3.5 ${
            isCenteredHeader
              ? 'text-center space-y-1'
              : 'flex items-center justify-between gap-4'
          }`}
          style={{
            borderBottom:
              templateId === 'ol-dual-rule-inst'
                ? `3px double ${effectiveAccent}`
                : `2px solid ${effectiveAccent}`,
          }}
        >
          {isCenteredHeader ? (
            <>
              {showOrgLogo && (
                <img
                  src={data.orgLogo}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="h-14 w-auto mx-auto object-contain mb-1.5"
                />
              )}
              {hasText(data.orgHeaderName) && (
                <h1
                  className="font-bold leading-tight"
                  style={{
                    fontSize: fs(21),
                    color: effectiveAccent,
                    fontFamily: useSerif ? DISPLAY_SERIF : undefined,
                  }}
                >
                  {data.orgHeaderName}
                </h1>
              )}
              {hasText(data.orgHeaderSub) && (
                <p className="text-[#524e48]" style={{ fontSize: fs(11.8) }}>
                  {data.orgHeaderSub}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3.5">
                {showOrgLogo && (
                  <img
                    src={data.orgLogo}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 object-contain shrink-0"
                  />
                )}
                <div>
                  {hasText(data.orgHeaderName) && (
                    <h1
                      className="font-bold leading-tight"
                      style={{ fontSize: fs(19.5), color: effectiveAccent }}
                    >
                      {data.orgHeaderName}
                    </h1>
                  )}
                  {hasText(data.orgHeaderSub) && (
                    <p className="text-[#524e48] mt-0.5" style={{ fontSize: fs(11.5) }}>
                      {data.orgHeaderSub}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right text-[#4a4845] shrink-0" style={{ fontSize: fs(11.8) }}>
                {hasText(formattedDate) && (
                  <p>
                    <span className="font-semibold">{isBn ? 'তারিখ: ' : 'Date: '}</span>
                    {formattedDate}
                  </p>
                )}
                {hasText(data.memoNo) && (
                  <p>
                    <span className="font-semibold">{isBn ? 'স্মারক: ' : 'Ref: '}</span>
                    {data.memoNo}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {isCenteredHeader && (hasText(formattedDate) || hasText(data.memoNo)) && (
          <div className="flex items-center justify-between" style={{ fontSize: fs(12.2) }}>
            <span>
              {hasText(data.memoNo) ? `${isBn ? 'স্মারক নং: ' : 'Ref No: '}${data.memoNo}` : ''}
            </span>
            <span>
              {hasText(formattedDate) ? `${isBn ? 'তারিখ: ' : 'Date: '}${formattedDate}` : ''}
            </span>
          </div>
        )}
      </header>
    );
  };

  // Internal Memo Grid (ol-clean-slate-memo)
  const renderMemoHeaderBlock = () => (
    <section
      className="a4-avoid-break grid grid-cols-[110px_1fr] gap-y-1.5 gap-x-3 p-4"
      style={{
        backgroundColor: secondary,
        borderLeft: `4px solid ${effectiveAccent}`,
        fontSize: fs(12.6),
      }}
    >
      <span className="font-bold uppercase text-[#524e48]">
        {isBn ? 'প্রাপক:' : 'TO:'}
      </span>
      <span className="font-semibold text-[#141414]">
        {[data.recipientTitle, data.organization, data.organizationAddress]
          .filter(hasText)
          .join(', ')}
      </span>

      <span className="font-bold uppercase text-[#524e48]">
        {isBn ? 'প্রেরক:' : 'FROM:'}
      </span>
      <span>
        {[data.senderName, data.senderDesignation, data.senderIdOrDept]
          .filter(hasText)
          .join(' · ')}
      </span>

      {hasText(data.throughLine) && (
        <>
          <span className="font-bold uppercase text-[#524e48]">
            {isBn ? 'মাধ্যম:' : 'THROUGH:'}
          </span>
          <span>{data.throughLine.replace(/^(মাধ্যম:|Through:)\s*/i, '')}</span>
        </>
      )}

      {hasText(formattedDate) && (
        <>
          <span className="font-bold uppercase text-[#524e48]">
            {isBn ? 'তারিখ:' : 'DATE:'}
          </span>
          <span>
            {formattedDate}
            {hasText(data.memoNo) ? `  |  ${data.memoNo}` : ''}
          </span>
        </>
      )}

      {hasText(data.subject) && (
        <>
          <span className="font-bold uppercase" style={{ color: effectiveAccent }}>
            {isBn ? 'বিষয়:' : 'SUBJECT:'}
          </span>
          <span className="font-bold text-[#111]">{data.subject}</span>
        </>
      )}
    </section>
  );

  const renderRecipient = () => {
    if (!isShown('recipient') || isMemoGrid) return null;
    const hasRec =
      hasText(data.recipientTitle) ||
      hasText(data.organization) ||
      hasText(data.organizationAddress);
    if (!hasRec) return null;
    return (
      <section className="a4-avoid-break space-y-0.5">
        {hasText(data.recipientLabel) && (
          <p className="font-semibold" style={{ color: effectiveAccent }}>
            {data.recipientLabel}
          </p>
        )}
        {hasText(data.recipientTitle) && (
          <p className="font-bold text-[#141414]">{data.recipientTitle}</p>
        )}
        {hasText(data.organization) && <p className="font-medium">{data.organization}</p>}
        {hasText(data.organizationAddress) && (
          <p className="text-[#4a4845]">{data.organizationAddress}</p>
        )}
      </section>
    );
  };

  const renderThrough = () => {
    if (!isShown('through') || isMemoGrid || !hasText(data.throughLine)) return null;
    return (
      <section className="a4-avoid-break">
        <p className="font-semibold text-[#2d2b28]">{data.throughLine}</p>
      </section>
    );
  };

  const renderSubject = () => {
    if (!isShown('subject') || isMemoGrid || !hasText(data.subject)) return null;
    const label = isBn ? 'বিষয়:' : 'Subject:';
    const useBox =
      templateId === 'ol-bank-framed' ||
      templateId === 'ol-corporate-hr' ||
      templateId === 'ol-emerald-modern' ||
      templateId === 'ol-executive-navy';
    if (useBox && !isPureBW) {
      return (
        <section className="a4-avoid-break">
          <div
            className="px-3.5 py-2"
            style={{
              backgroundColor: secondary,
              borderLeft: `3.5px solid ${effectiveAccent}`,
            }}
          >
            <p className="font-bold text-[#111]">
              <span style={{ color: effectiveAccent }} className="mr-1.5">
                {label}
              </span>
              {data.subject}
            </p>
          </div>
        </section>
      );
    }
    return (
      <section className="a4-avoid-break">
        <p className="font-bold text-[#111]">
          <span className="underline underline-offset-4 mr-1.5">{label}</span>
          {data.subject}
        </p>
      </section>
    );
  };

  const renderBody = () => {
    if (!isShown('body')) return null;
    if (!hasText(data.salutation) && bodyParagraphs.length === 0) return null;
    return (
      <section className="space-y-3">
        {hasText(data.salutation) && (
          <p className="font-semibold text-[#141414]">{data.salutation}</p>
        )}
        {bodyParagraphs.map((para, idx) => (
          <p key={idx} className="text-justify whitespace-pre-line text-[#23211e]">
            {para}
          </p>
        ))}
      </section>
    );
  };

  const renderSignature = () => {
    if (!isShown('signature')) return null;
    const alignRight = isNotice;
    return (
      <section className={`a4-avoid-break pt-3 ${alignRight ? 'flex justify-end' : ''}`}>
        <div className={alignRight ? 'text-center min-w-[220px]' : 'min-w-[220px]'}>
          {hasText(data.signOff) && <p className="mb-2">{data.signOff}</p>}
          <div
            className={`min-h-[44px] flex items-end mb-1.5 ${
              alignRight ? 'justify-center' : ''
            }`}
          >
            {showSigImg ? (
              <img
                src={data.signatureImage}
                alt="Signature"
                referrerPolicy="no-referrer"
                style={{ height: `${sigHeight}px` }}
                className="w-auto max-w-[200px] object-contain"
              />
            ) : (
              <div className="h-9" />
            )}
          </div>
          <div
            className="pt-1.5 inline-block min-w-[210px]"
            style={{ borderTop: `1px solid ${effectiveAccent}` }}
          >
            {hasText(data.senderName) && (
              <p className="font-bold text-[#141414]">{data.senderName}</p>
            )}
            {hasText(data.senderDesignation) && (
              <p className="text-[#44413c]" style={{ fontSize: fs(12.2) }}>
                {data.senderDesignation}
              </p>
            )}
            {hasText(data.senderIdOrDept) && (
              <p className="text-[#44413c]" style={{ fontSize: fs(12) }}>
                {data.senderIdOrDept}
              </p>
            )}
            {(hasText(data.senderPhone) || hasText(data.senderEmail)) && (
              <p className="text-[#5c5852]" style={{ fontSize: fs(11.5) }}>
                {[data.senderPhone, data.senderEmail, data.senderAddress]
                  .filter(hasText)
                  .join(' · ')}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderCC = () => {
    if (!isShown('cc') || ccLines.length === 0) return null;
    return (
      <section
        className="a4-avoid-break pt-3 mt-2"
        style={{ borderTop: `1px dashed ${isPureBW ? '#999' : '#d6d0c6'}` }}
      >
        <p className="font-bold mb-1" style={{ color: effectiveAccent, fontSize: fs(12.2) }}>
          {isBn ? 'অনুলিপি (সদয় অবগতির জন্য):' : 'Copy to (CC):'}
        </p>
        <ul className="space-y-0.5 text-[#383530]" style={{ fontSize: fs(12) }}>
          {ccLines.map((line, i) => (
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
              <h4 className="font-bold" style={{ color: effectiveAccent, fontSize: fs(13) }}>
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

  const renderSectionByKey = (key: string) => {
    switch (key) {
      case 'letterhead':
        return <React.Fragment key={key}>{renderLetterhead()}</React.Fragment>;
      case 'recipient':
        return (
          <React.Fragment key={key}>
            {isMemoGrid ? renderMemoHeaderBlock() : renderRecipient()}
          </React.Fragment>
        );
      case 'through':
        return <React.Fragment key={key}>{renderThrough()}</React.Fragment>;
      case 'subject':
        return <React.Fragment key={key}>{renderSubject()}</React.Fragment>;
      case 'body':
        return <React.Fragment key={key}>{renderBody()}</React.Fragment>;
      case 'cc':
        return <React.Fragment key={key}>{renderCC()}</React.Fragment>;
      case 'custom':
        return <React.Fragment key={key}>{renderCustom()}</React.Fragment>;
      case 'signature':
        return <React.Fragment key={key}>{renderSignature()}</React.Fragment>;
      default:
        return null;
    }
  };

  return (
    <div className="a4-sheet flex flex-col" style={rootStyle}>
      {/* Optional Top Strip / Navy Executive Banner */}
      {isTopStrip && !isPureBW && (
        <div className="h-2.5 w-full shrink-0" style={{ backgroundColor: effectiveAccent }} />
      )}
      {isNavyBanner && (
        <div
          className="px-12 py-5 text-white flex items-center justify-between shrink-0"
          style={{
            backgroundColor: effectiveAccent,
            borderBottom: '3px solid #c59b43',
          }}
        >
          <div className="flex items-center gap-3">
            {showOrgLogo && (
              <img
                src={data.orgLogo}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="h-10 w-10 object-contain bg-white/95 rounded p-0.5"
              />
            )}
            <div>
              <p className="font-bold text-white" style={{ fontSize: fs(17) }}>
                {data.orgHeaderName || (isBn ? 'অফিশিয়াল পত্র' : 'OFFICIAL CORRESPONDENCE')}
              </p>
              {hasText(data.orgHeaderSub) && (
                <p className="text-white/80" style={{ fontSize: fs(11.2) }}>
                  {data.orgHeaderSub}
                </p>
              )}
            </div>
          </div>
          {hasText(formattedDate) && (
            <p className="text-white/90 font-medium" style={{ fontSize: fs(11.8) }}>
              {formattedDate}
            </p>
          )}
        </div>
      )}

      {/* Main Page Body */}
      <div
        className="flex-1 flex flex-col"
        style={{
          padding: isFramed ? '24px' : `${padY}px ${padX}px`,
        }}
      >
        <div
          className={`flex-1 flex flex-col ${stackGap}`}
          style={
            isFramed
              ? {
                  border:
                    templateId === 'ol-dual-rule-inst' || templateId === 'ol-bold-announcement'
                      ? `4px double ${effectiveAccent}`
                      : `1.5px solid ${effectiveAccent}`,
                  padding: `${padY - 10}px ${padX - 12}px`,
                }
              : undefined
          }
        >
          {sectionOrder
            .filter((k) => !(isNavyBanner && k === 'letterhead' && !hasText(data.memoNo)))
            .map(renderSectionByKey)}
        </div>
      </div>
    </div>
  );
}
