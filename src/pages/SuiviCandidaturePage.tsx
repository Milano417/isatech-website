import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  Upload, 
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail
} from 'lucide-react';
import { db } from '../services/db';
import { Application, ApplicationStatus } from '../types';

interface SuiviCandidaturePageProps {
  initialNumber?: string;
  onNavigate: (route: string) => void;
}

export const SuiviCandidaturePage: React.FC<SuiviCandidaturePageProps> = ({
  initialNumber,
  onNavigate
}) => {
  const [appNumberInput, setAppNumberInput] = useState(initialNumber || '');
  const [emailPhoneInput, setEmailPhoneInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundApp, setFoundApp] = useState<Application | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [docUploadSuccess, setDocUploadSuccess] = useState(false);

  useEffect(() => {
    if (initialNumber) {
      handleSearch(initialNumber);
    }
  }, [initialNumber]);

  const handleSearch = (numberToSearch?: string) => {
    const targetNumber = (numberToSearch || appNumberInput).trim().toUpperCase();
    if (!targetNumber) {
      setErrorMsg('Veuillez saisir votre numéro de dossier (ex: ISA-2026-004128).');
      return;
    }

    const app = db.getApplicationByNumber(targetNumber);
    setSearched(true);

    if (app) {
      // Optional check if email or phone provided
      if (emailPhoneInput.trim()) {
        const query = emailPhoneInput.trim().toLowerCase();
        const matches = app.email.toLowerCase().includes(query) || app.phone.includes(query);
        if (!matches) {
          setErrorMsg('L\'adresse email ou téléphone ne correspond pas au numéro de dossier indiqué.');
          setFoundApp(null);
          return;
        }
      }
      setFoundApp(app);
      setErrorMsg('');
    } else {
      setFoundApp(null);
      setErrorMsg(`Aucun dossier trouvé pour la référence "${targetNumber}". Vérifiez la saisie.`);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'RECUE':
        return {
          label: 'Reçue',
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          icon: Clock,
          color: 'text-blue-600'
        };
      case 'EN_COURS':
        return {
          label: 'En cours d\'étude',
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: AlertTriangle,
          color: 'text-amber-600'
        };
      case 'COMPLEMENT_REQUIS':
        return {
          label: 'Informations complémentaires requises',
          bg: 'bg-purple-100 text-purple-900 border-purple-300',
          icon: AlertTriangle,
          color: 'text-purple-600'
        };
      case 'ACCEPTEE':
        return {
          label: 'Candidature Acceptée',
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: CheckCircle2,
          color: 'text-emerald-600'
        };
      case 'REFUSEE':
        return {
          label: 'Non retenue',
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: XCircle,
          color: 'text-rose-600'
        };
    }
  };

  const handleAddComplement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !foundApp) return;

    foundApp.documents.push({
      id: 'doc-compl-' + Date.now(),
      type: 'Pièce complémentaire transmise',
      name: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : `${newDocName.trim()}.pdf`,
      size: '1.2 Mo',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'VERIFIE'
    });

    db.updateApplicationStatus(foundApp.id, 'EN_COURS', 'Pièce complémentaire reçue. Dossier remis en cours d\'instruction.');
    setDocUploadSuccess(true);
    setNewDocName('');
    setTimeout(() => setDocUploadSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
          <Clock className="w-3.5 h-3.5 text-[#002060]" />
          <span className="text-xs font-black uppercase tracking-wider">
            Portail des Admissions
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002060]">
          SUIVI DE VOTRE CANDIDATURE EN DIRECT
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Renseignez votre numéro de dossier format <strong>ISA-2026-XXXXXX</strong> pour vérifier l'avancement de votre admission auprès du secrétariat d'ISATech Koumassi.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Numéro de dossier *
            </label>
            <input
              type="text"
              value={appNumberInput}
              onChange={(e) => setAppNumberInput(e.target.value)}
              placeholder="Ex: ISA-2026-004128"
              className="w-full text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 uppercase focus:border-[#002060] focus:bg-white outline-hidden tracking-wider"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email ou téléphone (facultatif)
            </label>
            <input
              type="text"
              value={emailPhoneInput}
              onChange={(e) => setEmailPhoneInput(e.target.value)}
              placeholder="Vérification supplémentaire"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 focus:border-[#002060] focus:bg-white outline-hidden"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Quick tester pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span>Dossiers de test :</span>
            <button
              type="button"
              onClick={() => {
                setAppNumberInput('ISA-2026-004128');
                handleSearch('ISA-2026-004128');
              }}
              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-[#002060]/10 text-[#002060] font-mono font-bold text-[11px]"
            >
              ISA-2026-004128 (En cours)
            </button>
            <button
              type="button"
              onClick={() => {
                setAppNumberInput('ISA-2026-003892');
                handleSearch('ISA-2026-003892');
              }}
              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-emerald-100 text-emerald-900 font-mono font-bold text-[11px]"
            >
              ISA-2026-003892 (Acceptée)
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleSearch()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-white" />
            <span>CONSULTER MON DOSSIER</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Found Application Details */}
      {foundApp && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden animate-in fade-in duration-300">
          
          {/* Banner Status */}
          {(() => {
            const badge = getStatusBadge(foundApp.status);
            const Icon = badge.icon;
            return (
              <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${badge.bg}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                    <Icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                      Statut d'instruction
                    </span>
                    <h3 className="text-lg font-black">{badge.label}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-slate-800 bg-white/70 px-3 py-1 rounded-lg">
                    {foundApp.applicationNumber}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Mis à jour le {new Date(foundApp.updatedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Status explanation & Commission Notes */}
            {foundApp.statusNotes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#002060] block">
                  Avis & Remarques de la Commission Académique :
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                  {foundApp.statusNotes}
                </p>
              </div>
            )}

            {/* Applicant Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase">Candidat</span>
                <p className="font-black text-slate-900 text-sm">
                  {foundApp.firstName} {foundApp.lastName}
                </p>
                <p className="text-slate-500">{foundApp.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase">Filière postulé</span>
                <p className="font-black text-[#002060] text-sm font-mono">
                  {foundApp.formationCode}
                </p>
                <p className="text-slate-500">BTS d'État (2 ans)</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase">Parcours</span>
                <p className="font-bold text-slate-900">{foundApp.lastDiploma}</p>
                <p className="text-slate-500">Obtenu en {foundApp.graduationYear}</p>
              </div>
            </div>

            {/* Submitted Documents & Status */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#002060]" />
                <span>Pièces transmises au dossier ({foundApp.documents.length})</span>
              </h4>

              <div className="space-y-2">
                {foundApp.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="font-bold text-slate-900">{doc.name}</span>
                        <span className="text-slate-500 block text-[11px]">{doc.type}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                      Conforme
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* If Complement Requis, show Upload box */}
            {foundApp.status === 'COMPLEMENT_REQUIS' && (
              <form onSubmit={handleAddComplement} className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-purple-900">
                  <Upload className="w-4 h-4 text-purple-600" />
                  <span>Transmettre la pièce complémentaire demandée</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Nom du document (ex: Releve_Bac_Legalise.pdf)"
                    className="flex-1 text-xs bg-white border border-purple-200 rounded-xl px-3 py-2.5 outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shrink-0"
                  >
                    Téléverser le complément
                  </button>
                </div>
                {docUploadSuccess && (
                  <p className="text-xs text-emerald-700 font-bold">
                    ✓ Document transmis avec succès. Le statut passe en cours d'instruction.
                  </p>
                )}
              </form>
            )}

            {/* Contact reminder */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-800">Secrétariat académique ISATech</p>
                <p>Établissement d'Abidjan — Koumassi, Côte d'Ivoire</p>
              </div>
              <button
                onClick={() => onNavigate('/contact')}
                className="text-xs font-bold text-[#002060] hover:underline flex items-center gap-1"
              >
                <span>Contacter l'administration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
