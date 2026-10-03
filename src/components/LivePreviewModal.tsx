import React, { useState } from 'react';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  ExternalLink,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Website, AgencyConfig } from '../types';
import { BlockRenderer } from './BlockRenderer';
import { downloadHtmlFile } from '../utils/exportHtml';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: Website;
  agency: AgencyConfig;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  website,
  agency,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const currentDomain =
    website.customDomain || `${website.slug}.${agency.domain || 'ajansdomain.com'}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col">
      {/* Top Controller Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-white shrink-0">
        {/* Left: Domain Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-emerald-400 border border-slate-700">
            <Globe className="w-3.5 h-3.5" />
            <span className="truncate max-w-[220px]">https://{currentDomain}</span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400">
            Canlı Önizleme Modu
          </span>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              device === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Masaüstü</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              device === 'tablet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              device === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobil</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadHtmlFile(website, agency)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium rounded-lg text-white transition-colors"
            title="Temiz HTML Dosyası İndir"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HTML İndir</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Viewport Frame */}
      <div className="flex-1 overflow-y-auto bg-slate-950 flex justify-center p-4 md:p-6">
        <div
          className={`bg-white shadow-2xl transition-all duration-300 flex flex-col ${
            device === 'desktop'
              ? 'w-full max-w-[1400px] rounded-lg'
              : device === 'tablet'
              ? 'w-[768px] rounded-2xl border-8 border-slate-800 shadow-2xl my-auto'
              : 'w-[390px] rounded-[36px] border-8 border-slate-800 shadow-2xl my-auto overflow-hidden'
          }`}
          style={{ minHeight: '80vh' }}
        >
          {/* Simulated Browser Bar */}
          <div className="h-9 bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white border border-slate-200 rounded px-3 py-0.5 text-[11px] text-slate-600 flex items-center justify-between font-mono">
                <span className="truncate">https://{currentDomain}</span>
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />
              </div>
            </div>
          </div>

          {/* Rendered Site Content */}
          <div className="flex-1 bg-white overflow-y-auto">
            {website.blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                isEditable={false}
                theme={website.theme}
              />
            ))}

            {/* White label agency footer badge */}
            {!agency.removePlatformBranding ? (
              <div className="py-3 px-4 bg-slate-900 text-slate-400 text-xs text-center border-t border-slate-800">
                <span>Tasarım & Altyapı: <strong className="text-white">{agency.name}</strong></span>
                {agency.domain && (
                  <span className="ml-2 opacity-75">· {agency.domain}</span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
