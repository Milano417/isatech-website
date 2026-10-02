import React from 'react';
import { 
  Users, 
  Sparkles, 
  Trophy, 
  Code, 
  Award, 
  MapPin, 
  Camera 
} from 'lucide-react';
import { PhotoGallery } from '../components/institution/PhotoGallery';

interface VieEtudiantePageProps {
  onNavigate: (route: string) => void;
}

export const VieEtudiantePage: React.FC<VieEtudiantePageProps> = ({ onNavigate }) => {
  const CLUBS = [
    {
      name: 'ISATech Coding & Dev Club',
      desc: 'Ateliers de programmation hebdomadaires, développement web et mobile et préparation aux hackathons.',
      badge: 'Technologie',
      icon: Code
    },
    {
      name: 'Club des Jeunes Gestionnaires & Financiers',
      desc: 'Simulations d\'analyses comptables SYSCOHADA, fiscalité pratique et échanges avec des experts.',
      badge: 'Gestion & Finance',
      icon: Trophy
    },
    {
      name: 'Atelier Graphique & Communication Visuelle',
      desc: 'Conception d\'affiches pour la vie de l\'école, typographie et perfectionnement sur Photoshop et Illustrator.',
      badge: 'Design & Culture',
      icon: Sparkles
    },
    {
      name: 'Association Sportive & Cohésion',
      desc: 'Tournois inter-promotions de football masculin et féminin, basketball et journées d\'intégration.',
      badge: 'Sport & Santé',
      icon: Award
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-white py-12 lg:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060] text-white">
            <Users className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Vie à l'École & Activités
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
            LA VIE SCOLAIRE & ÉTUDIANTE À ISATECH
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Un cadre rigoureux et convivial à Abidjan-Koumassi qui stimule le savoir-faire technique, la discipline, le leadership et l'esprit de fraternité.
          </p>
        </div>
      </section>

      {/* =========================================================================
          LOCAUX DE L'ÉTABLISSEMENT À KOUMASSI
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#002060] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#002060]" />
              <span>Locaux de Koumassi</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-[#002060]">
              Un cadre propice à l'apprentissage et à la réussite
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              L'école ISATech dispose de salles de cours équipées, d'un laboratoire informatique avec réseau, d'une salle multimédia et d'un secrétariat d'accueil dédié pour accompagner chaque étudiant au quotidien.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-lg font-black text-[#002060] block font-mono">2000+</span>
                <span className="text-[11px] text-slate-500 font-bold">Diplômés formés</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-lg font-black text-[#002060] block">Labo Info</span>
                <span className="text-[11px] text-slate-500 font-bold">Postes connectés</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-lg font-black text-[#002060] block">8 Filières</span>
                <span className="text-[11px] text-slate-500 font-bold">BTS d'État</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border-2 border-[#002060] shadow-md aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                alt="Ambiance de travail à l'école ISATech"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          GALERIE PHOTOS DE L'ÉCOLE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PhotoGallery />
      </section>

      {/* =========================================================================
          CLUBS & ASSOCIATIONS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-3 py-1 rounded-full border border-[#002060]/20">
            Dynamisme & Esprit d'Équipe
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#002060]">
            CLUBS & ACTIVITÉS DE L'ÉCOLE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CLUBS.map((club, idx) => {
            const Icon = club.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-[#002060] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#002060]/10 text-[#002060] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-[#002060] border border-slate-200">
                    {club.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {club.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {club.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
