import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: <Facebook size={18} />, label: 'Facebook', href: '#' },
    { icon: <Instagram size={18} />, label: 'Instagram', href: '#' },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', href: '#' },
    { icon: <Youtube size={18} />, label: 'YouTube', href: '#' }
  ];

  const quickLinks = [
    { label: 'Inicio', href: '#' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Misión y Visión', href: '#mision-vision' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Contacto', href: '#contacto' }
  ];

  const services = [
    'Mantenimiento General',
    'Pintura y Acabados',
    'Construcción',
    'Obras Civiles',
    'Limpieza Industrial',
    'Instalaciones Eléctricas'
  ];

  return (
    <footer style={{ 
      background: 'linear-gradient(180deg, rgba(11, 18, 32, 0.95) 0%, rgba(5, 11, 20, 1) 100%)', 
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '80px 0 30px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Main Footer Content */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <img 
                src="/src/assets/Logo Atento5.png" 
                alt="ATENTO5" 
                style={{ height: '42px' }}
              />
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(229, 231, 235, 0.5)', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.05em' }}>
              SERVICIOS GENERALES E.I.R.L.
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(229, 231, 235, 0.4)', marginBottom: '20px', lineHeight: 1.6 }}>
              Comprometidos con la excelencia en cada proyecto. Soluciones integrales para tus necesidades de servicios generales.
            </p>
            
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(229, 231, 235, 0.5)',
                    textDecoration: 'none'
                  }}
                  whileHover={{ transition: { duration: 0.1, delay: 0 }, scale: 1.1,
                    background: 'rgba(0, 195, 255, 0.1)',
                    borderColor: 'rgba(0, 195, 255, 0.3)',
                    color: '#00C3FF'
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
              Enlaces Rápidos
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quickLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  style={{ 
                    fontSize: '14px', 
                    color: 'rgba(229, 231, 235, 0.5)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#00C3FF'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(229, 231, 235, 0.5)'}
                >
                  <span style={{ color: 'rgba(0, 195, 255, 0.5)', fontSize: '10px' }}>▸</span>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
              Nuestros Servicios
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map((service) => (
                <span 
                  key={service}
                  style={{ 
                    fontSize: '13px', 
                    color: 'rgba(229, 231, 235, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ color: 'rgba(0, 195, 255, 0.5)', fontSize: '10px' }}>▸</span>
                  {service}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
              Información de Contacto
            </h4>
            <div style={{ fontSize: '13px', color: 'rgba(229, 231, 235, 0.5)', lineHeight: 2.2 }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={14} style={{ color: '#00C3FF' }} />
                +51 955 295 390
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={14} style={{ color: '#00C3FF' }} />
                contacto@atento5.com
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={14} style={{ color: '#00C3FF' }} />
                Lima, Perú
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <div style={{ 
          paddingTop: '30px', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <p style={{ fontSize: '13px', color: 'rgba(229, 231, 235, 0.3)' }}>
            © {currentYear} ATENTO5 SERVICIOS GENERALES E.I.R.L. Todos los derechos reservados.
          </p>
          
          <motion.button
            onClick={scrollToTop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'rgba(229, 231, 235, 0.4)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '10px 18px',
              cursor: 'pointer'
            }}
            whileHover={{ transition: { duration: 0.1, delay: 0 }, y: -3, 
              color: '#00C3FF',
              borderColor: 'rgba(0, 195, 255, 0.3)'
            }}
          >
            <ArrowUp size={14} />
            <span>Volver arriba</span>
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
