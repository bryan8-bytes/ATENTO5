import { useState, useEffect, useCallback, useRef } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Wrench, MessageCircle, ArrowRight, Briefcase, Phone } from 'lucide-react'
import logo from '../assets/Logo Atento5.png'
import heroBg from '../assets/hero-bg.webp'
import './Hero.css'

const SLIDE_DURATION = 15000

const socialSvgMap = {
  Facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.991 22 16.991 22 12z"/>
    </svg>
  ),
  Youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  WhatsApp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  MessageCircle: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2.5 22l5.06-1.37A9.934 9.934 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.37 0-2.68-.29-3.88-.82l-.72-.36-3.14.85.84-3.06-.47-.74A7.936 7.936 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
  ),
}

const slides = [
  {
    id: 'inicio',
    title: 'INICIO',
    subtitle: 'Soluciones Integrales para tu Empresa',
    description: 'Brindamos servicios confiables y personalizados para impulsar el crecimiento de tu negocio con una imagen moderna y atención experta en cada proyecto.',
    tag: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.',
    tagIcon: ShieldCheck,
    accent: '#3CB4FF',
    accentSecondary: '#D21414',
    showSocials: false,
    socials: [],
  },
  {
    id: 'servicios',
    title: 'SERVICIOS',
    subtitle: '16 Áreas de Especialización',
    description: 'Mantenimiento General, Construcción, Gasfitería, Electricidad, Jardinería, Limpieza Industrial y más. Expertos en cada área para garantizar resultados excepcionales.',
    tag: '¿QUÉ HACEMOS?',
    tagIcon: Wrench,
    accent: '#D21414',
    accentSecondary: '#3CB4FF',
    showSocials: false,
    socials: [],
  },
  {
    id: 'nosotros',
    title: 'NOSOTROS',
    subtitle: 'Compromiso y Excelencia',
    description: 'Somos un equipo comprometido con la calidad y la satisfacción del cliente. Nuestra experiencia nos respalda como líderes en servicios generales.',
    tag: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.',
    tagIcon: ShieldCheck,
    accent: '#3CB4FF',
    accentSecondary: '#D21414',
    showSocials: false,
    socials: [],
  },
  {
    id: 'mision-vision',
    title: 'MISIÓN Y VISIÓN',
    subtitle: 'Nuestro Propósito',
    description: 'Misión: Brindar soluciones integrales con calidad y compromiso. Visión: Ser la empresa líder en servicios generales reconocida por su excelencia y confiabilidad.',
    tag: 'NUESTRO FUTURO',
    tagIcon: ShieldCheck,
    accent: '#D21414',
    accentSecondary: '#3CB4FF',
    showSocials: false,
    socials: [],
  },
  {
    id: 'contacto',
    title: 'CONTACTO',
    subtitle: 'Estamos para Ayudarte',
    description: 'Ubicados en Lima, atendemos a nivel nacional. Solicita tu cotización sin compromiso o contáctanos por cualquiera de nuestras redes sociales.',
    tag: 'ESCRÍBENOS',
    tagIcon: MessageCircle,
    accent: '#3CB4FF',
    accentSecondary: '#D21414',
    showSocials: true,
    socials: [
      { name: 'Facebook', icon: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61592431140405' },
      { name: 'YouTube', icon: 'Youtube', href: 'https://youtube.com/@atento5solucionesgenerales' },
      { name: 'WhatsApp', icon: 'WhatsApp', href: 'https://wa.me/51955295390' },
      { name: 'Instagram', icon: 'Instagram', href: 'https://www.instagram.com/atento5.solucionesgen/' },
      { name: 'TikTok', icon: 'TikTok', href: 'https://www.tiktok.com/@atento5.solucione' },
    ],
  },
]

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
}

const childVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.35, ease: 'easeIn' },
  },
}

const HERO_BUTTON_BASE =
  'relative group inline-flex items-center justify-center gap-3 text-center font-extrabold rounded-full text-base sm:text-lg md:text-xl py-4 sm:py-4.5 md:py-5 px-8 sm:px-10 md:px-12 min-h-[58px] md:min-h-[64px] min-w-[220px] sm:min-w-[260px] transition-all duration-300 tracking-wide shadow-lg'

