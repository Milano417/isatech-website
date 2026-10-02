import React, { useState } from 'react';
import { Camera, Eye, X, ZoomIn, Award, Laptop, Users, BookOpen } from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'TENUE_OFFICIELLE' | 'LABO_TECH' | 'SALLES_COURS' | 'SOUTENANCES' | 'PROMOTIONS';
  categoryLabel: string;
  url: string;
  description: string;
  date?: string;
}

export const PhotoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('TOUT');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Gallery items faithfully reflecting the real visual life of ISATech school
  const PHOTOS: GalleryPhoto[] = [
    {
      id: 'p-1',
      title: 'Étudiants en cours magistral — Polos officiels ISATech',
      category: 'TENUE_OFFICIELLE',
      categoryLabel: 'Tenue Officielle ISATech',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      description: 'Séance de cours en amphi : concentration et prise de notes des étudiants portant le polo blanc officiel avec col bleu et écusson ISATech.',
      date: 'Promotion 2025-2026'
    },
    {
      id: 'p-2',
      title: 'Travaux pratiques en laboratoire informatique',
      category: 'LABO_TECH',
      categoryLabel: 'Laboratoire Informatique',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      description: 'Étudiants des filières IDA et RIT travaillant sur des ordinateurs de bureau lors des ateliers de programmation et de configuration réseau.',
      date: 'Ateliers Pratiques'
    },
    {
      id: 'p-3',
      title: 'Promotion en costume et cravate — Rigueur académique',
      category: 'TENUE_OFFICIELLE',
      categoryLabel: 'Tenue Officielle ISATech',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      description: 'Séance solennelle des étudiants en tailleurs et costumes noirs avec cravate foncée, incarnant la rigueur et le professionnalisme de l\'établissement.',
      date: 'Tenue Corporate'
    },
    {
      id: 'p-4',
      title: 'Délégation d\'étudiants devant le logo officiel de l\'école',
      category: 'PROMOTIONS',
      categoryLabel: 'Vie de l\'École',
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      description: 'Groupe d\'étudiants réunis à l\'entrée de l\'établissement à Koumassi, sous le logo institutionnel ISATech.',
      date: 'Esprit de Promotion'
    },
    {
      id: 'p-5',
      title: 'Séance d\'examen et de révision en salle de cours',
      category: 'SALLES_COURS',
      categoryLabel: 'Salles de Cours',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      description: 'Évaluation semestrielle et préparation intensive aux examens du BTS d\'État dans les salles de classe de l\'école.',
      date: 'Sessions d\'Évaluations'
    },
    {
      id: 'p-6',
      title: 'Soutenance de mémoire de stage devant jury',
      category: 'SOUTENANCES',
      categoryLabel: 'Soutenances & Diplômes',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
      description: 'Présentation des rapports de stage professionnel devant les enseignants et maîtres de stage d\'entreprises partenaires.',
      date: 'Diplomation BTS'
    }
  ];

  const filteredPhotos = activeCategory === 'TOUT' 
    ? PHOTOS 
    : PHOTOS.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#002060] flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#002060]" />
            <span>Galerie Photographique Officielle</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#002060] mt-1">
            L'ÉCOLE ISATECH EN IMAGES
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Découvrez le quotidien de nos étudiants, les cours en amphis, le laboratoire informatique et les tenues officielles.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'TOUT', label: 'Toutes les photos' },
            { id: 'TENUE_OFFICIELLE', label: 'Tenues & Polos' },
            { id: 'LABO_TECH', label: 'Labo Info' },
            { id: 'SALLES_COURS', label: 'Salles de Cours' },
            { id: 'SOUTENANCES', label: 'Soutenances' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#002060] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative rounded-2xl overflow-hidden bg-[#0A192F] border-2 border-slate-200 hover:border-[#002060] shadow-sm hover:shadow-lg transition-all cursor-pointer aspect-4/3"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              loading="lazy"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#002060]/95 via-[#002060]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

            {/* Top Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white text-[#002060] shadow-sm">
                {photo.categoryLabel}
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white space-y-1">
              {photo.date && (
                <span className="text-[10px] text-slate-300 font-semibold block">
                  {photo.date}
                </span>
              )}
              <h4 className="text-xs sm:text-sm font-bold leading-snug line-clamp-2">
                {photo.title}
              </h4>
            </div>

            {/* Hover zoom icon */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-slate-200">
            <div className="relative aspect-16/9 bg-slate-900">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#002060] bg-[#002060]/10 px-2.5 py-0.5 rounded">
                {selectedPhoto.categoryLabel} • {selectedPhoto.date}
              </span>
              <h3 className="text-base font-black text-slate-900">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
