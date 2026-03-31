import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'hero', title: 'Inicio' },
  { id: 'brochure', title: 'Brochure' },
  { id: 'nosotros', title: 'Nosotros' },
  { id: 'mision-vision', title: 'Misión y Visión' },
  { id: 'servicios', title: 'Servicios' },
  { id: 'ubicacion', title: 'Ubicación' },
  { id: 'contacto', title: 'Contacto' },
];

const ScrollSidebar = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredSection, setHoveredSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSection = 'hero';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: '50%',
        right: '30px',
        transform: 'translateY(-50%)',
        zIndex: 1000,
      }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sections.map((section) => (
          <li
            key={section.id}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <AnimatePresence>
              {hoveredSection === section.id && (
                <motion.div
                  style={{
                    position: 'absolute',
                    right: '30px',
                    background: 'linear-gradient(135deg, rgba(0,195,255,0.9) 0%, rgba(255,153,0,0.9) 100%)',
                    color: 'white',
                    border: '1px solid rgba(255,153,0,0.3)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    whiteSpace: 'nowrap',
                  }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {section.title}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              onClick={() => handleNavigation(section.id)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: activeSection === section.id ? 'linear-gradient(135deg, #00C3FF, #FF9900)' : 'rgba(255, 255, 255, 0.3)',
                boxShadow: activeSection === section.id ? '0 0 10px rgba(0, 195, 255, 0.8), 0 0 10px rgba(255, 153, 0, 0.8)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              animate={
                activeSection === section.id 
                  ? {
                      boxShadow: [
                        '0 0 10px rgba(0,195,255,0.8), 0 0 10px rgba(255,153,0,0.8)',
                        '0 0 20px rgba(0,195,255,1), 0 0 20px rgba(255,153,0,1)',
                        '0 0 10px rgba(0,195,255,0.8), 0 0 10px rgba(255,153,0,0.8)'
                      ]
                    }
                  : {}
              }
              transition={
                activeSection === section.id 
                  ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } 
                  : {}
              }
              whileHover={{ transition: { duration: 0.1, delay: 0 }, background: activeSection === section.id ? 'linear-gradient(135deg, #00C3FF, #FF9900)' : 'rgba(255, 255, 255, 0.6)',
                boxShadow: '0 0 10px rgba(0,195,255,0.6), 0 0 10px rgba(255,153,0,0.6)'
              }}
            />
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default ScrollSidebar;