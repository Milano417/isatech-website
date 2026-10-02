import React from 'react';
import { ArrowRight, MapPin, Award, Clock } from 'lucide-react';
import { Formation } from '../../types';

interface FormationCardProps {
  formation: Formation;
  onSelect: (slug: string) => void;
  onApply?: (code: string) => void;
}

export const FormationCard: React.FC<FormationCardProps> = ({
  formation,
  onSelect,
  onApply
}) => {
  return (
    <div 
      onClick={() => onSelect(formation.slug)}
      className="group relative bg-white rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-[#002060] hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with Zoom effect */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={formation.image}
          alt={formation.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Navy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002060]/90 via-[#002060]/30 to-transparent" />

        {/* Code Badge Top Left in Navy & White */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          <span className="px-3 py-1 bg-white text-[#002060] text-xs font-black rounded-lg shadow-sm font-mono tracking-wider border border-white">
            {formation.code}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#002060]/90 text-white backdrop-blur-xs">
            BTS d'État
          </span>
        </div>

        {/* Category Pill Bottom Left */}
        <div className="absolute bottom-3 left-3.5 right-3.5">
          <span className="text-[11px] font-semibold text-slate-200 uppercase tracking-wider block drop-shadow-sm">
            {formation.category}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight drop-shadow-xs line-clamp-1">
            {formation.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          « {formation.shortDescription} »
        </p>

        {/* Key meta */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#002060]" />
            <span>{formation.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#002060]" />
            <span>Koumassi</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <Award className="w-3.5 h-3.5 text-[#002060]" />
            <span>BTS / Bac+2</span>
          </div>
        </div>

        {/* Skills pill tags */}
        <div className="flex flex-wrap gap-1.5">
          {formation.skills.slice(0, 3).map((skill, i) => (
            <span 
              key={i} 
              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
          {formation.skills.length > 3 && (
            <span className="text-[10px] text-slate-400 font-semibold self-center">
              +{formation.skills.length - 3}
            </span>
          )}
        </div>

        {/* Action Button in Navy & White */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#002060] group-hover:underline flex items-center gap-1 transition-all">
            <span>Découvrir le cursus</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>

          {onApply && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(formation.code);
              }}
              className="px-3 py-1 text-[11px] font-bold text-white bg-[#002060] hover:bg-[#001744] rounded-lg transition-colors"
            >
              Candidater
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
