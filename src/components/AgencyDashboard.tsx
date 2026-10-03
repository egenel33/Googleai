import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Eye,
  FileText,
  Download,
  Trash2,
  Copy,
  Users,
  DollarSign,
  TrendingUp,
  Layout,
  Sliders,
  Check,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { Website, AgencyConfig, ClientProfile, ProposalDocument } from '../types';
import { TEMPLATE_PRESETS } from '../data/defaultData';
import { WhiteLabelSettings } from './WhiteLabelSettings';
import { downloadHtmlFile } from '../utils/exportHtml';

interface AgencyDashboardProps {
  websites: Website[];
  agency: AgencyConfig;
  clients: ClientProfile[];
  proposals: ProposalDocument[];
  onOpenEditor: (site: Website) => void;
  onOpenPreview: (site: Website) => void;
  onOpenProposal: (site: Website) => void;
  onOpenClientPortal: (site: Website, client: ClientProfile) => void;
  onOpenNewSiteModal: (templateId?: string) => void;
  onDeleteSite: (siteId: string) => void;
  onDuplicateSite: (site: Website) => void;
  onSaveAgency: (updated: AgencyConfig) => void;
  onAddClient: (client: ClientProfile) => void;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({
  websites,
  agency,
  clients,
  proposals,
  onOpenEditor,
  onOpenPreview,
  onOpenProposal,
  onOpenClientPortal,
  onOpenNewSiteModal,
  onDeleteSite,
  onDuplicateSite,
  onSaveAgency,
  onAddClient,
}) => {
  const [activeTab, setActiveTab] = useState<'sites' | 'templates' | 'clients' | 'whitelabel'>('sites');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Compute agency statistics
  const totalSalesRevenue = websites.reduce((acc, site) => acc + (site.salePrice || 0), 0);
  const monthlyRecurringRevenue = websites.reduce((acc, site) => acc + (site.monthlyFee || 0), 0);
  const publishedSitesCount = websites.filter((s) => s.status === 'published' || s.status === 'sold').length;

  const filteredWebsites = websites.filter((site) => {
    const matchesSearch =
      site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Toplam Satış Geliri</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 font-bold">
              {agency.currency}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {agency.currency}{totalSalesRevenue.toLocaleString('tr-TR')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {websites.length} web sitesi satışı & sözleşmesi
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Aylık Düzenli Gelir (MRR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {agency.currency}{monthlyRecurringRevenue.toLocaleString('tr-TR')}
            </span>
            <span className="text-xs text-slate-500">/ ay</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Sunucu & bakım aboneliklerinden
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Aktif / Yayındaki Siteler</span>
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {publishedSitesCount} / {websites.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Özel alan adına bağlı & canlıda
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Müşteriler & Portaller</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {clients.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {agency.clientPortalSlug} üzerinden erişimde
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sites')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'sites'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Web Siteleri ({websites.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'templates'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Şablon Galerisi ({TEMPLATE_PRESETS.length})
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'clients'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Müşteri CRM & Satış Teklifleri ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('whitelabel')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'whitelabel'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Beyaz Etiket & Marka Ayarları
          </button>
        </div>

        <button
          onClick={() => onOpenNewSiteModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer -mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Web Sitesi Başlat</span>
        </button>
      </div>

      {/* TAB 1: WEBSITES LIST & GRID */}
      {activeTab === 'sites' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Site adı, müşteri veya sektör ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Segmented Filter Controls */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tümü ({websites.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                  statusFilter === 'published'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yayında
              </button>
              <button
                onClick={() => setStatusFilter('sold')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                  statusFilter === 'sold'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satıldı
              </button>
              <button
                onClick={() => setStatusFilter('proposal')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                  statusFilter === 'proposal'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Teklif Aşaması
              </button>
            </div>
          </div>

          {/* Website Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((site) => {
              const matchedClient =
                clients.find((c) => c.assignedSiteId === site.id) || clients[0];
              const heroImage =
                site.blocks.find((b) => b.imageUrl)?.imageUrl ||
                site.blocks.find((b) => b.items?.[0]?.img)?.items?.[0]?.img ||
                '/src/assets/images/hero_web_agency_1791058152873.jpg';

              return (
                <div
                  key={site.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Thumbnail / Header */}
                  <div>
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={heroImage}
                        alt={site.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                      {/* Status indicator unboxed */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-800 shadow-xs">
                        {site.status === 'published'
                          ? '● Yayında'
                          : site.status === 'sold'
                          ? '✓ Satıldı & Teslim Edildi'
                          : site.status === 'proposal'
                          ? '⏳ Teklif Aşaması'
                          : 'Taslak'}
                      </div>

                      <div className="absolute bottom-3 left-3 text-white text-xs font-semibold">
                        {site.category}
                      </div>
                    </div>

                    {/* Site Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                          {site.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                          {site.customDomain || `https://${site.slug}.${agency.domain}`}
                        </p>
                      </div>

                      {/* Client & Pricing Metadata */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Müşteri</span>
                          <span className="font-semibold text-slate-800">{site.clientName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 block">Satış Bedeli</span>
                          <span className="font-mono font-bold text-slate-900 tabular-nums">
                            {agency.currency}{site.salePrice?.toLocaleString('tr-TR')}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-medium block">
                            +{agency.currency}{site.monthlyFee}/ay
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenEditor(site)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                        title="Wix/Tilda Tarzı Görsel Düzenleyici"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Düzenle</span>
                      </button>
                      <button
                        onClick={() => onOpenPreview(site)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                        title="Canlı Önizleme"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenProposal(site)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                        title="Fatura & Satış Teklifi"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadHtmlFile(site, agency)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                        title="HTML Olarak İndir"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenClientPortal(site, matchedClient)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 transition-colors"
                        title="Müşteri Üyelik Paneli Girişi"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Müşteri Portali</span>
                      </button>
                      <button
                        onClick={() => onDuplicateSite(site)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                        title="Çoğalt"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSite(site.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATES GALLERY */}
      {activeTab === 'templates' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hazır Sektörel Şablonlar</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Müşterilerinize hızlıca web sitesi satmak için hazır olarak yapılandırılmış şablonlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATE_PRESETS.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={tpl.imageUrl}
                      alt={tpl.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                      {tpl.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-900">{tpl.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Tavsiye Satış:</span>
                      <span className="font-bold text-slate-900">
                        {agency.currency}{tpl.defaultPrice.toLocaleString('tr-TR')} + {agency.currency}{tpl.defaultMonthly}/ay
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onOpenNewSiteModal(tpl.id)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Bu Şablonla Yeni Site Oluştur</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT CRM & PROPOSALS */}
      {activeTab === 'clients' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Müşteri Portföyü ve Satış Teklifleri</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Web sitesi sattığınız müşteriler ve erişim verdikleri üyelik panelleri
              </p>
            </div>
            <button
              onClick={() => onOpenNewSiteModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              + Müşteriye Yeni Site Sat
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Müşteri & Şirket</th>
                  <th className="py-3.5 px-4 font-semibold">Bağlı Web Sitesi</th>
                  <th className="py-3.5 px-4 font-semibold">Satış Tutarı</th>
                  <th className="py-3.5 px-4 font-semibold">Aylık Sunucu</th>
                  <th className="py-3.5 px-4 font-semibold">Durum</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Müşteri Portali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {clients.map((client) => {
                  const assignedSite =
                    websites.find((s) => s.id === client.assignedSiteId) || websites[0];
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{client.name}</p>
                        <p className="text-slate-500 text-[11px]">{client.companyName} · {client.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{assignedSite?.title}</span>
                        <span className="block text-[11px] text-slate-500">{assignedSite?.customDomain}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                        {agency.currency}{client.totalAgreed?.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-emerald-600 tabular-nums">
                        {agency.currency}{client.monthlyHosting?.toLocaleString('tr-TR')} / ay
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> {client.status === 'active' ? 'Aktif' : 'Ödeme Bekliyor'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => assignedSite && onOpenClientPortal(assignedSite, client)}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Portali Aç</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: WHITE LABEL SETTINGS */}
      {activeTab === 'whitelabel' && (
        <WhiteLabelSettings agency={agency} onSaveAgency={onSaveAgency} />
      )}
    </div>
  );
};
