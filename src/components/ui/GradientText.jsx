import { motion } from 'framer-motion'

export default function GradientText({ children, className = '' }) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-faguade-light-blue via-faguade-yellow to-faguade-light-blue bg-clip-text text-transparent ${className}`}
      style={{
        backgroundSize: '200% 200%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  )
}
