import React from 'react';
import { Sparkles, UserCheck, Shield, Plus, ExternalLink, Settings } from 'lucide-react';
import { AgencyConfig, UserRole } from '../types';

interface HeaderProps {
  agency: AgencyConfig;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNewSite: () => void;
  currentView: 'dashboard' | 'builder' | 'portal';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  agency,
  userRole,
  onRoleChange,
  onNewSite,
  currentView,
  onNavigateHome,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-xs transition-transform group-hover:scale-105"
              style={{ backgroundColor: agency.accentColor || '#2563eb' }}
            >
              {agency.logoText?.charAt(0) || 'K'}
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight font-display">
                {agency.name}
              </span>
              <span className="text-[11px] text-slate-500 block -mt-0.5">
                White-Label Web Stüdyosu & Satış Platformu
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={onNavigateHome}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Web Siteleri
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={onNavigateHome}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Şablonlar
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={onNavigateHome}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Müşteri Yönetimi
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={onNavigateHome}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Beyaz Etiket
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions & Role Persona Switcher */}
        <div className="flex items-center gap-3">
          {/* Persona Switcher (Ajans vs Müşteri) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => onRoleChange('agency_admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                userRole === 'agency_admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Ajans Sahibi</span>
            </button>
            <button
              onClick={() => onRoleChange('client')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                userRole === 'client'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Müşteri Portali</span>
            </button>
          </div>

          {currentView !== 'builder' && (
            <button
              onClick={onNewSite}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Site Sat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
