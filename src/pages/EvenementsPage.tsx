import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Filter, 
  ArrowRight,
  Ticket 
} from 'lucide-react';
import { db } from '../services/db';
import { CampusEvent } from '../types';

interface EvenementsPageProps {
  onNavigate: (route: string) => void;
}

export const EvenementsPage: React.FC<EvenementsPageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'TOUT' | 'A_VENIR' | 'TERMINE'>('TOUT');
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const events = db.getEvents();

  const filteredEvents = events.filter((e) => {
    if (filter === 'TOUT') return true;
    return e.status === filter;
  });

  const handleRegister = (eventId: string) => {
    if (!registeredIds.includes(eventId)) {
      setRegisteredIds(prev => [...prev, eventId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002060]/10 text-[#002060] border border-[#002060]/20">
          <CalendarIcon className="w-3.5 h-3.5 text-[#002060]" />
          <span className="text-xs font-black uppercase tracking-wider">
            Agenda Académique & Conférences
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002060] tracking-tight">
          ÉVÉNEMENTS & RENCONTRES DE L'ÉTABLISSEMENT
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Journées portes ouvertes, séminaires professionnels, hackathons technologiques et ateliers d'orientation à ISATech Koumassi.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        {[
          { key: 'TOUT', label: 'Tous les événements' },
          { key: 'A_VENIR', label: 'À venir' },
          { key: 'TERMINE', label: 'Événements passés' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              filter === tab.key
                ? 'bg-[#002060] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEvents.map((ev) => {
          const isRegistered = registeredIds.includes(ev.id);
          const isPast = ev.status === 'TERMINE';

          return (
            <div
              key={ev.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:border-[#002060] hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002060]/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ev.status === 'A_VENIR'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-700 text-slate-200'
                    }`}>
                      {ev.status === 'A_VENIR' ? 'À venir' : 'Terminé'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800">
                      {ev.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold leading-snug drop-shadow-xs">
                      {ev.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#002060] shrink-0" />
                      <span className="font-semibold text-slate-900">{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#002060] shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#002060] shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {ev.capacity ? `${ev.registeredCount + (isRegistered ? 1 : 0)} / ${ev.capacity} inscrits` : 'Entrée libre'}
                </span>

                {!isPast ? (
                  <button
                    onClick={() => handleRegister(ev.id)}
                    disabled={isRegistered}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isRegistered
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#002060] hover:bg-[#001744] text-white'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Place réservée !</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-3.5 h-3.5" />
                        <span>S'inscrire gratuitement</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">
                    Événement clôturé
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