const HERO_BUTTONS_CONTAINER_CLASSES =
  'flex flex-col sm:flex-row gap-4 md:gap-5 w-full justify-start items-stretch sm:items-center'

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isHovering, setIsHovering] = useState(false)
  const [parallaxY, setParallaxY] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY < window.innerHeight) {
        setParallaxY(scrollY * 0.08)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goTo = useCallback((nextIndex) => {
    if (nextIndex === current) return
    setDirection(nextIndex > current ? 1 : -1)
    setCurrent(nextIndex)
  }, [current])

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  useEffect(() => {
    if (isHovering) return
    timerRef.current = setInterval(() => {
      goNext()
    }, SLIDE_DURATION)

    return () => clearInterval(timerRef.current)
  }, [isHovering, goNext])

  const slide = slides[current]

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-x-hidden flex items-center justify-center py-20 md:py-28 lg:py-24 select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(5,11,20,0.92) 0%, rgba(5,11,20,0.55) 45%, rgba(5,11,20,0.88) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <Motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: `${slide.accent}18` }}
          key={`orb1-${slide.id}`}
        />
        <Motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: `${slide.accentSecondary}15` }}
          key={`orb2-${slide.id}`}
        />
      </div>

      <div className="hidden lg:flex absolute left-6 top-[42%] -translate-y-1/2 z-20">
        <Motion.button
          onClick={goPrev}
          className="flex items-center justify-center w-14 h-14 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Slide anterior"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Motion.button>
      </div>

      <div className="hidden lg:flex absolute right-6 top-[42%] -translate-y-1/2 z-20">
        <Motion.button
          onClick={goNext}
          className="flex items-center justify-center w-14 h-14 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Siguiente slide"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-center">
          <div className="relative z-10 max-w-2xl xl:max-w-3xl flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <Motion.div
                key={slide.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 120, damping: 20 },
                  opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                }}
                className="hero-stack"
              >
                <Motion.div
                  custom={0}
                  variants={childVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="hero-badge"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slide.accent, boxShadow: `0 0 12px 2px ${slide.accent}` }} />
                  <span className="text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase whitespace-nowrap">
                    {slide.tag}
                  </span>
                </Motion.div>

                <Motion.h1
                  custom={1}
                  variants={childVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="hero-title"
                >
                  <span className="text-white drop-shadow-sm">{slide.title}</span>
                </Motion.h1>

                <Motion.h2
                  custom={2}
                  variants={childVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wide leading-snug"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent} 0%, ${slide.accentSecondary} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {slide.subtitle}
                </Motion.h2>

                 <Motion.p
                   custom={3}
                   variants={childVariants}
                   initial="hidden"
                   animate="visible"
                   exit="exit"
                   className="hero-description"
                 >
                   {slide.description}
                 </Motion.p>

                 {slide.showSocials && (
                  <>
                    <Motion.div
                      custom={4}
                      variants={childVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase" style={{ color: slide.accent }}>
                        Nuestras Redes
                      </span>
                    </Motion.div>
                    <Motion.div
                      custom={5}
                      variants={childVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex flex-wrap items-center gap-3 sm:gap-4"
                    >
                      {slide.socials.map((social) => (
                        <Motion.a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 bg-white/5 text-white"
                          style={{ boxShadow: `0 0 15px ${slide.accent}10` }}
                          whileHover={{
                            scale: 1.15,
                            borderColor: slide.accent,
                            boxShadow: `0 0 25px ${slide.accent}30`,
                            backgroundColor: `${slide.accent}20`,
                          }}
                          whileTap={{ scale: 0.95 }}
                          title={social.name}
                        >
                          {socialSvgMap[social.icon] || socialSvgMap.MessageCircle}
                        </Motion.a>
                      ))}
                    </Motion.div>
                  </>
                 )}

                <Motion.div
                  custom={6}
                  variants={childVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`${HERO_BUTTONS_CONTAINER_CLASSES} ${slide.showSocials ? 'mt-10 sm:mt-14 md:mt-20 lg:mt-28' : 'mt-20 sm:mt-28 md:mt-36 lg:mt-48 xl:mt-56'}`}
                >
                  {slide.id === 'inicio' && (
                    <>
                      <Motion.a
                        href="#contacto"
                        className={HERO_BUTTON_BASE}
                        style={{
                          background: `linear-gradient(135deg, ${slide.accent} 0%, ${slide.accentSecondary} 100%)`,
                          boxShadow: `0 12px 24px ${slide.accent}25, inset 0 1px 0 rgba(255,255,255,0.2)`,
                        }}
                        whileHover={{ scale: 1.03, y: -1.5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="leading-none">Contáctanos</span>
                        <ArrowRight size={24} className="transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                      </Motion.a>
                      <Motion.a
                        href="#servicios"
                        className={HERO_BUTTON_BASE}
                        style={{
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                        }}
                        whileHover={{ scale: 1.03, y: -1.5, backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.35)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Ver Servicios</span>
                        <Wrench size={24} className="transition-transform group-hover:rotate-12" />
                      </Motion.a>
                    </>
                  )}

                  {slide.id === 'servicios' && (
                    <>
                      <Motion.a
                        href="#servicios"
                        className={HERO_BUTTON_BASE}
                        style={{
                          background: `linear-gradient(135deg, ${slide.accent} 0%, ${slide.accentSecondary} 100%)`,
                          boxShadow: `0 12px 24px ${slide.accent}25, inset 0 1px 0 rgba(255,255,255,0.2)`,
                        }}
                        whileHover={{ scale: 1.03, y: -1.5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Ver Servicios</span>
                        <ArrowRight size={24} className="transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                      </Motion.a>
                      <Motion.a
                        href="https://wa.me/51955295390"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={HERO_BUTTON_BASE}
                        style={{
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                        }}
                        whileHover={{ scale: 1.03, y: -1.5, backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.35)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Solicitar Cotización</span>
                        <MessageCircle size={24} className="transition-transform group-hover:rotate-45" />
                      </Motion.a>
                    </>
                  )}

                  {slide.id === 'nosotros' && (
                    <>
                      <Motion.a
                        href="#nosotros"
                        className={HERO_BUTTON_BASE}
                        style={{
                          background: `linear-gradient(135deg, ${slide.accent} 0%, ${slide.accentSecondary} 100%)`,
                          boxShadow: `0 12px 24px ${slide.accent}25, inset 0 1px 0 rgba(255,255,255,0.2)`,
                        }}
                        whileHover={{ scale: 1.03, y: -1.5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Conócenos</span>
                        <ArrowRight size={24} className="transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                      </Motion.a>
                      <Motion.a
                        href="#contacto"
                        className={HERO_BUTTON_BASE}
                        style={{
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                        }}
                        whileHover={{ scale: 1.03, y: -1.5, backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.35)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Contactar</span>
                        <MessageCircle size={24} className="transition-transform group-hover:rotate-45" />
                      </Motion.a>
                    </>
                  )}

                  {slide.id === 'mision-vision' && (
                    <>
                      <Motion.a
                        href="#mision-vision"
                        className={HERO_BUTTON_BASE}
                        style={{
                          background: `linear-gradient(135deg, ${slide.accent} 0%, ${slide.accentSecondary} 100%)`,
                          boxShadow: `0 12px 24px ${slide.accent}25, inset 0 1px 0 rgba(255,255,255,0.2)`,
                        }}
                        whileHover={{ scale: 1.03, y: -1.5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Nuestra Misión</span>
                        <ArrowRight size={24} className="transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                      </Motion.a>
                      <Motion.a
                        href="#contacto"
                        className={HERO_BUTTON_BASE}
                        style={{
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                        }}
                        whileHover={{ scale: 1.03, y: -1.5, backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.35)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Contactar</span>
                        <MessageCircle size={24} className="transition-transform group-hover:rotate-45" />
                      </Motion.a>
                    </>
                  )}

                  {slide.id === 'contacto' && (
                    <>
                      <Motion.a
                        href="https://wa.me/51955295390"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={HERO_BUTTON_BASE}
                        style={{
                          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                          boxShadow: '0 12px 24px rgba(37, 211, 102, 0.2)',
                        }}
                        whileHover={{ scale: 1.03, y: -1.5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle size={24} className="transition-transform group-hover:scale-110" />
                        <span>Escríbenos</span>
                      </Motion.a>
                      <Motion.a
                        href="#contacto"
                        className={HERO_BUTTON_BASE}
                        style={{
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                        }}
                        whileHover={{ scale: 1.03, y: -1.5, backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.35)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Ver Contacto</span>
                        <ArrowRight size={24} className="transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                      </Motion.a>
                    </>
                  )}
                </Motion.div>
               </Motion.div>
            </AnimatePresence>
          </div>

          <Motion.div
            key={`image-${slide.id}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1, y: parallaxY }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative flex items-center justify-center"
          >
            <Motion.div
              className="relative w-full aspect-square max-w-[200px] sm:max-w-sm md:max-w-sm lg:max-w-md mx-auto"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Motion.div
                className="absolute inset-0 rounded-[40px] border backdrop-blur-xl"
                style={{
                  background: `linear-gradient(135deg, ${slide.accent}10 0%, ${slide.accentSecondary}06 100%)`,
                  borderColor: `${slide.accent}20`,
                  boxShadow: `0 30px 60px ${slide.accent}10, inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              <Motion.img
                src={logo}
                alt="ATENTO5"
                width="512"
                height="512"
                className="relative z-10 w-full h-full object-contain p-6 sm:p-8 md:p-10"
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              <Motion.div
                className="absolute -top-10 -right-10 w-60 h-60 rounded-full blur-[100px]"
                style={{ background: `${slide.accent}25` }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                key={`glow1-${slide.id}`}
              />
              <Motion.div
                className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full blur-[100px]"
                style={{ background: `${slide.accentSecondary}20` }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.5, 0.25] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                key={`glow2-${slide.id}`}
              />
            </Motion.div>
          </Motion.div>
        </div>
      </div>

      <div className="hero-indicators">
        {slides.map((s, index) => (
          <Motion.button
            key={s.id}
            onClick={() => goTo(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '9999px',
              backgroundColor: current === index ? s.accent : 'rgba(255, 255, 255, 0.25)',
              border: current === index ? `1px solid ${s.accent}` : '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlider
