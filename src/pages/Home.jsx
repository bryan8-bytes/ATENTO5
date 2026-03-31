import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import MissionVision from '../components/MissionVision';
import Services from '../components/Services';
import Contact from '../components/Contact';
import BrochureDownloadField from '../components/brochure/BrochureDownloadField';
import Footer from '../components/Footer';
import ScrollSidebar from '../components/ui/ScrollSidebar';
import Location from '../components/Location';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050B14', position: 'relative', overflow: 'hidden' }}>
      


      <Navbar />
      <ScrollSidebar />
      
      <main style={{ position: 'relative', zIndex: 1 }}>
        <div id="hero"><Hero /></div>
        {/* New Brochure Download Field Section */}
        <div id="brochure"><BrochureDownloadField /></div>
        
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