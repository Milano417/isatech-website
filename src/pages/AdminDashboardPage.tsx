import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  BookOpen, 
  Newspaper, 
  Calendar, 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  X,
  ExternalLink 
} from 'lucide-react';
import { db } from '../services/db';
import { Application, Formation, NewsArticle, CampusEvent, ContactMessage, Role } from '../types';

interface AdminDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'CANDIDATURES' | 'FILIERES' | 'ACTUALITES' | 'MESSAGES' | 'EVENEMENTS'>('CANDIDATURES');
  const [currentUserRole, setCurrentUserRole] = useState<Role>('SUPER_ADMIN');

  // Local state synced with db
  const [stats, setStats] = useState(db.getStats());
  const [applications, setApplications] = useState(db.getApplications());
  const [formations, setFormations] = useState(db.getFormations());
  const [news, setNews] = useState(db.getNews());
  const [events, setEvents] = useState(db.getEvents());
  const [messages, setMessages] = useState(db.getMessages());

  // Filters & Search
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('TOUT');
  const [appFiliereFilter, setAppFiliereFilter] = useState('TOUT');

  // Selected Application Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [appNotesInput, setAppNotesInput] = useState('');

  // New News Modal
  const [showNewNewsModal, setShowNewNewsModal] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'Actualités' | 'Communiqués' | 'Formation' | 'Technologie'>('Actualités');
  const [newNewsExcerpt, setNewNewsExcerpt] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');

  // Sync listener
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setStats(db.getStats());
      setApplications(db.getApplications());
      setFormations(db.getFormations());
      setNews(db.getNews());
      setEvents(db.getEvents());
      setMessages(db.getMessages());
    });
    return unsubscribe;
  }, []);

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const term = appSearch.toLowerCase().trim();
    const matchesSearch = 
      !term || 
      app.applicationNumber.toLowerCase().includes(term) ||
      app.firstName.toLowerCase().includes(term) ||
      app.lastName.toLowerCase().includes(term) ||
      app.email.toLowerCase().includes(term);

    const matchesStatus = appStatusFilter === 'TOUT' || app.status === appStatusFilter;
    const matchesFiliere = appFiliereFilter === 'TOUT' || app.formationCode === appFiliereFilter;

    return matchesSearch && matchesStatus && matchesFiliere;
  });

  const handleStatusChange = (appId: string, newStatus: Application['status']) => {
    db.updateApplicationStatus(appId, newStatus);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleSaveNotes = () => {
    if (selectedApp) {
      db.updateApplicationStatus(selectedApp.id, selectedApp.status, appNotesInput);
      setSelectedApp({ ...selectedApp, statusNotes: appNotesInput });
      alert('Remarques administratives enregistrées avec succès.');
    }
  };

  const handleExportCSV = () => {
    const headers = 'Numéro,Nom,Prénoms,Filière,Email,Téléphone,Diplôme,Statut,Date\n';
    const rows = applications.map(a => 
      `"${a.applicationNumber}","${a.lastName}","${a.firstName}","${a.formationCode}","${a.email}","${a.phone}","${a.lastDiploma}","${a.status}","${a.submittedAt}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidatures_isatech_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle.trim() || !newNewsContent.trim()) return;

    const slug = newNewsTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newArticle: NewsArticle = {
      id: 'news-' + Date.now(),
      title: newNewsTitle,
      slug,
      excerpt: newNewsExcerpt || newNewsTitle,
      content: newNewsContent,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      category: newNewsCategory,
      author: 'Administration ISATech',
      authorRole: 'Direction de la Communication',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '3 min',
      status: 'PUBLISHED',
      tags: ['ISATech', newNewsCategory]
    };

    db.saveNews(newArticle);
    setShowNewNewsModal(false);
    setNewNewsTitle('');
    setNewNewsExcerpt('');
    setNewNewsContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Top Header Bar */}
      <div className="bg-[#002060] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">
              Console d'Administration ISATech
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Tableau de Bord & Gestion Institutionnelle
          </h1>
          <p className="text-xs text-slate-300">
            Contrôle des candidatures, des publications et des requêtes étudiantes.
          </p>
        </div>

        {/* Role Selector & Fast links */}
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs">
            <span className="text-slate-300 font-bold">Rôle :</span>
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as Role)}
              className="bg-transparent text-white font-bold outline-hidden cursor-pointer"
            >
              <option value="SUPER_ADMIN" className="text-slate-900">SUPER_ADMIN</option>
              <option value="ADMIN" className="text-slate-900">ADMIN</option>
              <option value="STAFF" className="text-slate-900">STAFF</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate('/')}
            className="px-4 py-2 rounded-xl bg-white text-[#002060] hover:bg-slate-100 text-xs font-black transition-all shadow-sm"
          >
            Site Public
          </button>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Candidatures Totales</span>
          <div className="text-2xl sm:text-3xl font-black text-[#002060] mt-1 font-mono">
            {stats.totalApplications}
          </div>
          <span className="text-[10px] text-blue-600 font-bold">
            {stats.receivedApplications} reçue(s) • {stats.inReviewApplications} en étude
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Candidatures Acceptées</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-mono">
            {stats.acceptedApplications}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Admis en promotion</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Filières Actives</span>
          <div className="text-2xl sm:text-3xl font-black text-[#002060] mt-1 font-mono">
            {stats.totalFormations}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">8 filières officielles</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Messages de Contact</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-mono">
            {stats.unreadMessages}
          </div>
          <span className="text-[10px] text-amber-700 font-bold">Nouveau(x) à traiter</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-2 border-b border-slate-200 pb-2 scrollbar-none">
        {[
          { id: 'CANDIDATURES', label: `Candidatures (${applications.length})`, icon: FileText },
          { id: 'FILIERES', label: `Filières (${formations.length})`, icon: BookOpen },
          { id: 'ACTUALITES', label: `Actualités (${news.length})`, icon: Newspaper },
          { id: 'MESSAGES', label: `Messages (${messages.length})`, icon: MessageSquare },
          { id: 'EVENEMENTS', label: `Événements (${events.length})`, icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#002060] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: GESTION DES CANDIDATURES
          ========================================================================= */}
      {activeTab === 'CANDIDATURES' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search, Filter & Export Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Rechercher par dossier (ISA-2026-...), nom, email..."
                  className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#002060]"
                />
              </div>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-hidden"
              >
                <option value="TOUT">Tous statuts</option>
                <option value="RECUE">Reçue</option>
                <option value="EN_COURS">En cours d'étude</option>
                <option value="COMPLEMENT_REQUIS">Complément requis</option>
                <option value="ACCEPTEE">Acceptée</option>
                <option value="REFUSEE">Refusée</option>
              </select>

              <select
                value={appFiliereFilter}
                onChange={(e) => setAppFiliereFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-hidden"
              >
                <option value="TOUT">Toutes filières</option>
                {formations.map(f => (
                  <option key={f.code} value={f.code}>{f.code}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Exporter CSV</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Dossier</th>
                    <th className="py-3.5 px-4">Candidat</th>
                    <th className="py-3.5 px-4">Filière</th>
                    <th className="py-3.5 px-4">Date dépôt</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{app.firstName} {app.lastName}</span>
                        <span className="text-[11px] text-slate-400">{app.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-xs px-2 py-0.5 rounded-md bg-[#002060] text-white font-mono">
                          {app.formationCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {new Date(app.submittedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-hidden ${
                            app.status === 'ACCEPTEE' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            app.status === 'EN_COURS' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            app.status === 'COMPLEMENT_REQUIS' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                            app.status === 'REFUSEE' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                            'bg-blue-50 text-blue-800 border-blue-300'
                          }`}
                        >
                          <option value="RECUE">Reçue</option>
                          <option value="EN_COURS">En cours</option>
                          <option value="COMPLEMENT_REQUIS">Complément requis</option>
                          <option value="ACCEPTEE">Acceptée</option>
                          <option value="REFUSEE">Refusée</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setAppNotesInput(app.statusNotes || '');
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#002060] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Voir le dossier complet"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredApps.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                Aucune candidature ne correspond aux critères de recherche.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: GESTION DES FILIÈRES
          ========================================================================= */}
      {activeTab === 'FILIERES' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-[#002060]">Catalogue des 8 Filières Officielles</h2>
              <p className="text-xs text-slate-500">Statuts de publication et administration des parcours.</p>
            </div>
            <span className="text-xs font-bold bg-[#002060]/10 text-[#002060] px-3 py-1 rounded-lg">
              8 / 8 Publiées
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formations.map((f) => (
              <div
                key={f.code}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#002060] transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-[#002060] text-white">
                      {f.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      {f.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{f.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{f.shortDescription}</p>
                </div>

                <button
                  onClick={() => onNavigate(`/formations/${f.slug}`)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 shrink-0"
                  title="Voir la page publique"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: GESTION DES ACTUALITÉS
          ========================================================================= */}
      {activeTab === 'ACTUALITES' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-[#002060]">Articles & Communiqués</h2>
              <p className="text-xs text-slate-500">Publiez des nouvelles et des dates clés pour les étudiants.</p>
            </div>

            <button
              onClick={() => setShowNewNewsModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#002060] hover:bg-[#001744] text-white font-black text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Rédiger un article</span>
            </button>
          </div>

          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#002060]">
                    {item.category} • {item.publishedAt}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.excerpt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate(`/actualites/${item.slug}`)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => db.deleteNews(item.id)}
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-rose-500"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: GESTION DES MESSAGES DE CONTACT
          ========================================================================= */}
      {activeTab === 'MESSAGES' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-[#0B1F33]">Boîte de Réception des Visiteurs</h2>
            <p className="text-xs text-slate-500">Demandes de renseignements soumises sur la page Contact.</p>
          </div>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{msg.name}</span>
                    <span className="text-xs text-slate-500">{msg.email} • {msg.phone || 'Pas de tél'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      msg.status === 'NOUVEAU' ? 'bg-amber-100 text-amber-900' :
                      msg.status === 'TRAITE' ? 'bg-emerald-100 text-emerald-900' :
                      'bg-blue-100 text-blue-900'
                    }`}>
                      {msg.status}
                    </span>
                    <button
                      onClick={() => db.updateMessageStatus(msg.id, msg.status === 'TRAITE' ? 'NOUVEAU' : 'TRAITE')}
                      className="text-xs font-bold text-[#002060] hover:underline"
                    >
                      {msg.status === 'TRAITE' ? 'Marquer nouveau' : 'Marquer comme traité'}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-700">
                  <strong className="block text-slate-900 mb-1">{msg.subject}</strong>
                  <p className="leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: GESTION DES ÉVÉNEMENTS
          ========================================================================= */}
      {activeTab === 'EVENEMENTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-[#002060]">Agenda & Événements</h2>
            <p className="text-xs text-slate-500">Gérez les inscriptions et les statuts des événements de l'établissement.</p>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-[#002060]">
                      {ev.date} • {ev.time}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {ev.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                  <p className="text-xs text-slate-500">📍 {ev.location}</p>
                </div>

                <button
                  onClick={() => onNavigate('/evenements')}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: APPLICATION DETAIL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#002060] uppercase tracking-wider">
                  Dossier {selectedApp.applicationNumber}
                </span>
                <h3 className="text-lg font-black text-[#002060]">
                  {selectedApp.firstName} {selectedApp.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 uppercase font-bold block">Filière choisie</span>
                <span className="font-black text-sm text-[#002060]">{selectedApp.formationCode}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 uppercase font-bold block">Diplôme précédent</span>
                <span className="font-bold text-slate-800">{selectedApp.lastDiploma} ({selectedApp.graduationYear})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 uppercase font-bold block">Email</span>
                <span className="font-medium text-slate-800">{selectedApp.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 uppercase font-bold block">Téléphone</span>
                <span className="font-medium text-slate-800">{selectedApp.phone}</span>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Documents fournis :</h4>
              <div className="space-y-1.5 text-xs">
                {selectedApp.documents.map(d => (
                  <div key={d.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span>{d.name} ({d.type})</span>
                    <span className="text-emerald-700 font-bold text-[10px]">Vérifié</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status changer */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">Changer le statut :</label>
              <div className="flex flex-wrap gap-2">
                {(['RECUE', 'EN_COURS', 'COMPLEMENT_REQUIS', 'ACCEPTEE', 'REFUSEE'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedApp.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedApp.status === st
                        ? 'bg-[#002060] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Administrative Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Remarques / Motif pour le candidat :</label>
              <textarea
                rows={3}
                value={appNotesInput}
                onChange={(e) => setAppNotesInput(e.target.value)}
                placeholder="Ex: Candidature acceptée, veuillez vous présenter au secrétariat avec les originaux..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#002060]"
              />
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-[#002060] hover:bg-[#001744] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer la remarque</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEWS */}
      {showNewNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleCreateNews} className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#0B1F33]">Nouvel Article ISATech</h3>
              <button
                type="button"
                onClick={() => setShowNewNewsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Titre de l'article *</label>
              <input
                type="text"
                required
                value={newNewsTitle}
                onChange={(e) => setNewNewsTitle(e.target.value)}
                placeholder="Ex: Rentrée solennelle et accueil des promotions"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
              <select
                value={newNewsCategory}
                onChange={(e) => setNewNewsCategory(e.target.value as any)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
              >
                <option value="Actualités">Actualités</option>
                <option value="Communiqués">Communiqués</option>
                <option value="Formation">Formation</option>
                <option value="Technologie">Technologie</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Extrait court</label>
              <input
                type="text"
                value={newNewsExcerpt}
                onChange={(e) => setNewNewsExcerpt(e.target.value)}
                placeholder="Résumé en une phrase"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contenu complet *</label>
              <textarea
                required
                rows={5}
                value={newNewsContent}
                onChange={(e) => setNewNewsContent(e.target.value)}
                placeholder="Rédigez le corps de l'article..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewNewsModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#002060] hover:bg-[#001744] text-white text-xs font-black shadow-sm"
              >
                Publier l'article
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
