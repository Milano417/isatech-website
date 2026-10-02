import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Layers, Award } from 'lucide-react';
import { FormationCard } from '../components/formations/FormationCard';
import { db } from '../services/db';
import { FormationCategory } from '../types';

interface FormationsPageProps {
  onNavigate: (route: string) => void;
}

export const FormationsPage: React.FC<FormationsPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');

  const formations = db.getFormations();

  const CATEGORIES: ('Toutes' | FormationCategory)[] = [
    'Toutes',
    'Informatique & Technologies',
    'Réseaux & Télécommunications',
    'Finance & Gestion',
    'Commerce & Management',
    'Communication & Design',
    'Tourisme & Hôtellerie',
    'Ressources Humaines & Communication',
    'Administration & Management'
  ];

  const filteredFormations = useMemo(() => {
    return formations.filter((f) => {
      const matchesCategory = selectedCategory === 'Toutes' || f.category === selectedCategory;
      const term = search.toLowerCase().trim();
      const matchesSearch = 
        !term ||
        f.name.toLowerCase().includes(term) ||
        f.code.toLowerCase().includes(term) ||
        f.description.toLowerCase().includes(term) ||
        f.skills.some(s => s.toLowerCase().includes(term)) ||
        f.opportunities.some(o => o.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [formations, selectedCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Page Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
          <BookOpen className="w-3.5 h-3.5 text-[#002060]" />
          <span className="text-xs font-black uppercase tracking-wider">
            Catalogue Académique Officiel
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
          CHOISISSEZ VOTRE PARCOURS.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Explorez les 8 filières professionnalisantes dispensées à ISATech Abidjan-Koumassi. Des cursus alliant savoirs fondamentaux, ateliers pratiques et stages en entreprise.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une formation par métier, compétence (Java, SYSCOHADA, Réseaux, Graphisme...)"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-[#002060] focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Categories Filter Tabs */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            <Filter className="w-3.5 h-3.5 text-[#002060]" />
            <span>Domaines d'études :</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    isSelected
                      ? 'bg-[#002060] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>{filteredFormations.length} filière(s) disponible(s)</span>
          {selectedCategory !== 'Toutes' && (
            <button
              onClick={() => setSelectedCategory('Toutes')}
              className="text-[#002060] font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {filteredFormations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFormations.map((formation) => (
              <FormationCard
                key={formation.id}
                formation={formation}
                onSelect={(slug) => onNavigate(`/formations/${slug}`)}
                onApply={(code) => onNavigate(`/candidater?filiere=${code}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Aucune formation ne correspond à votre recherche
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Essayez d'ajuster vos mots-clés ou consultez l'ensemble des 8 filières officielles d'ISATech.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('Toutes');
              }}
              className="px-4 py-2 bg-[#002060] text-white text-xs font-bold rounded-xl"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}
      </div>

      {/* Bottom Info Banner */}
      <div className="bg-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-base font-extrabold text-[#002060]">
            Besoin d'orientation personnalisée ?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600">
            Discutez immédiatement avec notre assistant officiel <strong>ISATECH AI</strong> en bas à droite pour trouver la filière qui correspond à votre profil.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/candidater')}
          className="px-5 py-3 rounded-xl bg-[#002060] hover:bg-[#001744] text-white text-xs sm:text-sm font-black transition-all shrink-0 shadow-sm"
        >
          Déposer un dossier de candidature
        </button>
      </div>
    </div>
  );
};
