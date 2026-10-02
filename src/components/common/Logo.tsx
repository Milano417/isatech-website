import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light' | 'white';
  showSlogan?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'full',
  showSlogan = false 
}) => {
  const isDarkBg = variant === 'light' || variant === 'white';
  // Official ISATech Navy Blue from logo: #002060 / #0A1172
  const navyColor = isDarkBg ? '#FFFFFF' : '#002060';
  const boxBg = isDarkBg ? '#0A192F' : '#FFFFFF';
  const textColor = isDarkBg ? '#FFFFFF' : '#002060';
  const subtextColor = isDarkBg ? '#CBD5E1' : '#475569';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Emblem exactly matching téléchargement (1).jpg */}
     <div className="relative flex-shrink-0 w-11 h-11 md:w-12 md:h-12">
  <img
    src="/images/logo.jpg"
    alt="Logo ISATech"
    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
  />
</div>

      {variant !== 'compact' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span 
              className="text-xl md:text-2xl font-black tracking-tight"
              style={{ color: textColor, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              ISATech
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
              isDarkBg ? 'bg-white/15 text-white' : 'bg-[#002060]/10 text-[#002060]'
            }`}>
              Abidjan
            </span>
          </div>

          <span 
            className="text-[10px] md:text-[11px] font-bold tracking-tight uppercase line-clamp-1"
            style={{ color: subtextColor }}
          >
            Institut des Sciences Appliquées et de la Technologie
          </span>

          {showSlogan && (
            <span className={`text-[9px] italic font-semibold tracking-tight ${
              isDarkBg ? 'text-slate-300' : 'text-[#002060]'
            }`}>
              « L’excellence demeure notre credo »
            </span>
          )}
        </div>
      )}
    </div>
  );
};
