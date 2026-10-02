import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Laptop, 
  Briefcase, 
  Layers, 
  Users, 
  ShieldCheck, 
  Clock, 
  FileText,
  Calendar,
  Compass,
  Award,
  ChevronRight,
  Network,
  Camera
} from 'lucide-react';
import { FormationCard } from '../components/formations/FormationCard';
import { PhotoGallery } from '../components/institution/PhotoGallery';
import { Organigramme } from '../components/institution/Organigramme';
import { db } from '../services/db';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const formations = db.getFormations();
  const news = db.getNews().slice(0, 3);
  const events = db.getEvents().slice(0, 2);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* =========================================================================
          HERO PRINCIPAL — Bleu Marine & Blanc
          ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060] text-white border border-white/20 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase">
                  INSTITUT DES SCIENCES APPLIQUÉES ET DE LA TECHNOLOGIE
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-black text-[#002060] leading-[1.14] tracking-tight">
                CONSTRUISEZ LES COMPÉTENCES QUI FAÇONNENT <span className="underline decoration-[#002060]/30 underline-offset-8">VOTRE AVENIR</span>.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal max-w-2xl">
                Établissement d'enseignement supérieur d'excellence à <strong>Abidjan, Koumassi</strong>, ISATech allie formation rigoureuse, application pratique en laboratoire, culture technologique et préparation concrète au monde professionnel.
              </p>

              {/* Slogan Badge */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border-2 border-[#002060]/20 shadow-xs max-w-xl">
                <div className="w-10 h-10 rounded-xl bg-[#002060] text-white flex items-center justify-center font-black shrink-0">
                  ✦
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 italic">
                  « L’excellence demeure notre credo »
                  <span className="block text-[11px] text-slate-500 font-semibold not-italic mt-0.5">
                    Fondé le 06 septembre 2001 à Abidjan, Koumassi • Plus de 2000 diplômés formés
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/formations')}
                  className="px-6 py-3.5 rounded-xl text-sm font-black text-white bg-[#002060] hover:bg-[#001744] shadow-lg shadow-[#002060]/20 flex items-center justify-center gap-2 transition-all group"
                >
                  <span>DÉCOUVRIR NOS FORMATIONS</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                
                <button
                  onClick={() => onNavigate('/organigramme')}
                  className="px-4 py-3.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#002060] hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Network className="w-4 h-4 text-[#002060]" />
                  <span>Organigramme</span>
                </button>
              </div>

              {/* Fast Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#002060]" />
                  BTS d'État & Filières Homologuées
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#002060]" />
                  Site de Koumassi Moderne
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#002060]" />
                  2000+ Cadres & Techniciens Formés
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#002060] bg-slate-900 aspect-4/3 sm:aspect-5/4">
                  <img
                    src="D:\MES PROJETS\SITE WEB\ISATECH\dist\assets\téléchargement (1).jpg"
                    alt="Étudiants de l'école ISATech à Abidjan Koumassi"
                    className="w-full h-full object-cover object-center hover:scale-104 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002060]/85 via-transparent to-transparent" />

                  {/* Float tag on image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#002060] tracking-wider block">
                        Établissement d'Enseignement Supérieur
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        Laboratoires Informatiques & Salles Multimédias
                      </p>
                    </div>
                    <span className="text-xs font-black text-white bg-[#002060] px-3 py-1 rounded-xl">
                      8 Filières
                    </span>
                  </div>
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 bg-[#002060] text-white p-3.5 rounded-2xl shadow-xl border-2 border-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#002060] font-black flex items-center justify-center text-sm">
                    2001
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider block">
                      Fondation
                    </span>
                    <span className="text-xs font-extrabold text-white">
                      +20 ans d'histoire
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          INDICATEURS INSTITUTIONNELS
          2001 | 8 Filières | +20 ans | 2000+ Étudiants formés
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#002060] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
            {/* Stat 1: 2001 */}
            <div className="text-center pt-4 sm:pt-0 sm:px-4">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight block">
                2001
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
                Année de création
              </p>
              <span className="text-[11px] text-slate-300">
                06 septembre 2001
              </span>
            </div>

            {/* Stat 2: 8 */}
            <div className="text-center pt-4 sm:pt-0 sm:px-4">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight block">
                8
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
                Filières officielles
              </p>
              <span className="text-[11px] text-slate-300">
                Tertiaire & Technologie
              </span>
            </div>

            {/* Stat 3: +20 ans */}
            <div className="text-center pt-4 sm:pt-0 sm:px-4">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight block">
                +20 ans
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
                d'expérience
              </p>
              <span className="text-[11px] text-slate-300">
                Excellence académique
              </span>
            </div>

            {/* Stat 4: 2000+ Diplômés */}
            <div className="text-center pt-4 sm:pt-0 sm:px-4">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight block font-mono">
                2000+
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
                Diplômés formés
              </p>
              <span className="text-[11px] text-slate-300">
                Cadres & techniciens insérés
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION PRÉSENTATION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-sm">
          
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-3 py-1 rounded-full border border-[#002060]/20">
              Présentation Institutionnelle
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002060] leading-tight">
              PLUS QU’UNE FORMATION, UN PARCOURS VERS L’AVENIR.
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Créé le <strong>06 septembre 2001</strong> à Abidjan dans la commune de Koumassi, l'<strong>Institut des Sciences Appliquées et de la Technologie (ISATech)</strong> est un établissement d'enseignement supérieur d'excellence dédié à la formation professionnelle, tertiaire et technologique.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Avec plus de <strong>2000 diplômés formés</strong>, l'école met l'accent sur les savoirs fondamentaux, l'application pratique en laboratoire, la maîtrise des outils informatiques contemporains et l'encadrement humain de proximité.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-[#002060] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Expérience & Rigueur</h4>
                  <p className="text-[11px] text-slate-500">Plus de deux décennies de savoir-faire pédagogique.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <Laptop className="w-5 h-5 text-[#002060] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Laboratoires Équipés</h4>
                  <p className="text-[11px] text-slate-500">Parc informatique et réseau pour travaux pratiques.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('/a-propos')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-[#002060] hover:bg-[#001744] transition-all group"
              >
                <span>DÉCOUVRIR L'ÉTABLISSEMENT</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/organigramme')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[#002060] bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
              >
                <Network className="w-4 h-4 text-[#002060]" />
                <span>Voir l'organigramme</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md aspect-4/3">
              <img
                src="D:\MES PROJETS\SITE WEB\ISATECH\dist\assets\Gemini_Generated_Image_4z0jn04z0jn04z0j.jpg"
                alt="Locaux de l'école ISATech Koumassi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002060]/85 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-mono font-bold text-slate-200">ABIDJAN — KOUMASSI</p>
                <p className="text-sm font-bold">Un cadre rigoureux propice au travail et à la réussite</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION NOS FILIÈRES — Les 8 filières officielles
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-3 py-1 rounded-full border border-[#002060]/20">
              Formations BTS & Diplômes d'État
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002060]">
              NOS 8 FILIÈRES OFFICIELLES
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Découvrez les parcours proposés par l'Institut des Sciences Appliquées et de la Technologie et construisez votre projet professionnel.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/formations')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#002060] hover:underline"
          >
            <span>Voir toutes les filières</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8 Formations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {formations.map((f) => (
            <FormationCard
              key={f.code}
              formation={f}
              onSelect={(slug) => onNavigate(`/formations/${slug}`)}
              onApply={(code) => onNavigate(`/candidater?filiere=${code}`)}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION ORGANIGRAMME & GOUVERNANCE APERÇU
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#002060]">
                Organisation Interne
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#002060] mt-1">
                ORGANIGRAMME DU FONDATEUR AU CORPS PROFESSORAL
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/organigramme')}
              className="px-4 py-2 bg-[#002060] hover:bg-[#001744] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Network className="w-4 h-4" />
              <span>Consulter l'organigramme complet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-[#002060] block">Niveau 1</span>
              <h4 className="text-sm font-black text-slate-900">Le Fondateur</h4>
              <p className="text-xs text-slate-500">Présidence & Vision Institutionnelle</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-[#002060] block">Niveau 2</span>
              <h4 className="text-sm font-black text-slate-900">Direction Générale</h4>
              <p className="text-xs text-slate-500">Direction des Études & Secrétariat Général</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-[#002060] block">Niveau 4 & 5</span>
              <h4 className="text-sm font-black text-slate-900">Secrétariat & Professeurs</h4>
              <p className="text-xs text-slate-500">Accueil des élèves & Corps Enseignant</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION GALERIE PHOTO DE L'ÉCOLE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <PhotoGallery />
      </section>

      {/* =========================================================================
          CANDIDATURE BANNER — Bleu Marine & Blanc
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#002060] p-8 sm:p-12 text-white shadow-2xl border border-white/20">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Session d'Admission 2026-2027
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Prêt à intégrer l'excellence ISATech ?
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
                Rejoignez une communauté de plus de 2000 diplômés formés. Déposez votre dossier à l'administration<strong>ISATECH</strong>.
              </p>
            </div>

            
          </div>
        </div>
      </section>

    </div>
  );
};
