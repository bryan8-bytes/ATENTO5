import { useState, useEffect, Suspense, lazy } from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import './Home.css';

const About = lazy(() => import('../components/About'));
const MissionVision = lazy(() => import('../components/MissionVision'));
const Services = lazy(() => import('../components/Services'));
const Contact = lazy(() => import('../components/Contact'));
const Location = lazy(() => import('../components/Location'));
const BrochureDownloadField = lazy(() => import('../components/brochure/BrochureDownloadField'));

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
    <>
      <div
        className="sidebar-scroll"
        role="navigation"
        aria-label="Navegación lateral"
      >
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const showLabel = hoveredSection === section.id;
          const color = index % 2 === 0 ? '#3CB4FF' : '#D21414';

          return (
            <div
              key={section.id}
              className="sidebar-scroll-item"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {showLabel && (
                <motion.div
                  initial={{ opacity: 0, x: 8, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="sidebar-scroll-label"
                  style={{
                    borderColor: `${color}80`,
                    boxShadow: `0 0 12px ${color}45`,
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
                className={`sidebar-scroll-dot ${isActive ? 'sidebar-scroll-dot-active' : ''}`}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${color}, ${index % 2 === 0 ? '#D21414' : '#3CB4FF'})`
                    : 'rgba(255, 255, 255, 0.92)',
                  boxShadow: isActive
                    ? `0 0 22px ${color}, 0 0 40px ${color}45`
                    : '0 0 6px rgba(255, 255, 255, 0.18)',
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
  <div className="page-background" aria-hidden="true">
    <div className="page-background-orb page-background-orb-1">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
    <div className="page-background-orb page-background-orb-2">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
    <div className="page-background-orb page-background-orb-3" />
    <div className="page-background-grid" />
  </div>
);

const SectionDivider = ({ color = '#3CB4FF' }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: 'easeInOut' }}
    className="section-divider"
    style={{
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
    }}
  />
);

const Home = () => {
  return (
    <div className="home-root">
      <PageBackground />
      <Navbar />
      <SidebarScroll />

      <main id="main" className="home-main">
        <Hero />
        <SectionDivider />
        <Suspense fallback={<div className="section-suspense" />}>
          <BrochureDownloadField />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={<div className="section-suspense" />}>
          <About />
        </Suspense>
        <SectionDivider color="#D21414" />
        <Suspense fallback={<div className="section-suspense" />}>
          <MissionVision />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={<div className="section-suspense" />}>
          <Services />
        </Suspense>
        <SectionDivider color="#D21414" />
        <Suspense fallback={<div className="section-suspense" />}>
          <Location />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={<div className="section-suspense" />}>
          <Contact />
        </Suspense>
      </main>
    </div>
  );
};

export default Home;