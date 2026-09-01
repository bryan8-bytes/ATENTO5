import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Mail, User, LogOut, FileText, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import logo from '../../assets/Logo Atento5.png'
import './Navbar.css'

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
    { name: 'COTIZADOR', href: '/cotizador' },
    { name: 'ORDEN DE COMPRA', href: '/purchase-order' },
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
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="navbar-inner">
        <Link href="#hero" className="navbar-logo" aria-label="ATENTO5 Inicio">
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
            <img src={logo} alt="ATENTO5" className="navbar-logo-img" />
          </motion.div>
        </Link>

        <div className="navbar-actions">
          {user && (
            <>
              <Link to="/cotizador">
                <Button variant="primary" size="sm" icon={<FileText size={14} />} motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}>
                  COTIZACIÓN
                </Button>
              </Link>
              <Link to="/purchase-order">
                <Button variant="danger" size="sm" icon={<ShoppingCart size={14} />} motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}>
                  ORDEN DE COMPRA
                </Button>
              </Link>
              <Link to="/correo">
                <Button variant="secondary" size="sm" icon={<Mail size={14} />} motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }} style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', border: 'none', boxShadow: '0 4px 15px rgba(124,58,237,0.35)' }}>
                  CORREO
                </Button>
              </Link>
            </>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="navbar-user">
                <div className="navbar-avatar">{user.avatar || 'AD'}</div>
                <div className="navbar-user-info">
                  <span className="navbar-user-name">{user.name}</span>
                  <span className="navbar-user-role">{user.role}</span>
                </div>
              </div>
              <button className="navbar-logout" onClick={logout} title="Cerrar Sesión" aria-label="Cerrar Sesión">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" icon={<User size={14} />} motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }} style={{ border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}>
                ACCESO ADMIN
              </Button>
            </Link>
          )}
        </div>

        <button className="navbar-menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menú">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="navbar-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="navbar-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="navbar-drawer-nav">
                <span className="navbar-drawer-section-label">Navegación</span>
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.id)}
                    className={`navbar-drawer-link ${activeLink === link.id ? 'active' : ''}`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              <div className="navbar-drawer-divider">
                <span className="navbar-drawer-admin-label">Área Administrativa</span>
                {user && (
                  <Link to="/cotizador" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                    <Button variant="primary" size="md" block style={{ marginBottom: '0.75rem' }}>
                      COTIZAR
                    </Button>
                  </Link>
                )}
                {user && (
                  <Link to="/purchase-order" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="md" block style={{ marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.12)' }}>
                      ORDEN DE COMPRA
                    </Button>
                  </Link>
                )}
                {user && (
                  <Link to="/correo" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="md" block style={{ marginBottom: '0.75rem', background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', border: 'none' }}>
                      <Mail size={14} /> MI CORREO
                    </Button>
                  </Link>
                )}

                {user ? (
                  <div className="navbar-drawer-user">
                    <div className="navbar-drawer-user-info">
                      <div className="navbar-drawer-user-avatar">{user.avatar || 'AD'}</div>
                      <div>
                        <div className="navbar-drawer-user-name">{user.name}</div>
                        <div className="navbar-drawer-user-role">{user.role}</div>
                      </div>
                    </div>
                    <button className="navbar-drawer-logout" onClick={() => { logout(); setIsOpen(false); }} aria-label="Cerrar Sesión">
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                    <Button variant="ghost" size="md" block style={{ border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                      <User size={14} /> ACCESO ADMIN
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
