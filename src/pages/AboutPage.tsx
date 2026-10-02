import React from 'react';
import { 
  Building2, 
  Target, 
  Compass, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight,
  Network
} from 'lucide-react';
import { Organigramme } from '../components/institution/Organigramme';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const VALUES = [
    {
      title: 'Excellence',
      description: 'L\'exigence de la qualité pédagogique, de la maîtrise technique et de la rigueur intellectuelle dans tous nos enseignements.',
      icon: Award
    },
    {
      title: 'Discipline',
      description: 'Le respect des règles de vie en communauté, de l\'assiduité et de l\'éthique personnelle pour forger des citoyens et techniciens responsables.',
      icon: ShieldCheck
    },
    {
      title: 'Innovation',
      description: 'L\'adaptation constante de nos cursus aux évolutions des sciences appliquées, des technologies numériques et des besoins économiques.',
      icon: Sparkles
    },
    {
      title: 'Professionnalisme',
      description: 'Une posture d\'immersion professionnelle dès le premier jour : ponctualité, rigueur d\'expression, tenues réglementaires et esprit d\'équipe.',
      icon: Target
    },
    {
      title: 'Responsabilité',
      description: 'L\'engagement civique et sociétal de nos étudiants au service du développement économique de la Côte d\'Ivoire.',
      icon: Building2
    },
    {
      title: 'Intégrité',
      description: 'L\'honnêteté intellectuelle, la transparence et le respect mutuel au cœur de la relation étudiants-enseignants.',
      icon: Compass
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-white py-12 lg:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060] text-white">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Institution & Gouvernance
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
            NOTRE HISTOIRE & NOTRE MISSION
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Institut des Sciences Appliquées et de la Technologie (ISATech) — Établissement d'enseignement supérieur d'excellence fondé le 06 septembre 2001 à Abidjan, Koumassi.
          </p>
        </div>
      </section>

      {/* =========================================================================
          NOTRE HISTOIRE — 06 septembre 2001 & 2000+ diplômés
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#002060]">
              <Calendar className="w-4 h-4 text-[#002060]" />
              <span>Création officielle : 06 septembre 2001</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002060] leading-tight">
              DEUX DÉCENNIES AU SERVICE DES SCIENCES APPLIQUÉES ET DU PROGRÈS.
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Créé le <strong>06 septembre 2001</strong> au cœur de la commune de Koumassi à Abidjan, l'<strong>Institut des Sciences Appliquées et de la Technologie (ISATech)</strong> est né de la volonté de son Fondateur de doter la jeunesse d'une formation supérieure solide, axée sur l'application concrète des sciences, de la gestion et des technologies numériques.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Depuis sa création, l'établissement a formé et diplômé <strong>plus de 2000 étudiants</strong>, désormais en activité dans les entreprises privées, cabinets d'audit, sociétés de télécoms et administrations publiques de Côte d'Ivoire.
            </p>

            <div className="p-4 bg-white rounded-2xl border-2 border-[#002060]/20 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#002060] text-white flex items-center justify-center font-black text-xl shrink-0 font-mono">
                2000+
              </div>
              <div className="text-xs sm:text-sm text-slate-700 font-medium">
                <strong>Plus de 2000 diplômés formés</strong> avec succès dans les 8 filières d'État préparant au BTS et licences professionnelles.
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-[#002060] bg-slate-900 aspect-4/3 sm:aspect-5/4">
              <img
                src="/images/Gemini_Generated_Image_4z0jn04z0jn04z0j.jpg"
                alt="Locaux de l'école ISATech Koumassi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          NOTRE VISION & NOTRE MISSION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#002060] text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#002060]">
              Notre Vision
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Devenir une institution de référence en Côte d'Ivoire dans l'enseignement supérieur appliqué, capable de former des diplômés directement opérationnels, éthiques, méthodiques et moteurs des transformations technologiques et managériales de leurs entreprises.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#002060] text-[#002060] flex items-center justify-center shadow-md">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#002060]">
              Notre Mission
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Délivrer à chaque apprenant une formation de haut niveau associant cours théoriques exigeants, mise en situation en laboratoire informatique, rigueur comportementale et stages obligatoires en entreprise, tout en garantissant un encadrement administratif de proximité.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          ORGANIGRAMME OFFICIEL INTÉGRÉ
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
        <Organigramme />
      </section>

      {/* =========================================================================
          SLOGAN INSTITUTIONNEL
          « L’excellence demeure notre credo »
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#002060] p-8 sm:p-14 text-center text-white border border-white/20 shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-slate-300">
              NOTRE DEVISE OFFICIELLE
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-serif italic">
              « L’excellence demeure notre credo »
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Plus qu'un slogan, cette devise oriente l'exigence de notre corps professoral, la rigueur de notre secrétariat et l'ambition de chaque promotion formée depuis 2001.
            </p>

            <div className="pt-2 flex justify-center">
              <div className="w-16 h-1 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          NOS VALEURS FONDAMENTALES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-3 py-1 rounded-full border border-[#002060]/20">
            Piliers Institutionnels
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002060]">
            NOS 6 VALEURS FONDAMENTALES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#002060] transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#002060]/10 text-[#002060] flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
