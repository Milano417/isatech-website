import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  FileText, 
  Clock, 
  User, 
  Download, 
  Award, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  LogOut 
} from 'lucide-react';
import { 
  DEMO_STUDENT, 
  DEMO_STUDENT_GRADES, 
  DEMO_STUDENT_SCHEDULE 
} from '../services/db';

interface StudentPortalPageProps {
  onNavigate: (route: string) => void;
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'ACCUEIL' | 'NOTES' | 'EMPLOI_DU_TEMPS' | 'DOCUMENTS' | 'PAIEMENTS'>('ACCUEIL');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Calculate GPA / Moyenne générale
  const totalCoeff = DEMO_STUDENT_GRADES.reduce((acc, g) => acc + g.coefficient, 0);
  const totalPoints = DEMO_STUDENT_GRADES.reduce((acc, g) => acc + (g.grade * g.coefficient), 0);
  const averageGrade = (totalPoints / totalCoeff).toFixed(2);
  const totalCredits = DEMO_STUDENT_GRADES.reduce((acc, g) => acc + g.credits, 0);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#002060] text-white flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#002060]">Espace Étudiant ISATech</h1>
            <p className="text-xs text-slate-500 mt-1">Accédez à vos cours, notes et attestations officielles.</p>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              defaultValue="ISA-2025-IDA-042"
              placeholder="Matricule étudiant"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-hidden"
            />
            <input
              type="password"
              defaultValue="••••••••"
              placeholder="Mot de passe"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-hidden"
            />
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-3 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-black text-sm transition-all shadow-md"
            >
              Se Connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Top Banner Profile */}
      <div className="bg-[#002060] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white bg-slate-800 shrink-0">
            <img
              src={DEMO_STUDENT.avatar}
              alt={DEMO_STUDENT.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#002060]">
                Étudiant Actif
              </span>
              <span className="text-xs text-slate-200 font-mono">
                Matricule : {DEMO_STUDENT.matricule}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {DEMO_STUDENT.name}
            </h1>
            <p className="text-xs text-slate-300">
              Filière : <strong className="text-white">IDA (Informatique Développement d'Applications)</strong> • Année Académique 2025-2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
          <button
            onClick={() => onNavigate('/')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
          >
            Site Public
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-2 border-b border-slate-200 pb-2 scrollbar-none">
        {[
          { id: 'ACCUEIL', label: 'Accueil & Synthèse', icon: BookOpen },
          { id: 'NOTES', label: 'Notes & Relevé', icon: Award },
          { id: 'EMPLOI_DU_TEMPS', label: 'Emploi du Temps', icon: Calendar },
          { id: 'DOCUMENTS', label: 'Documents Administratifs', icon: FileText },
          { id: 'PAIEMENTS', label: 'Scolarité & Frais', icon: CreditCard }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#002060] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: ACCUEIL & SYNTHÈSE
          ========================================================================= */}
      {activeTab === 'ACCUEIL' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Moyenne Générale</span>
              <div className="text-2xl sm:text-3xl font-black text-[#002060] mt-1 font-mono">
                {averageGrade} <span className="text-xs text-slate-500 font-normal">/20</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">Mention Très Bien</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Crédits Validés</span>
              <div className="text-2xl sm:text-3xl font-black text-[#002060] mt-1 font-mono">
                {totalCredits} <span className="text-xs text-slate-500 font-normal">ECTS</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">Semestre 3 validé</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Taux d'Assiduité</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                98%
              </div>
              <span className="text-[10px] text-slate-500">2h d'absence justifiée</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Stage 2026</span>
              <div className="text-lg font-black text-[#002060] mt-2">
                Convention signée
              </div>
              <span className="text-[10px] text-blue-600 font-bold">Immersion 10 sem.</span>
            </div>
          </div>

          {/* Academic notifications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#002060] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#002060]" />
              Notifications & Annonces Pédagogiques
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#002060] mt-1.5 shrink-0" />
                <div>
                  <strong className="font-bold text-[#002060] block">Projet Web Framework Laravel — Date de soutenance intermédiaire</strong>
                  <p className="text-slate-600 text-xs mt-0.5">La remise des dépôts de code et la présentation des maquettes auront lieu le vendredi 17 octobre à 10h au Lab Info 1.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="font-bold text-slate-800 block">Conférence Métiers : DevOps et Sécurité du Cloud</strong>
                  <p className="text-slate-600 text-xs mt-0.5">Animée par un ingénieur senior invité ce mercredi à 14h en amphi central. Présence recommandée pour les promotions IDA et RIT.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: NOTES & RELEVÉ
          ========================================================================= */}
      {activeTab === 'NOTES' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-[#002060]">Relevé de Notes — Semestre 3 (IDA)</h2>
              <p className="text-xs text-slate-500">Moyenne générale calculée : <strong className="text-[#002060]">{averageGrade} / 20</strong></p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-[#002060] hover:bg-[#001744] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Télécharger le bulletin</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Matière / Module</th>
                  <th className="py-3 px-4 text-center">Coeff</th>
                  <th className="py-3 px-4 text-center">Crédits</th>
                  <th className="py-3 px-4 text-center">Note / 20</th>
                  <th className="py-3 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {DEMO_STUDENT_GRADES.map((g) => (
                  <tr key={g.code} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{g.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{g.courseName}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{g.coefficient}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{g.credits}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{g.grade.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: EMPLOI DU TEMPS
          ========================================================================= */}
      {activeTab === 'EMPLOI_DU_TEMPS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-[#002060]">Planning Hebdomadaire des Cours</h2>
            <p className="text-xs text-slate-500">Semaine en cours • Établissement ISATech Koumassi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_STUDENT_SCHEDULE.map((sch) => (
              <div
                key={sch.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-[#002060] transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="px-2 py-0.5 rounded-md bg-[#002060] text-white">
                    {sch.day}
                  </span>
                  <span className="font-mono text-[#002060] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {sch.time}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 pt-1">
                  {sch.subject}
                </h4>
                <div className="text-xs text-slate-500 space-y-0.5 pt-1 border-t border-slate-200/60">
                  <p>Enseignant : <strong className="text-slate-700">{sch.teacher}</strong></p>
                  <p>Lieu : <strong className="text-slate-700">{sch.room}</strong> ({sch.type})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: DOCUMENTS ADMINISTRATIFS
          ========================================================================= */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-[#002060]">Documents Administratifs & Attestations</h2>
            <p className="text-xs text-slate-500">Téléchargez vos pièces officielles avec cachet académique ISATech.</p>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Certificat de Scolarité 2025-2026', desc: 'Atteste de votre inscription régulière en 2e année IDA.', file: 'Certificat_Scolarite_ISA2025.pdf' },
              { title: 'Attestation d\'Inscription Officielle', desc: 'Document officiel pour la prise en charge ou démarches administratives.', file: 'Attestation_Inscription_Koffi.pdf' },
              { title: 'Convention de Stage en Entreprise', desc: 'Formulaire tripartite obligatoire pour le stage de fin de cycle BTS.', file: 'Convention_Stage_ISATech.pdf' },
              { title: 'Règlement Intérieur & Charte de l\'Établissement', desc: 'Règles de discipline, assiduité et respect des locaux.', file: 'Reglement_Interieur_ISATech.pdf' }
            ].map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#002060] border border-slate-200 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.title}</span>
                    <span className="text-xs text-slate-500">{doc.desc}</span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Téléchargement de ${doc.file} lancé.`)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-[#002060]" />
                  <span className="hidden sm:inline">Télécharger</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: PAIEMENTS & SCOLARITÉ
          ========================================================================= */}
      {activeTab === 'PAIEMENTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-[#002060]">Situation des Frais de Scolarité</h2>
            <p className="text-xs text-slate-500">Architecture prête pour le suivi comptable des échéances.</p>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block font-bold">Situation en règle pour le semestre en cours</strong>
              Tous les versements de la tranche 1 et 2 sont validés auprès de la comptabilité d'ISATech.
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Les reçus physiques de caisse demeurent disponibles au service comptabilité de l'établissement à Koumassi.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
