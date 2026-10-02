import React, { useState } from 'react';
import { Organigramme } from '../components/institution/Organigramme';
import { Users, Award, Mail, BookOpen, ShieldCheck, Network } from 'lucide-react';
import { db } from '../services/db';

interface EquipePageProps {
  onNavigate: (route: string) => void;
}

export const EquipePage: React.FC<EquipePageProps> = ({ onNavigate }) => {
  const staff = db.getStaff();
  const [viewMode, setViewMode] = useState<'ORGANIGRAMME' | 'TROMPINOSCOPE'>('ORGANIGRAMME');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
          <Users className="w-3.5 h-3.5 text-[#002060]" />
          <span className="text-xs font-black uppercase tracking-wider">
            Gouvernance & Corps Professoral
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
          L'ÉQUIPE D'ISATECH
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Du Fondateur à la direction des études, aux responsables pédagogiques, au secrétariat et aux professeurs référents des 8 filières.
        </p>

        {/* View mode toggle */}
        <div className="pt-2 flex justify-center gap-2">
          <button
            onClick={() => setViewMode('ORGANIGRAMME')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'ORGANIGRAMME'
                ? 'bg-[#002060] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Vue Organigramme Hiérarchique</span>
          </button>

          <button
            onClick={() => setViewMode('TROMPINOSCOPE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'TROMPINOSCOPE'
                ? 'bg-[#002060] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Vue Trombinoscope</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'ORGANIGRAMME' ? (
        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
          <Organigramme />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-[#002060] hover:shadow-lg transition-all flex flex-col group"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002060]/90 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-white text-[#002060]">
                  {member.department}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#002060]">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2 line-clamp-3">
                    {member.biography}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>ISATech Koumassi</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Actif
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Spontaneous Application */}
      <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="text-xl font-black text-[#002060]">
          Rejoindre le corps enseignant d'ISATech
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Vous êtes enseignant certifié, ingénieur ou expert d'entreprise dans les filières informatiques, comptables ou tertiaires ? Faites parvenir votre candidature à la direction des études.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="px-6 py-3 rounded-xl bg-[#002060] hover:bg-[#001744] text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
        >
          Contacter la direction pédagogique
        </button>
      </div>
    </div>
  );
};
