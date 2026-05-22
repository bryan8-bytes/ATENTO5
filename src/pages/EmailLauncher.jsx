import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Send, Inbox, Star, FileText,
  Trash2, ExternalLink, RefreshCw, ChevronRight,
  AlertCircle, Wifi, Clock, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Logo Atento5.png';

// ─────────────────────────────────────────────
// Static quick-access folders (visual only)
// ─────────────────────────────────────────────
const FOLDERS = [
  { icon: Inbox,    label: 'Bandeja de entrada', color: '#3CB4FF', key: 'inbox'   },
  { icon: Send,     label: 'Enviados',            color: '#10b981', key: 'sent'    },
  { icon: Star,     label: 'Destacados',          color: '#f59e0b', key: 'starred' },
  { icon: FileText, label: 'Borradores',          color: '#a78bfa', key: 'drafts'  },
  { icon: Trash2,   label: 'Eliminados',          color: '#ef4444', key: 'trash'   },
];

// Build the OWA deep-link for a given folder key
const buildOWAUrl = (email, folderKey = 'inbox') => {
  const base = 'https://outlook.office.com/mail';
  const folderPaths = {
    inbox:   '',
    sent:    '/sentitems',
    starred: '/flagged',
    drafts:  '/drafts',
    trash:   '/deleteditems',
  };
  const hint = `?login_hint=${encodeURIComponent(email)}`;
  return `${base}${folderPaths[folderKey] ?? ''}/${hint}`;
};

