import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/Logo Atento5.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('INICIO');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'INICIO', id: 'hero' },
    { name: 'BROCHURE', id: 'brochure' },
    { name: 'NOSOTROS', id: 'nosotros' },
    { name: 'MISIÓN', id: 'mision-vision' },
    { name: 'SERVICIOS', id: 'servicios' },
    { name: 'UBICACIÓN', id: 'ubicacion' },
    { name: 'CONTACTO', id: 'contacto' },
  ];

  const handleNavClick = (id) => {
    setActiveLink(id.toUpperCase());
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for the fixed navbar height
        behavior: 'smooth',
      });
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
          ? 'rgba(5, 11, 20, 0.9)' 
          : 'rgba(5, 11, 20, 0.2)',
        backdropFilter: 'blur(20px)',
        borderBottom: isScrolled ? '1px solid rgba(0, 195, 255, 0.15)' : '1px solid transparent',
        transition: 'all 0.4s ease',
        boxShadow: isScrolled 
          ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0,195,255,0.1)' 
          : 'none',
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px'
      }}>
        {/* Logo with glow effect */}
        <Link 
          to="/home" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            gap: '24px'
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
                height: '45px', 
                width: '45px',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 0 10px rgba(0,195,255,0.4))',
              }}
            />

            {/* Sparkle Effects */}
            {[...Array(6)].map((_, i) => {
              const dotColor = i % 2 === 0 ? '#00C3FF' : '#FF9900';
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
          {/* Company name */}
          <span style={{
            fontSize: '20px',
            fontWeight: 800,
            letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ATENTO5
          </span>
        </Link>

        {/* Desktop Navigation with modern links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              style={{ position: 'relative' }}
              whileHover={{ transition: { duration: 0.1, delay: 0 }, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                style={{
                  // Normal link style
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: activeLink === link.name ? '#00C3FF' : 'rgba(229, 231, 235, 0.7)',
                  background: activeLink === link.name ? 'linear-gradient(135deg, rgba(0,195,255,0.15) 0%, rgba(255,153,0,0.15) 100%)' : 'transparent',
                  border: activeLink === link.name ? '1px solid rgba(0,195,255,0.4)' : '1px solid transparent',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  display: 'block',
                  cursor: 'pointer',
                  boxShadow: activeLink === link.name ? '0 0 10px rgba(0,195,255,0.1)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.textShadow = '-5px 0 10px rgba(0,195,255,0.8), 5px 0 10px rgba(255,153,0,0.8)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,195,255,0.2) 0%, rgba(255,153,0,0.2) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(255,153,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  if (activeLink !== link.name) {
                    e.currentTarget.style.color = 'rgba(229, 231, 235, 0.7)';
                    e.currentTarget.style.textShadow = 'none';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  } else {
                    e.currentTarget.style.color = '#00C3FF';
                    e.currentTarget.style.textShadow = 'none';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,195,255,0.15) 0%, rgba(255,153,0,0.15) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(0,195,255,0.4)';
                  }
                }}
              >
                {link.name}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;