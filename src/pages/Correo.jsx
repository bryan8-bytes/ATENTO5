import { useState, useEffect, useRef } from 'react';
import { useMail } from '../context/MailContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, RefreshCw, X, Plus, Menu, 
  Paperclip, Download, FileSpreadsheet, FileImage, 
  FileArchive, FileCode, FileText,
  Bell, Reply, ReplyAll, Forward, Settings, HelpCircle,
  Inbox, Send, AlertOctagon, Trash2,
  Shield, LogOut, Sliders, Filter, Building2, User, Mail, LifeBuoy, ChevronDown
} from 'lucide-react';
import EmailList from '../components/mail/EmailList';
import EmailDetail from '../components/mail/EmailDetail';
import EmailComposer from '../components/mail/EmailComposer';


// Helper for generating dynamic colors for user avatars
const getAvatarColor = (email = '') => {
  const colors = [
    'from-indigo-500 to-purple-600 shadow-indigo-200 dark:shadow-none',
    'from-blue-500 to-cyan-600 shadow-blue-200 dark:shadow-none',
    'from-emerald-500 to-teal-600 shadow-emerald-200 dark:shadow-none',
    'from-violet-500 to-fuchsia-600 shadow-violet-200 dark:shadow-none',
    'from-rose-500 to-pink-600 shadow-rose-200 dark:shadow-none',
    'from-amber-500 to-orange-600 shadow-amber-200 dark:shadow-none',
    'from-sky-500 to-blue-600 shadow-sky-200 dark:shadow-none'
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Map file types to Lucide Icons
const getFileIcon = (filename = '') => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['xls', 'xlsx', 'csv'].includes(ext)) return FileSpreadsheet;
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return FileImage;
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return FileArchive;
  if (['html', 'css', 'js', 'json', 'py', 'sh', 'sql'].includes(ext)) return FileCode;
  return FileText;
};

// Map file types to modern Tailwind badge styles
const getFileStyle = (filename = '') => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 border-emerald-200/50 dark:bg-emerald-950/20 dark:border-emerald-800/30';
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
    return 'text-purple-600 dark:text-purple-400 bg-purple-50/70 border-purple-200/50 dark:bg-purple-950/20 dark:border-purple-800/30';
  }
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
    return 'text-amber-600 dark:text-amber-400 bg-amber-50/70 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-800/30';
  }
  if (ext === 'pdf') {
    return 'text-rose-600 dark:text-rose-400 bg-rose-50/70 border-rose-200/50 dark:bg-rose-950/20 dark:border-rose-800/30';
  }
  if (['doc', 'docx'].includes(ext)) {
    return 'text-blue-600 dark:text-blue-400 bg-blue-50/70 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-800/30';
  }
  return 'text-slate-655 bg-slate-50/70 border-slate-200/50 dark:bg-slate-800/20 dark:border-slate-700/30';
};

// Sandboxed HTML Renderer to prevent CSS style leaks
const EmailHtmlRenderer = ({ html }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();

    // Check if parent application has dark mode class active
    const isDark = document.documentElement.classList.contains('dark') || 
                   document.body.classList.contains('dark') || 
                   !!document.querySelector('.dark');

    // Premium styling wrapper inside the sandboxed iframe
    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: ${isDark ? '#cbd5e1' : '#334155'};
              line-height: 1.8;
              margin: 0;
              padding: 32px 40px;
              word-break: break-word;
              font-size: 15.5px;
              background-color: ${isDark ? '#0b0f19' : '#ffffff'};
              transition: background-color 0.3s ease;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 12px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
              margin: 16px 0;
            }
            a {
              color: ${isDark ? '#60a5fa' : '#2563eb'};
              text-decoration: none;
              font-weight: 600;
              border-bottom: 2px solid transparent;
              transition: border-color 0.2s ease;
            }
            a:hover {
              border-bottom-color: ${isDark ? '#60a5fa' : '#2563eb'};
            }
            pre {
              background-color: ${isDark ? '#1e293b' : '#f8fafc'};
              color: ${isDark ? '#cbd5e1' : '#334155'};
              padding: 16px;
              border-radius: 12px;
              overflow-x: auto;
              font-size: 13.5px;
              border: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
              margin: 20px 0;
            }
            blockquote {
              border-left: 4px solid ${isDark ? '#3b82f6' : '#2563eb'};
              margin: 20px 0;
              padding-left: 20px;
              color: ${isDark ? '#94a3b8' : '#64748b'};
              font-style: italic;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    doc.write(styledHtml);
    doc.close();

    const resizeObserver = new ResizeObserver(() => {
      if (iframe.contentWindow && doc.body) {
        iframe.style.height = `${doc.body.scrollHeight + 16}px`;
      }
    });

    if (doc.body) {
      resizeObserver.observe(doc.body);
    }

    return () => resizeObserver.disconnect();
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title="Cuerpo del Correo"
      className="w-full border-0 bg-transparent transition-all duration-300"
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
  );
};

