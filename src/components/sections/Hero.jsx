import { motion } from 'framer-motion'
import GradientText from '../ui/GradientText'

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-950"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-faguade-light-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-faguade-yellow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-faguade-light-blue font-medium mb-4 tracking-wider uppercase">
              ATENTO5 SERVICIOS GENERALES E.I.R.L.
            </h2>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <GradientText>
              Soluciones Integrales
            </GradientText>
            <br />
            para tu Empresa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Brindamos servicios de excelencia y compromiso para impulsar el crecimiento 
            de tu negocio con soluciones personalizadas y profesionales.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#contact"
              className="px-8 py-4 bg-faguade-light-blue text-white font-semibold rounded-lg hover:bg-faguade-dark-blue transition-colors duration-300"
            >
              Contáctanos
            </a>
            <a
              href="#services"
              className="px-8 py-4 border-2 border-faguade-yellow text-faguade-yellow font-semibold rounded-lg hover:bg-faguade-yellow/10 transition-colors duration-300"
            >
              Ver Servicios
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 bg-faguade-light-blue rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}
