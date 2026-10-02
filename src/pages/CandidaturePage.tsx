import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  FileText, 
  User, 
  GraduationCap, 
  Layers, 
  CheckCircle2, 
  Printer, 
  Download, 
  ShieldCheck, 
  Sparkles,
  Clock
} from 'lucide-react';
import { db } from '../services/db';
import { Application, ApplicationDocument } from '../types';

interface CandidaturePageProps {
  initialFiliere?: string;
  onNavigate: (route: string) => void;
}

export const CandidaturePage: React.FC<CandidaturePageProps> = ({
  initialFiliere,
  onNavigate
}) => {
  const [step, setStep] = useState(1);
  const formations = db.getFormations();

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Identité
    lastName: '',
    firstName: '',
    birthDate: '',
    gender: 'M' as 'M' | 'F',
    phone: '',
    email: '',
    address: '',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',

    // Step 2: Parcours
    lastDiploma: 'Baccalauréat Série D',
    graduationYear: '2025',
    previousSchool: '',

    // Step 3: Formation
    formationCode: initialFiliere || 'IDA',

    // Step 4: Documents (Simulated uploaded files)
    documents: [
      { id: 'doc-cni', type: 'Pièce d\'identité (CNI/Passeport)', name: 'CNI_candidat.pdf', size: '1.4 Mo', uploadDate: new Date().toISOString().split('T')[0], status: 'VERIFIE' as const },
      { id: 'doc-bac', type: 'Attestation / Diplôme du Bac', name: 'Attestation_BAC.pdf', size: '2.1 Mo', uploadDate: new Date().toISOString().split('T')[0], status: 'VERIFIE' as const }
    ] as ApplicationDocument[]
  });

  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadNameInput, setUploadNameInput] = useState('');
  const [uploadTypeSelect, setUploadTypeSelect] = useState('Relevé de notes officiel');

  useEffect(() => {
    if (initialFiliere) {
      setFormData(prev => ({ ...prev, formationCode: initialFiliere.toUpperCase() }));
    }
  }, [initialFiliere]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadNameInput.trim()) return;

    const newDoc: ApplicationDocument = {
      id: 'doc-' + Date.now(),
      type: uploadTypeSelect,
      name: uploadNameInput.trim().endsWith('.pdf') ? uploadNameInput.trim() : `${uploadNameInput.trim()}.pdf`,
      size: `${(Math.random() * 2 + 0.8).toFixed(1)} Mo`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'VERIFIE'
    };

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));
    setUploadNameInput('');
  };

  const handleRemoveDoc = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = db.createApplication({
        firstName: formData.firstName || 'Candidat',
        lastName: formData.lastName || 'ISATech',
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate || '2005-01-01',
        gender: formData.gender,
        address: formData.address || 'Koumassi',
        city: formData.city || 'Abidjan',
        country: formData.country || 'Côte d\'Ivoire',
        lastDiploma: formData.lastDiploma,
        graduationYear: formData.graduationYear,
        previousSchool: formData.previousSchool || 'Établissement secondaire',
        formationCode: formData.formationCode,
        documents: formData.documents
      });

      setSubmittedApp(created);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  // SUCCESS SCREEN
  if (submittedApp) {
    const chosenFormation = formations.find(f => f.code === submittedApp.formationCode);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20 space-y-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-3 py-1 rounded-full border border-[#002060]/20">
              Confirmation d'Enregistrement
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#002060]">
              Votre candidature a bien été enregistrée.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Un dossier a été créé avec succès auprès du secrétariat d'ISATech Koumassi.
            </p>
          </div>

          {/* Official Reference Number Box */}
          <div className="bg-slate-50 border-2 border-dashed border-[#002060]/60 rounded-2xl p-5 max-w-md mx-auto space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
              Numéro Unique de Dossier
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#002060] font-mono tracking-wider selection:bg-[#002060] selection:text-white">
              {submittedApp.applicationNumber}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Conservez précieusement ce numéro pour consulter l'état de votre admission.
            </p>
          </div>

          {/* Summary Details */}
          <div className="bg-slate-50 rounded-2xl p-5 text-left text-xs sm:text-sm text-slate-700 space-y-2 border border-slate-100">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Candidat :</span>
              <span className="font-bold text-slate-900">{submittedApp.firstName} {submittedApp.lastName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Filière choisie :</span>
              <span className="font-bold text-[#002060]">{submittedApp.formationCode} — {chosenFormation?.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Email & Téléphone :</span>
              <span className="font-medium text-slate-900">{submittedApp.email} | {submittedApp.phone}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-semibold">Statut initial :</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#002060] text-white">
                Reçue
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate(`/suivi-candidature?numero=${submittedApp.applicationNumber}`)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Accéder au suivi en direct</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2 border border-slate-200"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimer le récépissé</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MULTI-STEP APPLICATION FORM
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-3 py-1 rounded-full border border-[#002060]/20">
          Session 2026-2027
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002060]">
          FORMULAIRE DE CANDIDATURE EN LIGNE
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Complétez les 5 étapes pour postuler à l'Institut des Sciences Appliquées et de la Technologie.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
          {[
            { n: 1, title: 'Identité' },
            { n: 2, title: 'Parcours' },
            { n: 3, title: 'Formation' },
            { n: 4, title: 'Documents' },
            { n: 5, title: 'Confirmation' }
          ].map((s) => {
            const isCompleted = step > s.n;
            const isCurrent = step === s.n;
            return (
              <div key={s.n} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#002060] text-white ring-4 ring-[#002060]/20 font-black'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.n}
                </div>
                <span className={`text-[10px] sm:text-xs mt-1.5 font-bold truncate max-w-full ${
                  isCurrent ? 'text-[#002060]' : 'text-slate-400'
                }`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
        
        {/* =========================================================================
            ÉTAPE 1 — IDENTITÉ
            ========================================================================= */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-[#002060] flex items-center gap-2">
                <User className="w-5 h-5 text-[#002060]" />
                Étape 1 — Identité du Candidat
              </h2>
              <p className="text-xs text-slate-500">Renseignez vos coordonnées exactes d'état civil.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom de famille *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Ex: KOUASSI"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prénoms *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Ex: Jean-Eudes"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date de naissance *</label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sexe *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'M' | 'F')}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                >
                  <option value="M">Masculin (M)</option>
                  <option value="F">Féminin (F)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone (WhatsApp souhaité) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ex: +225 07 00 00 00 00"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Ex: jean.kouassi@email.com"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse géographique de résidence *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Ex: Koumassi Remblais, Boulevard du 07 Décembre"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pays</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (!formData.lastName || !formData.firstName || !formData.email || !formData.phone) {
                    alert('Veuillez remplir les champs obligatoires (Nom, Prénoms, Email, Téléphone).');
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-bold text-sm inline-flex items-center gap-2 transition-all shadow-md"
              >
                <span>Étape suivante : Parcours</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            ÉTAPE 2 — PARCOURS ACADÉMIQUE
            ========================================================================= */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-[#002060] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#002060]" />
                Étape 2 — Parcours & Diplômes Précédents
              </h2>
              <p className="text-xs text-slate-500">Précisez vos antécédents scolaires et le baccalauréat obtenu.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dernier diplôme préparé ou obtenu *</label>
                <select
                  value={formData.lastDiploma}
                  onChange={(e) => handleInputChange('lastDiploma', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                >
                  <option value="Baccalauréat Général (Série A, C, D)">Baccalauréat Général (Série A, C, D)</option>
                  <option value="Baccalauréat Technique (Série G2, E, F)">Baccalauréat Technique (Série G2, E, F)</option>
                  <option value="BT (Brevet de Technicien)">BT (Brevet de Technicien)</option>
                  <option value="Autre équivalent étranger">Autre équivalent étranger</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Année d'obtention *</label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Établissement ou Lycée d'origine *</label>
                  <input
                    type="text"
                    required
                    value={formData.previousSchool}
                    onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                    placeholder="Ex: Lycée Municipal de Koumassi"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!formData.previousSchool) {
                    alert('Veuillez renseigner votre établissement d\'origine.');
                    return;
                  }
                  setStep(3);
                }}
                className="px-6 py-3 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-bold text-sm inline-flex items-center gap-2 transition-all shadow-md"
              >
                <span>Étape suivante : Choix de la filière</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            ÉTAPE 3 — CHOIX DE LA FORMATION (Les 8 filières officielles)
            ========================================================================= */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-[#002060] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#002060]" />
                Étape 3 — Sélection de la Filière
              </h2>
              <p className="text-xs text-slate-500">Sélectionnez la formation pour laquelle vous postulez à ISATech.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formations.map((f) => {
                const isSelected = formData.formationCode === f.code;
                return (
                  <div
                    key={f.code}
                    onClick={() => handleInputChange('formationCode', f.code)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#002060] bg-slate-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-md bg-[#002060] text-white">
                        {f.code}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#002060] text-white flex items-center justify-center text-xs font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 mt-2">
                      {f.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {f.category}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-bold text-sm inline-flex items-center gap-2 transition-all shadow-md"
              >
                <span>Étape suivante : Téléversement documents</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            ÉTAPE 4 — DOCUMENTS JUSTIFICATIFS
            ========================================================================= */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-[#002060] flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#002060]" />
                Étape 4 — Documents Justificatifs
              </h2>
              <p className="text-xs text-slate-500">
                Ajoutez les fichiers nécessaires à l'instruction de votre dossier (CNI, attestation de Bac, relevé).
              </p>
            </div>

            {/* Current files list */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Fichiers prêts pour votre dossier ({formData.documents.length})
              </h3>
              {formData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#002060]" />
                    <div>
                      <span className="font-bold text-slate-900 block">{doc.name}</span>
                      <span className="text-[11px] text-slate-500">{doc.type} • {doc.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Prêt
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload simulator bar */}
            <form onSubmit={handleAddDocument} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-[#002060] block">
                Ajouter un document complémentaire :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <select
                  value={uploadTypeSelect}
                  onChange={(e) => setUploadTypeSelect(e.target.value)}
                  className="sm:col-span-5 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 outline-hidden"
                >
                  <option value="Relevé de notes officiel">Relevé de notes officiel</option>
                  <option value="Pièce d'identité">Pièce d'identité</option>
                  <option value="Attestation de Bac">Attestation de Bac</option>
                  <option value="Photo d'identité">Photo d'identité</option>
                  <option value="Certificat de scolarité">Certificat de scolarité</option>
                  <option value="Autre document">Autre document</option>
                </select>

                <input
                  type="text"
                  value={uploadNameInput}
                  onChange={(e) => setUploadNameInput(e.target.value)}
                  placeholder="Nom du fichier (ex: Releve_Bac_2025.pdf)"
                  className="sm:col-span-5 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 outline-hidden"
                />

                <button
                  type="submit"
                  className="sm:col-span-2 text-xs font-bold bg-[#002060] hover:bg-[#001744] text-white rounded-xl px-3 py-2 transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-3 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-bold text-sm inline-flex items-center gap-2 transition-all shadow-md"
              >
                <span>Étape suivante : Récapitulatif</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            ÉTAPE 5 — CONFIRMATION & RÉCAPITULATIF (Section 26)
            ========================================================================= */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-[#002060] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#002060]" />
                Étape 5 — Récapitulatif & Validation Définitive
              </h2>
              <p className="text-xs text-slate-500">Vérifiez les données avant la transmission au secrétariat ISATech.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-[11px] font-black uppercase text-[#002060] tracking-wider block">
                  Identité
                </span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {formData.lastName} {formData.firstName} ({formData.gender})
                </p>
                <p className="text-slate-600">
                  Né(e) le {formData.birthDate || 'Non spécifié'} • {formData.address}, {formData.city}, {formData.country}
                </p>
                <p className="text-slate-600">
                  Email : {formData.email} • Téléphone : {formData.phone}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-black uppercase text-[#002060] tracking-wider block">
                  Formation Choisie
                </span>
                <p className="font-black text-[#002060] text-base mt-0.5">
                  {formData.formationCode} — {formations.find(f => f.code === formData.formationCode)?.name}
                </p>
                <p className="text-slate-600 text-xs">
                  {formations.find(f => f.code === formData.formationCode)?.category} • BTS d'État (2 ans)
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-black uppercase text-[#002060] tracking-wider block">
                  Parcours Scolaire
                </span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {formData.lastDiploma} (Obtenu en {formData.graduationYear})
                </p>
                <p className="text-slate-600 text-xs">
                  Établissement précédent : {formData.previousSchool}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-black uppercase text-[#002060] tracking-wider block">
                  Documents ({formData.documents.length})
                </span>
                <p className="text-slate-700 text-xs">
                  {formData.documents.map(d => d.name).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                En soumettant ce formulaire, j'atteste sur l'honneur l'exactitude des renseignements fournis.
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Modifier</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-black text-sm shadow-xl transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Transmission en cours...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-white" />
                    <span>ENVOYER MA CANDIDATURE</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
