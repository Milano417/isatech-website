import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Navigation, 
  ShieldCheck 
} from 'lucide-react';
import { db } from '../services/db';

interface ContactPageProps {
  onNavigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      db.createMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'Demande de renseignements générale',
        message: formData.message
      });
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
          <MessageSquare className="w-3.5 h-3.5 text-[#002060]" />
          <span className="text-xs font-black uppercase tracking-wider">
            Secrétariat & Renseignements
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
          CONTACTEZ ISATECH
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Notre équipe d'accueil et d'orientation vous répond du lundi au vendredi dans les locaux de l'établissement à Abidjan-Koumassi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Official Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#002060] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-white/20">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                Établissement Agréé
              </span>
              <h3 className="text-xl font-black">
                ISATech — Institut des Sciences Appliquées et de la Technologie
              </h3>
              <p className="text-xs text-slate-200 italic">
                « L’excellence demeure notre credo »
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-200 pt-2 border-t border-white/20">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Localisation :</strong>
                  <span>Abidjan — Koumassi, Côte d'Ivoire</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Standard téléphonique :</strong>
                  <span className="text-slate-300 font-mono">[À COMPLÉTER]</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Email officiel :</strong>
                  <span className="text-slate-300 font-mono">[À COMPLÉTER]</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Horaires d'accueil :</strong>
                  <p>Lundi au Vendredi : 07h30 - 17h30</p>
                  <p>Samedi : 08h00 - 12h30</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-[11px] text-slate-200">
              Pour toute question relative aux inscriptions 2026-2027, vous pouvez également utiliser notre formulaire de candidature en ligne direct.
            </div>
          </div>

          {/* Quick interactive location card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Navigation className="w-4 h-4 text-[#002060]" />
              <span>Accès & Transports urbains</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              L'école est desservie par les lignes de bus SOTRA, gbakas et taxis communaux de Koumassi. Située à proximité des grands axes pour un accès aisé depuis Marcory, Treichville et Port-Bouët.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-[#002060]">
              Envoyez-nous un message
            </h3>
            <p className="text-xs text-slate-500">
              Remplissez le formulaire ci-dessous. Le secrétariat vous répondra dans les meilleurs délais.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3 text-xs text-emerald-900 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Message envoyé avec succès !</strong>
                Votre demande a bien été transmise à l'administration d'ISATech. Nous reviendrons vers vous très prochainement.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom et Prénoms *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Kouamé Affoué"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ex: kouame@gmail.com"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ex: +225 07 00 00 00 00"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sujet de la demande *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Ex: Inscription en IDA / Frais de scolarité"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#002060] focus:bg-white outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Votre Message *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Détaillez votre question ou votre besoin d'information..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:border-[#002060] focus:bg-white outline-hidden"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{isSubmitting ? 'Envoi en cours...' : 'ENVOYER LE MESSAGE'}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
