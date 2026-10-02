import React from 'react';
import { Organigramme } from '../components/institution/Organigramme';
import { ShieldCheck, Network, Award, Users } from 'lucide-react';

interface OrganigrammePageProps {
  onNavigate: (route: string) => void;
}

export const OrganigrammePage: React.FC<OrganigrammePageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
          <Network className="w-3.5 h-3.5 text-[#002060]" />
          <span className="text-xs font-black uppercase tracking-wider">
            Gouvernance de l'Établissement
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
          ORGANIGRAMME DE DIRECTION & PÉDAGOGIQUE
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Découvrez la chaîne hiérarchique et organisationnelle d'ISATech, du Fondateur et de la Direction Générale aux Responsables Pédagogiques, au Secrétariat et aux Professeurs.
        </p>
      </div>

      {/* Main Interactive Organigramme Tree */}
      <div className="bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
        <Organigramme />
      </div>

      {/* Governance Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#002060]/10 text-[#002060] flex items-center justify-center mx-auto font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Leadership Pédagogique</h3>
          <p className="text-xs text-slate-500">Supervision stricte des programmes conformes au Ministère de l'Enseignement Supérieur.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#002060]/10 text-[#002060] flex items-center justify-center mx-auto font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Accueil & Écoute</h3>
          <p className="text-xs text-slate-500">Un secrétariat attentif et disponible pour guider étudiants et parents à Koumassi.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#002060]/10 text-[#002060] flex items-center justify-center mx-auto font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Rigueur & Discipline</h3>
          <p className="text-xs text-slate-500">Une éthique d'excellence appliquée depuis le 06 septembre 2001.</p>
        </div>
      </div>
    </div>
  );
};
