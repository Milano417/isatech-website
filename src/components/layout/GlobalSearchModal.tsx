import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Newspaper, Calendar, Compass, ArrowRight } from 'lucide-react';
import { db } from '../../services/db';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const formations = db.getFormations();
  const news = db.getNews();
  const events = db.getEvents();

  const INSTITUTIONAL_PAGES = [
    { title: 'À Propos d\'ISATech', desc: 'Histoire depuis 2001, vision, mission et valeurs institutionnelles.', route: '/a-propos' },
    { title: 'Organigramme Officiel', desc: 'Structure hiérarchique de l\'établissement : du Fondateur aux Professeurs.', route: '/organigramme' },
    { title: 'Galerie Photos de l\'École', desc: 'Immersion en images : amphis, labos informatiques et soutenances.', route: '/galerie' },
    { title: 'Admissions & Inscriptions', desc: 'Processus en 6 étapes, conditions requises et calendrier.', route: '/admission' },
    { title: 'Déposer une Candidature', desc: 'Formulaire officiel multi-étapes avec numéro unique.', route: '/candidater' },
    { title: 'Suivi de Candidature', desc: 'Consulter l\'état de votre dossier en temps réel.', route: '/suivi-candidature' },
    { title: 'Vie Étudiante & Établissement', desc: 'Établissement d\'Abidjan Koumassi, associations, clubs tech et ateliers.', route: '/vie-etudiante' },
    { title: 'Équipe Pédagogique & Direction', desc: 'Direction générale, corps professoral et responsables.', route: '/equipe' },
    { title: 'Contact & Localisation', desc: 'Locaux de Koumassi, formulaires et horaires d\'accueil.', route: '/contact' },
    { title: 'Portail Étudiant', desc: 'Espace sécurisé : notes, emploi du temps, certificats.', route: '/etudiant' }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const term = searchTerm.toLowerCase().trim();

  const filteredFormations = term
    ? formations.filter(f => 
        f.name.toLowerCase().includes(term) || 
        f.code.toLowerCase().includes(term) || 
        f.category.toLowerCase().includes(term) ||
        f.skills.some(s => s.toLowerCase().includes(term))
      )
    : formations.slice(0, 4);

  const filteredNews = term
    ? news.filter(n => 
        n.title.toLowerCase().includes(term) || 
        n.excerpt.toLowerCase().includes(term) ||
        n.category.toLowerCase().includes(term)
      )
    : news.slice(0, 2);

  const filteredEvents = term
    ? events.filter(e => 
        e.title.toLowerCase().includes(term) || 
        e.description.toLowerCase().includes(term) ||
        e.location.toLowerCase().includes(term)
      )
    : events.slice(0, 2);

  const filteredPages = term
    ? INSTITUTIONAL_PAGES.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.desc.toLowerCase().includes(term)
      )
    : INSTITUTIONAL_PAGES.slice(0, 4);

  const handleSelect = (route: string) => {
    onNavigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#0B1F33]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une filière, un événement, une actualité..."
            className="flex-1 bg-transparent text-base text-slate-800 placeholder:text-slate-400 outline-hidden font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose} 
            className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300 transition-colors"
          >
            ÉCHAP
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Formations */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#002060]" />
                Filières & Formations ({filteredFormations.length})
              </span>
              <button 
                onClick={() => handleSelect('/formations')}
                className="text-[#002060] font-bold hover:underline"
              >
                Tout voir
              </button>
            </div>

            {filteredFormations.length > 0 ? (
              <div className="space-y-1.5">
                {filteredFormations.map(f => (
                  <div
                    key={f.id}
                    onClick={() => handleSelect(`/formations/${f.slug}`)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#002060]/30 cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-8 rounded-lg bg-[#002060] text-white font-black text-xs flex items-center justify-center">
                        {f.code}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#002060]">
                          {f.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {f.category} • {f.level}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#002060] transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic px-2">Aucune formation trouvée pour "{searchTerm}"</p>
            )}
          </div>

          {/* Actualités */}
          {filteredNews.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
                <span className="flex items-center gap-1.5">
                  <Newspaper className="w-3.5 h-3.5 text-[#002060]" />
                  Actualités
                </span>
                <button 
                  onClick={() => handleSelect('/actualites')}
                  className="text-[#002060] font-bold hover:underline"
                >
                  Tout voir
                </button>
              </div>

              <div className="space-y-1.5">
                {filteredNews.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleSelect(`/actualites/${n.slug}`)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#002060] uppercase tracking-wider mr-2">
                        {n.category}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-[#002060]">
                        {n.title}
                      </h4>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Événements */}
          {filteredEvents.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Événements de l'Institut
                </span>
                <button 
                  onClick={() => handleSelect('/evenements')}
                  className="text-amber-600 hover:underline"
                >
                  Tout voir
                </button>
              </div>

              <div className="space-y-1.5">
                {filteredEvents.map(e => (
                  <div
                    key={e.id}
                    onClick={() => handleSelect('/evenements')}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        {e.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {e.date} • {e.location}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                      {e.status === 'A_VENIR' ? 'À venir' : e.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pages institutionnelles */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              Accès Rapide aux Pages
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredPages.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(p.route)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors border border-slate-200/60"
                >
                  <h5 className="text-xs font-bold text-slate-800">{p.title}</h5>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500">
          Recherche universelle ISATech • Abidjan, Koumassi
        </div>
      </div>
    </div>
  );
};
