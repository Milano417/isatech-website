import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Network, 
  Camera, 
  GraduationCap 
} from 'lucide-react';
import { db } from '../../services/db';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const formations = db.getFormations();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#002060] text-slate-200 border-t border-slate-800">
      {/* Top Accent Line */}
      <div className="h-1.5 w-full bg-white/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Column 1: Institution Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => handleLinkClick('/')}>
              <Logo variant="light" showSlogan={false} />
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              L'<strong>Institut des Sciences Appliquées et de la Technologie (ISATech)</strong> forme depuis le 06 septembre 2001 les cadres et techniciens de demain à Abidjan, Koumassi. Déjà <strong>plus de 2000+ diplômés</strong> insérés sur le marché de l'emploi en Côte d'Ivoire.
            </p>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block mb-0.5">
                Devise Officielle
              </span>
              <p className="text-sm font-bold text-white italic">
                « L’excellence demeure notre credo »
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>Abidjan — Koumassi, Côte d'Ivoire</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>Téléphone : <span className="text-slate-300 font-mono">+225 07 07 03 93 20/ 07 09 78 73 74</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span>Email : <span className="text-slate-300 font-mono">info@isatech.ci</span></span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation de l'École */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/20 pb-2">
              L'Établissement
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button 
                  onClick={() => handleLinkClick('/')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/a-propos')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  À propos d'ISATech
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/organigramme')}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5 font-bold"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Organigramme Officiel</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/galerie')}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5 font-bold"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Galerie Photo de l'École</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/formations')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Nos Formations (8 filières)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/admission')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Conditions d'Admission
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/actualites')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Actualités de l'école
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/contact')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Contact & Plan d'accès
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Les 8 Filières Officielles */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/20 pb-2">
              Nos 8 Filières
            </h4>
            <ul className="space-y-1.5 text-xs">
              {formations.map((f) => (
                <li key={f.code}>
                  <button
                    onClick={() => handleLinkClick(`/formations/${f.slug}`)}
                    className="group flex items-center gap-2 hover:text-white transition-colors text-left"
                  >
                    <span className="font-mono font-bold text-white group-hover:underline">
                      {f.code}
                    </span>
                    <span className="text-slate-300 group-hover:text-white line-clamp-1">
                      {f.name.replace(/^[^-]+—\s*/, '')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <button
                onClick={() => handleLinkClick('/candidater')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:underline"
              >
                <span>Déposer une candidature en ligne</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Column 4: Newsletter & Portails */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/20 pb-2">
              Renseignements & Inscriptions
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recevez les dates d'admissions et les communications de l'école ISATech.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="w-full text-xs bg-white text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 placeholder:text-slate-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-black bg-white text-[#002060] hover:bg-slate-100 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>S'INSCRIRE</span>
              </button>
            </form>

            {subscribed && (
              <div className="flex items-center gap-2 p-2 bg-emerald-900/60 border border-emerald-400 rounded-lg text-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
                <span>Merci pour votre inscription !</span>
              </div>
            )}

            <div className="pt-2 border-t border-white/20 space-y-1.5 text-xs">
              <button
                onClick={() => handleLinkClick('/suivi-candidature')}
                className="text-slate-200 hover:text-white flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Suivi de candidature en ligne
              </button>
              <button
                onClick={() => handleLinkClick('/etudiant')}
                className="text-slate-200 hover:text-white flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Portail Espace Étudiant
              </button>
              <button
                onClick={() => handleLinkClick('/admin')}
                className="text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                Espace Administration
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p className="text-center sm:text-left">
            © 2026 ISATech — Institut des Sciences Appliquées et de la Technologie. Tous droits réservés.
          </p>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-white">2000+ diplômés formés</span>
            <span>•</span>
            <span>Abidjan — Koumassi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
