import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Check, 
  ArrowRight,
  Bookmark,
  Tag
} from 'lucide-react';
import { db } from '../services/db';

interface ArticleDetailPageProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  slug,
  onNavigate
}) => {
  const article = db.getNewsBySlug(slug);
  const [copied, setCopied] = useState(false);
  const allNews = db.getNews();
  const relatedArticles = allNews.filter(n => n.slug !== slug).slice(0, 2);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Article introuvable</h2>
        <p className="text-slate-600">L'article demandé n'existe pas ou a été retiré.</p>
        <button
          onClick={() => onNavigate('/actualites')}
          className="px-5 py-2.5 bg-[#0B1F33] text-white font-bold rounded-xl text-sm"
        >
          Retour aux actualités
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8 pb-20">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/actualites')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B1F33] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux actualités ISATech</span>
      </button>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
            {article.category}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#002060]" />
            {article.publishedAt}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002060] leading-tight">
          {article.title}
        </h1>

        {/* Author bar */}
        <div className="flex items-center justify-between py-3 border-y border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#002060] text-white flex items-center justify-center font-bold text-xs">
              ISA
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{article.author}</p>
              <p className="text-[11px] text-slate-500">{article.authorRole}</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#002060] text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Lien copié !</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Partager</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 aspect-16/9">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Body */}
      <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-5 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">
        <p className="font-semibold text-slate-900 text-base sm:text-lg italic border-l-4 border-[#002060] pl-4 py-1 bg-slate-50 rounded-r-xl">
          {article.excerpt}
        </p>

        <div className="whitespace-pre-line leading-relaxed space-y-4 pt-2">
          {article.content}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            Mots-clés :
          </span>
          {article.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Related Articles */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-black text-[#002060]">
          Articles Similaires
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedArticles.map((rel) => (
            <div
              key={rel.id}
              onClick={() => onNavigate(`/actualites/${rel.slug}`)}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-[#002060] cursor-pointer transition-colors space-y-2 group"
            >
              <span className="text-[10px] font-bold text-[#002060] uppercase tracking-wider">
                {rel.category} • {rel.publishedAt}
              </span>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#002060] line-clamp-2">
                {rel.title}
              </h4>
              <span className="text-xs font-bold text-[#002060] inline-flex items-center gap-1">
                <span>Lire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
