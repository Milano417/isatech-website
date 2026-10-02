import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  Award, 
  Calendar 
} from 'lucide-react';

interface AdmissionPageProps {
  onNavigate: (route: string) => void;
}

export const AdmissionPage: React.FC<AdmissionPageProps> = ({ onNavigate }) => {
  const STEPS = [
    {
      num: '01',
      title: 'Choisir sa formation',
      desc: 'Explorez nos 8 filières professionnalisantes (IDA, FCGE, GEC, CV, TH, RHCOM, AD, RIT) et sélectionnez le parcours adapté à votre projet de carrière.'
    },
    {
      num: '02',
      title: 'Vérifier les conditions d\'admission',
      desc: 'Assurez-vous d\'être titulaire d\'un Baccalauréat d\'État (séries A, B, C, D, E, F, G1, G2 selon la filière visée) ou d\'un titre reconnu équivalent.'
    },
    {
      num: '03',
      title: 'Préparer son dossier',
      desc: 'Rassemblez les pièces justificatives au format numérique ou papier : pièce d\'identité (CNI/Passeport), attestation de réussite au Bac, relevés de notes et photos d\'identité.'
    },
    {
      num: '04',
      title: 'Remplir le formulaire en ligne',
      desc: 'Complétez notre formulaire officiel en 5 étapes sécurisées pour enregistrer votre identité, votre parcours académique et votre choix de formation.'
    },
    {
      num: '05',
      title: 'Soumettre sa candidature',
      desc: 'Validez votre dossier pour générer immédiatement votre numéro officiel de dossier au format ISA-2026-XXXXXX et télécharger votre récépissé.'
    },
    {
      num: '06',
      title: 'Suivre le traitement du dossier',
      desc: 'Consultez l\'avancement de votre candidature en temps réel sur notre portail dédié et recevez les convocations ou notifications d\'admission.'
    }
  ];

  const REQUIRED_DOCUMENTS = [
    'Une copie de la pièce d\'identité nationale (CNI, Passeport, ou Attestation d\'identité valide)',
    'Une photocopie légalisée de l\'attestation de réussite ou du diplôme du Baccalauréat',
    'Une photocopie du relevé de notes officiel du Baccalauréat',
    'Deux photos d\'identité récentes en couleur fond blanc',
    'Un extrait d\'acte de naissance ou jugement supplétif'
  ];

  const FAQS = [
    {
      q: 'Quel est le diplôme préparé à ISATech ?',
      a: 'ISATech prépare principalement au Brevet de Technicien Supérieur (BTS) d\'État ivoirien, homologué par le Ministère de l\'Enseignement Supérieur, avec possibilité de poursuite vers une Licence Professionnelle.'
    },
    {
      q: 'Les candidatures sont-elles ouvertes aux non-ivoiriens ?',
      a: 'Oui, ISATech accueille les étudiants ressortissants des pays de la sous-région et de toute l\'Afrique. Les diplômes équivalents au Baccalauréat sont acceptés après vérification.'
    },
    {
      q: 'Peut-on candidater sous réserve du Baccalauréat ?',
      a: 'Oui, les élèves en classe de Terminale peuvent pré-déposer leur dossier. L\'admission définitive sera prononcée dès la confirmation de l\'obtention du Baccalauréat.'
    },
    {
      q: 'Comment s\'effectue le règlement des frais de scolarité ?',
      a: 'Les modalités précises et échelonnements de paiement sont communiqués par le secrétariat académique lors de la validation du dossier d\'admission.'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] py-12 lg:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
            <Award className="w-3.5 h-3.5 text-[#002060]" />
            <span className="text-xs font-black uppercase tracking-wider">
              Procédure d'Admission 2026-2027
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
            VOTRE AVENIR COMMENCE ICI.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Rejoignez l'excellence ISATech à Abidjan-Koumassi. Découvrez les étapes d'inscription, les pièces à fournir et déposez votre candidature en ligne en toute simplicité.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('/candidater')}
              className="px-6 py-3 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>DÉPOSER MA CANDIDATURE</span>
            </button>
            <button
              onClick={() => onNavigate('/suivi-candidature')}
              className="px-5 py-3 rounded-xl bg-white border-2 border-[#002060] text-[#002060] font-bold text-sm shadow-xs transition-all flex items-center gap-2 hover:bg-slate-50"
            >
              <Clock className="w-4 h-4 text-[#002060]" />
              <span>SUIVRE MON DOSSIER</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LE PROCESSUS EN 6 ÉTAPES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-3 py-1 rounded-full border border-[#002060]/20">
            Guide Pas-à-Pas
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002060]">
            LE PROCESSUS D'ADMISSION EN 6 ÉTAPES
          </h2>
          <p className="text-sm text-slate-600">
            Un cheminement clair et transparent, de votre choix de filière jusqu'à votre intégration au sein de l'établissement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-slate-200 shadow-xs hover:border-[#002060] hover:shadow-md transition-all space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black font-mono text-[#002060] group-hover:scale-105 transition-transform">
                  {step.num}
                </span>
                <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#002060] group-hover:text-white transition-colors text-xs font-bold">
                  ✓
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#002060]">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          PIÈCES À FOURNIR
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#002060] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Dossier d'Inscription
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Pièces constitutives du dossier d'admission
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              Pour garantir le traitement rapide de votre dossier par le secrétariat académique, veuillez préparer des copies lisibles (format PDF ou image) de ces pièces officielles.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/candidater')}
                className="px-6 py-3.5 rounded-xl bg-white text-[#002060] font-black text-sm hover:bg-slate-100 transition-all inline-flex items-center gap-2 shadow-md"
              >
                <span>Accéder au formulaire de candidature</span>
                <ArrowRight className="w-4 h-4 text-[#002060]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white border-b border-white/15 pb-2">
              Liste des pièces requises
            </h4>
            <div className="space-y-2.5">
              {REQUIRED_DOCUMENTS.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ADMISSION
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-3 py-1 rounded-full border border-[#002060]/20">
            Questions Fréquentes
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#002060]">
            TOUT CE QUE VOUS DEVEZ SAVOIR
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2"
            >
              <h4 className="text-sm sm:text-base font-bold text-[#002060] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#002060] shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
