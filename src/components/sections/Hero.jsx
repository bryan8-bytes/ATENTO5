import { motion } from 'framer-motion'
import GradientText from '../ui/GradientText'
import { ArrowRight, ShieldCheck, Wrench, MessageCircle } from 'lucide-react'

export default function Hero() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/51955295390', '_blank')
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050B14]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#3CB4FF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D21414]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#3CB4FF]/5 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest text-[#3CB4FF] mb-6">
              <ShieldCheck size={14} />
              ATENTO5 SERVICIOS GENERALES E.I.R.L.
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]"
            >
              <GradientText>
                Soluciones Integrales
              </GradientText>
              <br />
              <span className="text-white">para tu Empresa</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed"
            >
              Brindamos servicios de excelencia y compromiso para impulsar el crecimiento 
              de tu negocio con soluciones personalizadas y profesionales.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] text-white font-semibold rounded-[28px] hover:brightness-110 transition-all duration-300 shadow-[0_10px_30px_rgba(60,180,255,0.25)]"
              >
                Contáctanos
                <ArrowRight size={18} />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 text-white font-semibold rounded-[28px] hover:bg-white/10 transition-all duration-300"
              >
                Ver Servicios
                <Wrench size={18} />
              </a>
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold rounded-[28px] hover:brightness-110 transition-all duration-300 shadow-[0_10px_30px_rgba(37,211,102,0.25)]"
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative w-full aspect-square max-w-lg ml-auto">
              <div className="absolute inset-0 rounded-[56px] bg-gradient-to-br from-white/10 to-white/0 border border-white/10 backdrop-blur-sm" />
              <img
                src="/Logo Atento5.png"
                alt="ATENTO5"
                className="relative z-10 w-full h-full object-contain p-10"
              />
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#3CB4FF]/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#D21414]/20 blur-[100px] rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}