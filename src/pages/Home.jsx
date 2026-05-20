import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import MissionVision from '../components/MissionVision';
import Services from '../components/Services';
import Contact from '../components/Contact';
import BrochureDownloadField from '../components/brochure/BrochureDownloadField';
import Footer from '../components/Footer';
import Location from '../components/Location';

const sections = [
  { id: 'hero', title: 'INICIO' },
  { id: 'brochure-download', title: 'BROCHURE' },
  { id: 'nosotros', title: 'NOSOTROS' },
  { id: 'mision-vision', title: 'MISIÓN' },
  { id: 'servicios', title: 'SERVICIOS' },
  { id: 'ubicacion', title: 'UBICACIÓN' },
  { id: 'contacto', title: 'CONTACTO' },
];

const SidebarScroll = () => {
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
      right: '15px',
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
        gap: '10px',
        background: 'rgba(10, 20, 40, 0.95)',
        padding: '20px 14px',
        borderRadius: '30px',
        border: '3px solid #3CB4FF',
        boxShadow: '0 0 30px rgba(60, 180, 255, 0.4), 0 0 20px rgba(210, 20, 20, 0.3), inset 0 0 20px rgba(60, 180, 255, 0.1)',
      }}>
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const showLabel = hoveredSection === section.id;
          const color = index % 2 === 0 ? '#3CB4FF' : '#D21414';
          
          return (
            <div
              key={section.id}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <AnimatePresence>
                {showLabel && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    style={{
                      position: 'absolute',
                      right: '35px',
                      background: 'linear-gradient(90deg, #D21414, #3CB4FF)',
                      color: '#000',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '800',
                      whiteSpace: 'nowrap',
                      border: '2px solid #fff',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    }}
                  >
                    {section.title}
                  </motion.div>
                )}
              </AnimatePresence>
              <div
                onClick={() => scrollTo(section.id)}
                style={{
                  width: isActive ? '20px' : '14px',
                  height: isActive ? '20px' : '14px',
                  borderRadius: '50%',
                  background: isActive 
                    ? `linear-gradient(135deg, ${color}, ${index % 2 === 0 ? '#D21414' : '#3CB4FF'})`
                    : 'rgba(255, 255, 255, 0.4)',
                  border: `3px solid ${isActive ? '#fff' : 'rgba(255, 255, 255, 0.5)'}`,
                  cursor: 'pointer',
                  boxShadow: isActive 
                    ? `0 0 25px ${color}, 0 0 40px ${color}`
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

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050B14' }}>
      <Navbar />
      <SidebarScroll />
      
      <main>
        <div id="hero"><Hero /></div>
        <div id="brochure-download"><BrochureDownloadField /></div>
        <div id="nosotros"><About /></div>
        <div id="mision-vision"><MissionVision /></div>
        <div id="servicios"><Services /></div>
        <div id="ubicacion"><Location /></div>
        <div id="contacto"><Contact /></div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;