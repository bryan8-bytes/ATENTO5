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
      className="relative min-h-screen overflow-hidden flex items-center justify-center py-24 lg:py-0"
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

      {/* Centered container aligned with Navbar (1440px max width) */}
      <div 
        className="relative z-10 flex w-full items-center"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
          boxSizing: 'border-box'
        }}
      >
        <div className="grid w-full gap-12 lg:grid-cols-2 items-center">
          
          {/* Left column (Text & actions) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left'
            }}
          >
            {/* Badges container */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}
            >
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '30px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px 18px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: '#3CB4FF',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(60, 180, 255, 0.05)'
                }}
              >
                <ShieldCheck size={14} />
                atento5 servicios generales e.i.r.l.
              </div>
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #ff9a3c 0%, #ff6a8a 100%)',
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#051124',
                  boxShadow: '0 8px 20px rgba(255, 106, 138, 0.25)'
                }}
              >
                New Big Update
              </span>
            </div>

            {/* Title block */}
            <div style={{ width: '100%', marginBottom: '24px' }}>
              <p style={{
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.35em',
                color: 'rgba(6, 182, 212, 0.8)',
                fontWeight: '700',
                margin: '0 0 12px 0'
              }}>Servicios generales de confianza</p>
              
              <h1 style={{
                fontSize: 'clamp(2.3rem, 4.8vw, 4.2rem)',
                fontWeight: '900',
                lineHeight: '1.15',
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
              }}>
                Soluciones Integrales<br />
                <span style={{
                  background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>para tu Empresa</span>
              </h1>
              
              <div 
                style={{
                  height: '5px',
                  width: '180px',
                  marginTop: '20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, #3CB4FF, #D21414)',
                  opacity: 0.8
                }}
              />
            </div>

            {/* Description */}
            <p style={{
              maxWidth: '600px',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              lineHeight: '1.75',
              color: 'rgba(229, 231, 235, 0.75)',
              margin: '0 0 32px 0'
            }}>
              Brindamos servicios confiables y personalizados para impulsar el crecimiento de tu negocio con una imagen moderna y atención experta en cada proyecto.
            </p>

            {/* Buttons Row with flex wrap to prevent overlap */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <button
                onClick={handleWhatsApp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '16px 36px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 12px 35px rgba(60, 180, 255, 0.25)',
                  transition: 'all 0.3s ease',
                }}
                className="hover:brightness-110"
              >
                Contáctanos
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '16px 36px',
                  borderRadius: '30px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                className="hover:bg-white/10"
              >
                Ver Servicios
                <Wrench size={18} />
              </button>

              <button
                onClick={handleWhatsApp}
                aria-label="Contactar por WhatsApp"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                className="hover:bg-white/10 hover:text-[#25D366] hover:scale-105"
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
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Ambient blur glow behind the card */}
            <div style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '42px',
              background: 'radial-gradient(circle, rgba(60, 180, 255, 0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }} />
            
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              borderRadius: '36px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)'
            }}>
              <img 
                src={heroBg} 
                alt="ATENTO5 Mantenimiento" 
                style={{
                  width: '100%',
                  height: 'clamp(320px, 45vh, 460px)',
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(5, 11, 20, 0.9) 0%, rgba(5, 11, 20, 0.1) 40%, transparent 100%)',
                pointerEvents: 'none'
              }} />
              
              <div style={{
                position: 'absolute',
                left: '20px',
                bottom: '20px',
                right: '20px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(5, 11, 20, 0.65)',
                padding: '16px 20px',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)'
              }}>
                <p style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: '#3CB4FF',
                  fontWeight: '700',
                  margin: 0
                }}>ATENTOS</p>
                <p style={{
                  marginTop: '8px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.5',
                  margin: '8px 0 0 0'
                }}>
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
