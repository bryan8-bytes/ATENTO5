import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import logo from '../assets/Logo Atento5.png';

const Intro = () => {
  const navigate = useNavigate();

  const handleEnter = (e) => {
    e.stopPropagation();
    navigate('/home');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: '#050B14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      zIndex: 9999,
      padding: '2rem',
    }}>
      
      {/* Simple gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(0,195,255,0.08) 0%, rgba(5,11,20,1) 70%)',
      }} />
      
      {/* Subtle orb */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,195,255,0.1) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Container - Logo with smaller rings - Centered */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative',
        zIndex: 10,
        marginBottom: '1rem',
        width: '100%',
        maxWidth: '500px',
        transform: 'translateY(-40px)'
      }}>
         
        {/* Logo Central - Smaller */}
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'relative', zIndex: 10 }}
        >
          {/* Glow */}
          <motion.div
            style={{
              position: 'absolute',
              inset: '-45px',
              background: 'radial-gradient(circle, rgba(0,195,255,0.35) 0%, transparent 60%)',
              filter: 'blur(35px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <img 
            src={logo} 
            alt="Atento5 Logo" 
            style={{
              width: '240px',
              height: '240px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 30px rgba(0,195,255,0.6))',
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
                  width: '10px',
                  height: '10px',
                  backgroundColor: dotColor,
                  borderRadius: '50%',
                  boxShadow: `0 0 12px ${dotColor}, 0 0 24px ${dotColor}`,
                  left: `calc(${50 + 42 * Math.cos((i * 60 * Math.PI) / 180)}% - 5px)`,
                  top: `calc(${50 + 42 * Math.sin((i * 60 * Math.PI) / 180)}% - 5px)`,
                  zIndex: 15,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  x: [0, 25 * Math.cos((i * 60 * Math.PI) / 180), 0],
                  y: [0, 25 * Math.sin((i * 60 * Math.PI) / 180), 0],
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
      </div>

      {/* Title Section - More space below logo */}
      <motion.div 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center', 
          zIndex: 10,
          marginTop: '1.5rem',
          marginBottom: '0',
          width: '100%',
          maxWidth: '800px',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Main title - simpler */}
        <motion.h1 
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '0.1em',
            margin: 0,
            marginBottom: '0.3rem',
            fontFamily: "'Segoe UI', sans-serif",
            background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ATENTO5
        </motion.h1>
        
        {/* Company type */}
        <motion.p 
          style={{
            fontSize: 'clamp(0.6rem, 1.5vw, 0.85rem)',
            letterSpacing: '0.4em',
            fontWeight: 600,
            marginBottom: '0',
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #00C3FF, #FF9900)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          SERVICIOS GENERALES E.I.R.L.
        </motion.p>
      </motion.div>

        {/* Enter Button - Clean and simple, perfectly centered */}
        <motion.div
          style={{ 
            marginTop: '3.5rem', 
            zIndex: 10, 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%' 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleEnter}
            style={{
              position: 'relative',
              padding: '16px 48px',
              background: 'linear-gradient(135deg, rgba(0,195,255,0.1) 0%, rgba(255,153,0,0.1) 100%)',
              border: '1.5px solid rgba(0,195,255,0.4)',
              borderRadius: '50px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{ transition: { duration: 0.1, delay: 0 }, scale: 1.05,
              borderColor: 'rgba(255,255,255,0.4)',
              background: 'linear-gradient(135deg, rgba(0,195,255,0.25) 0%, rgba(255,153,0,0.25) 100%)',
              boxShadow: '-12px 0 30px rgba(0,195,255,0.5), 12px 0 30px rgba(255,153,0,0.5)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* LED indicator */}
            <motion.span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
              }}
              animate={{ 
                scale: [1, 1.3, 1],
                backgroundColor: ['#00C3FF', '#FF9900', '#00C3FF'],
                boxShadow: ['0 0 10px #00C3FF', '0 0 10px #FF9900', '0 0 10px #00C3FF'],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <span style={{
              fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
              letterSpacing: '0.25em',
              color: '#FFFFFF',
              fontWeight: 700,
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(255,255,255,0.3)',
            }}>
              Ingresar
            </span>
            
            <motion.span 
              style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}
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
              <ArrowRight size={28} strokeWidth={3} />
            </motion.span>
          </motion.button>
        </motion.div>
    </div>
  );
};

export default Intro;
