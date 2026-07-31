import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, RefreshCw, Bell, Settings, HelpCircle,
  LogOut, ChevronDown, X, Menu, Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMail } from '../../context/MailContext';
import logoAtento5 from '../../../public/logo-atento5.png';

const MailHeader = ({ onCompose, onRefresh, loading, onMenuToggle, onShowSettings, onShowHelp }) => {
  const { user, logout } = useAuth();
  const { 
    syncFolder, 
    currentFolder, 
    unreadInboxEmails, 
    fetchEmail, 
    setSelectedEmail, 
    markAsRead, 
    setCurrentFolder, 
    searchEmails, 
    fetchEmails,
    setDateFilter
  } = useMail();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeDateFilter, setActiveDateFilter] = useState('all');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchEmails(searchQuery);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    await fetchEmails(currentFolder);
  };

  const handleDateFilter = async (filter) => {
    setActiveDateFilter(filter);
    setDateFilter(filter);
    await fetchEmails(currentFolder);
    setShowFilters(false);
  };

  const handleRefresh = async () => {
    await syncFolder(currentFolder);
    if (onRefresh) onRefresh();
  };

  // Get up to 5 unread emails dynamically
  const unreadEmails = unreadInboxEmails || [];

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      if (isNaN(date.getTime())) return '';
      if (diff < 60000) return 'Hace un momento';
      if (diff < 3600000) {
        const mins = Math.floor(diff / 60000);
        return `Hace ${mins} min`;
      }
      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `Hace ${hours} h`;
      }
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  const notifications = unreadEmails.slice(0, 5).map(email => ({
    id: email.id,
    title: email.from_name || email.from_email.split('@')[0],
    message: email.subject || '(Sin Asunto)',
    time: formatTimeAgo(email.date),
    unread: true,
    emailObj: email
  }));

  const handleNotificationClick = async (email) => {
    setShowNotifications(false);
    if (currentFolder !== 'INBOX') {
      setCurrentFolder('INBOX');
    }
    setSelectedEmail(email);
    try {
      await fetchEmail(email.id);
      if (!email.is_read) {
        await markAsRead(email.id, true);
      }
    } catch (err) {
      console.error('Error opening email from notification:', err);
    }
  };

  return (
    <header className="h-20 bg-[#050B14]/92 backdrop-blur-xl border-b border-[#3CB4FF]/25 flex items-center justify-between px-6 lg:px-8 shrink-0 relative z-30 transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.65),_0_0_20px_rgba(60,180,255,0.12)]">
      {/* Left: Volver al Inicio + Enlaces Rápidos + Logo */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 bg-slate-900/50 hover:bg-[#3CB4FF]/10 border border-slate-800/80 hover:border-[#3CB4FF]/40 rounded-xl text-slate-400 hover:text-[#3CB4FF] lg:hidden flex items-center justify-center active:scale-95 cursor-pointer shadow-md transition-all duration-300"
          title="Menú"
        >
          <Menu size={18} />
        </button>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/home')}
          className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 hover:bg-[#3CB4FF]/15 border border-slate-800 hover:border-[#3CB4FF]/40 rounded-xl text-xs font-semibold text-slate-300 hover:text-[#3CB4FF] transition-all duration-200 cursor-pointer"
          title="Ir a Inicio"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline font-bold">Volver</span>
        </button>

        <div className="h-6 w-[1px] bg-slate-800 hidden sm:block"></div>

        <div className="relative flex items-center gap-2">
          <div className="absolute inset-[-10px] bg-gradient-to-br from-[#3CB4FF]/15 to-transparent blur-md opacity-60 pointer-events-none" />
          <img 
            src={logoAtento5} 
            alt="Atento5" 
            className="h-8 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(60,180,255,0.35)]"
          />
          <span className="hidden xl:inline-block text-[10px] font-bold tracking-widest text-[#3CB4FF] uppercase bg-[#3CB4FF]/10 border border-[#3CB4FF]/25 px-2 py-0.5 rounded-md">
            CORREO
          </span>
        </div>
      </div>

      {/* Center: Large Search Bar */}
      <div className="flex-1 max-w-2xl mx-6 lg:mx-10">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3CB4FF] transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-20 py-2.5 bg-slate-950/60 focus:bg-[#050B14]/90 border border-slate-850/80 focus:border-[#3CB4FF]/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all shadow-2xl focus:ring-1 focus:ring-[#3CB4FF]/30 focus:shadow-[0_0_15px_rgba(60,180,255,0.08)]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showFilters ? 'bg-[#3CB4FF]/20 text-[#3CB4FF]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                title="Filtrar por fecha"
              >
                <Filter size={14} />
              </button>
            </div>
          </div>
        </form>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full mt-2 left-0 bg-[#0B1220]/95 backdrop-blur-xl border border-slate-800/80 rounded-xl shadow-2xl z-50 p-2 flex flex-col gap-1 w-48"
            >
              {[
                { value: 'all', label: 'Todas las fechas' },
                { value: 'today', label: 'Hoy' },
                { value: 'yesterday', label: 'Ayer' },
                { value: 'week', label: 'Última semana' },
                { value: 'month', label: 'Último mes' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleDateFilter(option.value)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${activeDateFilter === option.value ? 'bg-[#3CB4FF]/15 text-[#3CB4FF]' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'}`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-3 bg-slate-900/40 hover:bg-[#3CB4FF]/10 text-slate-400 hover:text-[#3CB4FF] border border-slate-800/50 hover:border-[#3CB4FF]/35 rounded-2xl transition-all duration-300 disabled:opacity-50 active:scale-95 cursor-pointer flex items-center justify-center shadow-lg shadow-black/20 hover:shadow-[#3CB4FF]/5 hover:scale-[1.05]"
          title="Actualizar"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>

        {/* Settings */}
        <button
          onClick={onShowSettings}
          className="p-3 bg-slate-900/40 hover:bg-[#3CB4FF]/10 text-slate-400 hover:text-[#3CB4FF] border border-slate-800/50 hover:border-[#3CB4FF]/35 rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center shadow-lg shadow-black/20 hover:shadow-[#3CB4FF]/5 hover:scale-[1.05]"
          title="Configuración"
        >
          <Settings size={20} />
        </button>

        {/* Help */}
        <button
          onClick={onShowHelp}
          className="p-3 bg-slate-900/40 hover:bg-[#3CB4FF]/10 text-slate-400 hover:text-[#3CB4FF] border border-slate-800/50 hover:border-[#3CB4FF]/35 rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center shadow-lg shadow-black/20 hover:shadow-[#3CB4FF]/5 hover:scale-[1.05]"
          title="Ayuda"
        >
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-slate-900/40 hover:bg-[#3CB4FF]/10 text-slate-400 hover:text-[#3CB4FF] border border-slate-800/50 hover:border-[#3CB4FF]/35 rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center relative shadow-lg shadow-black/20 hover:shadow-[#3CB4FF]/5 hover:scale-[1.05]"
            title="Notificaciones"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-3 w-80 bg-[#0B1220]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-800/60 bg-slate-900/20">
                    <h3 className="font-semibold text-sm text-slate-200">Notificaciones</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                        No hay correos no leídos
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.emailObj)}
                          className="p-4 border-b border-slate-800/40 hover:bg-[#3CB4FF]/5 cursor-pointer transition-colors bg-[#3CB4FF]/5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#3CB4FF] rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#3CB4FF]" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#3CB4FF] truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs text-slate-250 truncate mt-0.5 font-medium">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-800/60 bg-slate-900/10">
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        setSelectedEmail(null);
                        setCurrentFolder('INBOX');
                      }}
                      className="w-full text-xs font-semibold text-[#3CB4FF] hover:text-[#3CB4FF]/80 transition-colors"
                    >
                      Ver todas las notificaciones
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="group flex items-center gap-3 p-1.5 bg-slate-900/40 hover:bg-[#3CB4FF]/10 border border-slate-800/50 hover:border-[#3CB4FF]/35 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg shadow-black/20 hover:scale-[1.03]"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform ring-1 ring-white/10">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <ChevronDown size={15} className="text-slate-450 group-hover:text-white transition-colors mr-1" />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-3 w-56 bg-[#0B1220]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-800/60 bg-slate-900/20">
                    <p className="font-semibold text-sm text-slate-200">
                      {user?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-slate-450 mt-0.5 truncate">
                      {user?.email || 'usuario@atento5.com'}
                    </p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        onShowSettings();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-350 hover:bg-slate-800/60 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Settings size={16} />
                      <span>Configuración</span>
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Compose Button (Desktop) */}
        <button
          onClick={onCompose}
          className="hidden lg:flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#D21414] via-rose-600 to-[#3CB4FF] hover:brightness-110 text-white rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-red-500/15 hover:shadow-red-500/25 active:scale-95 cursor-pointer border border-white/[0.08] hover:scale-[1.03]"
        >
          <span className="text-lg leading-none font-bold">+</span>
          <span>Redactar</span>
        </button>
      </div>
    </header>
  );
};

export default MailHeader;