// ─────────────────────────────────────────────
// Tips shown in a rotating carousel
// ─────────────────────────────────────────────
const TIPS = [
  'Atajo rápido: Ctrl + N para redactar un nuevo correo en Outlook.',
  'Usa categorías de color en Outlook para priorizar tus correos.',
  'La búsqueda avanzada de Outlook te permite filtrar por fecha, remitente o asunto.',
  'Puedes arrastrar correos a una carpeta para organizarlos.',
  'Activa "Respuesta automática" cuando estés fuera de la oficina.',
];

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const EmailLauncher = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeFolder, setActiveFolder] = useState('inbox');
  const [tipIndex,     setTipIndex]     = useState(0);
  const [launching,    setLaunching]    = useState(false);
  const [launched,     setLaunched]     = useState(false);
  const [hoveredFolder,setHoveredFolder]= useState(null);

  // Rotate tips every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setTipIndex(i => (i + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const handleOpenEmail = (folderKey = activeFolder) => {
    if (!user?.email) return;
    setActiveFolder(folderKey);
    setLaunching(true);

    setTimeout(() => {
      const url = buildOWAUrl(user.email, folderKey);
      window.open(url, '_blank', 'noopener,noreferrer');
      setLaunching(false);
      setLaunched(true);
      setTimeout(() => setLaunched(false), 3000);
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #050B14 0%, #071525 100%)',
      color: 'white',
      fontFamily: '"Inter", system-ui, sans-serif',
      padding: '32px 24px 60px',
      boxSizing: 'border-box',
    }}>

      {/* ── Background ambient glows ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background:
          'radial-gradient(circle at 10% 20%, rgba(60,180,255,0.06) 0%, transparent 50%),' +
          'radial-gradient(circle at 90% 75%, rgba(210,20,20,0.05) 0%, transparent 50%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto' }}>

        {/* ── Back button ── */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -4, borderColor: 'rgba(60,180,255,0.4)', color: '#3CB4FF' }}
          whileTap={{ scale: 0.96 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '10px 20px',
            color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer', marginBottom: '36px', transition: 'all 0.25s',
            letterSpacing: '0.04em',
          }}
        >
          <ArrowLeft size={15} /> Volver atrás
        </motion.button>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}
        >
          <div style={{
            width: '60px', height: '60px', borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(60,180,255,0.2), rgba(210,20,20,0.15))',
            border: '1px solid rgba(60,180,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(60,180,255,0.15)',
          }}>
            <Mail size={28} color="#3CB4FF" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 900, letterSpacing: '0.02em' }}>
              Mi Correo Corporativo
            </h1>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>
              Accede a Outlook Web directamente desde el panel
            </p>
          </div>
          <img src={logo} alt="Atento5" style={{
            height: '44px', objectFit: 'contain',
            filter: 'drop-shadow(0 0 8px rgba(60,180,255,0.4))',
            marginLeft: 'auto',
          }} />
        </motion.div>

        {/* ── Main grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>

          {/* ── Card 1: User info + main launch ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              gridColumn: '1 / -1',
              background: 'linear-gradient(135deg, rgba(10,18,32,0.9) 0%, rgba(5,11,20,0.95) 100%)',
              border: '1.5px solid rgba(60,180,255,0.18)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '8%', right: '8%', height: '2px',
              background: 'linear-gradient(90deg, transparent, #3CB4FF, #D21414, transparent)',
            }} />

            <div style={{
              display: 'flex', flexWrap: 'wrap',
              alignItems: 'center', justifyContent: 'space-between', gap: '24px',
            }}>
              {/* User info block */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 900, color: 'white',
                  boxShadow: '0 0 20px rgba(60,180,255,0.4)',
                  flexShrink: 0,
                }}>
                  {user?.avatar || 'A5'}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700,
                    color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em',
                    textTransform: 'uppercase', marginBottom: '4px' }}>
                    Sesión activa
                  </p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'white' }}>
                    {user?.name}
                  </p>
                  <p style={{
                    margin: '4px 0 0', fontSize: '13px', fontWeight: 600,
                    background: 'linear-gradient(90deg, #3CB4FF, #a78bfa)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {user?.email}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px',
                    color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                    {user?.role}
                  </p>
                </div>
              </div>

              {/* Launch button */}
              <motion.button
                onClick={() => handleOpenEmail(activeFolder)}
                disabled={launching}
                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(60,180,255,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: launched
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                  border: 'none', borderRadius: '14px',
                  padding: '16px 28px',
                  color: 'white', fontSize: '14px', fontWeight: 800,
                  cursor: launching ? 'wait' : 'pointer',
                  letterSpacing: '0.06em',
                  boxShadow: '0 8px 25px rgba(60,180,255,0.3)',
                  transition: 'background 0.4s ease',
                  minWidth: '220px', justifyContent: 'center',
                }}
              >
                <AnimatePresence mode="wait">
                  {launching ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      >
                        <RefreshCw size={18} />
                      </motion.div>
                      Abriendo correo…
                    </motion.div>
                  ) : launched ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      ✓ ¡Correo abierto!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <Mail size={18} />
                      ABRIR MI CORREO
                      <ExternalLink size={14} style={{ opacity: 0.7 }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Info notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: '24px', display: 'flex', alignItems: 'flex-start', gap: '10px',
                background: 'rgba(60,180,255,0.06)', border: '1px solid rgba(60,180,255,0.15)',
                borderRadius: '12px', padding: '12px 16px',
              }}
            >
              <AlertCircle size={16} color="#3CB4FF" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                Tu correo se abrirá en <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Outlook Web App (OWA)</strong>{' '}
                en una nueva pestaña con tu cuenta <strong style={{ color: '#3CB4FF' }}>{user?.email}</strong> pre-cargada.
                Si Microsoft te pide contraseña, es la misma que usas en Outlook de escritorio.
              </p>
            </motion.div>
          </motion.div>

          {/* ── Card 2: Folder quick-access ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: 'rgba(10,18,32,0.85)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
            }}
          >
            <h2 style={{
              margin: '0 0 20px', fontSize: '13px', fontWeight: 800,
              color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              Acceso por carpeta
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FOLDERS.map(({ icon: Icon, label, color, key }) => {
                const isActive  = activeFolder === key;
                const isHovered = hoveredFolder === key;
                return (
                  <motion.button
                    key={key}
                    onClick={() => handleOpenEmail(key)}
                    onMouseEnter={() => setHoveredFolder(key)}
                    onMouseLeave={() => setHoveredFolder(null)}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      background: isActive || isHovered
                        ? `rgba(${color === '#3CB4FF' ? '60,180,255' : color === '#10b981' ? '16,185,129' : color === '#f59e0b' ? '245,158,11' : color === '#a78bfa' ? '167,139,250' : '239,68,68'},0.1)`
                        : 'transparent',
                      border: '1px solid',
                      borderColor: isActive
                        ? `${color}55`
                        : isHovered ? `${color}33` : 'transparent',
                      borderRadius: '12px', padding: '12px 16px',
                      color: isActive || isHovered ? 'white' : 'rgba(255,255,255,0.6)',
                      fontSize: '14px', fontWeight: 700,
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s ease', width: '100%',
                    }}
                  >
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '10px',
                      background: `${color}1a`,
                      border: `1px solid ${color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={16} color={color} />
                    </div>
                    <span style={{ flexGrow: 1 }}>{label}</span>
                    <ChevronRight size={14} style={{
                      opacity: isActive || isHovered ? 0.7 : 0.3,
                      transition: 'opacity 0.2s',
                    }} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Card 3: Tips + Status ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Status badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                background: 'rgba(10,18,32,0.85)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '24px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
              }}
            >
              <h2 style={{
                margin: '0 0 16px', fontSize: '13px', fontWeight: 800,
                color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                Estado del servicio
              </h2>
              {[
                { icon: Wifi,   label: 'Outlook Web App',     status: 'Disponible', color: '#10b981' },
                { icon: Shield, label: 'Conexión segura HTTPS', status: 'Activa',     color: '#10b981' },
                { icon: Clock,  label: 'Sesión corporativa',   status: 'Activa',      color: '#3CB4FF' },
              ].map(({ icon: Icon, label, status, color }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={15} color="rgba(255,255,255,0.4)" />
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                      {label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                      animation: 'pulse 2s ease-in-out infinite',
                    }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color }}>{status}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Rotating tip */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, rgba(60,180,255,0.08), rgba(167,139,250,0.06))',
                border: '1px solid rgba(60,180,255,0.15)',
                borderRadius: '20px', padding: '24px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
              }}
            >
              <p style={{
                margin: '0 0 12px', fontSize: '11px', fontWeight: 800,
                color: '#3CB4FF', letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                💡 Consejo de Outlook
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    margin: 0, fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontWeight: 500,
                  }}
                >
                  {TIPS[tipIndex]}
                </motion.p>
              </AnimatePresence>
              {/* Dot indicators */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
                {TIPS.map((_, i) => (
                  <div key={i} style={{
                    width: i === tipIndex ? '18px' : '6px',
                    height: '6px', borderRadius: '3px',
                    background: i === tipIndex ? '#3CB4FF' : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTipIndex(i)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Footer note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: '40px', textAlign: 'center',
            color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          ATENTO5 SERVICIOS GENERALES &bull; Panel Administrativo &bull; Powered by Microsoft Outlook
        </motion.div>
      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default EmailLauncher;
