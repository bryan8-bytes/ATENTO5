import { motion as Motion } from 'framer-motion'
import { Users, Award, TrendingUp, Clock, CheckCircle2, ScrollText, ShieldCheck } from 'lucide-react'
import Card from '../ui/Card'
import Section from '../ui/Section'

export default function About() {
  const features = [
    {
      icon: Users,
      title: 'Equipo Profesional',
      description: 'Contamos con personal altamente capacitado y comprometido con la excelencia.',
      accent: '#3CB4FF',
    },
    {
      icon: Award,
      title: 'Calidad Garantizada',
      description: 'Standards de calidad en cada uno de nuestros servicios.',
      accent: '#D21414',
    },
    {
      icon: TrendingUp,
      title: 'Resultados Medibles',
      description: 'Enfoque en resultados que impulsar el crecimiento de tu empresa.',
      accent: '#3CB4FF',
    },
  ]

  const timeline = [
    { year: '2014', title: 'Fundación', desc: 'Inicio de operaciones como empresa de servicios generales' },
    { year: '2016', title: 'Expansión', desc: 'Ampliación de servicios a construcción y obras civiles' },
    { year: '2019', title: 'Reconocimiento', desc: 'Certificación de calidad y primeros premios sectoriales' },
    { year: '2024', title: 'Liderazgo', desc: 'Posicionamiento como empresa líder en el mercado' },
  ]

  const whyChooseUs = [
    'Garantía total en todos nuestros servicios',
    'Equipo técnico especializado y certificado',
    'Materiales de primera calidad',
    'Precios competitivos sin sacrificar calidad',
    'Cumplimiento estricto de plazos',
    'Asesoría técnica gratuita',
  ]

  return (
    <Section id="about" spacing="lg">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-16 md:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest text-[#3CB4FF] mb-6">
          SOMOS ATENTO5
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Sobre Nosotros</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] mx-auto rounded-full" />
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Conoce más sobre ATENTO5 y nuestra trayectoria en el sector de servicios generales. 
          Somos tu socio estratégico para soluciones integrales.
        </p>
      </Motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center mb-16">
        <Motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <Card padding="lg" hover={false}>
            <div className="relative">
              <div className="absolute top-0 left-0 w-40 h-40 bg-[#3CB4FF]/20 blur-[80px] rounded-full" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#D21414]/20 blur-[80px] rounded-full" aria-hidden="true" />
              <h3 className="text-2xl font-semibold text-white mb-6 relative z-10 flex items-center gap-3">
                <ScrollText className="w-6 h-6 text-[#3CB4FF]" />
                Nuestra Historia
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed relative z-10">
                <strong className="text-white">ATENTO5 SERVICIOS GENERALES E.I.R.L.</strong> es una empresa líder en el sector de servicios generales, fundada con la visión de proporcionar soluciones integrales de la más alta calidad.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed relative z-10">
                A lo largo de nuestra trayectoria, hemos construido una sólida reputación basado en la <span className="text-[#3CB4FF] font-semibold">excelencia, integridad y compromiso</span> con cada proyecto.
              </p>
              <p className="text-gray-300 leading-relaxed relative z-10">
                Hoy, continuamos innovando y mejorando nuestros servicios para mantener nuestro posicionamiento como la opción preferida de empresas y particulares que buscan <span className="text-[#D21414] font-semibold">calidad, confiabilidad y excelencia</span>.
              </p>
            </div>
          </Card>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <Card padding="lg" hover={false}>
            <div className="relative">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#D21414]" />
                ¿Por Qué Elegirnos?
              </h3>
              <ul className="space-y-1 relative z-10">
                {whyChooseUs.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: i % 2 === 0 ? '#3CB4FF' : '#D21414' }} />
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Motion.div>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-60px' }}
        className="mb-16"
      >
        <h3 className="text-2xl font-bold text-white text-center mb-10 tracking-tight">Nuestra Trayectoria</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {timeline.map((item, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: '-40px' }}
              className="relative rounded-2xl p-5 md:p-6 text-center border border-white/10 bg-white/5 hover:border-[#3CB4FF]/30 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-[#3CB4FF] to-[#D21414] flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-[#3CB4FF]/20">
                {item.year}
              </div>
              <h4 className="text-white font-semibold mt-8 mb-2 group-hover:text-[#3CB4FF] transition-colors text-sm md:text-base">{item.title}</h4>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </Motion.div>
          ))}
        </div>
      </Motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <Motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: '-40px' }}
          >
            <Card hover padding="md">
              <div className="relative z-10">
                <div className="card-icon-wrap" style={{ color: feature.accent }}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="card-title">{feature.title}</h4>
                <p className="card-body">{feature.description}</p>
              </div>
            </Card>
          </Motion.div>
        ))}
      </div>
    </Section>
  )
}
