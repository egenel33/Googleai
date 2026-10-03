/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Website,
  AgencyConfig,
  ClientProfile,
  ProposalDocument,
  UserRole
} from './types';
import {
  DEFAULT_AGENCY_CONFIG,
  INITIAL_WEBSITES,
  INITIAL_CLIENTS,
  INITIAL_PROPOSALS
} from './data/defaultData';
import { Header } from './components/Header';
import { AgencyDashboard } from './components/AgencyDashboard';
import { SiteBuilder } from './components/SiteBuilder';
import { ClientPortal } from './components/ClientPortal';
import { NewSiteModal } from './components/NewSiteModal';
import { LivePreviewModal } from './components/LivePreviewModal';
import { ProposalModal } from './components/ProposalModal';

export default function App() {
  // Load or initialize state from localStorage
  const [agency, setAgency] = useState<AgencyConfig>(() => {
    const saved = localStorage.getItem('markastudio_agency');
    return saved ? JSON.parse(saved) : DEFAULT_AGENCY_CONFIG;
  });

  const [websites, setWebsites] = useState<Website[]>(() => {
    const saved = localStorage.getItem('markastudio_websites');
    return saved ? JSON.parse(saved) : INITIAL_WEBSITES;
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('markastudio_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [proposals, setProposals] = useState<ProposalDocument[]>(() => {
    const saved = localStorage.getItem('markastudio_proposals');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  // Navigation & View state
  const [currentView, setCurrentView] = useState<'dashboard' | 'builder' | 'portal'>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('agency_admin');
  const [activeSiteId, setActiveSiteId] = useState<string>(websites[0]?.id || '');
  const [activeClientId, setActiveClientId] = useState<string>(clients[0]?.id || '');

  // Modals state
  const [isNewSiteModalOpen, setIsNewSiteModalOpen] = useState(false);
  const [newSitePresetTpl, setNewSitePresetTpl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSite, setPreviewSite] = useState<Website | null>(null);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalSite, setProposalSite] = useState<Website | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('markastudio_agency', JSON.stringify(agency));
  }, [agency]);

  useEffect(() => {
    localStorage.setItem('markastudio_websites', JSON.stringify(websites));
  }, [websites]);

  useEffect(() => {
    localStorage.setItem('markastudio_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('markastudio_proposals', JSON.stringify(proposals));
  }, [proposals]);

  // Handlers
  const handleSaveWebsite = (updated: Website) => {
    setWebsites((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSaveAgency = (updated: AgencyConfig) => {
    setAgency(updated);
  };

  const handleCreateSite = (newSite: Website, newClient?: ClientProfile) => {
    setWebsites((prev) => [newSite, ...prev]);
    if (newClient) {
      setClients((prev) => [newClient, ...prev]);
    }
    setActiveSiteId(newSite.id);
    setCurrentView('builder');
  };

  const handleDeleteSite = (siteId: string) => {
    if (confirm('Bu web sitesini ve bağlı yapılandırmayı silmek istediğinizden emin misiniz?')) {
      setWebsites((prev) => prev.filter((s) => s.id !== siteId));
      setClients((prev) => prev.filter((c) => c.assignedSiteId !== siteId));
    }
  };

  const handleDuplicateSite = (site: Website) => {
    const copy: Website = {
      ...JSON.parse(JSON.stringify(site)),
      id: `site-${Date.now()}`,
      title: `${site.title} (Kopya)`,
      slug: `${site.slug}-kopya`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setWebsites((prev) => [copy, ...prev]);
  };

  const handleOpenEditor = (site: Website) => {
    setActiveSiteId(site.id);
    setCurrentView('builder');
  };

  const handleOpenPreview = (site: Website) => {
    setPreviewSite(site);
    setIsPreviewOpen(true);
  };

  const handleOpenProposal = (site: Website) => {
    setProposalSite(site);
    setIsProposalOpen(true);
  };

  const handleOpenClientPortal = (site: Website, client: ClientProfile) => {
    setActiveSiteId(site.id);
    setActiveClientId(client.id);
    setUserRole('client');
    setCurrentView('portal');
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'client') {
      setCurrentView('portal');
    } else {
      setCurrentView('dashboard');
    }
  };

  const activeWebsite =
    websites.find((s) => s.id === activeSiteId) || websites[0] || INITIAL_WEBSITES[0];
  const activeClient =
    clients.find((c) => c.assignedSiteId === activeWebsite?.id) ||
    clients[0] ||
    INITIAL_CLIENTS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* If in Builder view, render full-screen builder */}
      {currentView === 'builder' && activeWebsite ? (
        <SiteBuilder
          website={activeWebsite}
          agency={agency}
          onSaveWebsite={handleSaveWebsite}
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      ) : currentView === 'portal' && activeWebsite && activeClient ? (
        <ClientPortal
          agency={agency}
          website={activeWebsite}
          client={activeClient}
          onUpdateWebsite={handleSaveWebsite}
          onSwitchToAdmin={() => {
            setUserRole('agency_admin');
            setCurrentView('dashboard');
          }}
        />
      ) : (
        /* Agency Admin Dashboard View */
        <div className="min-h-screen flex flex-col">
          <Header
            agency={agency}
            userRole={userRole}
            onRoleChange={handleRoleChange}
            onNewSite={() => {
              setNewSitePresetTpl(null);
              setIsNewSiteModalOpen(true);
            }}
            currentView={currentView}
            onNavigateHome={() => setCurrentView('dashboard')}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
            <AgencyDashboard
              websites={websites}
              agency={agency}
              clients={clients}
              proposals={proposals}
              onOpenEditor={handleOpenEditor}
              onOpenPreview={handleOpenPreview}
              onOpenProposal={handleOpenProposal}
              onOpenClientPortal={handleOpenClientPortal}
              onOpenNewSiteModal={(tplId) => {
                setNewSitePresetTpl(tplId || null);
                setIsNewSiteModalOpen(true);
              }}
              onDeleteSite={handleDeleteSite}
              onDuplicateSite={handleDuplicateSite}
              onSaveAgency={handleSaveAgency}
              onAddClient={(newClient) => setClients((prev) => [newClient, ...prev])}
            />
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>
                © 2026 <strong>{agency.name}</strong> · Wix & Tilda Tarzı White-Label Web Sitesi Satış Platformu
              </p>
              <div className="flex items-center gap-4 text-slate-500">
                <span>Müşteri Portali: <code className="text-blue-600">{agency.clientPortalSlug}</code></span>
                <span>·</span>
                <span>Altyapı: Kendi Markanız (White-Label)</span>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* New Project Wizard Modal */}
      <NewSiteModal
        isOpen={isNewSiteModalOpen}
        onClose={() => setIsNewSiteModalOpen(false)}
        agency={agency}
        onCreateSite={handleCreateSite}
        presetTemplateId={newSitePresetTpl}
      />

      {/* Standalone Live Preview Modal */}
      {previewSite && (
        <LivePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewSite(null);
          }}
          website={previewSite}
          agency={agency}
        />
      )}

      {/* Proposal & Invoice Modal */}
      {proposalSite && (
        <ProposalModal
          isOpen={isProposalOpen}
          onClose={() => {
            setIsProposalOpen(false);
            setProposalSite(null);
          }}
          website={proposalSite}
          agency={agency}
          onSaveProposal={(updatedProp) => {
            setProposals((prev) =>
              prev.map((p) => (p.id === updatedProp.id ? updatedProp : p))
            );
          }}
        />
      )}
    </div>
  );
}
