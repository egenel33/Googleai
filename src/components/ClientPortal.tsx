import React, { useState } from 'react';
import {
  Globe,
  Settings,
  Edit3,
  FileText,
  LifeBuoy,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Check,
  AlertCircle,
  TrendingUp,
  Users,
  Eye,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { Website, AgencyConfig, ClientProfile } from '../types';
import { LivePreviewModal } from './LivePreviewModal';

interface ClientPortalProps {
  agency: AgencyConfig;
  website: Website;
  client: ClientProfile;
  onUpdateWebsite: (site: Website) => void;
  onSwitchToAdmin: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  agency,
  website,
  client,
  onUpdateWebsite,
  onSwitchToAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'editor' | 'invoices' | 'support'>('overview');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Simple safe text state for client
  const [contactPhone, setContactPhone] = useState(
    website.blocks.find((b) => b.type === 'contact')?.contactPhone || ''
  );
  const [contactEmail, setContactEmail] = useState(
    website.blocks.find((b) => b.type === 'contact')?.contactEmail || ''
  );
  const [contactAddress, setContactAddress] = useState(
    website.blocks.find((b) => b.type === 'contact')?.contactAddress || ''
  );
  const [heroTitle, setHeroTitle] = useState(
    website.blocks.find((b) => b.type === 'hero')?.title || ''
  );
  const [heroDesc, setHeroDesc] = useState(
    website.blocks.find((b) => b.type === 'hero')?.description || ''
  );

  // Support ticket state
  const [supportMessage, setSupportMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const handleSaveClientEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBlocks = website.blocks.map((block) => {
      if (block.type === 'hero') {
        return {
          ...block,
          title: heroTitle,
          description: heroDesc,
        };
      }
      if (block.type === 'contact') {
        return {
          ...block,
          contactPhone,
          contactEmail,
          contactAddress,
        };
      }
      return block;
    });

    const updatedSite = {
      ...website,
      blocks: updatedBlocks,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateWebsite(updatedSite);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setSupportMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Client Portal Header - Fully White-Labeled with Agency Brand */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Agency Brand Zone */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-white text-base shadow-sm"
              style={{ backgroundColor: agency.accentColor || '#2563eb' }}
            >
              {agency.logoText?.charAt(0) || 'K'}
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">{agency.name}</span>
              <span className="text-[11px] text-slate-500 block">Müşteri Yönetim Portali</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              İçerik Düzenleyici
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'invoices'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faturalar & Ödemeler
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'support'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ajans Destek Talebi
            </button>
          </nav>

          {/* Right: User Profile & Admin Switch */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-slate-800">{client.name}</span>
              <span className="block text-[11px] text-slate-500">{client.companyName}</span>
            </div>
            <button
              onClick={onSwitchToAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Ajans Yöneticisi Paneline Dön"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ajans Paneline Dön</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Website Status Hero Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                    Web Siteniz Yayında & Aktif
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{website.title}</h1>
                <p className="text-xs text-slate-500 max-w-xl">
                  Web siteniz {agency.name} yüksek performanslı bulut altyapısı üzerinde kesintisiz olarak yayınlanmaktadır.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-700 pt-1">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Globe className="w-3.5 h-3.5" />
                    <span>https://{website.customDomain || `${website.slug}.com`}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SSL Aktif (256-Bit)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Sitemi Görüntüle</span>
                </button>
                <button
                  onClick={() => setActiveTab('editor')}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>İçerikleri Düzenle</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Bu Ayki Ziyaretçi</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    4.820
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">+%18</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Geçen aya göre artışta</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Gelen İletişim / Form</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    34 Talep
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">%100 İletildi</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">{website.clientEmail} adresine</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Aylık Hosting & Bakım</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    {agency.currency}{website.monthlyFee?.toLocaleString('tr-TR')}
                  </span>
                  <span className="text-xs text-slate-500">/ ay</span>
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 block">Sonraki fatura: 15 gün sonra</span>
              </div>
            </div>

            {/* Quick Actions & Recent Updates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Müşteri Portali Hızlı İşlemler</h3>
                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">İletişim Bilgilerini Güncelle</p>
                      <p className="text-slate-500 text-[11px]">Telefon, e-posta veya ofis adresinizi değiştirin</p>
                    </div>
                    <Edit3 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Son Faturayı İndir</p>
                      <p className="text-slate-500 text-[11px]">Resmi e-fatura ve sözleşme dökümünüz</p>
                    </div>
                    <FileText className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('support')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Ajansa Yeni İstek Gönder</p>
                      <p className="text-slate-500 text-[11px]">Yeni sayfa talebi, revizyon veya teknik destek</p>
                    </div>
                    <LifeBuoy className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Sözleşmeli Ajansınız</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
                      {agency.logoText?.substring(0, 2) || 'KU'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{agency.name}</h4>
                      <p className="text-slate-500 text-[11px]">{agency.domain}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-slate-600 text-[11px]">
                    <p>Destek E-Posta: <strong className="text-slate-800">{agency.supportEmail}</strong></p>
                    <p>Telefon: <strong className="text-slate-800">{agency.supportPhone}</strong></p>
                    <p>Alan Adı Yönetimi: {agency.name} Altyapısı Tarafından Sağlanmaktadır</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDITOR TAB - Safe Client Mode */}
        {activeTab === 'editor' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Güvenli Müşteri İçerik Paneli
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Web Sitenizin Metinlerini ve İletişim Bilgilerini Düzenleyin
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Burada yapacağınız değişiklikler sitenizin tasarım düzenini bozmadan anında güncellenir.
              </p>
            </div>

            <form onSubmit={handleSaveClientEdits} className="space-y-6 text-sm">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Ana Sayfa Manşet Metinleri
                </h3>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Ana Manşet Başlığı
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Açıklama Metni
                  </label>
                  <textarea
                    rows={3}
                    value={heroDesc}
                    onChange={(e) => setHeroDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  İletişim & Konum Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Telefon Numarası
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Açık Adres Bilgisi
                  </label>
                  <input
                    type="text"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-50"
                >
                  Önce Önizle
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Değişiklikler Canlıya Alındı!</span>
                    </>
                  ) : (
                    <span>Değişiklikleri Kaydet & Yayına Al</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Faturalar ve Hizmet Sözleşmesi</h2>
              <p className="text-xs text-slate-500 mt-1">
                {agency.name} tarafından düzenlenen kurumsal web tasarım ve barındırma faturalarınız.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Fatura No</th>
                    <th className="py-3 px-4 font-semibold">Hizmet Açıklaması</th>
                    <th className="py-3 px-4 font-semibold">Tarih</th>
                    <th className="py-3 px-4 font-semibold">Tutar</th>
                    <th className="py-3 px-4 font-semibold">Durum</th>
                    <th className="py-3 px-4 text-right font-semibold">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">FAT-2026-0038</td>
                    <td className="py-3.5 px-4 font-medium">{website.title} - Kurulum & Tasarım Bedeli</td>
                    <td className="py-3.5 px-4 text-slate-500">14 Ağustos 2026</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      {agency.currency}{website.salePrice?.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Ödendi
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert('Fatura PDF olarak indiriliyor...')}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        PDF İndir
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">BAK-2026-0901</td>
                    <td className="py-3.5 px-4 font-medium">Aylık Bulut Sunucu & Bakım Hizmeti</td>
                    <td className="py-3.5 px-4 text-slate-500">01 Ekim 2026</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      {agency.currency}{website.monthlyFee?.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Ödendi
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert('Fatura PDF olarak indiriliyor...')}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        PDF İndir
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
              <p className="font-semibold text-slate-800">Otomatik Ödeme Bilgisi:</p>
              <p>
                Aylık bakım ve sunucu bedelleri her ayın 1'inde kayıtlı şirket kartınızdan otomatik olarak tahsil edilmektedir.
              </p>
            </div>
          </div>
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6 animate-in fade-in duration-150 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ajans Destek & Revizyon Talebi</h2>
              <p className="text-xs text-slate-500 mt-1">
                Web sitenizde yeni bir sayfa, logo değişikliği veya ek modül talep etmek için doğrudan ajansınıza mesaj gönderin.
              </p>
            </div>

            {ticketSent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-emerald-900 text-sm">Talebiniz Ajansa İletildi</h3>
                <p className="text-xs text-emerald-700">
                  Destek ekibimiz en geç 2 saat içinde talebinizi inceleyip kayıtlı e-postanız üzerinden yanıt verecektir.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendTicket} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Talep Konusu</label>
                  <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs">
                    <option>Yeni Blok veya Sayfa Ekleme Talebi</option>
                    <option>Görsel veya Logo Revizyonu</option>
                    <option>E-Posta veya Alan Adı Ayarı</option>
                    <option>Genel Soru / Destek</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Açıklamanız</label>
                  <textarea
                    rows={5}
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Web sitenizde yapılmasını istediğiniz değişiklikleri detaylandırın..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Destek Talebini Ajansa Gönder</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

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
