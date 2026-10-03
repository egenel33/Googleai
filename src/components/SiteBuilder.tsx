import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  Download,
  Plus,
  Save,
  Check,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  Sliders,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Undo2,
  Redo2,
  Trash2,
  Copy
} from 'lucide-react';
import { Website, BlockData, AgencyConfig, SiteTheme } from '../types';
import { BlockRenderer } from './BlockRenderer';
import { BlockInspector } from './BlockInspector';
import { BlockCatalogModal } from './BlockCatalogModal';
import { LivePreviewModal } from './LivePreviewModal';
import { downloadHtmlFile } from '../utils/exportHtml';

interface SiteBuilderProps {
  website: Website;
  agency: AgencyConfig;
  onSaveWebsite: (updated: Website) => void;
  onBackToDashboard: () => void;
}

export const SiteBuilder: React.FC<SiteBuilderProps> = ({
  website: initialWebsite,
  agency,
  onSaveWebsite,
  onBackToDashboard,
}) => {
  const [website, setWebsite] = useState<Website>(initialWebsite);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    website.blocks[0]?.id || null
  );
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  // Selected block
  const selectedBlock =
    website.blocks.find((b) => b.id === selectedBlockId) || null;

  const handleUpdateBlock = (updated: BlockData) => {
    const newBlocks = website.blocks.map((b) =>
      b.id === updated.id ? updated : b
    );
    const updatedSite = {
      ...website,
      blocks: newBlocks,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setWebsite(updatedSite);
  };

  const handleUpdateInlineText = (blockId: string, field: string, value: string) => {
    const newBlocks = website.blocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          [field]: value,
        };
      }
      return b;
    });
    setWebsite({
      ...website,
      blocks: newBlocks,
    });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= website.blocks.length) return;
    const newBlocks = [...website.blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    setWebsite({ ...website, blocks: newBlocks });
  };

  const handleDuplicateBlock = (index: number) => {
    const original = website.blocks[index];
    const duplicate: BlockData = {
      ...JSON.parse(JSON.stringify(original)),
      id: `block-${original.type}-${Date.now()}`,
    };
    const newBlocks = [...website.blocks];
    newBlocks.splice(index + 1, 0, duplicate);
    setWebsite({ ...website, blocks: newBlocks });
    setSelectedBlockId(duplicate.id);
  };

  const handleDeleteBlock = (index: number) => {
    if (website.blocks.length <= 1) {
      alert('Sayfada en az bir blok bulunmalıdır.');
      return;
    }
    const newBlocks = website.blocks.filter((_, i) => i !== index);
    setWebsite({ ...website, blocks: newBlocks });
    if (selectedBlockId === website.blocks[index].id) {
      setSelectedBlockId(newBlocks[0]?.id || null);
    }
  };

  const handleAddBlockAt = (index: number | null) => {
    setInsertIndex(index);
    setIsCatalogOpen(true);
  };

  const handleInsertBlock = (newBlock: BlockData) => {
    const newBlocks = [...website.blocks];
    if (insertIndex === null || insertIndex >= newBlocks.length) {
      newBlocks.push(newBlock);
    } else {
      newBlocks.splice(insertIndex + 1, 0, newBlock);
    }
    setWebsite({ ...website, blocks: newBlocks });
    setSelectedBlockId(newBlock.id);
    setInsertIndex(null);
  };

  const handleSave = () => {
    onSaveWebsite(website);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handlePublish = () => {
    const updated = {
      ...website,
      status: 'published' as const,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setWebsite(updated);
    onSaveWebsite(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Top Builder Control Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-40 shrink-0">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onSaveWebsite(website);
              onBackToDashboard();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Panele Dön</span>
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={website.title}
                onChange={(e) => setWebsite({ ...website, title: e.target.value })}
                className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1"
              />
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                · {website.category}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Device Viewport Switches */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded transition-colors ${
              viewport === 'desktop'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Masaüstü Görünüm"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded transition-colors ${
              viewport === 'tablet'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Tablet Görünüm"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded transition-colors ${
              viewport === 'mobile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Mobil Görünüm"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Add Block */}
          <button
            onClick={() => handleAddBlockAt(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Blok Ekle</span>
          </button>

          {/* Theme Settings */}
          <button
            onClick={() => setThemeModalOpen(!themeModalOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Tema ve Renk Paleti"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tema</span>
          </button>

          {/* Preview */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Önizle</span>
          </button>

          {/* Export HTML */}
          <button
            onClick={() => downloadHtmlFile(website, agency)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Temiz Bağımsız HTML İndir"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">HTML İndir</span>
          </button>

          {/* Save / Publish */}
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-all cursor-pointer ${
              saveSuccess ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Kaydedildi</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Kaydet</span>
              </>
            )}
          </button>

          {website.status !== 'published' && (
            <button
              onClick={handlePublish}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Yayınla</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Builder Area: Canvas + Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-200/60">
          <div
            className={`bg-white shadow-xl transition-all duration-300 min-h-full flex flex-col ${
              viewport === 'desktop'
                ? 'w-full max-w-[1280px] rounded-lg'
                : viewport === 'tablet'
                ? 'w-[768px] rounded-2xl border-4 border-slate-700 shadow-2xl my-auto'
                : 'w-[390px] rounded-[32px] border-8 border-slate-800 shadow-2xl my-auto overflow-hidden'
            }`}
          >
            {website.blocks.map((block, idx) => (
              <BlockRenderer
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => setSelectedBlockId(block.id)}
                onMoveUp={idx > 0 ? () => handleMoveBlock(idx, 'up') : undefined}
                onMoveDown={
                  idx < website.blocks.length - 1
                    ? () => handleMoveBlock(idx, 'down')
                    : undefined
                }
                onDuplicate={() => handleDuplicateBlock(idx)}
                onDelete={() => handleDeleteBlock(idx)}
                onInsertBelow={() => handleAddBlockAt(idx)}
                isEditable={true}
                onUpdateText={(field, val) =>
                  handleUpdateInlineText(block.id, field, val)
                }
                theme={website.theme}
              />
            ))}

            {/* Quick Add Block Button at Bottom */}
            <div className="p-8 text-center bg-slate-50 border-t border-dashed border-slate-300">
              <button
                onClick={() => handleAddBlockAt(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>Sayfanın Sonuna Yeni Blok Ekle</span>
              </button>
            </div>
          </div>
        </main>

        {/* Side Inspector */}
        {selectedBlock && (
          <BlockInspector
            block={selectedBlock}
            onUpdateBlock={handleUpdateBlock}
            onClose={() => setSelectedBlockId(null)}
            theme={website.theme}
          />
        )}
      </div>

      {/* Theme Drawer / Modal */}
      {themeModalOpen && (
        <div className="absolute top-16 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900">Site Teması & Renkleri</h4>
            <button
              onClick={() => setThemeModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Kapat
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Ana Vurgu Rengi
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={website.theme.primaryColor}
                onChange={(e) =>
                  setWebsite({
                    ...website,
                    theme: { ...website.theme, primaryColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-700">
                {website.theme.primaryColor}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Yazı Tipi (Font Ailesi)
            </label>
            <select
              value={website.theme.fontFamily}
              onChange={(e) =>
                setWebsite({
                  ...website,
                  theme: {
                    ...website.theme,
                    fontFamily: e.target.value as any,
                  },
                })
              }
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern & Kurumsal)</option>
              <option value="Syne">Syne (Prestijli & Mimari)</option>
              <option value="Inter">Inter (Nötr & Temiz)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Köşe Yuvarlaklığı
            </label>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {(['none', 'sm', 'md', 'lg'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() =>
                    setWebsite({
                      ...website,
                      theme: { ...website.theme, borderRadius: r },
                    })
                  }
                  className={`py-1 rounded border capitalize ${
                    website.theme.borderRadius === r
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Block Catalog Modal */}
      <BlockCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectBlock={handleInsertBlock}
      />

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        website={website}
        agency={agency}
      />
    </div>
  );
};
