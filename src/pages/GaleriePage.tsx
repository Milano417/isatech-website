import React from 'react';
import { PhotoGallery } from '../components/institution/PhotoGallery';
import { Camera, Image as ImageIcon, MapPin } from 'lucide-react';

interface GaleriePageProps {
  onNavigate: (route: string) => void;
}

export const GaleriePage: React.FC<GaleriePageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
          <Camera className="w-3.5 h-3.5 text-[#002060]" />
          <span className="text-xs font-black uppercase tracking-wider">
            Reportage & Album de l'École
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
          GALERIE PHOTOS D'ISATECH
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Plongez au cœur de l'école : les amphis en tenue officielle (polos ISATech, costumes corporate), les laboratoires informatiques, les ateliers de travaux pratiques et les soutenances de diplômes à Abidjan-Koumassi.
        </p>
      </div>

      {/* Main Photo Gallery */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        <PhotoGallery />
      </div>

      {/* School Location Reminder */}
      <div className="bg-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#002060] text-white flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Locaux d'ISATech à Abidjan, Koumassi</h4>
            <p className="text-xs text-slate-500">Un établissement moderne et équipé au service de plus de 2000 diplômés formés.</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/contact')}
          className="px-5 py-2.5 rounded-xl bg-[#002060] hover:bg-[#001744] text-white text-xs font-bold transition-all shrink-0"
        >
          Visiter l'établissement
        </button>
      </div>
    </div>
  );
};
