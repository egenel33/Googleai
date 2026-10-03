import React from 'react';
import { X, Palette, AlignLeft, Layout, Type, Image as ImageIcon } from 'lucide-react';
import { BlockData, SiteTheme } from '../types';

interface BlockInspectorProps {
  block: BlockData | null;
  onUpdateBlock: (updated: BlockData) => void;
  onClose: () => void;
  theme?: SiteTheme;
}

export const BlockInspector: React.FC<BlockInspectorProps> = ({
  block,
  onUpdateBlock,
  onClose,
  theme,
}) => {
  if (!block) return null;

  const handleChange = (field: string, val: any) => {
    onUpdateBlock({
      ...block,
      [field]: val,
    });
  };

  const handleStyleChange = (field: string, val: any) => {
    onUpdateBlock({
      ...block,
      style: {
        ...block.style,
        [field]: val,
      },
    });
  };

  const handleItemChange = (index: number, subfield: string, val: any) => {
    const newItems = [...(block.items || [])];
    newItems[index] = {
      ...newItems[index],
      [subfield]: val,
    };
    onUpdateBlock({
      ...block,
      items: newItems,
    });
  };

  const colorPresets = [
    '#ffffff',
    '#f8fafc',
    '#f1f5f9',
    '#0f172a',
    '#1e293b',
    '#18181b',
    '#1c1917',
    '#eff6ff',
    '#fef2f2',
    '#f0fdf4',
  ];

  const imagePresets = [
    { label: 'Hukuk / Kurumsal', path: '/src/assets/images/template_law_firm_1791058165714.jpg' },
    { label: 'Restoran / Mutfak', path: '/src/assets/images/template_restaurant_1791058176664.jpg' },
    { label: 'Modern Mimarlık', path: '/src/assets/images/template_architecture_1791058187553.jpg' },
    { label: 'Ajans & Çalışma Masası', path: '/src/assets/images/hero_web_agency_1791058152873.jpg' },
  ];

  return (
    <aside className="w-80 border-l border-slate-200 bg-white flex flex-col h-full shadow-lg z-30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
            Blok Düzenle
          </span>
          <h3 className="text-sm font-bold text-slate-800 capitalize">
            {block.type} ({block.variant || 'Varsayılan'})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
        {/* Texts Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
            <Type className="w-3.5 h-3.5 text-blue-600" />
            <span>Metin İçerikleri</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Başlık</label>
            <input
              type="text"
              value={block.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {block.subtitle !== undefined && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Üst / Alt Başlık</label>
              <input
                type="text"
                value={block.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {block.description !== undefined && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Açıklama</label>
              <textarea
                rows={3}
                value={block.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          )}
        </div>

        {/* Buttons / CTA Section */}
        {(block.buttonText !== undefined || block.secondaryButtonText !== undefined) && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
              <Layout className="w-3.5 h-3.5 text-blue-600" />
              <span>Eylem Butonları</span>
            </div>

            {block.buttonText !== undefined && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Birincil Buton Yazısı
                </label>
                <input
                  type="text"
                  value={block.buttonText}
                  onChange={(e) => handleChange('buttonText', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {block.secondaryButtonText !== undefined && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  İkincil Buton Yazısı
                </label>
                <input
                  type="text"
                  value={block.secondaryButtonText}
                  onChange={(e) => handleChange('secondaryButtonText', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Image Selection */}
        {block.imageUrl !== undefined && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Görsel Ayarları</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600">Hazır Görsellerden Seç</label>
              <div className="grid grid-cols-2 gap-2">
                {imagePresets.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChange('imageUrl', img.path)}
                    className={`p-1.5 text-left rounded-lg border text-[11px] truncate transition-all ${
                      block.imageUrl === img.path
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Özel Görsel URL</label>
              <input
                type="text"
                value={block.imageUrl || ''}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Items List (Features, Stats, etc.) */}
        {block.items && block.items.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Öğeler ({block.items.length})
            </div>
            {block.items.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-[11px] font-semibold text-slate-500">Öğe #{idx + 1}</span>
                {item.title !== undefined && (
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                    placeholder="Başlık"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded"
                  />
                )}
                {item.desc !== undefined && (
                  <textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                    placeholder="Açıklama"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded resize-none"
                  />
                )}
                {item.metric !== undefined && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.metric}
                      onChange={(e) => handleItemChange(idx, 'metric', e.target.value)}
                      placeholder="Sayı"
                      className="px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                    />
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                      placeholder="Etiket"
                      className="px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Style & Padding Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            <span>Görünüm & Renkler</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Arka Plan Rengi</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleStyleChange('bgColor', c)}
                  className={`w-6 h-6 rounded-full border shadow-sm transition-transform ${
                    block.style.bgColor === c ? 'scale-125 ring-2 ring-blue-500' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <input
              type="text"
              value={block.style.bgColor || '#ffffff'}
              onChange={(e) => handleStyleChange('bgColor', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Yazı Rengi</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleStyleChange('textColor', '#0f172a')}
                className={`flex-1 py-1.5 text-xs font-medium border rounded ${
                  block.style.textColor === '#0f172a' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
                }`}
              >
                Koyu Metin
              </button>
              <button
                type="button"
                onClick={() => handleStyleChange('textColor', '#ffffff')}
                className={`flex-1 py-1.5 text-xs font-medium border rounded ${
                  block.style.textColor === '#ffffff' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
                }`}
              >
                Açık Metin
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Dikey Boşluk (Padding)</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['compact', 'normal', 'spacious'] as const).map((pad) => (
                <button
                  key={pad}
                  type="button"
                  onClick={() => handleStyleChange('paddingY', pad)}
                  className={`py-1.5 text-xs capitalize rounded border font-medium ${
                    block.style.paddingY === pad
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {pad === 'compact' ? 'Dar' : pad === 'spacious' ? 'Geniş' : 'Normal'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
