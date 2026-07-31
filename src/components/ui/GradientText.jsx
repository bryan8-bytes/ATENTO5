import { motion } from 'framer-motion'

export default function GradientText({ children, className = '' }) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-[var(--color-electric)] via-[var(--color-celeste)] to-[var(--color-electric)] bg-clip-text text-transparent ${className}`}
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
