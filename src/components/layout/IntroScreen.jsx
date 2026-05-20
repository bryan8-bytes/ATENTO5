import { motion } from 'framer-motion'
import logoA5 from '../../logo_a5.png'

export default function IntroScreen() {
  return (
    <div className="fixed inset-0 bg-dark-950 z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex justify-center mb-6"
        >
          <img src={logoA5} alt="ATENTO5" className="h-20 sm:h-24 w-auto object-contain" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-xl"
        >
          Servicios Generales E.I.R.L.
        </motion.p>
        
        {/* Loading bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'linear' }}
          className="h-1 bg-gradient-to-r from-faguade-light-blue via-faguade-yellow to-faguade-light-blue mt-8 max-w-md mx-auto rounded-full"
        />
      </motion.div>
    </div>
  )
}
