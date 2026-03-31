import { motion } from 'framer-motion';
import logo from '../../assets/Logo Atento5.png';

const ModernAnimatedLogo = ({ size = 'large', showText = true, variant = 'default', disableRings = false }) => {
  const sizeConfig = {
    small: { logo: 60, text: '24px', subtext: '12px' },
    medium: { logo: 100, text: '36px', subtext: '16px' },
    large: { logo: 160, text: '54px', subtext: '20px' },
    xlarge: { logo: 220, text: '72px', subtext: '28px' }
  };

  const config = sizeConfig[size] || sizeConfig.large;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Animated Glow Ring */}
      {!disableRings && (
        <motion.div
        style={{
          position: 'absolute',
          width: config.logo * 1.4,
          height: config.logo * 1.4,
          borderRadius: '50%',
          border: '2px solid transparent',
          background: 'linear-gradient(45deg, rgba(0, 195, 255, 0.3), rgba(255, 153, 0, 0.3)) border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      )}

      {/* Outer Pulse Ring */}
      {!disableRings && (
        <motion.div
        style={{
          position: 'absolute',
          width: config.logo * 1.6,
          height: config.logo * 1.6,
          borderRadius: '50%',
          border: '1px solid rgba(0, 195, 255, 0.2)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      )}

      {/* Logo Container with 3D Effect */}
      <motion.div
        style={{
          position: 'relative',
          width: config.logo,
          height: config.logo,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px',
        }}
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Logo Background Glow */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 195, 255, 0.4) 0%, rgba(0, 195, 255, 0.1) 40%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Main Logo */}
        <motion.img
          src={logo}
          alt="ATENTO5 Logo"
          style={{
            width: '80%',
            height: '80%',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0 0 20px rgba(0, 195, 255, 0.6)) drop-shadow(0 0 40px rgba(0, 195, 255, 0.3))',
          }}
          animate={{
            rotateY: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Sparkle Effects */}
        {[...Array(6)].map((_, i) => {
          const dotColor = variant === 'brochure' ? (i % 2 === 0 ? '#00C3FF' : '#FF9900') : '#00C3FF';
          
          return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: variant === 'brochure' ? '6px' : '4px',
              height: variant === 'brochure' ? '6px' : '4px',
              backgroundColor: dotColor,
              borderRadius: '50%',
              boxShadow: `0 0 8px ${dotColor}, 0 0 16px ${dotColor}`,
              left: `calc(${50 + 45 * Math.cos((i * 60 * Math.PI) / 180)}% - ${variant === 'brochure' ? '3px' : '2px'})`,
              top: `calc(${50 + 45 * Math.sin((i * 60 * Math.PI) / 180)}% - ${variant === 'brochure' ? '3px' : '2px'})`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              x: variant === 'brochure' ? [0, 15 * Math.cos((i * 60 * Math.PI) / 180), 0] : 0,
              y: variant === 'brochure' ? [0, 15 * Math.sin((i * 60 * Math.PI) / 180), 0] : 0,
            }}
            transition={{
              duration: variant === 'brochure' ? 3 : 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        )})}
      </motion.div>

      {/* Company Name */}
      {showText && (
        <motion.div
          style={{ textAlign: 'center', marginTop: '20px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h1
            style={{
              fontSize: config.text,
              fontWeight: 800,
              margin: 0,
              letterSpacing: '6px',
              textShadow: 'none',
              lineHeight: 1,
              background: 'linear-gradient(90deg, #00C3FF 0%, #FF9900 50%, #00C3FF 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% center', '200% center'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ATENTO5
          </motion.h1>
          
          <motion.div
            style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, #00C3FF, #FF9900)',
              margin: '12px auto',
              borderRadius: '2px',
            }}
            animate={{
              width: ['60px', '100px', '60px'],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          <motion.p
            style={{
              fontSize: config.subtext,
              fontWeight: 400,
              margin: 0,
              letterSpacing: '4px',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            SERVICIOS GENERALES
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};

export default ModernAnimatedLogo;
