export type UserRole = 'agency_admin' | 'client';

export interface AgencyConfig {
  name: string;
  tagline: string;
  domain: string;
  logoText: string;
  logoUrl?: string;
  accentColor: string;
  supportEmail: string;
  supportPhone: string;
  currency: '₺' | '$' | '€';
  clientPortalSlug: string;
  removePlatformBranding: boolean;
  customFooterText: string;
  invoiceCompanyTitle: string;
  invoiceAddress: string;
  taxNumber: string;
  bankIban: string;
}

export type BlockType =
  | 'header'
  | 'hero'
  | 'features'
  | 'about'
  | 'gallery'
  | 'pricing'
  | 'testimonials'
  | 'contact'
  | 'cta'
  | 'footer';

export interface BlockStyle {
  bgColor: string;
  textColor: string;
  paddingY: 'compact' | 'normal' | 'spacious';
  align: 'left' | 'center' | 'right';
  bgImage?: string;
  bgOverlay?: boolean;
}

export interface BlockData {
  id: string;
  type: BlockType;
  variant: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  style: BlockStyle;
  // Specific data payloads
  items?: any[];
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export interface SiteTheme {
  fontFamily: 'Plus Jakarta Sans' | 'Syne' | 'Playfair' | 'Inter';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export type SiteStatus = 'draft' | 'proposal' | 'published' | 'sold';

export interface Website {
  id: string;
  title: string;
  slug: string;
  category: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  salePrice: number;
  monthlyFee: number;
  status: SiteStatus;
  customDomain?: string;
  createdAt: string;
  updatedAt: string;
  theme: SiteTheme;
  blocks: BlockData[];
}

export interface ClientProfile {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  assignedSiteId: string;
  totalAgreed: number;
  monthlyHosting: number;
  status: 'active' | 'pending_payment' | 'lead';
  notes: string;
  createdAt: string;
}

export interface ProposalItem {
  id: string;
  description: string;
  amount: number;
}

export interface ProposalDocument {
  id: string;
  siteId: string;
  clientId: string;
  proposalNumber: string;
  issueDate: string;
  validUntil: string;
  clientName: string;
  clientCompany: string;
  items: ProposalItem[];
  subtotal: number;
  tax: number;
  total: number;
  monthlyFee: number;
  notes: string;
  status: 'draft' | 'sent' | 'paid';
}
