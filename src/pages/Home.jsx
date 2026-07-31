import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import MissionVision from '../components/MissionVision';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Location from '../components/Location';
import BrochureDownloadField from '../components/brochure/BrochureDownloadField';

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  if (!isClient) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          right: '18px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          background: 'rgba(5, 11, 20, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(60, 180, 255, 0.12)',
          borderRadius: '28px',
          padding: '18px 10px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45), 0 0 30px rgba(60, 180, 255, 0.05)',
          maxHeight: '72vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          width: '48px',
        }}
      >
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const showLabel = hoveredSection === section.id;
          const color = index % 2 === 0 ? '#3CB4FF' : '#D21414';

          return (
            <div
              key={section.id}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {showLabel && (
                <motion.div
                  initial={{ opacity: 0, x: 8, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    right: '58px',
                    background: 'rgba(5, 11, 20, 0.92)',
                    color: '#fff',
                    padding: '7px 12px',
                    borderRadius: '14px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    border: `1px solid ${color}`,
                    boxShadow: `0 0 12px ${color}45`,
                    pointerEvents: 'none',
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {section.title}
                </motion.div>
              )}

              <motion.button
                onClick={() => scrollTo(section.id)}
                aria-label={section.title}
                title={section.title}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isActive ? 30 : 16,
                  height: isActive ? 30 : 16,
                  borderRadius: '50%',
                  background: isActive
                    ? `linear-gradient(135deg, ${color}, ${index % 2 === 0 ? '#D21414' : '#3CB4FF'})`
                    : 'rgba(255, 255, 255, 0.92)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isActive
                    ? `0 0 22px ${color}, 0 0 40px ${color}45`
                    : '0 0 6px rgba(255, 255, 255, 0.18)',
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                }}
              />
            </div>
          );
        })}
      </div>

    </>
  );
};

const PageBackground = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute',
      top: '-20%',
      left: '-10%',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(60, 180, 255, 0.06) 0%, transparent 60%)',
      filter: 'blur(80px)',
    }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
    <div style={{
      position: 'absolute',
      bottom: '-20%',
      right: '-10%',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(210, 20, 20, 0.04) 0%, transparent 60%)',
      filter: 'blur(80px)',
    }}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '800px',
      height: '800px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(60, 180, 255, 0.03) 0%, transparent 60%)',
      filter: 'blur(100px)',
    }} />
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `radial-gradient(rgba(60, 180, 255, 0.03) 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
    }} />
  </div>
);

const SectionDivider = ({ color = '#3CB4FF' }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: 'easeInOut' }}
    style={{
      width: '100%',
      height: '1px',
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      opacity: 0.3,
      transformOrigin: 'center',
    }}
  />
);

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050B14',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <PageBackground />
      <Navbar />
      <SidebarScroll />

      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <div id="hero">
          <Hero />
        </div>
        <SectionDivider />
        <div id="brochure-download">
          <BrochureDownloadField />
        </div>
        <SectionDivider />
        <div id="nosotros">
          <About />
        </div>
        <SectionDivider color="#D21414" />
        <div id="mision-vision">
          <MissionVision />
        </div>
        <SectionDivider />
        <div id="servicios">
          <Services />
        </div>
        <SectionDivider color="#D21414" />
        <div id="ubicacion">
          <Location />
        </div>
        <SectionDivider />
        <div id="contacto">
          <Contact />
        </div>
      </main>
    </div>
  );
};

export default Home;