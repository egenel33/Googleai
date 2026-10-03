import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Plus,
  Settings,
  Check,
  Star,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Briefcase,
  FileText,
  Scale,
  Utensils,
  Flame,
  Coffee
} from 'lucide-react';
import { BlockData, SiteTheme } from '../types';

interface BlockRendererProps {
  block: BlockData;
  isSelected?: boolean;
  onSelect?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onInsertBelow?: () => void;
  isEditable?: boolean;
  isClientRestricted?: boolean;
  onUpdateText?: (field: string, val: string) => void;
  theme?: SiteTheme;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onInsertBelow,
  isEditable = false,
  isClientRestricted = false,
  onUpdateText,
  theme,
}) => {
  const [formSent, setFormSent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const style = block.style || {
    bgColor: '#ffffff',
    textColor: '#0f172a',
    paddingY: 'normal',
    align: 'left',
  };

  const pyClass =
    style.paddingY === 'compact'
      ? 'py-8 md:py-12'
      : style.paddingY === 'spacious'
      ? 'py-20 md:py-32'
      : 'py-14 md:py-20';

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.bgColor,
    color: style.textColor,
  };

  // Helper for inline editable text
  const renderEditableText = (
    text: string | undefined,
    field: string,
    tag: 'h1' | 'h2' | 'h3' | 'p' | 'span',
    className: string,
    placeholder = 'Metin giriniz...'
  ) => {
    if (!text && !isEditable) return null;
    const Tag = tag;

    if (isEditable && onUpdateText) {
      return (
        <Tag
          contentEditable
          suppressContentEditableWarning
          className={`${className} outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 transition-all ${
            !text ? 'opacity-50 italic' : ''
          }`}
          onBlur={(e) => {
            const val = e.currentTarget.textContent || '';
            onUpdateText(field, val);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {text || placeholder}
        </Tag>
      );
    }

    return <Tag className={className}>{text}</Tag>;
  };

  const renderContent = () => {
    switch (block.type) {
      case 'header':
        return (
          <header className="px-6 py-4 border-b border-black/10 transition-colors">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="font-bold text-lg tracking-tight">
                {renderEditableText(block.title, 'title', 'span', 'font-bold text-lg tracking-tight')}
              </div>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {(block.items || []).map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href || '#'}
                    className="hover:opacity-75 transition-opacity"
                    onClick={(e) => isEditable && e.preventDefault()}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              {block.buttonText && (
                <div className="flex items-center gap-2">
                  <a
                    href={block.buttonLink || '#'}
                    className="px-4 py-2 text-xs font-semibold rounded-lg text-white shadow-sm transition-transform active:scale-95"
                    style={{ backgroundColor: theme?.primaryColor || '#2563eb' }}
                    onClick={(e) => isEditable && e.preventDefault()}
                  >
                    {block.buttonText}
                  </a>
                </div>
              )}
            </div>
          </header>
        );

      case 'hero':
        return (
          <section className={`${pyClass} px-6 relative overflow-hidden`}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {block.subtitle && (
                  <div className="text-xs uppercase tracking-widest font-semibold text-blue-600">
                    {renderEditableText(
                      block.subtitle,
                      'subtitle',
                      'p',
                      'text-xs uppercase tracking-widest font-semibold text-blue-600'
                    )}
                  </div>
                )}
                <div>
                  {renderEditableText(
                    block.title,
                    'title',
                    'h1',
                    'text-3xl md:text-5xl font-extrabold tracking-tight leading-tight'
                  )}
                </div>
                {block.description && (
                  <div>
                    {renderEditableText(
                      block.description,
                      'description',
                      'p',
                      'text-base md:text-lg opacity-85 leading-relaxed max-w-xl'
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-4 pt-2">
                  {block.buttonText && (
                    <button
                      className="px-6 py-3 text-sm font-semibold rounded-xl text-white shadow-sm transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                      style={{ backgroundColor: theme?.primaryColor || '#2563eb' }}
                      onClick={() => !isEditable && alert('Butona tıklandı!')}
                    >
                      {block.buttonText}
                    </button>
                  )}
                  {block.secondaryButtonText && (
                    <button
                      className="px-6 py-3 text-sm font-semibold rounded-xl border border-current hover:bg-black/5 transition-all active:scale-95 cursor-pointer"
                      onClick={() => !isEditable && alert('İkincil işlem')}
                    >
                      {block.secondaryButtonText}
                    </button>
                  )}
                </div>
              </div>
              {block.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-black/10 group">
                  <img
                    src={block.imageUrl}
                    alt={block.title}
                    className="w-full h-auto object-cover max-h-[460px] group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          </section>
        );

      case 'features':
        return (
          <section className={`${pyClass} px-6`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                {block.subtitle && (
                  <div>
                    {renderEditableText(
                      block.subtitle,
                      'subtitle',
                      'p',
                      'text-xs uppercase tracking-widest font-semibold text-blue-600'
                    )}
                  </div>
                )}
                <div>
                  {renderEditableText(
                    block.title,
                    'title',
                    'h2',
                    'text-2xl md:text-3xl font-bold tracking-tight'
                  )}
                </div>
                {block.description && (
                  <div>
                    {renderEditableText(
                      block.description,
                      'description',
                      'p',
                      'text-sm opacity-80 leading-relaxed'
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(block.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-8 rounded-2xl bg-white/80 border border-black/10 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white"
                      style={{ backgroundColor: theme?.primaryColor || '#2563eb' }}
                    >
                      {item.icon === 'Briefcase' ? (
                        <Briefcase className="w-5 h-5" />
                      ) : item.icon === 'Scale' ? (
                        <Scale className="w-5 h-5" />
                      ) : item.icon === 'Utensils' ? (
                        <Utensils className="w-5 h-5" />
                      ) : item.icon === 'Flame' ? (
                        <Flame className="w-5 h-5" />
                      ) : item.icon === 'Coffee' ? (
                        <Coffee className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm opacity-75 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section className={`${pyClass} px-6`}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {block.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-black/10 shadow-lg">
                  <img
                    src={block.imageUrl}
                    alt={block.title}
                    className="w-full h-auto object-cover max-h-[440px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="space-y-6">
                {block.subtitle && (
                  <div>
                    {renderEditableText(
                      block.subtitle,
                      'subtitle',
                      'p',
                      'text-xs uppercase tracking-widest font-semibold text-blue-600'
                    )}
                  </div>
                )}
                <div>
                  {renderEditableText(
                    block.title,
                    'title',
                    'h2',
                    'text-2xl md:text-3xl font-bold tracking-tight'
                  )}
                </div>
                <div>
                  {renderEditableText(
                    block.description,
                    'description',
                    'p',
                    'text-base opacity-80 leading-relaxed'
                  )}
                </div>
                {block.items && block.items.length > 0 && (
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-black/10">
                    {block.items.map((stat, sIdx) => (
                      <div key={sIdx}>
                        <div
                          className="text-2xl md:text-3xl font-extrabold tracking-tight"
                          style={{ color: theme?.primaryColor || '#2563eb' }}
                        >
                          {stat.metric}
                        </div>
                        <div className="text-xs opacity-75 mt-1 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section className={`${pyClass} px-6`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                {block.subtitle && (
                  <div className="text-xs uppercase tracking-widest font-semibold text-blue-600">
                    {block.subtitle}
                  </div>
                )}
                <div>
                  {renderEditableText(
                    block.title,
                    'title',
                    'h2',
                    'text-2xl md:text-3xl font-bold tracking-tight'
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(block.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="group rounded-2xl overflow-hidden border border-black/10 bg-white shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>{item.category}</span>
                        <span>{item.year}</span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section id="iletisim" className={`${pyClass} px-6`}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                {block.subtitle && (
                  <div>
                    {renderEditableText(
                      block.subtitle,
                      'subtitle',
                      'p',
                      'text-xs uppercase tracking-widest font-semibold text-blue-400'
                    )}
                  </div>
                )}
                <div>
                  {renderEditableText(
                    block.title,
                    'title',
                    'h2',
                    'text-2xl md:text-3xl font-bold tracking-tight'
                  )}
                </div>
                <div>
                  {renderEditableText(
                    block.description,
                    'description',
                    'p',
                    'text-base opacity-80 leading-relaxed'
                  )}
                </div>
                <div className="space-y-4 pt-4 text-sm">
                  {block.contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 opacity-75 shrink-0" />
                      <span>{block.contactPhone}</span>
                    </div>
                  )}
                  {block.contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 opacity-75 shrink-0" />
                      <span>{block.contactEmail}</span>
                    </div>
                  )}
                  {block.contactAddress && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 opacity-75 shrink-0 mt-0.5" />
                      <span>{block.contactAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Functional interactive contact form */}
              <div className="bg-black/20 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                {formSent ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold">Mesajınız Alındı</h3>
                    <p className="text-sm opacity-80">
                      Talebiniz ekibimize iletilmiştir. En kısa sürede geri dönüş yapılacaktır.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSent(false)}
                      className="px-4 py-2 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFormSent(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                        Adınız & Soyadınız
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                        E-Posta Adresi
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ahmet@example.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                        Mesajınız & Talep Detayları
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Hangi konuda hizmet almak istersiniz?"
                        className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 text-sm font-semibold rounded-lg text-white shadow transition-all hover:brightness-110 active:scale-98 cursor-pointer"
                      style={{ backgroundColor: theme?.primaryColor || '#2563eb' }}
                    >
                      {block.buttonText || 'Mesajı Gönder'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        );

      case 'footer':
        return (
          <footer className="px-6 py-8 border-t border-black/10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="font-semibold text-sm">
                {renderEditableText(block.title, 'title', 'span', 'font-semibold text-sm')}
              </div>
              <div className="opacity-75 text-center md:text-right">
                {renderEditableText(block.description, 'description', 'span', 'opacity-75')}
              </div>
            </div>
          </footer>
        );

      default:
        return (
          <section className="py-12 px-6 text-center">
            <h3 className="font-bold">{block.title}</h3>
            <p className="text-sm opacity-75">{block.description}</p>
          </section>
        );
    }
  };

  return (
    <div
      onClick={isEditable ? onSelect : undefined}
      style={containerStyle}
      className={`relative group transition-all duration-150 ${
        isEditable
          ? `cursor-pointer ${
              isSelected
                ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg z-20'
                : 'hover:ring-1 hover:ring-blue-300'
            }`
          : ''
      }`}
    >
      {/* Editor Floating Actions Overlay when selected in builder */}
      {isEditable && (
        <div
          className={`absolute top-2 right-4 z-30 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md text-white p-1 rounded-lg text-xs shadow-xl transition-opacity duration-150 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="px-2 py-1 text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
            {block.type}
          </span>
          <div className="h-4 w-px bg-slate-700 mx-0.5" />
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              title="Yukarı Taşı"
              className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              title="Aşağı Taşı"
              className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              title="Çoğalt"
              className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          {onSelect && (
            <button
              onClick={onSelect}
              title="Blok Ayarları"
              className="p-1.5 hover:bg-blue-600 rounded transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              title="Sil"
              className="p-1.5 hover:bg-red-600 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Insert Block Divider Button */}
      {isEditable && onInsertBelow && (
        <div className="relative group/divider h-2 z-10 -mb-1">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 group-hover/divider:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInsertBelow();
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-md transition-transform active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>Araya Blok Ekle</span>
            </button>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
};
