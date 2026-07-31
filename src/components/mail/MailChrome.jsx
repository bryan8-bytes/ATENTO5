import React from 'react';
import { motion } from 'framer-motion';
import logo from '../../assets/Logo Atento5.png';
import {
  Inbox,
  Star,
  Send,
  FileText,
  Trash2,
  LogOut,
  Search,
  Menu,
  AlertOctagon,
  Archive,
} from 'lucide-react';

const MailChrome = ({
  user,
  onLogout,
  activeFolder,
  onFolderChange,
  activeAccount,
  onAccountChange,
  accounts,
  unreadCounts,
  onOpenCompose,
  onMobileMenuToggle,
  mobileMenuOpen,
  searchQuery,
  onSearchChange,
  children,
}) => {
  const folders = [
    { key: 'inbox', label: 'Bandeja', icon: Inbox },
    { key: 'starred', label: 'Importantes', icon: Star },
    { key: 'sent', label: 'Enviados', icon: Send },
    { key: 'drafts', label: 'Borradores', icon: FileText },
    { key: 'spam', label: 'Spam', icon: AlertOctagon },
    { key: 'trash', label: 'Papelera', icon: Trash2 },
    { key: 'archive', label: 'Archivo', icon: Archive },
  ];

  return (
    <div
      className="h-screen w-full flex text-slate-200 overflow-hidden"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileMenuToggle}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: mobileMenuOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 210 }}
        className="fixed lg:relative z-50 h-full flex flex-col"
        style={{
          background: '#050B14',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
          width: '48px',
          padding: '18px 6px',
        }}
      >
        <div className="flex flex-col items-center gap-3 mb-4">
          {folders.map(({ key, label, icon: Icon }, index) => {
            const isActive = activeFolder === key;
            const color = index % 2 === 0 ? '#3CB4FF' : '#D21414';

            return (
              <div
                key={key}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <motion.button
                  onClick={() => onFolderChange(key)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isActive ? 30 : 16,
                    height: isActive ? 30 : 16,
                    borderRadius: '50%',
                    background: isActive ? `linear-gradient(135deg, ${color}, ${index % 2 === 0 ? '#D21414' : '#3CB4FF'})` : 'rgba(255, 255, 255, 0.92)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 0 22px ${color}, 0 0 40px ${color}45` : '0 0 6px rgba(255, 255, 255, 0.18)',
                    transform: isActive ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling;
                    if (tooltip) tooltip.style.opacity = '0';
                  }}
                >
                  <Icon
                    size={isActive ? 18 : 14}
                    style={{
                      color: isActive ? '#fff' : 'rgba(148, 163, 184, 0.85)',
                      filter: isActive ? 'drop-shadow(0 0 4px currentColor)' : 'none',
                    }}
                  />
                </motion.button>
                <div
                  style={{
                    position: 'absolute',
                    right: '42px',
                    background: '#050B14',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                    border: `1px solid ${color}`,
                    boxShadow: `0 0 12px ${color}45`,
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.18s ease',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onLogout}
            className="p-2 rounded-full text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-16 border-b flex items-center px-4 lg:px-6 gap-3 shrink-0" style={{ backgroundColor: '#050B14', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center justify-center">
            <img src={logo} alt="ATENTO5" className="h-9 w-auto object-contain drop-shadow-[0_0_10px_rgba(60,180,255,0.3)]" />
          </div>

          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Buscar correo"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 focus:border-white/20 rounded-full text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenCompose}
              className="flex items-center gap-1.5 px-3 py-2 text-white rounded-full text-sm font-semibold shadow-sm transition-colors active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, var(--color-electric), var(--color-celeste))',
                boxShadow: '0 4px 15px rgba(210, 20, 20, 0.25)',
              }}
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">Redactar</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <img src={logo} alt="ATENTO5" className="h-8 w-auto object-contain" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden" style={{ backgroundColor: '#050B14' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MailChrome;
