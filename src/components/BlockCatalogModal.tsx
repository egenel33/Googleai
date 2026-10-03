import React, { useState } from 'react';
import {
  X,
  LayoutTemplate,
  Sparkles,
  Layers,
  MessageSquare,
  DollarSign,
  Image,
  PhoneCall,
  Footprints,
  Sliders
} from 'lucide-react';
import { BlockData, BlockType } from '../types';

interface BlockCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (newBlock: BlockData) => void;
}

export const BlockCatalogModal: React.FC<BlockCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectBlock,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const catalogItems: Array<{
    category: string;
    title: string;
    description: string;
    block: BlockData;
  }> = [
    {
      category: 'hero',
      title: 'Ayrık Görselli Başlık (Split Hero)',
      description: 'Sol tarafta güçlü manşet ve eylem butonları, sağda etkileyici görsel.',
      block: {
        id: `block-hero-${Date.now()}`,
        type: 'hero',
        variant: 'split',
        title: 'İşinizi Geleceğe Taşıyacak Dijital Çözümler',
        subtitle: 'Profesyonellik · Güven · İnovasyon',
        description: 'Müşterilerinize değer katan modern, hızlı ve kurumsal web deneyimleri inşa ediyoruz.',
        imageUrl: '/src/assets/images/hero_web_agency_1791058152873.jpg',
        buttonText: 'Hemen Başlayın',
        buttonLink: '#iletisim',
        secondaryButtonText: 'Detaylı Bilgi',
        secondaryButtonLink: '#hizmetler',
        style: {
          bgColor: '#ffffff',
          textColor: '#0f172a',
          paddingY: 'spacious',
          align: 'left',
        },
      },
    },
    {
      category: 'hero',
      title: 'Ortalanmış Minimalist Hero',
      description: 'Zarif tipografi ve odaklanmış tek bir çağrı eylemi.',
      block: {
        id: `block-hero-${Date.now()}`,
        type: 'hero',
        variant: 'centered',
        title: 'Sade, Etkili ve Güçlü Bir Dijital Varlık',
        subtitle: 'Minimalist Yaklaşım',
        description: 'Karmaşıklıktan uzak, hedef kitlenizle doğrudan bağ kuran temiz bir sunum.',
        buttonText: 'İletişime Geçin',
        buttonLink: '#iletisim',
        style: {
          bgColor: '#0f172a',
          textColor: '#ffffff',
          paddingY: 'spacious',
          align: 'center',
        },
      },
    },
    {
      category: 'features',
      title: '3 Kolonlu Hizmetler Kartı',
      description: 'İkonlu ve açıklamalı 3 temel hizmet veya özellik kutusu.',
      block: {
        id: `block-features-${Date.now()}`,
        type: 'features',
        variant: 'grid-3',
        title: 'Sunduğumuz Çözümler',
        subtitle: 'Yetkinliklerimiz',
        description: 'Her alanda sektör standardının üzerinde kaliteli hizmet.',
        style: {
          bgColor: '#f8fafc',
          textColor: '#0f172a',
          paddingY: 'normal',
          align: 'center',
        },
        items: [
          {
            title: 'Stratejik Danışmanlık',
            desc: 'Hedeflerinize yönelik veri odaklı büyüme ve dönüşüm stratejileri.',
            icon: 'Briefcase',
          },
          {
            title: 'Teknolojik Altyapı',
            desc: 'Hızlı, güvenli ve kesintisiz modern dijital altyapı kurulumları.',
            icon: 'FileText',
          },
          {
            title: 'Hukuki & Operasyonel Güvence',
            desc: 'Tüm süreçlerin regülasyonlara ve etik kurallara tam uyumu.',
            icon: 'Scale',
          },
        ],
      },
    },
    {
      category: 'about',
      title: 'Rakamlarla Başarı & Hakkımızda',
      description: 'Kurumsal hikayenizi sayılar ve deneyimle pekiştiren bölüm.',
      block: {
        id: `block-about-${Date.now()}`,
        type: 'about',
        variant: 'editorial',
        title: 'Deneyim ve Tutkuyla Şekillenen Bir Vizyon',
        subtitle: 'Hikayemiz',
        description: 'Yılların getirdiği uzmanlıkla sektörümüzde öncü projelere imza atıyoruz. Müşteri memnuniyetini merkeze alarak kalıcı değer üretiyoruz.',
        imageUrl: '/src/assets/images/template_architecture_1791058187553.jpg',
        style: {
          bgColor: '#ffffff',
          textColor: '#0f172a',
          paddingY: 'normal',
          align: 'left',
        },
        items: [
          { metric: '10+', label: 'Yıllık Sektör Deneyimi' },
          { metric: '250+', label: 'Başarılı Proje Teslimi' },
          { metric: '%99', label: 'Zamanında Teslim Oranı' },
        ],
      },
    },
    {
      category: 'gallery',
      title: 'Portfolyo & Proje Galerisi',
      description: 'Tamamlanan işleri ve ürünleri görsel kartlarla sergileyin.',
      block: {
        id: `block-gallery-${Date.now()}`,
        type: 'gallery',
        variant: 'grid-3',
        title: 'Öne Çıkan Çalışmalarımız',
        subtitle: 'Portfolyo',
        description: 'Yakın zamanda tamamladığımız seçkin projeler.',
        style: {
          bgColor: '#f8fafc',
          textColor: '#0f172a',
          paddingY: 'normal',
          align: 'center',
        },
        items: [
          {
            title: 'Lüks Rezidans Projesi',
            category: 'Mimari',
            year: '2026',
            img: '/src/assets/images/template_architecture_1791058187553.jpg',
          },
          {
            title: 'Kurumsal Hukuk Portalı',
            category: 'Web Tasarım',
            year: '2026',
            img: '/src/assets/images/template_law_firm_1791058165714.jpg',
          },
          {
            title: 'Gastronomi Deneyimi',
            category: 'Markalama',
            year: '2025',
            img: '/src/assets/images/template_restaurant_1791058176664.jpg',
          },
        ],
      },
    },
    {
      category: 'contact',
      title: 'Çalışan İletişim Formu & Harita Bilgileri',
      description: 'Ziyaretçilerin doğrudan size ulaşmasını sağlayan canlı form ve iletişim kanalları.',
      block: {
        id: `block-contact-${Date.now()}`,
        type: 'contact',
        variant: 'split-info',
        title: 'Bize Ulaşın & Teklif Alın',
        subtitle: 'İletişim',
        description: 'Projeniz hakkında görüşmek ve ücretsiz keşif toplantısı planlamak için formu doldurun.',
        contactEmail: 'iletisim@ajansiniz.com',
        contactPhone: '+90 212 999 88 77',
        contactAddress: 'Büyükdere Cad. No: 124 Levent / İstanbul',
        buttonText: 'Talebi İlet',
        style: {
          bgColor: '#0f172a',
          textColor: '#ffffff',
          paddingY: 'normal',
          align: 'left',
        },
      },
    },
    {
      category: 'footer',
      title: 'Zarif ve Sade Alt Bilgi (Footer)',
      description: 'Telif hakları, yasal bildirimler ve kurumsal dipnot.',
      block: {
        id: `block-footer-${Date.now()}`,
        type: 'footer',
        variant: 'clean',
        title: 'Marka & Şirket Adı',
        description: '© 2026 Tüm hakları saklıdır. Gizlilik Politikası ve Kullanım Koşulları.',
        style: {
          bgColor: '#020617',
          textColor: '#94a3b8',
          paddingY: 'compact',
          align: 'center',
        },
      },
    },
  ];

  const categories = [
    { id: 'all', label: 'Tüm Bloklar' },
    { id: 'hero', label: 'Başlık & Hero' },
    { id: 'features', label: 'Hizmetler & Özellikler' },
    { id: 'about', label: 'Hakkımızda & Hikaye' },
    { id: 'gallery', label: 'Galeri & Projeler' },
    { id: 'contact', label: 'İletişim & Form' },
    { id: 'footer', label: 'Alt Bilgi (Footer)' },
  ];

  const filtered =
    activeCategory === 'all'
      ? catalogItems
      : catalogItems.filter((i) => i.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-blue-600" />
              <span>Tilda / Wix Tarzı Blok Kütüphanesi</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sayfanıza eklemek istediğiniz hazır blok şablonunu seçin
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-white shrink-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === c.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between group bg-slate-50/50 hover:bg-white"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {item.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => {
                    onSelectBlock(item.block);
                    onClose();
                  }}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors group-hover:scale-102"
                >
                  Bu Bloğu Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
