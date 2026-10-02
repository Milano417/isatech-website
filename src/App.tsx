/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { IsatechAI } from './components/ai/IsatechAI';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FormationsPage } from './pages/FormationsPage';
import { FormationDetailPage } from './pages/FormationDetailPage';
import { AdmissionPage } from './pages/AdmissionPage';
import { CandidaturePage } from './pages/CandidaturePage';
import { SuiviCandidaturePage } from './pages/SuiviCandidaturePage';
import { VieEtudiantePage } from './pages/VieEtudiantePage';
import { ActualitesPage } from './pages/ActualitesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { EvenementsPage } from './pages/EvenementsPage';
import { EquipePage } from './pages/EquipePage';
import { OrganigrammePage } from './pages/OrganigrammePage';
import { GaleriePage } from './pages/GaleriePage';
import { ContactPage } from './pages/ContactPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Sync with browser history back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (route: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route resolver
  const renderRoute = () => {
    const [pathname, searchStr] = currentRoute.split('?');
    const searchParams = new URLSearchParams(searchStr || '');

    if (pathname === '/' || pathname === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (pathname === '/a-propos') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (pathname === '/formations') {
      return <FormationsPage onNavigate={navigate} />;
    }

    if (pathname.startsWith('/formations/')) {
      const slug = pathname.replace('/formations/', '');
      return <FormationDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (pathname === '/organigramme') {
      return <OrganigrammePage onNavigate={navigate} />;
    }

    if (pathname === '/galerie') {
      return <GaleriePage onNavigate={navigate} />;
    }

    if (pathname === '/admission') {
      return <AdmissionPage onNavigate={navigate} />;
    }

    if (pathname === '/candidater') {
      const initialFiliere = searchParams.get('filiere') || undefined;
      return <CandidaturePage initialFiliere={initialFiliere} onNavigate={navigate} />;
    }

    if (pathname === '/suivi-candidature') {
      const initialNum = searchParams.get('numero') || undefined;
      return <SuiviCandidaturePage initialNumber={initialNum} onNavigate={navigate} />;
    }

    if (pathname === '/vie-etudiante' || pathname === '/vie-scolaire') {
      return <VieEtudiantePage onNavigate={navigate} />;
    }

    if (pathname === '/actualites') {
      return <ActualitesPage onNavigate={navigate} />;
    }

    if (pathname.startsWith('/actualites/')) {
      const slug = pathname.replace('/actualites/', '');
      return <ArticleDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (pathname === '/evenements') {
      return <EvenementsPage onNavigate={navigate} />;
    }

    if (pathname === '/equipe') {
      return <EquipePage onNavigate={navigate} />;
    }

    if (pathname === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (pathname === '/etudiant' || pathname.startsWith('/etudiant')) {
      return <StudentPortalPage onNavigate={navigate} />;
    }

    if (pathname === '/admin' || pathname.startsWith('/admin')) {
      return <AdminDashboardPage onNavigate={navigate} />;
    }

    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B] selection:bg-[#002060] selection:text-white">
      {/* Sticky Institutional Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Page View */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Institutional Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Universal Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={navigate}
      />

      {/* ISATECH AI Institutional Floating Assistant */}
      <IsatechAI onNavigate={navigate} />
    </div>
  );
}
