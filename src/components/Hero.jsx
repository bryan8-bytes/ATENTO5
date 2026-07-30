import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Wrench, MessageCircle } from 'lucide-react';
import GradientText from './ui/GradientText';
import logo from '../assets/Logo Atento5.png';

const socialLinks = [
  { label: 'facebook', icon: 'f', href: '#' },
  { label: 'youtube', icon: '▶', href: '#' },
  { label: 'instagram', icon: '◎', href: '#' },
];

const Hero = () => {
  const heroRef = useRef(null);
  const orbRefs = useRef([]);

  const handleWhatsApp = () => {
    window.open('https://wa.me/51955295390', '_blank');
  };

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    function onMove(e) {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      const bgX = 50 + x * 3;
      const bgY = 50 + y * 3;
      hero.style.backgroundPosition = `${bgX}% ${bgY}%`;

      orbRefs.current.forEach((orb, index) => {
        if (!orb) return;
        const depth = (index + 1) * 6;
        orb.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
      });
    }

    if (window.innerWidth > 900 && 'onmousemove' in window) {
      window.addEventListener('mousemove', onMove, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050B14]"
    >
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,20,0.96),rgba(5,11,20,0.4)_35%,transparent_65%)]" />

      <div
        ref={(el) => (orbRefs.current[0] = el)}
        className="absolute top-10 left-[-80px] w-[260px] h-[260px] rounded-full blur-[120px] bg-gradient-to-r from-[#4ba9ff] to-[#7b3bff] opacity-70 mix-blend-screen animate-float"
      />
      <div
        ref={(el) => (orbRefs.current[1] = el)}
        className="absolute right-6 top-6 w-[180px] h-[180px] rounded-full blur-[140px] bg-gradient-to-r from-[#ff6a8a] to-[#ffb86b] opacity-70 mix-blend-screen animate-float-slow"
      />
      <div
        ref={(el) => (orbRefs.current[2] = el)}
        className="absolute right-20 bottom-6 w-[120px] h-[120px] rounded-full blur-[100px] bg-gradient-to-r from-[#3fe0ff] to-[#5b6cff] opacity-70 mix-blend-screen animate-float-delayed"
      />

      <div className="absolute top-6 left-6 z-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff9a3c] to-[#ff6a8a] px-4 py-2 text-xs font-bold text-[#051124] shadow-lg">
          <span className="h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
          New Big Update
        </span>
      </div>

      <div className="hidden lg:flex flex-col gap-3 absolute left-6 top-1/3 z-20 text-[#dbeafe]">
        {socialLinks.map((social, index) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold transition hover:bg-gradient-to-r hover:from-[#3fe0ff] hover:to-[#5b6cff]"
          >
            {social.icon}
          </a>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-[-0.05em] text-white"
            >
              <GradientText>Soluciones Integrales</GradientText>
              <br />
              <span className="text-white drop-shadow-[0_0_20px_rgba(63,224,255,0.18)]">para tu Empresa</span>
            </motion.h1>

            <motion.svg
              viewBox="0 0 300 40"
              className="w-[320px] h-[36px] mt-4 mb-6"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="hero-underline" x1="0" x2="1">
                  <stop offset="0%" stopColor="#3fe0ff" />
                  <stop offset="100%" stopColor="#5b6cff" />
                </linearGradient>
              </defs>
              <motion.path
                d="M5 20 C80 0, 140 40, 295 20"
                fill="none"
                stroke="url(#hero-underline)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: [0.2, 0.9, 0.2, 1], delay: 0.35 }}
              />
            </motion.svg>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed"
            >
              Empresa especializada en servicios generales comprometida con la excelencia.
              Brindamos soluciones integrales de la más alta calidad.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[28px] bg-gradient-to-r from-[#3CB4FF] to-[#D21414] text-white font-semibold shadow-[0_10px_30px_rgba(60,180,255,0.25)] transition hover:brightness-110"
              >
                Contáctanos
                <ArrowRight size={18} />
              </button>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[28px] border border-white/15 text-white font-semibold transition hover:bg-white/10"
              >
                Ver Servicios
                <Wrench size={18} />
              </a>
              <button
                aria-label="Enviar WhatsApp"
                onClick={handleWhatsApp}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center transition hover:scale-105"
              >
                <MessageCircle size={20} />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative hidden md:flex justify-end"
            aria-hidden="true"
          >
            <div className="relative w-full max-w-[520px]">
              <div className="absolute inset-0 rounded-[56px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm" />
              <img
                src={logo}
                alt="ATENTO5 logo"
                className="relative z-10 w-full h-full object-contain p-8"
              />
              <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[#3CB4FF]/20 blur-[100px]" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-[#D21414]/20 blur-[100px]" />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65 }}
      >
        <div className="h-14 w-10 rounded-full border border-white/15 flex items-start justify-center p-2">
          <div className="h-3 w-3 rounded-full bg-white/75 animate-bounce" />
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-white/60">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;
