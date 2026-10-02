import React, { useState } from 'react';
import { 
  Crown, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  UserCheck, 
  ChevronDown, 
  ChevronRight, 
  Users,
  ShieldCheck,
  Building2,
  Mail,
  Award
} from 'lucide-react';
import { db } from '../../services/db';
import { StaffMember } from '../../types';

export const Organigramme: React.FC = () => {
  const staff = db.getStaff();
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

  const fondateur = staff.find(s => s.level === 'FONDATEUR');
  const directions = staff.filter(s => s.level === 'DIRECTION');
  const pedagogie = staff.filter(s => s.level === 'PEDAGOGIE');
  const secretariat = staff.filter(s => s.level === 'SECRETARIAT');
  const professeurs = staff.filter(s => s.level === 'PROFESSEURS');

  return (
    <div className="space-y-12">
      {/* Introduction text */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-3 py-1 rounded-full border border-[#002060]/20">
          Structure Organisationnelle
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#002060]">
          ORGANIGRAMME OFFICIEL D'ISATECH
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          De la présidence fondatrice au corps professoral et au secrétariat, découvrez la gouvernance de l'établissement.
        </p>
      </div>

      {/* Visual Hierarchy Tree */}
      <div className="relative max-w-5xl mx-auto space-y-10">

        {/* NIVEAU 1: FONDATEUR */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#002060] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Niveau 1 — Haute Présidence
            </span>
          </div>

          {fondateur && (
            <div 
              onClick={() => setSelectedMember(fondateur)}
              className="group relative bg-[#002060] text-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-xl border-2 border-white/20 hover:scale-102 transition-all cursor-pointer text-center"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border-2 border-white mb-3 shadow-md">
                <img src={fondateur.image} alt={fondateur.name} className="w-full h-full object-cover" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-[#002060] text-[10px] font-black uppercase tracking-wider mb-2">
                <Crown className="w-3.5 h-3.5" />
                Fondateur de l'école (2001)
              </div>
              <h3 className="text-lg font-black text-white">{fondateur.name}</h3>
              <p className="text-xs text-slate-200 font-semibold mt-0.5">{fondateur.role}</p>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                {fondateur.biography}
              </p>
            </div>
          )}

          {/* Vertical connecting line */}
          <div className="w-0.5 h-10 bg-[#002060]/40 my-1" />
        </div>

        {/* NIVEAU 2: DIRECTION GÉNÉRALE & DIRECTION DES ÉTUDES */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#002060] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Niveau 2 — Direction Générale & Secrétariat Général
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {directions.map((dir) => (
              <div
                key={dir.id}
                onClick={() => setSelectedMember(dir)}
                className="bg-white rounded-2xl p-5 border-2 border-[#002060]/20 hover:border-[#002060] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={dir.image} alt={dir.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#002060] tracking-wider block">
                    {dir.department}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#002060]">{dir.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{dir.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Vertical connecting line */}
          <div className="w-0.5 h-10 bg-[#002060]/40 mx-auto" />
        </div>

        {/* NIVEAU 3: RESPONSABLES PÉDAGOGIQUES */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#002060] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Niveau 3 — Responsables Pédagogiques des Filières
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pedagogie.map((ped) => (
              <div
                key={ped.id}
                onClick={() => setSelectedMember(ped)}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#002060] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={ped.image} alt={ped.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#002060] tracking-wider block">
                    {ped.department}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#002060]">{ped.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{ped.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Vertical connecting line */}
          <div className="w-0.5 h-10 bg-[#002060]/40 mx-auto" />
        </div>

        {/* NIVEAU 4: SECRÉTARIAT DE DIRECTION & ACCUEIL */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#002060] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Niveau 4 — Secrétariat & Accueil Administratif
            </span>
          </div>

          <div className="max-w-md mx-auto">
            {secretariat.map((sec) => (
              <div
                key={sec.id}
                onClick={() => setSelectedMember(sec)}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#002060] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={sec.image} alt={sec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#002060] tracking-wider block">
                    {sec.department}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#002060]">{sec.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{sec.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Vertical connecting line */}
          <div className="w-0.5 h-10 bg-[#002060]/40 mx-auto" />
        </div>

        {/* NIVEAU 5: CORPS PROFESSORAL / ENSEIGNANTS */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#002060] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Niveau 5 — Corps Professoral & Enseignants Référents
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {professeurs.map((prof) => (
              <div
                key={prof.id}
                onClick={() => setSelectedMember(prof)}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-[#002060] shadow-xs hover:shadow-md transition-all cursor-pointer text-center group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden mx-auto border border-slate-200 mb-2">
                  <img src={prof.image} alt={prof.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[9px] font-black uppercase text-[#002060] tracking-wider block">
                  {prof.department}
                </span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#002060] mt-0.5">{prof.name}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{prof.role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#002060] shrink-0">
                  <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#002060] tracking-wider">
                    {selectedMember.department}
                  </span>
                  <h3 className="text-base font-black text-slate-900">{selectedMember.name}</h3>
                  <p className="text-xs font-semibold text-[#002060]">{selectedMember.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedMember.biography}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>ISATech Abidjan — Koumassi</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Actif
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
