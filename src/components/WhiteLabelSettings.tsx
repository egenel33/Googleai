import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  Save,
  Building,
  Globe,
  Mail,
  Phone,
  DollarSign,
  Palette,
  Eye,
  FileText
} from 'lucide-react';
import { AgencyConfig } from '../types';

interface WhiteLabelSettingsProps {
  agency: AgencyConfig;
  onSaveAgency: (updated: AgencyConfig) => void;
}

export const WhiteLabelSettings: React.FC<WhiteLabelSettingsProps> = ({
  agency: initialAgency,
  onSaveAgency,
}) => {
  const [agency, setAgency] = useState<AgencyConfig>(initialAgency);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAgency(agency);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const colorPresets = [
    '#2563eb', // Blue
    '#059669', // Emerald
    '#7c3aed', // Purple
    '#ea580c', // Orange
    '#0f172a', // Slate/Black
    '#be185d', // Rose
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Beyaz Etiket (White-Label) & Kendi Markanızın Ayarları
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Müşterilerinizin göreceği tüm panelleri, faturaları ve web sitelerini kendi şirket kimliğinizle donatın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Identity Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Ajans Kimliği & Marka Adı</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Ajans / Marka Adı (Markanız)
              </label>
              <input
                type="text"
                required
                value={agency.name}
                onChange={(e) => setAgency({ ...agency, name: e.target.value })}
                placeholder="Örn: Apex Dijital Stüdyo"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Kısa Logo Yazısı (Monogram)
              </label>
              <input
                type="text"
                value={agency.logoText}
                onChange={(e) => setAgency({ ...agency, logoText: e.target.value })}
                placeholder="Örn: APEX"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Slogan / Alt Başlık
              </label>
              <input
                type="text"
                value={agency.tagline}
                onChange={(e) => setAgency({ ...agency, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Marka Vurgu Rengi
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAgency({ ...agency, accentColor: c })}
                      className={`w-7 h-7 rounded-lg border shadow-xs transition-transform ${
                        agency.accentColor === c ? 'scale-110 ring-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={agency.accentColor}
                  onChange={(e) => setAgency({ ...agency, accentColor: e.target.value })}
                  className="w-7 h-7 rounded border border-slate-200 cursor-pointer ml-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Domain & Client Portal URL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Alan Adı & Müşteri Giriş Portali</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Ajans Ana Alan Adı (Website)
              </label>
              <input
                type="text"
                value={agency.domain}
                onChange={(e) => setAgency({ ...agency, domain: e.target.value })}
                placeholder="ajansiniz.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Müşteri Üyelik Paneli Alt Alan Adı (Portal)
              </label>
              <input
                type="text"
                value={agency.clientPortalSlug}
                onChange={(e) => setAgency({ ...agency, clientPortalSlug: e.target.value })}
                placeholder="portal.ajansiniz.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600 font-semibold"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Destek E-Postası (Müşterilerin Gördüğü)
              </label>
              <input
                type="email"
                value={agency.supportEmail}
                onChange={(e) => setAgency({ ...agency, supportEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Para Birimi Sembolü
              </label>
              <select
                value={agency.currency}
                onChange={(e) => setAgency({ ...agency, currency: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white font-bold"
              >
                <option value="₺">₺ - Türk Lirası (TRY)</option>
                <option value="$">$ - ABD Doları (USD)</option>
                <option value="€">€ - Euro (EUR)</option>
              </select>
            </div>
          </div>

          {/* Remove Watermark Toggle */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 block">
                Platform Filigranını Kaldır (Tam Beyaz Etiket)
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                Sitelerin altındaki 3. parti ibareleri gizler ve yalnızca sizin belirlediğiniz ajans telifini gösterir.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={agency.removePlatformBranding}
                onChange={(e) =>
                  setAgency({ ...agency, removePlatformBranding: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Invoice & Legal Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Müşteri Teklif & Fatura Resmi Bilgileri
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                Resmi Şirket Unvanı
              </label>
              <input
                type="text"
                value={agency.invoiceCompanyTitle}
                onChange={(e) => setAgency({ ...agency, invoiceCompanyTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                Ofis / Tebligat Adresi
              </label>
              <input
                type="text"
                value={agency.invoiceAddress}
                onChange={(e) => setAgency({ ...agency, invoiceAddress: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Vergi Dairesi ve Numarası
              </label>
              <input
                type="text"
                value={agency.taxNumber}
                onChange={(e) => setAgency({ ...agency, taxNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Banka Hesap IBAN (Tahsilat İçin)
              </label>
              <input
                type="text"
                value={agency.bankIban}
                onChange={(e) => setAgency({ ...agency, bankIban: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Ayarlar Güncellendi</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Marka Ayarlarını Kaydet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
