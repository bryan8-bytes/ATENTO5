import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, Menu, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { name: 'INICIO', id: 'hero' },
  { name: 'BROCHURE', id: 'brochure-download' },
  { name: 'NOSOTROS', id: 'nosotros' },
  { name: 'MISIÓN', id: 'mision-vision' },
  { name: 'SERVICIOS', id: 'servicios' },
  { name: 'UBICACIÓN', id: 'ubicacion' },
  { name: 'CONTACTO', id: 'contacto' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('INICIO');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
      if (window.innerWidth >= 1200) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/home') return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 180;

      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveLink(link.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [location.pathname]);

  const handleNavClick = (linkId, linkName) => {
    setActiveLink(linkName);
    if (location.pathname !== '/home') {
      navigate('/home');
      setTimeout(() => {
        const element = document.getElementById(linkId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      const element = document.getElementById(linkId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <Motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled
          ? 'rgba(3, 7, 18, 0.92)'
          : 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isScrolled ? '1px solid rgba(60, 180, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.35s ease',
        boxShadow: isScrolled
          ? '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(60, 180, 255, 0.08)'
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1750px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          height: '78px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Left: Animated Text Logo */}
        <Link
          to="/home"
          onClick={() => {
            if (location.pathname === '/home') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <span
            style={{
              height: '56px',
              lineHeight: '56px',
              fontSize: '1.75rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              background: 'repeating-linear-gradient(90deg, #3CB4FF 0%, #D21414 40%, #3CB4FF 80%)',
              backgroundSize: '200px 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              animation: 'logoFlowRight 2s linear infinite',
              filter: 'drop-shadow(0 0 18px rgba(60, 180, 255, 0.45)) drop-shadow(0 0 18px rgba(210, 20, 20, 0.45))',
              userSelect: 'none',
            }}
          >
            ATENTO5
          </span>
        </Link>

        {!isMobile && (
          <div
            style={{
              background: 'rgba(5, 12, 22, 0.8)',
              border: '1px solid rgba(60, 180, 255, 0.16)',
              borderRadius: '9999px',
              padding: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeLink === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.id, link.name)}
                  style={{
                    background: isActive ? 'rgba(60, 180, 255, 0.14)' : 'transparent',
                    border: isActive ? '1.5px solid rgba(60, 180, 255, 0.6)' : '1.5px solid transparent',
                    borderRadius: '9999px',
                    color: isActive ? '#3CB4FF' : 'rgba(255, 255, 255, 0.82)',
                    fontSize: '12px',
                    fontWeight: isActive ? 800 : 700,
                    letterSpacing: '0.04em',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 12px rgba(60, 180, 255, 0.25)' : 'none',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.name}
                </button>
              );
            })}
          </div>
        )}

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/cotizador" style={{ textDecoration: 'none' }}>
              <Motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 22px rgba(60, 180, 255, 0.5), 0 0 22px rgba(210, 20, 20, 0.4)' }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                  color: '#FFFFFF',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '12px',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(60, 180, 255, 0.35)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                COTIZAR
              </Motion.button>
            </Link>

            <Link to="/purchase-order" style={{ textDecoration: 'none' }}>
              <Motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 22px rgba(0, 200, 117, 0.6)' }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: 'linear-gradient(135deg, #00C875 0%, #059669 100%)',
                  color: '#FFFFFF',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '12px',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(0, 200, 117, 0.35)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ORDEN DE COMPRA
              </Motion.button>
            </Link>

            <Link to="/hoja-membretada" style={{ textDecoration: 'none' }}>
              <Motion.button
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(10, 18, 30, 0.85)',
                  border: '1px solid rgba(210, 20, 30, 0.5)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#D21414',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)',
                }}
              >
                HOJA MEMBRETADA
              </Motion.button>
            </Link>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/gerente-general" style={{ textDecoration: 'none' }}>
                  <Motion.div
                    whileHover={{ scale: 1.03, borderColor: 'rgba(60, 180, 255, 0.5)' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(10, 18, 30, 0.85)',
                      border: '1px solid rgba(60, 180, 255, 0.25)',
                      borderRadius: '9999px',
                      padding: '4px 14px 4px 5px',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 0 15px rgba(60, 180, 255, 0.1)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        boxShadow: '0 0 10px rgba(60, 180, 255, 0.5)',
                        flexShrink: 0,
                      }}
                    >
                      {user.avatar || 'JA'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          lineHeight: '1.2',
                          letterSpacing: '0.01em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.name || 'Juan Ampuero'}
                      </span>
                      <span
                        style={{
                          fontSize: '8px',
                          fontWeight: 700,
                          color: 'rgba(255, 255, 255, 0.5)',
                          lineHeight: '1',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.role || 'ADMINISTRADOR GENERAL'}
                      </span>
                    </div>
                  </Motion.div>
                </Link>

                <Motion.button
                  onClick={logout}
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                  }}
                  whileTap={{ scale: 0.92 }}
                  title="Cerrar Sesión"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.75)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  <LogOut size={15} />
                </Motion.button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Motion.div
                    whileHover={{ scale: 1.03, borderColor: 'rgba(60, 180, 255, 0.5)' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(10, 18, 30, 0.85)',
                      border: '1px solid rgba(60, 180, 255, 0.25)',
                      borderRadius: '9999px',
                      padding: '4px 14px 4px 5px',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 0 15px rgba(60, 180, 255, 0.1)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        boxShadow: '0 0 10px rgba(60, 180, 255, 0.5)',
                        flexShrink: 0,
                      }}
                    >
                      JA
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          lineHeight: '1.2',
                          letterSpacing: '0.01em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Juan Ampuero
                      </span>
                      <span
                        style={{
                          fontSize: '8px',
                          fontWeight: 700,
                          color: 'rgba(255, 255, 255, 0.5)',
                          lineHeight: '1',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ADMINISTRADOR GENERAL
                      </span>
                    </div>
                  </Motion.div>
                </Link>

                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Motion.button
                    whileHover={{
                      scale: 1.08,
                      backgroundColor: 'rgba(60, 180, 255, 0.15)',
                      color: '#3CB4FF',
                      borderColor: 'rgba(60, 180, 255, 0.4)',
                    }}
                    whileTap={{ scale: 0.92 }}
                    title="Iniciar Sesión"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255, 255, 255, 0.75)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    <UserIcon size={15} />
                  </Motion.button>
                </Link>
              </div>
            )}
          </div>
        )}

        {isMobile && (
          <Motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              zIndex: 1001,
              transition: 'all 0.2s ease',
            }}
          >
            <Menu size={20} />
          </Motion.button>
        )}
      </div>

      <AnimatePresence>
        {isMobile && isOpen && (
          <>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(5, 7, 12, 0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 1002,
              }}
            />

            <Motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '320px',
                maxWidth: '85vw',
                height: '100vh',
                background: 'rgba(5, 11, 20, 0.98)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderLeft: '1px solid rgba(60, 180, 255, 0.2)',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
                zIndex: 1003,
                padding: '24px 20px 30px 20px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflowY: 'auto',
              }}
            >
              {/* Top Drawer Bar with Volver Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(60, 180, 255, 0.15)',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    background: 'linear-gradient(90deg, #3CB4FF, #D21414)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ATENTO5
                </span>

                <Motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(60, 180, 255, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(60, 180, 255, 0.12)',
                    border: '1.5px solid rgba(60, 180, 255, 0.45)',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    color: '#3CB4FF',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    boxShadow: '0 0 12px rgba(60, 180, 255, 0.2)',
                  }}
                >
                  <ArrowLeft size={15} />
                  <span>VOLVER</span>
                </Motion.button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'rgba(60, 180, 255, 0.6)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                    display: 'block',
                  }}
                >
                  Navegación
                </span>
                {NAV_LINKS.map((link) => (
                  <Motion.button
                    key={link.name}
                    onClick={() => {
                      handleNavClick(link.id, link.name);
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 6, color: '#3CB4FF' }}
                    style={{
                      background: activeLink === link.name ? 'rgba(60, 180, 255, 0.12)' : 'none',
                      border: activeLink === link.name ? '1px solid rgba(60, 180, 255, 0.3)' : '1px solid transparent',
                      borderRadius: '8px',
                      color: activeLink === link.name ? '#3CB4FF' : 'rgba(255, 255, 255, 0.8)',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: 750,
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      padding: '8px 12px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {link.name}
                  </Motion.button>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                  paddingTop: '20px',
                  marginTop: '20px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'rgba(210, 20, 20, 0.6)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '2px',
                    display: 'block',
                  }}
                >
                  Acciones Rápidas
                </span>

                <Link to="/cotizador" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                  <Motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                      color: 'white',
                      padding: '12px',
                      borderRadius: '9999px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '12px',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(60, 180, 255, 0.25)',
                    }}
                  >
                    COTIZAR
                  </Motion.button>
                </Link>

                <Link to="/purchase-order" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                  <Motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #00C875 0%, #059669 100%)',
                      color: 'white',
                      padding: '12px',
                      borderRadius: '9999px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '12px',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0, 200, 117, 0.25)',
                    }}
                  >
                    ORDEN DE COMPRA
                  </Motion.button>
                  </Link>

                  <Link to="/hoja-membretada" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                    <Motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        background: 'rgba(210, 20, 30, 0.15)',
                        color: '#D21414',
                        padding: '12px',
                        borderRadius: '9999px',
                        border: '1px solid #D21414',
                        fontWeight: 800,
                        fontSize: '12px',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      HOJA MEMBRETADA
                    </Motion.button>
                  </Link>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(10, 18, 30, 0.85)',
                      border: '1px solid rgba(60, 180, 255, 0.25)',
                      borderRadius: '14px',
                      padding: '10px 14px',
                      marginTop: '8px',
                    }}
                  >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: 'white',
                      }}
                    >
                      {user ? (user.avatar || 'JA') : 'JA'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>
                        {user ? user.name : 'Juan Ampuero'}
                      </span>
                      <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)' }}>
                        {user ? user.role : 'ADMINISTRADOR GENERAL'}
                      </span>
                    </div>
                  </div>
                  {user ? (
                    <Motion.button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      whileHover={{ scale: 1.1, color: '#ef4444' }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <LogOut size={18} />
                    </Motion.button>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)} style={{ color: '#3CB4FF' }}>
                      <UserIcon size={18} />
                    </Link>
                  )}
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </Motion.nav>
  );
};

export default Navbar;