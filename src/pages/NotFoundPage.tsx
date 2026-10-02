import React from 'react';
import { Home, Compass } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (route: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-[#002060]/10 text-[#002060] flex items-center justify-center mx-auto border border-[#002060]/20">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-[#002060]">
          Erreur 404
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002060]">
          OUPS ! CETTE PAGE N’EST PAS DANS NOTRE PROGRAMME.
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          La page recherchée semble ne plus exister ou avoir changé d'adresse.
        </p>
      </div>

      <div className="pt-4 flex justify-center">
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-3.5 rounded-xl bg-[#002060] hover:bg-[#001744] text-white text-sm font-black transition-all shadow-md flex items-center gap-2"
        >
          <Home className="w-4 h-4 text-white" />
          <span>RETOUR À L'ACCUEIL</span>
        </button>
      </div>
    </div>
  );
};
