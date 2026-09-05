import { Suspense, lazy } from 'react';
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