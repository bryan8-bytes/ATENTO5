import { useState, useEffect } from 'react'
import { Menu, X, Mail, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/Logo Atento5.png'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('hero')

  const navLinks = [
    { name: 'INICIO', id: 'hero' },
    { name: 'BROCHURE', id: 'brochure-download' },
    { name: 'NOSOTROS', id: 'nosotros' },
    { name: 'MISIÓN', id: 'mision-vision' },
    { name: 'SERVICIOS', id: 'servicios' },
    { name: 'UBICACIÓN', id: 'ubicacion' },
    { name: 'CONTACTO', id: 'contacto' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 150
      for (const link of navLinks) {
        const el = document.getElementById(link.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveLink(link.id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScrollSpy)
    handleScrollSpy()
    return () => window.removeEventListener('scroll', handleScrollSpy)
  }, [])

  const handleNavClick = (id) => {
    setActiveLink(id)
    setIsOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: isScrolled ? 'rgba(5, 11, 20, 0.85)' : 'rgba(5, 11, 20, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: isScrolled ? '1px solid rgba(60, 180, 255, 0.12)' : '1px solid transparent',
        transition: 'all 0.4s ease',
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(60, 180, 255, 0.08)' : 'none',
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
        height: '80px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'visible'
      }}>
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '16px', flexShrink: 0 }}>
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <motion.div
              style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', filter: 'blur(20px)' }}
              animate={{
                background: [
                  'radial-gradient(circle, rgba(60, 180, 255,0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(210, 20, 20,0.25) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(60, 180, 255,0.3) 0%, transparent 70%)'
                ],
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.img
              src={logo}
              alt="ATENTO5"
              style={{
                height: '180px',
                width: '180px',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 0 25px rgba(60, 180, 255, 0.85))',
              }}
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>
        </a>

        <div className="hidden sm:flex items-center gap-1">
          {user && (
            <a href="/correo" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(167,139,250,0.5)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                  color: 'white',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
              >
                <Mail size={14} />
                CORREO
              </motion.button>
            </a>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'linear-gradient(135deg, rgba(60, 180, 255, 0.15) 0%, rgba(210, 20, 20, 0.08) 100%)',
                  border: '1px solid rgba(60, 180, 255, 0.3)',
                  borderRadius: '30px',
                  padding: '6px 18px 6px 6px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: 'white',
                }}>
                  {user.avatar || 'AD'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'white', lineHeight: '1.2' }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', lineHeight: '1', textTransform: 'uppercase' }}>
                    {user.role}
                  </span>
                </div>
              </motion.div>

              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.1, color: '#ef4444' }}
                whileTap={{ scale: 0.9 }}
                title="Cerrar Sesión"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <LogOut size={18} />
              </motion.button>
            </div>
          ) : (
            <a href="/login" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  fontWeight: 750,
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textTransform: 'uppercase'
                }}
              >
                <User size={14} />
                <span>ACCESO ADMIN</span>
              </motion.button>
            </a>
          )}
        </div>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            zIndex: 100,
          }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(60, 180, 255, 0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  Navegación
                </span>
                {navLinks.map((link) => (
                  <motion.button
                    key={link.name}
                    onClick={() => handleNavClick(link.id)}
                    whileHover={{ x: 6, color: '#3CB4FF' }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: activeLink === link.id ? '#3CB4FF' : 'rgba(255, 255, 255, 0.75)',
                      textAlign: 'left',
                      fontSize: '15px',
                      fontWeight: 750,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      padding: '8px 0',
                      borderBottom: activeLink === link.id ? '1px solid rgba(60, 180, 255, 0.2)' : '1px solid transparent',
                    }}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                paddingTop: '24px',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(210, 20, 20, 0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                  Área Administrativa
                </span>

                <a href="/cotizador" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
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
                    }}
                  >
                    COTIZAR
                  </motion.button>
                </a>

                <a href="/purchase-order" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
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
                    }}
                  >
                    ORDEN DE COMPRA
                  </motion.button>
                </a>

                {user && (
                  <a href="/correo" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <Mail size={14} /> MI CORREO
                    </motion.button>
                  </a>
                )}

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
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>{user.name}</span>
                        <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>{user.role}</span>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => { logout(); setIsOpen(false); }}
                      whileHover={{ scale: 1.1, color: '#ef4444' }}
                      whileTap={{ scale: 0.9 }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 0 }}
                    >
                      <LogOut size={18} />
                    </motion.button>
                  </div>
                ) : (
                  <a href="/login" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.02)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(255,255,255,0.1)',
                        fontWeight: 700,
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <User size={14} />
                      <span>ACCESO ADMIN</span>
                    </motion.button>
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}