// Helper for generating dynamic colors for accounts badges
const getAccountBadgeStyle = (email = '') => {
  const name = email.split('@')[0].toLowerCase();
  switch (name) {
    case 'juan.ampuero':
      return 'bg-emerald-50/70 border-emerald-200/20 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-800/30';
    case 'corina.anorga':
      return 'bg-purple-50/70 border-purple-200/20 text-purple-600 dark:text-purple-400 dark:bg-purple-950/20 dark:border-purple-800/30';
    case 'proyectos':
      return 'bg-blue-50/70 border-blue-200/20 text-blue-600 dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-800/30';
    case 'ventas':
      return 'bg-amber-50/70 border-amber-200/20 text-amber-600 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-800/30';
    case 'operaciones':
      return 'bg-rose-50/70 border-rose-200/20 text-rose-600 dark:text-rose-400 dark:bg-rose-950/20 dark:border-rose-800/30';
    default:
      return 'bg-slate-50/70 border-slate-200/50 text-slate-550 dark:text-slate-400 dark:bg-slate-800/20 dark:border-slate-700/30';
  }
};

const getAccountLabel = (email = '') => {
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const Correo = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    emails,
    currentFolder,
    selectedEmail,
    loading,
    error,
    folders,
    unreadCount,
    accounts,
    activeAccount,
    setActiveAccount,
    selectedCategory,
    setSelectedCategory,
    selectedOrigin,
    setSelectedOrigin,
    selectedPriority,
    setSelectedPriority,
    getFilteredEmails,
    setCurrentFolder,
    setSelectedEmail,
    fetchEmails,
    fetchEmail,
    markAsRead,
    toggleStar,
    deleteEmail,
    searchEmails,
    syncFolder,
    sendEmail,
    saveDraft,
    getAttachments,
    downloadAttachment,
    augmentEmail
  } = useMail();

  const [showComposer, setShowComposer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [composerMode, setComposerMode] = useState('new'); // 'new' | 'reply' | 'replyAll' | 'forward'
  const [composerEmail, setComposerEmail] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeTheme, setActiveTheme] = useState(localStorage.getItem('mail_theme') || 'glow');

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const handleEmailClick = async (email) => {
    if (!email) return;
    setSelectedEmail(email);
    try {
      await fetchEmail(email.id);
      if (!email.is_read) {
        await markAsRead(email.id, true);
      }
      if (email.has_attachments) {
        const emailAttachments = await getAttachments(email.id);
        setAttachments(emailAttachments);
      } else {
        setAttachments([]);
      }
    } catch (err) {
      console.error('Error al cargar detalles de correo:', err);
    }
  };

  // Auto-select first email on load if none selected
  useEffect(() => {
    const filtered = getFilteredEmails();
    if (!selectedEmail && filtered && filtered.length > 0) {
      handleEmailClick(filtered[0]);
    }
  }, [emails, currentFolder, activeAccount]);

  const handleRefresh = async () => {
    try {
      await syncFolder(currentFolder);
      addToast('Bandeja de correo actualizada con éxito', 'success');
    } catch (err) {
      addToast('Error al sincronizar el correo', 'error');
    }
  };

  const handleDelete = async () => {
    if (selectedEmail) {
      try {
        await deleteEmail(selectedEmail.id);
        addToast('Correo movido a Elementos eliminados', 'info');
      } catch (err) {
        addToast('Error al eliminar el correo', 'error');
      }
    }
  };

  const handleStar = async () => {
    if (selectedEmail) {
      try {
        const isStarred = !selectedEmail.is_starred;
        await toggleStar(selectedEmail.id, isStarred);
        addToast(isStarred ? 'Marcado como importante' : 'Quitado de importantes', 'success');
      } catch (err) {
        addToast('Error al actualizar el correo', 'error');
      }
    }
  };

  const handleReply = (email) => {
    setComposerMode('reply');
    setComposerEmail(email);
    setShowComposer(true);
  };

  const handleReplyAll = (email) => {
    setComposerMode('replyAll');
    setComposerEmail(email);
    setShowComposer(true);
  };

  const handleForward = (email) => {
    setComposerMode('forward');
    setComposerEmail(email);
    setShowComposer(true);
  };

  const getFolderIcon = (iconName) => {
    const icons = { Inbox, Send, FileText, AlertOctagon, Trash2 };
    const Icon = icons[iconName] || Inbox;
    return <Icon size={18} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) { // Less than 24h
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) { // Less than 7 days
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      
      if (key === 'escape') {
        setSelectedEmail(null);
        setShowComposer(false);
        setShowSettings(false);
        setShowHelp(false);
      } else if (key === 'c') {
        e.preventDefault();
        setComposerMode('new');
        setComposerEmail(null);
        setShowComposer(true);
      } else if (key === 'r' && selectedEmail) {
        e.preventDefault();
        handleReply(selectedEmail);
      } else if (key === 'a' && selectedEmail) {
        e.preventDefault();
        handleReplyAll(selectedEmail);
      } else if (key === 'f' && selectedEmail) {
        e.preventDefault();
        handleForward(selectedEmail);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEmail]);

  // Auto-sync interval
  useEffect(() => {
    const freq = localStorage.getItem('mail_sync_freq') || 'manual';
    if (freq === 'manual') return;

    const minutes = parseInt(freq, 10);
    if (isNaN(minutes) || minutes <= 0) return;

    const interval = setInterval(() => {
      syncFolder(currentFolder);
      addToast('Correo sincronizado automáticamente', 'success');
    }, minutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentFolder, activeAccount]);

  // Calculate summary counts dynamically from emails list
  const totalCount = emails.length;
  const unreadTotal = emails.filter(e => !e.is_read).length;
  const gobiernoCount = emails.filter(e => {
    const augmented = augmentEmail(e);
    return augmented.origen === 'Gobierno';
  }).length;
  const internosCount = emails.filter(e => {
    const augmented = augmentEmail(e);
    return augmented.origen === 'Interno';
  }).length;

  const unreadInternos = emails.filter(e => {
    const augmented = augmentEmail(e);
    return augmented.origen === 'Interno' && !augmented.is_read;
  }).length;

  const unreadGobierno = emails.filter(e => {
    const augmented = augmentEmail(e);
    return augmented.origen === 'Gobierno' && !augmented.is_read;
  }).length;

  return (
    <div className="h-screen w-screen flex flex-row font-sans antialiased overflow-hidden relative select-none" style={{ backgroundColor: '#050B14', color: '#E5E7EB' }}>
      
      {/* ── COLUMNA 1: SIDEBAR INTRAPORTAL ── */}
      <aside className="w-64 flex flex-col border-r shrink-0 h-full" style={{ backgroundColor: '#050B14', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        {/* Logo Brand */}
        <div className="p-6 pb-4 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
            <Shield size={20} className="fill-white/10" />
          </div>
          <span className="font-extrabold text-slate-800 text-lg tracking-tight">IntraPortal</span>
        </div>

        {/* User profile block */}
        <div className="px-6 py-4 flex items-center gap-3 shrink-0" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-extrabold shadow-lg shrink-0" style={{ background: 'linear-gradient(135deg, var(--color-electric), var(--color-celeste))' }}>
            {(user?.name || "María González").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white truncate">{user?.name || "María González"}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide truncate">{user?.role || "Recursos Humanos"}</div>
          </div>
        </div>

        {/* Active Account / Organization Selector */}
        <div className="px-6 py-3 shrink-0">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/10 border rounded-xl text-left transition-all active:scale-[0.98]"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 shadow-sm shadow-indigo-300"></div>
              <span className="text-[11px] font-bold text-slate-700 truncate">
                {activeAccount === 'all' ? 'Servicios Profesionales S.A.S' : getAccountLabel(activeAccount)}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Menu principal */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <p className="text-[9px] font-extrabold uppercase tracking-widest px-3 py-2" style={{ color: 'rgba(60, 180, 255, 0.85)' }}>
            Principal
          </p>
          
          {/* Bandeja de Mensajes */}
          <button 
            onClick={() => {
              setCurrentFolder('INBOX');
              setSelectedOrigin('all');
              setSelectedPriority('all');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all
              ${currentFolder === 'INBOX' && selectedOrigin === 'all' && selectedPriority === 'all'
                ? 'text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            style={
              currentFolder === 'INBOX' && selectedOrigin === 'all' && selectedPriority === 'all'
                ? { background: 'rgba(60, 180, 255, 0.12)', boxShadow: '0 0 12px rgba(60, 180, 255, 0.15)' }
                : {}
            }
          >
            <div className="flex items-center gap-3">
              <Mail size={16} className={currentFolder === 'INBOX' ? 'text-blue-500' : 'text-slate-400'} />
              <span>Bandeja de Mensajes</span>
            </div>
            {unreadTotal > 0 && (
              <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadTotal}
              </span>
            )}
          </button>

          {/* Servicios y Contacto */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
            <Building2 size={16} className="text-slate-500" />
            <span>Servicios y Contacto</span>
          </button>

          {/* Notificaciones */}
          <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-slate-500" />
              <span>Notificaciones</span>
            </div>
            <span className="text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full min-w-[20px] text-center" style={{ background: 'rgba(210, 20, 20, 0.25)', border: '1px solid rgba(210, 20, 20, 0.35)' }}>
              2
            </span>
          </button>

          {/* Documentos */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
            <FileText size={16} className="text-slate-500" />
            <span>Documentos</span>
          </button>

          {/* Soporte */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
            <LifeBuoy size={16} className="text-slate-500" />
            <span>Soporte</span>
          </button>
        </nav>

        {/* Bottom Options */}
        <div className="p-4 space-y-1 shrink-0" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <Settings size={16} className="text-slate-500" />
            <span>Configuración</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <LogOut size={16} className="text-slate-500" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ── COLUMNA 2: SUB-SIDEBAR (FOLDERS & FILTERS) ── */}
      <aside className="w-56 flex flex-col border-r shrink-0 h-full justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: '#050B14' }}>
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 pb-2 shrink-0">
            <h2 className="font-extrabold text-slate-800 text-base tracking-tight">Bandeja de Entrada</h2>
            <p className="text-[11px] font-bold text-slate-400 mt-0.5">{unreadTotal} sin leer</p>
          </div>

          {/* Origen Group */}
          <div className="px-4 py-2">
            <p className="text-[9px] font-extrabold text-slate-400 px-3 py-2 uppercase tracking-widest">
              Origen
            </p>
            <div className="space-y-0.5">
              <button 
                onClick={() => setSelectedOrigin('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all
                  ${selectedOrigin === 'all' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <span>Todos</span>
              </button>
              <button 
                onClick={() => setSelectedOrigin('Interno')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all
                  ${selectedOrigin === 'Interno' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <span>Internos</span>
                {unreadInternos > 0 && (
                  <span className="text-[9px] font-extrabold bg-blue-600 text-white px-1.5 py-0.5 rounded-full min-w-[15px] text-center shadow-sm">
                    {unreadInternos}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setSelectedOrigin('Gobierno')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all
                  ${selectedOrigin === 'Gobierno' ? 'text-purple-600 bg-purple-50/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <span>Gobierno</span>
                {unreadGobierno > 0 && (
                  <span className="text-[9px] font-extrabold bg-purple-600 text-white px-1.5 py-0.5 rounded-full min-w-[15px] text-center shadow-sm">
                    {unreadGobierno}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Prioridad Group */}
          <div className="px-4 py-2">
            <p className="text-[9px] font-extrabold text-slate-400 px-3 py-2 uppercase tracking-widest">
              Prioridad
            </p>
            <div className="space-y-0.5">
              {[
                { id: 'all', label: 'Todas', color: 'bg-blue-500' },
                { id: 'Urgente', label: 'Urgente', color: 'bg-red-500 shadow-red-200' },
                { id: 'Alta', label: 'Alta', color: 'bg-amber-500 shadow-amber-200' },
                { id: 'Normal', label: 'Normal', color: 'bg-blue-500 shadow-blue-200' },
                { id: 'Informativa', label: 'Informativa', color: 'bg-slate-400 shadow-slate-200' }
              ].map(p => (
                <button 
                  key={p.id}
                  onClick={() => setSelectedPriority(p.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold transition-all
                    ${selectedPriority === p.id ? 'text-blue-600 bg-blue-50/50 font-extrabold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.color} shrink-0 shadow-[0_0_6px]`}></span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen Box */}
        <div className="p-4 shrink-0">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5 text-[11px] text-slate-600 font-bold">
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-1.5 mb-2">
              Resumen
            </p>
            <div className="flex items-center justify-between">
              <span>Total mensajes</span>
              <span className="text-slate-800 font-extrabold">{totalCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Sin leer</span>
              <span className="text-red-500 font-extrabold">{unreadTotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gobierno</span>
              <span className="text-purple-600 font-extrabold">{gobiernoCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Internos</span>
              <span className="text-emerald-600 font-extrabold">{internosCount}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── COLUMNA 3: LISTA DE CORREOS ── */}
      <div className={`w-full lg:w-[400px] border-r flex flex-col shrink-0 transition-all duration-300 h-full bg-[#050B14]
        ${selectedEmail ? 'hidden lg:flex' : 'flex'}`}
        style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
      >
        <EmailList
          selectedEmailId={selectedEmail?.id}
          onSelectEmail={handleEmailClick}
          filteredEmails={getFilteredEmails()}
          onCompose={() => {
            setComposerMode('new');
            setComposerEmail(null);
            setShowComposer(true);
          }}
          onRefresh={handleRefresh}
          loading={loading}
        />
      </div>

      {/* ── COLUMNA 4: DETALLE DEL CORREO ── */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 bg-[#050B14]
        ${selectedEmail ? 'flex' : 'hidden lg:flex'}`}
      >
        <EmailDetail
          selectedEmail={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          attachments={attachments}
          setAttachments={setAttachments}
          onReply={handleReply}
          onReplyAll={handleReplyAll}
          onForward={handleForward}
        />
      </div>

      {/* Composer Panel - Side sliding panel */}
      <ComposerPanel
        show={showComposer}
        onClose={() => {
          setShowComposer(false);
          setComposerMode('new');
          setComposerEmail(null);
        }}
        onSend={async (emailData) => {
          try {
            await sendEmail(emailData);
            setShowComposer(false);
            setComposerMode('new');
            setComposerEmail(null);
            addToast('Correo enviado con éxito', 'success');
            fetchEmails('Sent');
          } catch (err) {
            addToast('Error al enviar el correo', 'error');
          }
        }}
        onSaveDraft={async (draftData) => {
          try {
            await saveDraft(draftData);
            setShowComposer(false);
            setComposerMode('new');
            setComposerEmail(null);
            addToast('Borrador guardado', 'success');
          } catch (err) {
            addToast('Error al guardar el borrador', 'error');
          }
        }}
        mode={composerMode}
        originalEmail={composerEmail}
      />

      {/* Settings Panel - Side sliding panel */}
      <SettingsPanel
        show={showSettings}
        onClose={() => setShowSettings(false)}
        addToast={addToast}
        onThemeChange={(newTheme) => setActiveTheme(newTheme)}
      />

      {/* Help Modal */}
      <HelpModal
        show={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.15 } }}
              className={`p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 pointer-events-auto select-none
                ${toast.type === 'error'
                  ? 'bg-white/95 border-rose-250 text-rose-700 shadow-rose-100 shadow-lg'
                  : toast.type === 'info'
                    ? 'bg-white/95 border-blue-250 text-blue-700 shadow-blue-100 shadow-lg'
                    : 'bg-white/95 border-emerald-250 text-emerald-700 shadow-emerald-100 shadow-lg'
                }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full shrink-0
                ${toast.type === 'error' ? 'bg-rose-500 shadow-md shadow-rose-350' : toast.type === 'info' ? 'bg-blue-500 shadow-md shadow-blue-350' : 'bg-emerald-500 shadow-md shadow-emerald-350'}`}
              />
              <span className="text-xs font-bold">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Composer Panel - Slides in from right side without dark overlay
const ComposerPanel = ({ show, onClose, mode, originalEmail, onSend, onSaveDraft }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-full max-w-2xl h-full bg-white/95 backdrop-blur-xl border-l border-slate-200 rounded-l-[32px] shadow-[0_0_50px_rgba(0,0,0,0.12)] z-50 flex flex-col overflow-hidden text-slate-800"
        >
          <EmailComposer
            onClose={onClose}
            onSend={onSend}
            onSaveDraft={onSaveDraft}
            mode={mode}
            originalEmail={originalEmail}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Settings Panel Component
const SettingsPanel = ({ show, onClose, addToast, onThemeChange }) => {
  const { user } = useAuth();
  const { activeAccount } = useMail();
  const [signature, setSignature] = useState(localStorage.getItem('email_signature') || '');
  const [syncFreq, setSyncFreq] = useState(localStorage.getItem('mail_sync_freq') || 'manual');
  const [theme, setTheme] = useState(localStorage.getItem('mail_theme') || 'glow');

  const handleSave = () => {
    localStorage.setItem('email_signature', signature);
    localStorage.setItem('mail_sync_freq', syncFreq);
    localStorage.setItem('mail_theme', theme);
    onThemeChange(theme);
    addToast('Configuración guardada correctamente', 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white/95 backdrop-blur-2xl border-l border-slate-200 rounded-l-[32px] shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 flex flex-col overflow-hidden text-slate-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-[#3CB4FF]" />
                <h3 className="font-bold text-base text-slate-800">Configuración</h3>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Account details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detalles de la Cuenta</h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Usuario</span>
                    <span className="text-xs font-bold text-slate-700">{user?.name || 'Usuario'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Correo Electrónico</span>
                    <span className="text-xs font-bold text-slate-700">{user?.email || 'usuario@atento5.com'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Cuenta Activa (IMAP)</span>
                    <span className="text-xs font-mono font-bold text-[#3CB4FF] bg-[#3CB4FF]/10 px-2 py-0.5 rounded-md border border-[#3CB4FF]/25 inline-block mt-1">
                      {activeAccount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email signature */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Firma de Correo Personal</h4>
                <p className="text-[10px] text-slate-400 font-medium">Esta firma de texto se añadirá al final de tus correos salientes automáticamente.</p>
                <textarea
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Saludos cordiales,&#10;Mi Nombre&#10;Cargo"
                  rows={4}
                  className="w-full p-3 bg-white border border-slate-200 focus:border-[#3CB4FF]/55 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none shadow-sm"
                />
              </div>

              {/* Theme Settings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tema de Interfaz</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'glow', label: 'Obsidian Glow' },
                    { id: 'classic', label: 'Pure Obsidian' },
                    { id: 'glass', label: 'Electric Glass' },
                    { id: 'light', label: 'Executive Light' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`py-2 px-3 text-center rounded-xl border text-[10px] font-bold transition-all cursor-pointer
                        ${theme === t.id
                          ? 'bg-[#3CB4FF]/10 border-[#3CB4FF]/40 text-[#3CB4FF] shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sync Interval */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Frecuencia de Sincronización</h4>
                <select
                  value={syncFreq}
                  onChange={(e) => setSyncFreq(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 focus:border-[#3CB4FF]/50 rounded-xl text-xs text-slate-800 focus:outline-none transition-all cursor-pointer shadow-sm"
                >
                  <option value="manual">Manual (Al hacer clic en actualizar)</option>
                  <option value="1">Cada 1 minuto (Modo rápido)</option>
                  <option value="5">Cada 5 minutos</option>
                  <option value="15">Cada 15 minutos</option>
                  <option value="30">Cada 30 minutos</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-150 flex items-center justify-end gap-3 bg-slate-50/50">
              <button
                onClick={onClose}
                className="px-4 py-2 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-lg text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Help Modal Component
const HelpModal = ({ show, onClose }) => {
  const [activeTab, setActiveTab] = useState('inicio');

  return (
    <AnimatePresence>
      {show && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl z-[90] overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-blue-600" />
                <h3 className="font-bold text-base text-slate-800">Guía de Ayuda</h3>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-150 bg-slate-50/50 px-6">
              {[
                { id: 'inicio', label: 'Bandeja inteligente' },
                { id: 'shortcuts', label: 'Atajos de teclado' },
                { id: 'soporte', label: 'Soporte técnico' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer relative
                    ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-450 hover:text-slate-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-655 space-y-4">
              {activeTab === 'inicio' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Organización de Correos en ATENTO5</h4>
                  <p className="leading-relaxed">
                    Nuestra bandeja inteligente clasifica automáticamente los correos entrantes en categorías lógicas basadas en su remitente y contenido:
                  </p>
                  <ul className="space-y-2 mt-2">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span><strong>Prioritarios:</strong> Correos de contacto directo y de máxima relevancia para tu trabajo diario.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span><strong>Importantes:</strong> Mensajes marcados con estrellas o identificados con palabras clave urgentes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <span><strong>Anuncios:</strong> Boletines, newsletters y comunicados de carácter general.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                      <span><strong>Otros:</strong> Notificaciones automáticas de redes o sistemas que no requieren atención prioritaria.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'shortcuts' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Atajos de Teclado del Correo</h4>
                  <p className="leading-relaxed">
                    Optimiza tu tiempo utilizando las siguientes teclas rápidas para controlar el flujo de trabajo:
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Redactar nuevo correo</span>
                      <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono text-blue-600 shadow-sm">C</kbd>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Responder al remitente</span>
                      <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono text-blue-600 shadow-sm">R</kbd>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Responder a todos</span>
                      <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono text-blue-600 shadow-sm">A</kbd>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Reenviar correo</span>
                      <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono text-blue-600 shadow-sm">F</kbd>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between col-span-2">
                      <span className="text-[11px] text-slate-500">Cerrar modales, paneles o deseleccionar correo</span>
                      <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono text-blue-600 shadow-sm">Esc</kbd>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'soporte' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Asistencia Técnica de ATENTO5</h4>
                  <p className="leading-relaxed">
                    Si necesitas soporte o conectar tus cuentas IMAP/SMTP adicionales, contacta a nuestro equipo:
                  </p>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-2">
                    <p className="text-xs text-slate-700">
                      <strong>Canal oficial:</strong> support@atento5.com
                    </p>
                    <p className="text-xs text-slate-700">
                      <strong>Horario de atención:</strong> Lunes a Viernes (8:00 AM - 6:00 PM)
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 italic text-center mt-4">
                    ATENTO5 Premium Email Client - v1.4.0 Executive Light Edition
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-150 flex items-center justify-end bg-slate-50/50">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Cerrar Guía
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Correo;
