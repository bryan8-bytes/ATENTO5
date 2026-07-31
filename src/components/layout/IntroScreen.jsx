import { motion } from 'framer-motion'
import logo from '../../assets/Logo Atento5.png'

export default function IntroScreen() {
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
      
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(60, 180, 255, 0.07) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(210, 20, 20, 0.05) 0%, transparent 60%), #050B14',
      }} />
      
      <motion.div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(60, 180, 255, 0.12) 0%, transparent 60%)',
          filter: 'blur(70px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-150px',
          right: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(210, 20, 20, 0.08) 0%, transparent 60%)',
          filter: 'blur(70px)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative',
        zIndex: 10,
        marginBottom: '1rem',
        width: '100%',
        maxWidth: '700px',
        transform: 'translateY(-40px)'
      }}>
         
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'relative', zIndex: 10 }}
        >
          <motion.div
            style={{
              position: 'absolute',
              inset: '-120px',
              background: 'radial-gradient(circle, rgba(60, 180, 255, 0.28) 0%, rgba(210, 20, 20, 0.22) 45%, transparent 70%)',
              filter: 'blur(75px)',
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
              width: 'clamp(380px, 70vw, 580px)',
              height: 'clamp(380px, 70vw, 580px)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 45px rgba(60, 180, 255,0.6))',
            }}
          />

          {[...Array(6)].map((_, i) => {
            const dotColor = i % 2 === 0 ? '#3CB4FF' : '#D21414';
            return (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '14px',
                  height: '14px',
                  backgroundColor: dotColor,
                  borderRadius: '50%',
                  boxShadow: `0 0 16px ${dotColor}, 0 0 32px ${dotColor}`,
                  left: `calc(${50 + 39 * Math.cos((i * 60 * Math.PI) / 180)}% - 7px)`,
                  top: `calc(${50 + 39 * Math.sin((i * 60 * Math.PI) / 180)}% - 7px)`,
                  zIndex: 15,
                }}
                animate={{
                  scale: [0, 1.6, 0],
                  opacity: [0, 1, 0],
                  x: [0, 35 * Math.cos((i * 60 * Math.PI) / 180), 0],
                  y: [0, 35 * Math.sin((i * 60 * Math.PI) / 180), 0],
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

      <motion.div
        style={{ 
          marginTop: '1rem', 
          zIndex: 10, 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%',
          transform: 'translateY(-20px)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          style={{
            position: 'relative',
            padding: '16px 48px',
            background: 'linear-gradient(135deg, rgba(60, 180, 255,0.1) 0%, rgba(210, 20, 20,0.1) 100%)',
            border: '1.5px solid rgba(60, 180, 255,0.4)',
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
            background: 'linear-gradient(135deg, rgba(60, 180, 255,0.25) 0%, rgba(210, 20, 20,0.25) 100%)',
            boxShadow: '-12px 0 30px rgba(60, 180, 255,0.5), 12px 0 30px rgba(210, 20, 20,0.5)',
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
              scale: [1, 1.3, 1],
              backgroundColor: ['#3CB4FF', '#D21414', '#3CB4FF'],
              boxShadow: ['0 0 10px #3CB4FF', '0 0 10px #D21414', '0 0 10px #3CB4FF'],
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
              color: ['#3CB4FF', '#D21414', '#3CB4FF'],
              filter: [
                'drop-shadow(0 0 8px rgba(60, 180, 255,0.6))', 
                'drop-shadow(0 0 8px rgba(210, 20, 20,0.6))', 
                'drop-shadow(0 0 8px rgba(60, 180, 255,0.6))'
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  )
}