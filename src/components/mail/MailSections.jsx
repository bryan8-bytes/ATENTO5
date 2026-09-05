import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Inbox, Send, FileText, AlertOctagon, Trash2,
  Star, Archive, Settings,
  Search, RefreshCw, Menu, ChevronDown, Users,
  Building2, Activity, DollarSign, Clock,
  CheckCircle, AlertTriangle, Mail, Folder,
  ChevronLeft, X, PenSquare, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const getSectionIcon = (iconName) => {
  const icons = {
    Inbox, Send, FileText, AlertOctagon, Trash2,
    Star, Archive, Users, Building2, Activity, DollarSign,
    Clock, CheckCircle, AlertTriangle, Mail, Folder
  };
  return icons[iconName] || Inbox;
};

const getSectionColor = (sectionId) => {
  const colors = {
    todos: '#3CB4FF',
    internos: '#10B981',
    gobierno: '#8B5CF6',
    ventas: '#F59E0B',
    operaciones: '#06B6D4',
    proyectos: '#EC4899',
    finanzas: '#EF4444',
    urgentes: '#DC2626',
    'sin Leer': '#6366F1',
  };
  return colors[sectionId] || '#3CB4FF';
};

const MailSections = ({
  sections,
  activeSection,
  onSectionChange,
  accounts,
  activeAccount,
  onAccountChange,
  folders,
  currentFolder,
  onFolderChange,
  onCompose,
  onRefresh,
  isSyncing,
  syncStatus,
  lastSyncTime,
  searchQuery,
  onSearchChange,
  mobileMenuOpen,
  onMobileMenuToggle,
  onBack,
}) => {
  const { logout } = useAuth();
  const [showAccounts, setShowAccounts] = useState(false);

  const formatSyncTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const syncLabel = syncStatus === 'syncing' ? 'Sincronizando...' :
    syncStatus === 'error' ? 'Error' :
    lastSyncTime ? `Última sync: ${formatSyncTime(lastSyncTime)}` : 'Sin sync';

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileMenuToggle}
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          x: mobileMenuOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 26, stiffness: 210 }}
        className="fixed lg:relative z-50 h-full flex flex-col"
        style={{
          background: '#050B14',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
          width: '280px',
          padding: '0',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0" style={{ backgroundColor: '#050B14' }}>
          <div className="flex items-center gap-3">
            <img src="/Logo Atento5.png" alt="ATENTO5" className="h-20 w-auto object-contain" />
            <div>
              <h2 className="text-xs font-extrabold text-white tracking-wider uppercase">ATENTO5</h2>
              <p className="text-[10px] text-slate-400 font-semibold">Correo Empresarial</p>
            </div>
          </div>
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Back button */}
        <div className="px-4 py-2 shrink-0">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar correos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-[#3CB4FF]/40 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Compose Button */}
        <div className="px-4 py-2 shrink-0">
          <button
            onClick={onCompose}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D21414] via-rose-600 to-[#3CB4FF] hover:brightness-110 text-white rounded-xl py-2.5 text-xs font-extrabold shadow-lg shadow-red-500/10 transition-all active:scale-[0.98] cursor-pointer border border-white/[0.05]"
          >
            <PenSquare size={14} />
            <span>Redactar</span>
          </button>
        </div>

        {/* Sync Status */}
        <div className="px-4 py-2 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-blue-400 animate-pulse' : syncStatus === 'error' ? 'bg-red-400' : 'bg-emerald-400'}`} />
            <span className="text-[10px] font-semibold text-slate-400">{syncLabel}</span>
          </div>
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="p-1.5 text-slate-400 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            title="Sincronizar"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3CB4FF #050B14' }}>

          {/* Accounts Section */}
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
              Cuentas
            </p>
            <button
              onClick={() => onAccountChange('all')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer mb-1.5
                ${activeAccount === 'all'
                  ? 'bg-[#3CB4FF]/10 text-[#3CB4FF] border border-[#3CB4FF]/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
            >
              <div className="w-6 h-6 rounded-lg bg-linear-to-br from-[#D21414] to-[#3CB4FF] flex items-center justify-center text-white text-[10px] font-bold">
                ✉
              </div>
              <span>Todas las cuentas</span>
            </button>

            {accounts.map((acc) => {
              const isActive = activeAccount === acc.email;
              const name = acc.email.split('@')[0].toLowerCase();
              let gradient = 'from-blue-500 to-cyan-600';
              if (name === 'juan.ampuero') gradient = 'from-emerald-500 to-teal-600';
              else if (name === 'corina.anorga') gradient = 'from-purple-500 to-fuchsia-600';
              else if (name === 'proyectos') gradient = 'from-blue-500 to-indigo-650';
              else if (name === 'ventas') gradient = 'from-amber-500 to-orange-600';
              else if (name === 'operaciones') gradient = 'from-rose-500 to-pink-650';

              return (
                <button
                  key={acc.email}
                  onClick={() => onAccountChange(acc.email)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer mb-1
                    ${isActive
                      ? 'bg-white/5 text-white border border-white/10'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-lg bg-linear-to-br ${gradient} flex items-center justify-center text-white text-[9px] font-bold`}>
                    {acc.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate flex-1 text-left">{acc.email.split('@')[0]}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Sections Navigation */}
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
              Secciones
            </p>
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = getSectionIcon(section.icon);
                const isActive = activeSection === section.id;
                const color = getSectionColor(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => onSectionChange(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer
                      ${isActive
                        ? 'text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    style={isActive ? {
                      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                      borderLeft: `3px solid ${color}`,
                      boxShadow: `0 0 12px ${color}22`,
                    } : {}}
                  >
                    <Icon size={16} style={{ color: isActive ? color : 'inherit', opacity: isActive ? 1 : 0.7 }} />
                    <span className="flex-1 text-left">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Folders Navigation */}
          <div className="px-4 py-3">
            <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
              Carpetas
            </p>
            <div className="space-y-1">
              {folders.map(({ key, label, icon: Icon }) => {
                const isActive = currentFolder === key;
                const color = isActive ? '#3CB4FF' : '#94A3B8';

                return (
                  <button
                    key={key}
                    onClick={() => onFolderChange(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer
                      ${isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    style={isActive ? {
                      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                      borderLeft: `3px solid ${color}`,
                    } : {}}
                  >
                    <Icon size={16} style={{ color: isActive ? color : 'inherit', opacity: isActive ? 1 : 0.7 }} />
                    <span className="flex-1 text-left">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between gap-3 shrink-0 bg-black/20">
          <button
            onClick={() => setShowAccounts(!showAccounts)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all text-xs font-semibold cursor-pointer"
          >
            <Settings size={14} />
            <span>Ajustes</span>
          </button>

          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-rose-950/40 bg-transparent hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all text-xs font-semibold cursor-pointer"
          >
            <LogOut size={14} />
            <span>Salir</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default MailSections;