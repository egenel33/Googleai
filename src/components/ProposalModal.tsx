import React, { useState } from 'react';
import { X, Printer, Check, Copy, FileText, Send, Building, DollarSign } from 'lucide-react';
import { Website, AgencyConfig, ProposalDocument } from '../types';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: Website;
  agency: AgencyConfig;
  proposal?: ProposalDocument;
  onSaveProposal?: (proposal: ProposalDocument) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  website,
  agency,
  proposal: initialProposal,
  onSaveProposal,
}) => {
  if (!isOpen) return null;

  const defaultSubtotal = website.salePrice || 30000;
  const defaultTax = Math.round(defaultSubtotal * 0.2);
  const defaultTotal = defaultSubtotal + defaultTax;

  const [proposal, setProposal] = useState<ProposalDocument>(
    initialProposal || {
      id: `prop-${Date.now()}`,
      siteId: website.id,
      clientId: 'client-active',
      proposalNumber: `TEK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      clientName: website.clientName || 'Müşteri Adı',
      clientCompany: website.companyName || 'Müşteri Şirketi',
      items: [
        {
          id: 'item-1',
          description: `${website.title} - Kurumsal Web Sitesi Tasarımı, Kodlaması ve Yayına Alma`,
          amount: defaultSubtotal * 0.75,
        },
        {
          id: 'item-2',
          description: 'Mobil & Tablet %100 Responsive Uyumluluk ve Sayfa Hız Optimizasyonu',
          amount: defaultSubtotal * 0.15,
        },
        {
          id: 'item-3',
          description: '1 Yıllık Yüksek Hızlı Kurumsal Bulut Hosting & SSL Güvenlik Sertifikası',
          amount: defaultSubtotal * 0.1,
        },
      ],
      subtotal: defaultSubtotal,
      tax: defaultTax,
      total: defaultTotal,
      monthlyFee: website.monthlyFee || 750,
      notes:
        'Sözleşme onayı ile birlikte %50 avans faturası kesilir, kalan %50 teslimatta tahsil edilir. Yıllık yenilemelerde hosting ve alan adı dahil bakım bedeli geçerlidir.',
      status: website.status === 'sold' ? 'paid' : 'sent',
    }
  );

  const [copiedLink, setCopiedLink] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPortalLink = () => {
    const link = `https://${agency.clientPortalSlug}/teklif/${proposal.proposalNumber}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStatusChange = (status: 'draft' | 'sent' | 'paid') => {
    const updated = { ...proposal, status };
    setProposal(updated);
    if (onSaveProposal) onSaveProposal(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Modal Toolbar (Non-printable) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-bold">Müşteri Satış Teklifi & Fatura Önizlemesi</h2>
              <span className="text-xs text-slate-400">
                Markanız altında düzenlenen resmi satış dökümanı
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Selector */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => handleStatusChange('sent')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  proposal.status === 'sent'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Teklif Gönderildi
              </button>
              <button
                onClick={() => handleStatusChange('paid')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  proposal.status === 'paid'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ödeme Alındı / Satıldı
              </button>
            </div>

            <button
              onClick={handleCopyPortalLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium rounded-lg text-white transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Kopyalandı' : 'Müşteri Linki'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-semibold rounded-lg text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice / Proposal Document */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white text-slate-800 space-y-8 font-sans">
          {/* Header Block: Agency Brand */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="inline-block px-3 py-1 rounded bg-blue-600 text-white font-extrabold text-lg tracking-wider mb-2">
                {agency.logoText || 'KUANTUM'}
              </div>
              <h1 className="text-xl font-bold text-slate-900">{agency.invoiceCompanyTitle || agency.name}</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                {agency.invoiceAddress}
              </p>
              <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                <p>Vergi Dairesi & No: <strong className="text-slate-700">{agency.taxNumber}</strong></p>
                <p>E-Posta: <strong className="text-slate-700">{agency.supportEmail}</strong> · Tel: {agency.supportPhone}</p>
              </div>
            </div>

            <div className="text-left md:text-right space-y-1">
              <span className="text-xs uppercase tracking-widest font-semibold text-blue-600">
                Hizmet Satış Teklifi
              </span>
              <div className="text-2xl font-mono font-bold text-slate-900">
                {proposal.proposalNumber}
              </div>
              <div className="text-xs text-slate-500 pt-2 space-y-1">
                <p>Düzenleme Tarihi: <strong className="text-slate-700">{proposal.issueDate}</strong></p>
                <p>Geçerlilik Tarihi: <strong className="text-slate-700">{proposal.validUntil}</strong></p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-2"
                  style={{
                    backgroundColor: proposal.status === 'paid' ? '#dcfce7' : '#e0f2fe',
                    color: proposal.status === 'paid' ? '#15803d' : '#0369a1',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: proposal.status === 'paid' ? '#16a34a' : '#0284c7' }} />
                  {proposal.status === 'paid' ? 'Onaylandı & Ödendi' : 'Müşteri Onayı Bekliyor'}
                </div>
              </div>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                Teklif Verilen Müşteri / Kurum
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{website.companyName || proposal.clientCompany}</h3>
              <p className="text-xs text-slate-600 mt-0.5">Yetkili: {website.clientName || proposal.clientName}</p>
              <p className="text-xs text-slate-600">E-Posta: {website.clientEmail}</p>
              <p className="text-xs text-slate-600">Telefon: {website.clientPhone}</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                Proje Bilgileri & Alan Adı
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">{website.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">Proje Kategorisi: {website.category}</p>
              <p className="text-xs text-slate-600">
                Hedef Alan Adı: <strong className="text-blue-600">{website.customDomain || `${website.slug}.com`}</strong>
              </p>
              <p className="text-xs text-slate-600">
                Aylık Bakım & Sunucu: <strong className="text-slate-800">{agency.currency}{website.monthlyFee?.toLocaleString('tr-TR')} / ay</strong>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900">
                  <th className="py-3 px-2 font-bold uppercase tracking-wider">Hizmet / Kapsam Açıklaması</th>
                  <th className="py-3 px-2 text-right font-bold uppercase tracking-wider w-36">Birim Fiyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {proposal.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-2">
                      <p className="font-semibold text-slate-800">{item.description}</p>
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono font-medium text-slate-700 tabular-nums">
                      {agency.currency}
                      {item.amount.toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
            <div className="max-w-md text-xs text-slate-600 space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Ödeme Bilgileri & Banka Hesapları
              </h4>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                <p>IBAN: <strong>{agency.bankIban}</strong></p>
                <p>Alıcı: {agency.invoiceCompanyTitle}</p>
                <p>Açıklama: {proposal.proposalNumber} - {website.title}</p>
              </div>
              <p className="text-slate-500 italic text-[11px] leading-relaxed">
                {proposal.notes}
              </p>
            </div>

            <div className="w-full md:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Ara Toplam:</span>
                <span className="font-mono font-medium tabular-nums">
                  {agency.currency}{proposal.subtotal.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">KDV (%20):</span>
                <span className="font-mono font-medium tabular-nums">
                  {agency.currency}{proposal.tax.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b-2 border-slate-900 text-sm font-bold text-slate-900">
                <span>Genel Toplam:</span>
                <span className="font-mono tabular-nums text-blue-600">
                  {agency.currency}{proposal.total.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between py-1 text-[11px] text-slate-500">
                <span>Düzenli Bakım (Aylık):</span>
                <span className="font-mono font-medium text-emerald-600 tabular-nums">
                  +{agency.currency}{proposal.monthlyFee.toLocaleString('tr-TR')} / ay
                </span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-200 text-xs">
            <div>
              <p className="font-bold text-slate-800">Teklifi Hazırlayan (Ajans):</p>
              <p className="text-slate-500">{agency.name}</p>
              <div className="h-14 border-b border-dashed border-slate-300 mt-4 flex items-end pb-1 text-slate-400 italic">
                Kaşe / Yetkili İmza
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-800">Teklifi Kabul Eden (Müşteri):</p>
              <p className="text-slate-500">{website.companyName || proposal.clientCompany}</p>
              <div className="h-14 border-b border-dashed border-slate-300 mt-4 flex items-end pb-1 text-slate-400 italic">
                Yetkili İmza & Onay Tarihi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
