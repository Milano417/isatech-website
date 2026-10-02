import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';
import { 
  Search, 
  Menu, 
  X, 
  GraduationCap, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Camera,
  Network
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', route: '/' },
    { label: 'À propos', route: '/a-propos' },
    { label: 'Formations', route: '/formations' },
    { label: 'Organigramme', route: '/organigramme' },
    { label: 'Galerie Photos', route: '/galerie' },
    { label: 'Admission', route: '/admission' },
    { label: 'Actualités', route: '/actualites' },
    { label: 'Contact', route: '/contact' }
  ];

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200' 
            : 'bg-white py-3.5 border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              onClick={() => handleLinkClick('/')}
              className="cursor-pointer"
            >
              <Logo showSlogan={false} />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navLinks.map((link) => {
                const isActive = currentRoute === link.route || 
                  (link.route !== '/' && currentRoute.startsWith(link.route));
                return (
                  <button
                    key={link.route}
                    onClick={() => handleLinkClick(link.route)}
                    className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-all ${
                      isActive
                        ? 'text-[#002060] bg-slate-100 font-extrabold border-b-2 border-[#002060]'
                        : 'text-slate-600 hover:text-[#002060] hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="p-2 sm:p-2.5 text-slate-600 hover:text-[#002060] hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
                title="Rechercher (Ctrl+K)"
                aria-label="Recherche"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                <span className="hidden xl:inline-block text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                  Ctrl K
                </span>
              </button>

              {/* Suivi Candidature Quick link */}
              <button
                onClick={() => handleLinkClick('/suivi-candidature')}
                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#002060] px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                title="Suivre un dossier existant"
              >
                <Clock className="w-3.5 h-3.5 text-[#002060]" />
                <span>Suivi dossier</span>
              </button>

              {/* Espace Étudiant */}
              <button
                onClick={() => handleLinkClick('/etudiant')}
                className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all border ${
                  currentRoute.startsWith('/etudiant')
                    ? 'bg-[#002060] text-white border-[#002060]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#002060] hover:text-[#002060]'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#002060]" />
                <span>Espace Étudiant</span>
              </button>

              {/* Primary CTA CANDIDATER in Navy & White */}
              <button
                onClick={() => handleLinkClick('/candidater')}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#002060] hover:bg-[#001744] active:scale-95 shadow-md shadow-[#002060]/20 transition-all border border-[#002060]"
              >
                <FileText className="w-4 h-4 shrink-0 text-white" />
                <span>CANDIDATER</span>
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-800 hover:text-[#002060] hover:bg-slate-100 rounded-xl"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-30 bg-white flex flex-col justify-between overflow-y-auto lg:hidden animate-in slide-in-from-top-4 duration-200 border-t border-slate-200 p-4">
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation de l'École
            </div>
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`w-full text-left px-4 py-3 text-base font-semibold rounded-xl transition-all ${
                  currentRoute === link.route
                    ? 'bg-slate-100 text-[#002060] font-bold border-l-4 border-[#002060]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-slate-200 mt-4 space-y-2">
              <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Services & Admissions
              </div>

              <button
                onClick={() => handleLinkClick('/candidater')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#002060] text-white font-black text-sm shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white" />
                  Déposer une Candidature
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-bold">2026-2027</span>
              </button>

              <button
                onClick={() => handleLinkClick('/organigramme')}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm"
              >
                <Network className="w-4 h-4 text-[#002060]" />
                Organigramme de l'Établissement
              </button>

              <button
                onClick={() => handleLinkClick('/galerie')}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm"
              >
                <Camera className="w-4 h-4 text-[#002060]" />
                Galerie Photo de l'École
              </button>

              <button
                onClick={() => handleLinkClick('/suivi-candidature')}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-800 font-bold text-sm"
              >
                <Clock className="w-4 h-4 text-[#002060]" />
                Suivre mon Dossier de Candidature
              </button>

              <button
                onClick={() => handleLinkClick('/etudiant')}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-800 font-bold text-sm"
              >
                <GraduationCap className="w-4 h-4 text-[#002060]" />
                Accéder à l'Espace Étudiant
              </button>

              <button
                onClick={() => handleLinkClick('/admin')}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Administration ISATech
              </button>
            </div>
          </div>

          <div className="pt-6 pb-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600 font-medium">
              ISATech — Institut des Sciences Appliquées et de la Technologie
            </p>
            <p className="text-xs text-[#002060] font-bold mt-0.5">
              Abidjan, Koumassi • 2000+ diplômés formés
            </p>
            <p className="text-[11px] text-slate-400 italic font-semibold mt-1">
              « L’excellence demeure notre credo »
            </p>
          </div>
        </div>
      )}
    </>
  );
};
