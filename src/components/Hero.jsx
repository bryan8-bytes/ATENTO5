import { motion } from 'framer-motion';
import { MessageCircle, ArrowDown, Phone, Mail, Globe } from 'lucide-react';
import logo from '../assets/Logo Atento5.png';
import BrochurePDF from './brochure/BrochurePDF';

const Hero = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/51955295390', '_blank');
  };

  const BrochureFrontPage = () => (
    <div id="brochure-front" style={{
      position: 'absolute',
      left: '-9999px',
      width: '595px',
      height: '842px',
      background: 'white',
      fontFamily: "'Segoe UI', sans-serif",
      color: 'black',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', // to contain the wave
    }}>
      {/* Main Content Area */}
      <div style={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '150px' // Space for the wave footer
      }}>
        <img src={logo} alt="ATENTO5 Logo" style={{ width: '200px', height: '200px', marginBottom: '20px' }} />
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#003366', margin: 0, letterSpacing: '0.05em' }}>
          ATENTO5
        </h1>
        <p style={{ fontSize: '24px', color: '#0055A4', marginTop: '5px', letterSpacing: '0.1em' }}>
          SERVICIOS GENERALES E.I.R.L.
        </p>
      </div>

      {/* Footer with Wave */}
      <div style={{ position: 'relative', width: '100%', height: '250px' }}>
        {/* The Wave SVG */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 1 }}>
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path fill="#0055A4" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Contact Info */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '40px',
          right: '40px',
          zIndex: 2,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          fontSize: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={18} />
            <span>+51 955 295 390</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} />
            <span>contacto@atento5.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} />
            <span>www.atento5.com</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '120px',
      paddingBottom: '60px'
    }}>
      
      {/* Clean gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(0,195,255,0.08) 0%, rgba(5,11,20,0.95) 70%)',
      }} />
      


      {/* Content - with Logo */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: '1000px'
      }}>
        
        {/* Logo and Title Column - Centered */}
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2.5rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Logo with glow */}
          <motion.div
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Dual Glow effect */}
            <motion.div
              style={{
                position: 'absolute',
                inset: '-20px',
                borderRadius: '50%',
                filter: 'blur(20px)',
              }}
              animate={{
                background: [
                  'radial-gradient(circle, rgba(0,195,255,0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(255,153,0,0.25) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(0,195,255,0.3) 0%, transparent 70%)'
                ],
                scale: [1, 1.2, 1], 
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <img 
              src={logo} 
              alt="ATENTO5" 
              style={{
                width: '180px',
                height: '180px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 15px rgba(0,195,255,0.5))',
                position: 'relative',
                zIndex: 1
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
                    width: '6px',
                    height: '6px',
                    backgroundColor: dotColor,
                    borderRadius: '50%',
                    boxShadow: `0 0 10px ${dotColor}, 0 0 20px ${dotColor}`,
                    left: `calc(${50 + 46 * Math.cos((i * 60 * Math.PI) / 180)}% - 3px)`,
                    top: `calc(${50 + 46 * Math.sin((i * 60 * Math.PI) / 180)}% - 3px)`,
                    zIndex: 15,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    x: [0, 20 * Math.cos((i * 60 * Math.PI) / 180), 0],
                    y: [0, 20 * Math.sin((i * 60 * Math.PI) / 180), 0],
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

          {/* Text Column - Below Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '24px' }}>
            {/* Title */}
            <motion.h1 
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 5rem)',
                fontWeight: 900,
                letterSpacing: '0.08em',
                margin: 0,
                fontFamily: "'Segoe UI', sans-serif",
                background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px rgba(0,195,255,0.2)',
              }}
            >
              ATENTO5
            </motion.h1>
            
            <motion.p 
              style={{
                fontSize: 'clamp(0.8rem, 1.8vw, 1.1rem)',
                color: '#FFFFFF',
                letterSpacing: '0.35em',
                fontWeight: 700,
                marginTop: '10px',
                marginBottom: 0,
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #00C3FF, #FF9900)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center'
              }}
            >
              SERVICIOS GENERALES E.I.R.L.
            </motion.p>
          </div>
        </motion.div>

        {/* Short description */}
        <motion.p
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: 'rgba(229, 231, 235, 0.6)',
            maxWidth: '600px',
            lineHeight: 1.7,
            margin: '0 auto 2.5rem'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Empresa líder en servicios generales con más de 10 años de experiencia.
          Brindamos soluciones integrales de calidad.
        </motion.p>

        {/* CTA Button - Simple */}
        <motion.div
          style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleWhatsApp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 46px',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '17px',
              background: 'linear-gradient(135deg, rgba(0,195,255,0.15) 0%, rgba(255,153,0,0.15) 100%)',
              color: 'white',
              border: '1.5px solid rgba(0,195,255,0.4)',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 195, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{ transition: { duration: 0.1, delay: 0 }, scale: 1.05, 
              borderColor: 'rgba(255,153,0,0.8)',
              background: 'linear-gradient(135deg, rgba(0,195,255,0.25) 0%, rgba(255,153,0,0.25) 100%)',
              boxShadow: '-10px 0 25px rgba(0, 195, 255, 0.4), 10px 0 25px rgba(255, 153, 0, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
              }}
              animate={{
                backgroundColor: ['#00C3FF', '#FF9900', '#00C3FF'],
                boxShadow: ['0 0 8px #00C3FF', '0 0 8px #FF9900', '0 0 8px #00C3FF'],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span>Contáctanos por WhatsApp</span>
            <motion.span
              style={{ display: 'flex', alignItems: 'center', marginLeft: '2px' }}
              animate={{
                color: ['#00C3FF', '#FF9900', '#00C3FF'],
                filter: [
                  'drop-shadow(0 0 8px rgba(0,195,255,0.6))', 
                  'drop-shadow(0 0 8px rgba(255,153,0,0.6))', 
                  'drop-shadow(0 0 8px rgba(0,195,255,0.6))'
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MessageCircle size={22} strokeWidth={2.5} />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator - Modern */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {/* Modern scroll icon - Animated mouse */}
        <motion.div
          style={{
            width: '24px',
            height: '38px',
            borderRadius: '12px',
            border: '2px solid rgba(0, 195, 255, 0.4)',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '6px',
          }}
        >
          {/* Scroll wheel */}
          <motion.div
            style={{
              width: '4px',
              height: '8px',
              borderRadius: '2px',
              background: 'linear-gradient(180deg, #00C3FF, #FF9900)',
              boxShadow: '0 0 10px rgba(0, 195, 255, 0.6), 0 0 10px rgba(255, 153, 0, 0.6)',
            }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;