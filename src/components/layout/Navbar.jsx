import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, FileText, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('hero')

  const isCotizadorActive = location.pathname === '/cotizador'
  const isPurchaseOrderActive = location.pathname === '/purchase-order'

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
          <span className="navbar-logo-text">ATENTO5</span>
        </Link>

        <div className="navbar-actions">
          <Link to="/cotizador" className={`navbar-link ${isCotizadorActive ? 'navbar-link-active' : ''}`}>
            <Button variant="primary" size="sm" icon={<FileText size={14} />} motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}>
              COTIZAR
            </Button>
          </Link>
          <Link to="/purchase-order" className={`navbar-link ${isPurchaseOrderActive ? 'navbar-link-active' : ''}`}>
            <Button variant="danger" size="sm" icon={<ShoppingCart size={14} />} motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}>
              ORDEN DE COMPRA
            </Button>
          </Link>

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
              <Button variant="ghost" size="sm" icon={<User size={14} />} motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }} className="navbar-btn-login">
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
                <Link to="/cotizador" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="md" block className="navbar-drawer-btn">
                    COTIZAR
                  </Button>
                </Link>
                <Link to="/purchase-order" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="md" block className="navbar-drawer-btn navbar-drawer-btn-outline">
                    ORDEN DE COMPRA
                  </Button>
                </Link>

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
