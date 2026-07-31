import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Wrench, MessageCircle } from 'lucide-react'
import logo from '../assets/Logo Atento5.png'
import heroBg from '../assets/hero-bg.png'

const socialLinks = [
  { label: 'facebook', icon: 'f', href: '#' },
  { label: 'youtube', icon: '▶', href: '#' },
  { label: 'instagram', icon: '◎', href: '#' },
]

const Hero = () => {
  const heroRef = useRef(null)
  const orbRefs = useRef([])

  const handleWhatsApp = () => {
    window.open('https://wa.me/51955295390', '_blank')
  }

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    function onMove(e) {
      const x = (e.clientX / window.innerWidth) - 0.5
      const y = (e.clientY / window.innerHeight) - 0.5
      const bgX = 52 + x * 6
      const bgY = 48 + y * 4
      hero.style.backgroundPosition = `${bgX}% ${bgY}%`

      orbRefs.current.forEach((orb, index) => {
        if (!orb) return
        const depth = (index + 1) * 7
        orb.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`
      })
    }

    if (window.innerWidth > 900 && 'onmousemove' in window) {
      window.addEventListener('mousemove', onMove, { passive: true })
    }

    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center py-20 lg:py-0"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(5,11,20,0.95) 0%, rgba(5,11,20,0.65) 35%, rgba(5,11,20,0.95) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay & gradients */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(63,224,255,0.18)_0%,_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(210,20,20,0.16)_0%,_transparent_22%)] mix-blend-screen z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,20,0.95),rgba(5,11,20,0.25)_40%,transparent_60%)] z-0" />

      {/* Floating background orb lights */}
      <div
        ref={(el) => (orbRefs.current[0] = el)}
        className="absolute -left-10 top-24 h-64 w-64 rounded-full bg-gradient-to-r from-[#4ba9ff] to-[#7b3bff] opacity-60 blur-3xl mix-blend-screen animate-float z-0 pointer-events-none"
      />
      <div
        ref={(el) => (orbRefs.current[1] = el)}
        className="absolute right-8 top-20 h-44 w-44 rounded-full bg-gradient-to-r from-[#ff6a8a] to-[#ffb86b] opacity-60 blur-3xl mix-blend-screen animate-float-slow z-0 pointer-events-none"
      />
      <div
        ref={(el) => (orbRefs.current[2] = el)}
        className="absolute right-24 bottom-20 h-32 w-32 rounded-full bg-gradient-to-r from-[#3fe0ff] to-[#5b6cff] opacity-60 blur-3xl mix-blend-screen animate-float-delayed z-0 pointer-events-none"
      />

      {/* Social links (Floating side) */}
      <div className="hidden lg:flex flex-col gap-3 absolute left-6 top-1/3 z-20 text-[#dbeafe]">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-bold transition hover:bg-gradient-to-r hover:from-[#3fe0ff] hover:to-[#5b6cff] hover:scale-105"
          >
            {social.icon}
          </a>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          
          {/* Left column (Text & actions) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:space-y-8"
          >
            {/* Badges container */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-[#3CB4FF] shadow-[0_20px_50px_rgba(60,180,255,0.1)] backdrop-blur-sm">
                <ShieldCheck size={14} />
                atento5 servicios generales e.i.r.l.
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff9a3c] to-[#ff6a8a] px-4 py-2 text-xs font-bold text-[#051124] shadow-lg shadow-[#ff6a8a]/20">
                New Big Update
              </span>
            </div>

            {/* Title block */}
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/80 font-bold">Servicios generales de confianza</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white tracking-tight">
                <span className="block">Soluciones Integrales</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3fe0ff] to-[#5b6cff]">para tu Empresa</span>
              </h1>
              <div className="h-1.5 w-[200px] sm:w-[320px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#3fe0ff] to-[#5b6cff]"
                />
              </div>
            </div>

            {/* Description */}
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              Brindamos servicios confiables y personalizados para impulsar el crecimiento de tu negocio con una imagen moderna y atención experta en cada proyecto.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3CB4FF] to-[#D21414] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_60px_rgba(60,180,255,0.22)] hover:shadow-[0_18px_60px_rgba(60,180,255,0.4)] transition-all duration-300 hover:brightness-110"
              >
                Contáctanos
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/25"
              >
                Ver Servicios
                <Wrench size={18} />
              </button>

              <button
                onClick={handleWhatsApp}
                aria-label="Contactar por WhatsApp"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:text-[#25D366]"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </motion.div>

          {/* Right column (Skyscraper card mockup) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="absolute -inset-4 sm:-inset-8 rounded-[42px] bg-white/5 shadow-[0_60px_120px_rgba(0,0,0,0.18)] blur-3xl pointer-events-none" />
            <div className="relative overflow-hidden rounded-[32px] sm:rounded-[42px] border border-white/10 bg-white/5 backdrop-blur-xl">
              <img src={heroBg} alt="ATENTO5 Mantenimiento" className="h-[400px] sm:h-[520px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute left-4 bottom-4 right-4 sm:left-6 sm:bottom-6 sm:right-6 rounded-[24px] sm:rounded-[28px] border border-white/10 bg-black/50 p-4 sm:p-5 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                <p className="text-xs uppercase tracking-[0.35em] text-[#3CB4FF] font-bold">ATENTO5</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Soluciones confiables y profesionales en mantenimiento, infraestructura y servicios generales.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
