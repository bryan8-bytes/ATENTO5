import { motion as Motion } from 'framer-motion'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react'
import logo from '../../assets/Logo Atento5.png'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    { icon: <Facebook size={18} />, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61592431140405' },
    { icon: <Instagram size={18} />, label: 'Instagram', href: 'https://www.instagram.com/atento5.solucionesgen/' },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', href: '#' },
    { icon: <Youtube size={18} />, label: 'YouTube', href: 'https://youtube.com/@atento5solucionesgenerales' },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
      label: 'TikTok',
      href: 'https://www.tiktok.com/@atento5.solucione',
    },
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="footer-brand"
        >
          <div className="footer-logo-wrap">
            <div className="footer-logo-glow" aria-hidden="true" />
            <img src={logo} alt="ATENTO5" className="footer-logo" loading="lazy" />
          </div>
          <p className="footer-description">
            SERVICIOS GENERALES E.I.R.L.
          </p>
          <p className="footer-description" style={{ fontSize: '0.75rem', color: 'rgba(229, 231, 235, 0.35)', maxWidth: '26rem' }}>
            Comprometidos con la excelencia en cada proyecto. Soluciones integrales para tus necesidades de servicios generales.
          </p>

          <div className="footer-socials">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                className="footer-social-link"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <div className="footer-divider" />

        <div className="footer-grid">
          <motion.div
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
          </motion.div>

          <motion.div
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
          </motion.div>

          <motion.div
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
          </motion.div>
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
