import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'hero', title: 'INICIO' },
  { id: 'brochure', title: 'BROCHURE' },
  { id: 'nosotros', title: 'NOSOTROS' },
  { id: 'mision-vision', title: 'MISIÓN' },
  { id: 'servicios', title: 'SERVICIOS' },
  { id: 'ubicacion', title: 'UBICACIÓN' },
  { id: 'contacto', title: 'CONTACTO' },
];

const ModernSidebar = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredSection, setHoveredSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetHeight = el.offsetHeight;
          
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        backgroundColor: 'rgba(10, 20, 40, 0.98)',
        padding: '24px 12px',
        borderRadius: '40px',
        border: '3px solid #00ffff',
        boxShadow: '0 0 60px #3CB4FF, 0 0 40px rgba(210, 20, 20, 0.5), inset 0 0 30px rgba(60, 180, 255,0.15)',
      }}>
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const showLabel = hoveredSection === section.id;
          
          return (
            <div
              key={section.id}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <AnimatePresence>
                {showLabel && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      right: '45px',
                      background: 'linear-gradient(90deg, #D21414, #3CB4FF)',
                      color: '#000',
                      padding: '8px 16px',
                      borderRadius: '25px',
                      fontSize: '12px',
                      fontWeight: '900',
                      whiteSpace: 'nowrap',
                      border: '3px solid #fff',
                      boxShadow: '0 6px 30px rgba(0,0,0,0.7)',
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {section.title}
                  </motion.div>
                )}
              </AnimatePresence>
              <div
                onClick={() => scrollTo(section.id)}
                style={{
                  width: isActive ? '22px' : '14px',
                  height: isActive ? '22px' : '14px',
                  borderRadius: '50%',
                  background: isActive 
                    ? 'linear-gradient(135deg, #D21414, #3CB4FF)'
                    : 'rgba(255, 255, 255, 0.4)',
                  border: `3px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.6)'}`,
                  cursor: 'pointer',
                  boxShadow: isActive 
                    ? '0 0 40px #D21414, 0 0 40px #3CB4FF, 0 0 60px #00ffff'
                    : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModernSidebar;