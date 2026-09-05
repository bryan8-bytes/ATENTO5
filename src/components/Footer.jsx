import { motion as Motion } from 'framer-motion'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react'
import logo from '../assets/Logo Atento5.png'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    { icon: <Facebook size={18} />, label: 'Facebook', href: '#' },
    { icon: <Instagram size={18} />, label: 'Instagram', href: '#' },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', href: '#' },
    { icon: <Youtube size={18} />, label: 'YouTube', href: '#' }
  ]

  const quickLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Misión y Visión', href: '#mision-vision' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Contacto', href: '#contacto' }
  ]

  const services = [
    'Mantenimiento General',
    'Pintura y Acabados',
    'Construcción',
    'Obras Civiles',
    'Limpieza Industrial',
    'Instalaciones Eléctricas'
  ]

  return (
    <footer className="footer">
      <div className="footer-inner">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="footer-brand"
        >
          <div className="footer-logo-wrap">
            <div className="footer-logo-glow" aria-hidden="true" />
            <img src={logo} alt="ATENTO5" className="footer-logo" />
          </div>
          <p className="footer-description">
            SERVICIOS GENERALES E.I.R.L.
          </p>
          <p className="footer-description" style={{ fontSize: '0.75rem', color: 'rgba(229, 231, 235, 0.35)', maxWidth: '26rem' }}>
            Comprometidos con la excelencia en cada proyecto. Soluciones integrales para tus necesidades de servicios generales.
          </p>

          <div className="footer-socials">
            {socialLinks.map((social, index) => (
              <Motion.a
                key={index}
                href={social.href}
                className="footer-social-link"
                aria-label={social.label}
                whileHover={{ y: -2 }}
              >
                {social.icon}
              </Motion.a>
            ))}
          </div>
        </Motion.div>

        <div className="footer-divider" />

        <div className="footer-grid">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h4 className="footer-column-title">Enlaces Rápidos</h4>
            <div className="footer-links">
              {quickLinks.map((link) => (
                <a key={link.label} href={link.href} className="footer-link">
                  <span className="footer-link-arrow">▸</span>
                  {link.label}
                </a>
              ))}
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h4 className="footer-column-title">Nuestros Servicios</h4>
            <div className="footer-links">
              {services.map((service) => (
                <span key={service} className="footer-link" style={{ cursor: 'default' }}>
                  <span className="footer-link-arrow">▸</span>
                  {service}
                </span>
              ))}
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h4 className="footer-column-title">Información de Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <p className="footer-contact-item">
                <Phone size={14} className="footer-contact-icon" />
                +51 955 295 390
              </p>
              <p className="footer-contact-item">
                <Mail size={14} className="footer-contact-icon" />
                Juan.ampuero@atento5.com
              </p>
              <p className="footer-contact-item">
                <MapPin size={14} className="footer-contact-icon" />
                Lima, Perú
              </p>
            </div>
          </Motion.div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} ATENTO5 SERVICIOS GENERALES E.I.R.L. Todos los derechos reservados.
          </p>
          <button onClick={scrollToTop} className="footer-back-to-top" aria-label="Volver arriba">
            <ArrowUp size={14} />
            <span>Volver arriba</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
