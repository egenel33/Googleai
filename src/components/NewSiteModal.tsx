import React, { useState } from 'react';
import { X, Sparkles, Layout, DollarSign, Check, Layers } from 'lucide-react';
import { Website, AgencyConfig, ClientProfile } from '../types';
import { TEMPLATE_PRESETS, LAW_FIRM_BLOCKS, RESTAURANT_BLOCKS, ARCHITECTURE_BLOCKS } from '../data/defaultData';

interface NewSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: AgencyConfig;
  onCreateSite: (newSite: Website, newClient?: ClientProfile) => void;
  presetTemplateId?: string | null;
}

export const NewSiteModal: React.FC<NewSiteModalProps> = ({
  isOpen,
  onClose,
  agency,
  onCreateSite,
  presetTemplateId,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    presetTemplateId || 'tpl-law'
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hukuk & Danışmanlık');
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [salePrice, setSalePrice] = useState<number>(32000);
  const [monthlyFee, setMonthlyFee] = useState<number>(750);

  if (!isOpen) return null;

  const handleTemplateChange = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = TEMPLATE_PRESETS.find((t) => t.id === tplId);
    if (tpl) {
      setSalePrice(tpl.defaultPrice);
      setMonthlyFee(tpl.defaultMonthly);
      setCategory(tpl.category);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const slug = (title || 'yeni-site')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const siteId = `site-${Date.now()}`;
    const clientId = `client-${Date.now()}`;

    let blocksToUse = LAW_FIRM_BLOCKS;
    if (selectedTemplateId === 'tpl-restaurant') blocksToUse = RESTAURANT_BLOCKS;
    if (selectedTemplateId === 'tpl-architecture') blocksToUse = ARCHITECTURE_BLOCKS;

    const newSite: Website = {
      id: siteId,
      title: title || 'Yeni Web Projesi',
      slug,
      category,
      clientName: clientName || 'Yeni Müşteri',
      clientEmail: clientEmail || 'musteri@example.com',
      clientPhone: clientPhone || '+90 500 000 0000',
      companyName: companyName || title,
      salePrice: Number(salePrice) || 30000,
      monthlyFee: Number(monthlyFee) || 750,
      status: 'proposal',
      customDomain: `www.${slug}.com`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      theme: {
        fontFamily: 'Plus Jakarta Sans',
        primaryColor: agency.accentColor || '#2563eb',
        secondaryColor: '#64748b',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        borderRadius: 'lg',
      },
      blocks: JSON.parse(JSON.stringify(blocksToUse)),
    };

    const newClient: ClientProfile = {
      id: clientId,
      name: clientName || 'Yeni Müşteri',
      companyName: companyName || title,
      email: clientEmail || 'musteri@example.com',
      phone: clientPhone || '+90 500 000 0000',
      assignedSiteId: siteId,
      totalAgreed: Number(salePrice) || 30000,
      monthlyHosting: Number(monthlyFee) || 750,
      status: 'pending_payment',
      notes: 'Yeni proje oluşturuldu. Teklif gönderildi.',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateSite(newSite, newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Yeni Müşteri Web Sitesi Oluştur</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Şablon seçin, müşteri bilgilerini ve satış fiyatını belirleyin
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* 1. Template Choice */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              1. Başlangıç Sektör Şablonu
            </label>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATE_PRESETS.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleTemplateChange(tpl.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplateId === tpl.id
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-2 bg-slate-100">
                    <img
                      src={tpl.imageUrl}
                      alt={tpl.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs truncate">{tpl.title}</h4>
                  <span className="text-[10px] text-slate-500 block truncate">{tpl.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Site & Brand Information */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              2. Web Sitesi Başlığı & Sektör
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Site / Proje Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Akasya Diş Polikliniği"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Kategori</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Sağlık, Gastronomi, Hukuk..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Client CRM Details */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              3. Müşteri İletişim Bilgileri (Üyelik Paneli İçin)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Müşteri Yetkili Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Dt. Selin Aydın"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Müşteri Şirket / Kurum Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Akasya Ağız ve Diş Sağlığı Ltd."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Müşteri E-Postası (Portal Girişi İçin)
                </label>
                <input
                  type="email"
                  required
                  placeholder="selin@akasyadis.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Telefon Numarası</label>
                <input
                  type="tel"
                  placeholder="+90 532 999 88 77"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Sales Pricing & Hosting Fee */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              4. Satış Fiyatı ve Aylık Düzenli Gelir (MRR)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-800 mb-1">
                  Site Satış / Tasarım Bedeli ({agency.currency})
                </label>
                <input
                  type="number"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Müşteriye teklif edilecek tek seferlik kurulum bedeli
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-800 mb-1">
                  Aylık Bakım & Sunucu Ücreti ({agency.currency})
                </label>
                <input
                  type="number"
                  required
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Her ay tahsil edilecek düzenli hosting ve bakım ücreti
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              Siteyi Oluştur ve Tasarımcıyı Başlat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
