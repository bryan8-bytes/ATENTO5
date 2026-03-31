import { motion } from 'framer-motion';
import logo from '../../assets/Logo Atento5.png';

const AnimatedLogoText = ({ className = '', size = 'normal' }) => {
  const sizeClasses = {
    small: 'w-28',
    normal: 'w-40 md:w-48',
    large: 'w-56 md:w-64',
    hero: 'w-64 md:w-72 lg:w-80'
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.img
        src={logo}
        alt="ATENTO5"
        className={sizeClasses[size]}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          filter: 'drop-shadow(0 4px 20px rgba(59, 130, 246, 0.4))'
        }}
      />
    </motion.div>
  );
};

export default AnimatedLogoText;