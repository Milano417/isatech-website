import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2, 
  Briefcase, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Share2, 
  HelpCircle 
} from 'lucide-react';
import { db } from '../services/db';

interface FormationDetailPageProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const FormationDetailPage: React.FC<FormationDetailPageProps> = ({
  slug,
  onNavigate
}) => {
  const formation = db.getFormationBySlug(slug) || db.getFormationByCode(slug);
  const [openSemesters, setOpenSemesters] = useState<Record<number, boolean>>({
    0: true, // first semester open by default
    1: false,
    2: false,
    3: false
  });
  const [copied, setCopied] = useState(false);

  if (!formation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Formation introuvable</h2>
        <p className="text-slate-600">La filière demandée n'existe pas ou a été modifiée.</p>
        <button
          onClick={() => onNavigate('/formations')}
          className="px-5 py-2.5 bg-[#0B1F33] text-white font-bold rounded-xl text-sm"
        >
          Retour aux formations
        </button>
      </div>
    );
  }

  const toggleSemester = (index: number) => {
    setOpenSemesters(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${formation.code} - ${formation.name} | ISATech`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Top Breadcrumb navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => onNavigate('/formations')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B1F33] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue des 8 filières</span>
        </button>
      </div>

      {/* =========================================================================
          HERO DE LA FILIÈRE
          ========================================================================= */}
      <section className="relative bg-[#002060] text-white overflow-hidden py-12 lg:py-20 border-b border-white/10">
        {/* Background glow and image preview */}
        <div className="absolute inset-0 opacity-15 overflow-hidden">
          <img
            src={formation.image}
            alt={formation.name}
            className="w-full h-full object-cover blur-sm"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#002060] via-[#002060]/95 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Header info */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg bg-white text-[#002060] text-sm font-black tracking-wider font-mono shadow-md">
                  {formation.code}
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                  {formation.category}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  BTS d'État Homologué
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {formation.name}
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-3xl">
                {formation.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate(`/candidater?filiere=${formation.code}`)}
                  className="px-6 py-3.5 rounded-xl text-sm font-extrabold text-[#002060] bg-white hover:bg-slate-100 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#002060]" />
                  <span>CANDIDATER À CETTE FORMATION</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-3.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copied ? 'Lien copié !' : 'Partager'}</span>
                </button>
              </div>
            </div>

            {/* Right Card preview */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 lg:aspect-auto lg:h-72">
                <img
                  src={formation.image}
                  alt={formation.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          INFORMATIONS CLÉS (Section 23)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Code Filière
            </span>
            <span className="text-sm sm:text-base font-black text-[#0B1F33] font-mono">
              {formation.code}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Niveau Diplôme
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0B1F33]">
              {formation.level}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Durée du cycle
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0B1F33]">
              {formation.duration}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Localisation
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0B1F33]">
              {formation.location}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Effectif par promotion
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-500 italic">
              [À COMPLÉTER]
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Objectives, Skills, Program */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Objectifs pédagogiques */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-[#002060] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#002060]" />
              Objectifs de la Formation
            </h2>
            <div className="space-y-2.5">
              {formation.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#002060] shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed">{obj}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Compétences visées */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-[#002060] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#002060]" />
              Compétences Clés Développées
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {formation.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-800 text-xs sm:text-sm font-bold hover:bg-[#002060]/10 hover:border-[#002060]/40 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Programme des études (Accordéons par semestre) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#002060] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#002060]" />
                Programme Académique & Modules
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                4 Semestres (2 ans)
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {formation.program.map((sem, idx) => {
                const isOpen = openSemesters[idx];
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleSemester(idx)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                    >
                      <span className="font-bold text-sm text-[#002060]">
                        {sem.semester}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white border-t border-slate-200 space-y-2 text-xs sm:text-sm">
                        {sem.modules.map((mod, mIdx) => (
                          <div key={mIdx} className="flex items-start gap-2.5 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#002060] mt-2 shrink-0" />
                            <span>{mod}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Opportunities & Admission Conditions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Débouchés professionnels */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-[#002060] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#002060]" />
              Débouchés & Métiers
            </h3>
            <p className="text-xs text-slate-500">
              Métiers préparés dès l'obtention du diplôme ou après une poursuite d'études :
            </p>
            <div className="space-y-2">
              {formation.opportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{opp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions d'admission */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-[#002060] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#002060]" />
              Conditions d'Admission
            </h3>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              {formation.admissionRequirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#002060] font-bold">•</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
              <p>Frais d'inscription & scolarité : <span className="font-semibold text-slate-800">[À COMPLÉTER auprès du secrétariat]</span></p>
            </div>
          </div>

          {/* Candidature Direct Card */}
          <div className="bg-[#002060] text-white p-6 rounded-2xl space-y-4 border border-slate-800 shadow-md">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-200">
              Rejoindre la promotion 2026
            </span>
            <h4 className="text-base font-extrabold text-white">
              Candidature en ligne en 5 étapes
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Préparez votre pièce d'identité et votre attestation de Baccalauréat pour postuler en quelques minutes.
            </p>
            <button
              onClick={() => onNavigate(`/candidater?filiere=${formation.code}`)}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-[#002060] font-black text-xs sm:text-sm transition-all shadow-md"
            >
              POSTULER EN {formation.code}
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================================
          BOTTOM CTA (Section 23)
          "PRÊT À REJOINDRE ISATECH ?" - Bouton: "DÉPOSER MA CANDIDATURE"
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#002060] text-white p-8 sm:p-12 rounded-3xl text-center space-y-5 border border-white/20 shadow-xl">
          <span className="text-xs font-black uppercase tracking-wider text-slate-200">
            « L’excellence demeure notre credo »
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            PRÊT À REJOINDRE ISATECH ?
          </h2>
          <p className="text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
            Construisez dès aujourd'hui les compétences qui façonneront votre avenir professionnel avec la filière <strong>{formation.name}</strong>.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => onNavigate(`/candidater?filiere=${formation.code}`)}
              className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-[#002060] font-black text-sm sm:text-base transition-all shadow-xl active:scale-95"
            >
              DÉPOSER MA CANDIDATURE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
