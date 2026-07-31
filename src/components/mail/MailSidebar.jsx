import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, Send, FileText, AlertOctagon, Trash2,
  Star, Archive, LogOut, PenSquare, Settings
} from 'lucide-react';
import { useMail } from '../../context/MailContext';
import { useAuth } from '../../context/AuthContext';

const folders = [
  { id: 'INBOX', label: 'Bandeja de entrada', icon: Inbox },
  { id: 'Starred', label: 'Importantes', icon: Star },
  { id: 'Sent', label: 'Elementos enviados', icon: Send },
  { id: 'Drafts', label: 'Borradores', icon: FileText },
  { id: 'Spam', label: 'Correo no deseado', icon: AlertOctagon },
  { id: 'Trash', label: 'Elementos eliminados', icon: Trash2 },
  { id: 'Archive', label: 'Archivo', icon: Archive },
];

const MailSidebar = ({ onCompose, mobileOpen, onMobileClose, onShowSettings }) => {
  const { logout } = useAuth();
  const {
    currentFolder,
    setCurrentFolder,
    unreadCount,
    accounts,
    activeAccount,
    setActiveAccount,
  } = useMail();

  const [isMobile, setIsMobile] = useState(false);

  const handleFolderChange = (folder) => {
    setCurrentFolder(folder);
    if (onMobileClose) onMobileClose();
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Main Combined Sidebar Panel */}
      <motion.aside
        initial={false}
        animate={{
          x: mobileOpen ? 0 : (isMobile ? -320 : 0),
          width: '260px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className={`fixed lg:relative z-20 h-full flex flex-col shrink-0 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden border border-slate-800/80 bg-[#0B1220]/75 backdrop-blur-xl
          ${mobileOpen ? 'm-0 rounded-none border-0 h-full w-80' : ''}`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/40 min-h-[64px] shrink-0">
          <span className="text-xs font-bold bg-gradient-to-r from-[#D21414] to-[#3CB4FF] bg-clip-text text-transparent tracking-widest uppercase">
            ATENTO5 Mail
          </span>
        </div>

        {/* Compose Button */}
        <div className="p-4 shrink-0">
          <button
            onClick={onCompose}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D21414] via-rose-600 to-[#3CB4FF] hover:brightness-110 text-white rounded-xl py-3 text-xs font-extrabold shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all active:scale-[0.98] cursor-pointer border border-white/[0.05]"
            title="Redactar correo"
          >
            <PenSquare size={16} />
            <span>Redactar</span>
          </button>
        </div>

        {/* Folders List */}
        <nav 
          className="flex-1 overflow-y-auto px-3 space-y-2 py-3"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3CB4FF #0B1220',
          }}
        >
          <p className="text-[9px] font-bold text-slate-500 px-3 mb-2 uppercase tracking-wider">
            Carpetas
          </p>
          {folders.map((folder) => {
            const Icon = folder.icon;
            const isActive = currentFolder === folder.id;
            const count = unreadCount[folder.id] || 0;

            return (
              <button
                key={folder.id}
                onClick={() => handleFolderChange(folder.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 group border-l-2 cursor-pointer
                  ${isActive
                    ? 'bg-[#3CB4FF]/10 text-[#3CB4FF] border-[#3CB4FF] shadow-[inset_4px_0_12px_rgba(60,180,255,0.03)]'
                    : 'bg-transparent border-transparent hover:bg-white/[0.04] hover:border-l-white/20 text-slate-400 hover:text-slate-200 hover:translate-x-1'
                  }`}
              >
                <Icon
                  size={16}
                  className={`${isActive ? 'text-[#3CB4FF]' : 'text-slate-500 group-hover:text-slate-350'} transition-colors`}
                />
                <span className="flex-1 text-left truncate">{folder.label}</span>
                {count > 0 && (
                  <span className="text-[9px] font-extrabold bg-gradient-to-r from-[#D21414] to-red-600 text-white px-2 py-0.5 rounded-full min-w-[18px] text-center shadow-md shadow-red-500/20">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Accounts Section */}
          {accounts.length > 0 && (
            <div className="pt-6 mt-6 border-t border-slate-800/40">
              <p className="text-[9px] font-bold text-slate-500 px-3 mb-2 uppercase tracking-wider">
                Cuentas corporativas
              </p>
              
              {/* Unified Inbox */}
              <button
                onClick={() => setActiveAccount('all')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer mb-2
                  ${activeAccount === 'all'
                    ? 'bg-[#3CB4FF]/10 border-[#3CB4FF]/30 text-[#3CB4FF] shadow-lg shadow-black/10'
                    : 'bg-transparent border-transparent hover:bg-slate-850/30 hover:translate-x-1 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <div className="relative">
                  <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-br from-[#D21414] to-[#3CB4FF] text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                    ✉
                  </div>
                  {activeAccount === 'all' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#0B1220] animate-pulse" />
                  )}
                </div>
                <span className="truncate flex-1 text-left">Todas las cuentas</span>
              </button>

              {/* Individual Accounts */}
              {accounts.map((acc) => {
                const isActive = activeAccount === acc.email;
                const name = acc.email.split('@')[0].toLowerCase();
                let gradient = 'from-blue-500 to-cyan-600';
                let activeBorder = 'border-blue-550/30';
                let activeText = 'text-blue-450';
                
                if (name === 'juan.ampuero') {
                  gradient = 'from-emerald-500 to-teal-600';
                  activeBorder = 'border-emerald-500/30';
                  activeText = 'text-emerald-450';
                } else if (name === 'corina.anorga') {
                  gradient = 'from-purple-500 to-fuchsia-600';
                  activeBorder = 'border-purple-500/30';
                  activeText = 'text-purple-450';
                } else if (name === 'proyectos') {
                  gradient = 'from-blue-500 to-indigo-650';
                  activeBorder = 'border-blue-550/30';
                  activeText = 'text-blue-450';
                } else if (name === 'ventas') {
                  gradient = 'from-amber-500 to-orange-600';
                  activeBorder = 'border-amber-500/30';
                  activeText = 'text-amber-450';
                } else if (name === 'operaciones') {
                  gradient = 'from-rose-500 to-pink-650';
                  activeBorder = 'border-rose-550/30';
                  activeText = 'text-rose-450';
                }

                return (
                  <button
                    key={acc.email}
                    onClick={() => setActiveAccount(acc.email)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer mb-1.5
                      ${isActive
                        ? `bg-slate-900/40 ${activeBorder} ${activeText} shadow-lg shadow-black/10`
                        : 'bg-transparent border-transparent hover:bg-slate-850/30 hover:translate-x-1 text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    <div className="relative">
                      <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br ${gradient} shadow-sm`}>
                        {acc.email.charAt(0).toUpperCase()}
                      </div>
                      {isActive && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B1220] animate-pulse" />
                      )}
                    </div>
                    <span className="truncate flex-1 text-left" title={acc.email}>
                      {acc.email.split('@')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </nav>

        {/* Bottom Actions - Settings and Logout */}
        <div className="p-4 border-t border-slate-800/40 flex items-center justify-between gap-3 shrink-0 bg-slate-950/20">
          <button
            onClick={onShowSettings}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-800/60 bg-transparent hover:bg-slate-850/45 text-slate-400 hover:text-slate-200 transition-all text-xs font-semibold cursor-pointer"
            title="Configuración de la cuenta"
          >
            <Settings size={15} />
            <span>Ajustes</span>
          </button>

          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-rose-950/40 bg-transparent hover:bg-rose-500/10 text-slate-450 hover:text-rose-400 transition-all text-xs font-semibold cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut size={15} />
            <span>Salir</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default MailSidebar;
