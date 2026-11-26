import React, { useEffect, useMemo, useState } from 'react';
import { Check, Code2, Copy, Download, X } from 'lucide-react';
import {
  DocCustomization,
  DocLanguage,
  InvoiceData,
} from '../types/builder';
import { getTemplatesForMode } from '../data/templates';
import {
  CodeExportFormat,
  generateInvoiceHtmlCode,
  generateInvoiceJsonCode,
  generateInvoiceReactCode,
  getInvoiceComponentName,
} from '../utils/invoiceCodeGen';

interface InvoiceCodeModalProps {
  templateId: string;
  data: InvoiceData;
  language: DocLanguage;
  customization: DocCustomization;
  onChangeTemplateId: (id: string) => void;
  onClose: () => void;
}

export function InvoiceCodeModal({
  templateId,
  data,
  language,
  customization,
  onChangeTemplateId,
  onClose,
}: InvoiceCodeModalProps) {
  const isBn = language === 'bn';
  const [format, setFormat] = useState<CodeExportFormat>('html');
  const [copied, setCopied] = useState(false);

  const invoiceTemplates = useMemo(() => getTemplatesForMode('invoice'), []);
  const activeTpl = useMemo(
    () => invoiceTemplates.find((t) => t.id === templateId) ?? invoiceTemplates[0],
    [invoiceTemplates, templateId]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const code = useMemo(() => {
    if (format === 'html') {
      return generateInvoiceHtmlCode(activeTpl.id, data, language, customization);
    }
    if (format === 'react') {
      return generateInvoiceReactCode(activeTpl.id, data, language, customization);
    }
    return generateInvoiceJsonCode(activeTpl.id, data, language, customization);
  }, [format, activeTpl.id, data, language, customization]);

  const lines = useMemo(() => code.split('\n'), [code]);

  const fileName = useMemo(() => {
    if (format === 'html') return `${activeTpl.id}.html`;
    if (format === 'react') return `${getInvoiceComponentName(activeTpl.id)}.tsx`;
    return `${activeTpl.id}-data.json`;
  }, [format, activeTpl.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const mime =
      format === 'html'
        ? 'text/html;charset=utf-8'
        : format === 'json'
        ? 'application/json;charset=utf-8'
        : 'text/plain;charset=utf-8';
    const blob = new Blob([code], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTabs: Array<{ id: CodeExportFormat; label: string; hintEn: string; hintBn: string }> = [
    {
      id: 'html',
      label: 'HTML + CSS',
      hintEn: 'Standalone print-ready HTML file for any backend (PHP, Laravel, Django, Node, Puppeteer).',
      hintBn: 'যেকোনো ওয়েব অ্যাপ বা ব্যাকএন্ডে (PHP, Laravel, Django, Node) সরাসরি ব্যবহারের HTML + CSS।',
    },
    {
      id: 'react',
      label: 'React + Tailwind',
      hintEn: 'Drop-in TypeScript component with auto subtotal, discount, VAT & due math.',
      hintBn: 'অটো ভ্যাট, ডিসকাউন্ট ও মোট হিসাবসহ সরাসরি ব্যবহারযোগ্য React + Tailwind কম্পোনেন্ট।',
    },
    {
      id: 'json',
      label: 'JSON Data',
      hintEn: 'Structured invoice payload & calculated totals ready for your API or database.',
      hintBn: 'আপনার API বা ডাটাবেসের জন্য পূর্ণাঙ্গ ইনভয়েস ও মোট হিসাবের JSON ডেটা।',
    },
  ];

  const activeHint = formatTabs.find((t) => t.id === format)!;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-code-modal-title"
      className="fixed inset-0 z-50 bg-[#24211d]/55 flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="sketch-box w-full max-w-5xl max-h-[90dvh] flex flex-col overflow-hidden bg-[#fffdf8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-[#3a3630]/25 bg-[#faf7f0] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#1e5645] text-white flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3
                id="invoice-code-modal-title"
                className="sketch-heading text-xl sm:text-2xl text-[#24211d] leading-tight truncate"
              >
                {isBn ? 'ক্যাশ মেমো টেমপ্লেট কোড' : 'Cash Memo Template Code'}
              </h3>
              <p className="text-xs text-[#5c564d] truncate">
                {isBn
                  ? 'সরাসরি কপি করে আপনার নিজের ওয়েব বা অ্যাপে ব্যবহার করুন।'
                  : 'Copy or download clean, ready-to-use code for your own app.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={activeTpl.id}
              onChange={(e) => onChangeTemplateId(e.target.value)}
              aria-label={isBn ? 'টেমপ্লেট বদলান' : 'Switch cash memo template'}
              className="sketch-input px-2.5 py-1.5 text-xs font-semibold bg-[#fffdf8] max-w-[200px] sm:max-w-[240px]"
            >
              {invoiceTemplates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {isBn ? tpl.nameBn : tpl.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#5c564d] hover:text-[#24211d] rounded-lg hover:bg-[#ece6d9] cursor-pointer transition-colors"
              aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Format Tabs & Action Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#3a3630]/20 bg-[#f3ede0]/70 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div
            className="inline-flex p-0.5 bg-[#fffdf8] border border-[#3a3630]/45 rounded-lg"
            role="tablist"
            aria-label="Code format"
          >
            {formatTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={format === tab.id}
                onClick={() => {
                  setFormat(tab.id);
                  setCopied(false);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer whitespace-nowrap transition-colors ${
                  format === tab.id
                    ? 'bg-[#24211d] text-[#fffdf8]'
                    : 'text-[#5c564d] hover:text-[#24211d]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline text-xs font-mono text-[#5c564d] mr-1">
              {fileName} · {lines.length} {isBn ? 'লাইন' : 'lines'}
            </span>
            <button
              type="button"
              onClick={handleDownload}
              className="sketch-btn px-3 py-1.5 text-xs font-semibold bg-[#fffdf8] text-[#24211d] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBn ? 'ফাইল ডাউনলোড' : 'Download'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="sketch-btn px-3.5 py-1.5 text-xs font-bold bg-[#1e5645] text-[#fffdf8] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>
                {copied
                  ? isBn
                    ? 'কপি হয়েছে!'
                    : 'Copied!'
                  : isBn
                  ? 'কোড কপি করুন'
                  : 'Copy Code'}
              </span>
            </button>
          </div>
        </div>

        {/* Helpful Context Line */}
        <div className="px-4 sm:px-6 py-2 bg-[#faf7f0] border-b border-[#3a3630]/15 text-xs text-[#5c564d] flex items-center justify-between gap-2 shrink-0">
          <span>{isBn ? activeHint.hintBn : activeHint.hintEn}</span>
          <span className="font-semibold text-[#1e5645] whitespace-nowrap shrink-0">
            {isBn ? activeTpl.nameBn : activeTpl.name}
          </span>
        </div>

        {/* Scrollable Code Block with Line Numbers */}
        <div className="flex-1 overflow-auto bg-[#1b1a18] text-[#f5f2eb] font-mono text-xs leading-relaxed">
          <div className="p-4 sm:p-5 min-w-max">
            <table className="border-collapse w-full">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td
                      className="select-none text-right pr-4 text-[#7d776d] align-top tabular-nums"
                      style={{ width: '44px' }}
                    >
                      {i + 1}
                    </td>
                    <td className="whitespace-pre text-[#f3efe6]">{line || ' '}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
