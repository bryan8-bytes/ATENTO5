import React from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import './MailChrome.css';

const getAvatarColor = (email = '') => {
  const colors = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-violet-500 to-fuchsia-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-sky-500 to-blue-600',
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

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
    { key: 'inbox', label: 'Bandeja de entrada', icon: Inbox },
    { key: 'starred', label: 'Importantes', icon: Star },
    { key: 'sent', label: 'Elementos enviados', icon: Send },
    { key: 'drafts', label: 'Borradores', icon: FileText },
    { key: 'spam', label: 'Correo no deseado', icon: AlertOctagon },
    { key: 'trash', label: 'Elementos eliminados', icon: Trash2 },
    { key: 'archive', label: 'Archivo', icon: Archive },
  ];

  const renderFolderIcon = (icon, key) => {
    const Icon = icon;
    return (
      <Icon size={20} className={activeFolder === key ? 'text-[#3CB4FF]' : 'text-slate-400'} />
    );
  };

  return (
    <div className="mail-chrome">
      {mobileMenuOpen && (
        <div
          className="mail-chrome-overlay"
          onClick={onMobileMenuToggle}
        />
      )}
      <motion.aside
        initial={false}
        animate={{ x: mobileMenuOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="mail-chrome-sidebar"
      >
        <div className="mail-chrome-sidebar-header">
          <img src="/logo-atento5.png" alt="Atento5" className="mail-chrome-sidebar-logo" />
          <span className="mail-chrome-sidebar-brand">ATENTO5</span>
        </div>

        <div className="mail-chrome-compose">
          <button
            onClick={onOpenCompose}
            className="mail-chrome-compose-button"
          >
            <span className="text-lg leading-none">+</span>
            Redactar
          </button>
        </div>

        <nav className="mail-chrome-nav">
          <div className="mail-chrome-nav-list">
            {folders.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => onFolderChange(key)}
                className={`mail-chrome-nav-button ${activeFolder === key ? 'mail-chrome-nav-button-active' : ''}`}
              >
                {renderFolderIcon(icon, key)}
                <span className="flex-1 text-left">{label}</span>
                {key === 'inbox' && unreadCounts.inbox > 0 && (
                  <span className="mail-chrome-nav-badge">
                    {unreadCounts.inbox}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="mail-chrome-accounts">
          <p className="mail-chrome-accounts-title">Cuentas</p>
          <div className="mail-chrome-account-list">
            <button
              onClick={() => onAccountChange('all')}
              className={`mail-chrome-account-button ${activeAccount === 'all' ? 'mail-chrome-account-button-active' : ''}`}
            >
              <div className="mail-chrome-account-avatar bg-[#3CB4FF]/20 text-[#3CB4FF]">
                ✉
              </div>
              <span className="mail-chrome-account-email">Todas las cuentas</span>
            </button>
            {accounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => onAccountChange(acc.email)}
                className={`mail-chrome-account-button ${activeAccount === acc.email ? 'mail-chrome-account-button-active' : ''}`}
              >
                <div
                  className={`mail-chrome-account-avatar bg-gradient-to-br ${getAvatarColor(acc.email)}`}
                >
                  {acc.email.charAt(0).toUpperCase()}
                </div>
                <span className="mail-chrome-account-email" title={acc.email}>
                  {acc.email}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mail-chrome-logout">
          <button
            onClick={onLogout}
            className="mail-chrome-logout-button"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </motion.aside>

      <div className="mail-chrome-main">
        <header className="mail-chrome-header">
          <button
            onClick={onMobileMenuToggle}
            className="mail-chrome-header-menu lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="lg:hidden flex items-center gap-2 mr-2">
            <img src="/logo-atento5.png" alt="Atento5" className="h-6 w-auto object-contain" />
          </div>

          <div className="mail-chrome-search">
            <Search className="mail-chrome-search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar correo"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="mail-chrome-search-input"
            />
          </div>

          <div className="mail-chrome-header-actions">
            <button
              onClick={onOpenCompose}
              className="mail-chrome-header-compose"
            >
              <span className="text-base leading-none">+</span>
              <span>Redactar</span>
            </button>
            <div
              className="mail-chrome-header-avatar"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="mail-chrome-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MailChrome;
