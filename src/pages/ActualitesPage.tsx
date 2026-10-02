import React, { useState } from 'react';
import { Newspaper, Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react';
import { db } from '../services/db';
import { NewsArticle } from '../types';

interface ActualitesPageProps {
  onNavigate: (route: string) => void;
}

export const ActualitesPage: React.FC<ActualitesPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const news = db.getNews();

  const CATEGORIES = [
    'Toutes',
    'Actualités',
    'Communiqués',
    'Événements',
    'Formation',
    'Vie étudiante',
    'Technologie'
  ];

  const filteredNews = selectedCategory === 'Toutes'
    ? news
    : news.filter(n => n.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
          <Newspaper className="w-3.5 h-3.5 text-[#002060]" />
          <span className="text-xs font-black uppercase tracking-wider">
            Espace Presse & Communiqués
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
          ACTUALITÉS & ÉVÉNEMENTS DE L'ÉTABLISSEMENT
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Suivez la vie institutionnelle, les annonces officielles, les projets étudiants et les dates clés de l'Institut des Sciences Appliquées et de la Technologie.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedCategory === cat
                ? 'bg-[#002060] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              onClick={() => onNavigate(`/actualites/${article.slug}`)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-[#002060] hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#002060] text-white border border-[#002060]">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#002060]" />
                      {article.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 group-hover:text-[#002060] line-clamp-2 leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    Par {article.author}
                  </span>
                  <span className="text-xs font-bold text-[#002060] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Lire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <p className="text-slate-500 text-sm">Aucune actualité disponible pour cette catégorie pour le moment.</p>
          <button
            onClick={() => setSelectedCategory('Toutes')}
            className="text-xs font-bold text-[#002060] hover:underline"
          >
            Afficher toutes les actualités
          </button>
        </div>
      )}
    </div>
  );
};
