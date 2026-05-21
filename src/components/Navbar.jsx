import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Logo Atento5.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('INICIO');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  const navLinks = [
    { name: 'INICIO', id: 'hero' },
    { name: 'BROCHURE', id: 'brochure-download' },
    { name: 'NOSOTROS', id: 'nosotros' },
    { name: 'MISIÓN', id: 'mision-vision' },
    { name: 'SERVICIOS', id: 'servicios' },
    { name: 'UBICACIÓN', id: 'ubicacion' },
    { name: 'CONTACTO', id: 'contacto' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  // ScrollSpy to highlight nav links as user scrolls down the home page
  useEffect(() => {
    if (location.pathname !== '/home') return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 150; // offset for navbar height
      
      for (const link of navLinks) {
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
      // Delay slightly to allow navigation page load before scrolling
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
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: isScrolled 
          ? 'rgba(5, 11, 20, 0.95)' 
          : 'rgba(5, 11, 20, 0.4)',
        backdropFilter: 'blur(20px)',
        borderBottom: isScrolled ? '1px solid rgba(60, 180, 255, 0.2)' : '1px solid transparent',
        transition: 'all 0.4s ease',
        boxShadow: isScrolled 
          ? '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(60, 180, 255, 0.15)' 
          : 'none',
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '140px', // Premium height
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* LOGO COLUMN */}
        <Link 
          to="/home" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            gap: '16px',
            flexShrink: 0
          }}
        >
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ transition: { duration: 0.1, delay: 0 }, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ position: 'relative' }}
          >
            <img 
              src={logo} 
              alt="ATENTO5" 
              style={{ 
                height: '150px', 
                width: '150px',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 0 15px rgba(60, 180, 255, 0.6))',
              }}
            />

            {/* Sparkle Effects */}
            {[...Array(6)].map((_, i) => {
              const dotColor = i % 2 === 0 ? '#3CB4FF' : '#D21414';
              return (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '3.5px',
                    height: '3.5px',
                    backgroundColor: dotColor,
                    borderRadius: '50%',
                    boxShadow: `0 0 8px ${dotColor}, 0 0 15px ${dotColor}`,
                    left: `calc(${50 + 45 * Math.cos((i * 60 * Math.PI) / 180)}% - 1.75px)`,
                    top: `calc(${50 + 45 * Math.sin((i * 60 * Math.PI) / 180)}% - 1.75px)`,
                    zIndex: 15,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    x: [0, 8 * Math.cos((i * 60 * Math.PI) / 180), 0],
                    y: [0, 8 * Math.sin((i * 60 * Math.PI) / 180), 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
          </motion.div>
          
          <span style={{
            fontSize: '22px',
            fontWeight: 850,
            letterSpacing: '0.18em',
            background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ATENTO5
          </span>
        </Link>

        {/* DESKTOP CENTER NAVIGATION LINKS */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            margin: '0 24px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '6px 12px',
              borderRadius: '30px',
              backdropFilter: 'blur(10px)',
            }}>
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ transition: { duration: 0.1, delay: 0 }, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => handleNavClick(link.id, link.name)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: 750,
                      letterSpacing: '0.08em',
                      color: activeLink === link.name ? '#3CB4FF' : 'rgba(229, 231, 235, 0.75)',
                      background: activeLink === link.name 
                        ? 'linear-gradient(135deg, rgba(60, 180, 255, 0.15) 0%, rgba(210, 20, 20, 0.1) 100%)' 
                        : 'transparent',
                      border: activeLink === link.name 
                        ? '1px solid rgba(60, 180, 255, 0.4)' 
                        : '1px solid transparent',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: activeLink === link.name ? '0 0 15px rgba(60, 180, 255, 0.1)' : 'none',
                    }}
                  >
                    {link.name}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* DESKTOP RIGHT ACTIONS COLUMN */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexShrink: 0
          }}>
            <Link to="/cotizador" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(60, 180, 255, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                  color: 'white',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(60, 180, 255, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                COTIZAR
              </motion.button>
            </Link>
            
            <Link to="/purchase-order" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                ORDEN DE COMPRA
              </motion.button>
            </Link>

            {/* Vertical Divider */}
            <span style={{ 
              height: '24px', 
              width: '1px', 
              background: 'rgba(255, 255, 255, 0.15)',
              margin: '0 4px' 
            }} />

            {/* Auth capsule */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, rgba(60, 180, 255, 0.15) 0%, rgba(210, 20, 20, 0.08) 100%)',
                    border: '1px solid rgba(60, 180, 255, 0.3)',
                    borderRadius: '25px',
                    padding: '4px 14px 4px 4px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 0 15px rgba(60, 180, 255, 0.1)'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'white',
                    boxShadow: '0 0 8px rgba(60, 180, 255, 0.4)'
                  }}>
                    {user.avatar || 'AD'}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: 'white',
                      lineHeight: '1.2',
                      letterSpacing: '0.02em'
                    }}>
                      {user.name}
                    </span>
                    <span style={{
                      fontSize: '8px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.5)',
                      lineHeight: '1',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {user.role}
                    </span>
                  </div>
                </motion.div>

                <motion.button
                  onClick={logout}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  whileTap={{ scale: 0.9 }}
                  title="Cerrar Sesión"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    padding: 0
                  }}
                >
                  <LogOut size={16} />
                </motion.button>
              </div>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)', boxShadow: '0 0 15px rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '30px',
                    border: '1.5px solid rgba(255, 255, 255, 0.12)',
                    fontWeight: 750,
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.25s ease',
                    textTransform: 'uppercase'
                  }}
                >
                  <UserIcon size={12} />
                  <span>ACCESO ADMIN</span>
                </motion.button>
              </Link>
            )}
          </div>
        )}

        {/* MOBILE HAMBURGER BUTTON */}
        {isMobile && (
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              zIndex: 100,
              transition: 'all 0.2s ease',
            }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        )}
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
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
                background: 'rgba(5, 7, 12, 0.75)',
                backdropFilter: 'blur(8px)',
                zIndex: 85,
              }}
            />

            {/* Sidebar menu */}
            <motion.div
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
                borderLeft: '1px solid rgba(60, 180, 255, 0.2)',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)',
                zIndex: 90,
                padding: '110px 32px 40px 32px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Menu Links */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'rgba(60, 180, 255, 0.6)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Navegación
                </span>
                {navLinks.map((link) => (
                  <motion.button
                    key={link.name}
                    onClick={() => {
                      handleNavClick(link.id, link.name);
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 6, color: '#3CB4FF' }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: activeLink === link.name ? '#3CB4FF' : 'rgba(255, 255, 255, 0.75)',
                      textAlign: 'left',
                      fontSize: '15px',
                      fontWeight: 750,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      padding: '8px 0',
                      transition: 'color 0.2s ease',
                      borderBottom: activeLink === link.name ? '1px solid rgba(60, 180, 255, 0.2)' : '1px solid transparent',
                    }}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </div>

              {/* Actions Area */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                paddingTop: '24px',
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'rgba(210, 20, 20, 0.6)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  display: 'block'
                }}>
                  Área Administrativa
                </span>
                
                <Link to="/cotizador" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                      color: 'white',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '12px',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(60, 180, 255, 0.2)',
                    }}
                  >
                    COTIZAR
                  </motion.button>
                </Link>
                
                <Link to="/purchase-order" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '12px',
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    ORDEN DE COMPRA
                  </motion.button>
                </Link>

                {user ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, rgba(60, 180, 255, 0.1) 0%, rgba(210, 20, 20, 0.05) 100%)',
                    border: '1px solid rgba(60, 180, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    marginTop: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: 'white',
                      }}>
                        {user.avatar || 'AD'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>
                          {user.name}
                        </span>
                        <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)' }}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <motion.button
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
                        padding: 0
                      }}
                    >
                      <LogOut size={18} />
                    </motion.button>
                  </div>
                ) : (
                  <Link to="/login" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.02)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(255, 255, 255, 0.1)',
                        fontWeight: 700,
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <UserIcon size={14} />
                      <span>ACCESO ADMIN</span>
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;