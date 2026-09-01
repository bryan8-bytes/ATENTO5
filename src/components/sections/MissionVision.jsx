import { motion as Motion } from 'framer-motion'
import { Target, Eye, Award, Heart, Lightbulb, Users, Handshake, Leaf, CheckCircle2 } from 'lucide-react'
import Section from '../ui/Section'
import Card from '../ui/Card'

export default function MissionVision() {
  const items = [
    { title: 'Misión', content: 'Proporcionar servicios generales de la más alta calidad, superando las expectativas de nuestros clientes mediante un equipo profesional comprometido, innovación constante y valores sólidos que nos distinguen como líderes en el sector.', icon: <Target size={36} style={{ color: '#3CB4FF' }} />, accent: '#3CB4FF' },
    { title: 'Visión', content: 'Ser líderes indiscutibles en el sector de servicios generales en Perú y Latinoamérica, reconocidos por la excelencia operativa, confiabilidad absoluta y compromiso genuino con el desarrollo sostenible de nuestros clientes y la comunidad.', icon: <Eye size={36} style={{ color: '#D21414' }} />, accent: '#D21414' },
  ]

  const values = [
    { name: 'Excelencia', desc: 'Superamos estándares en cada proyecto', icon: <Award size={20} /> },
    { name: 'Integridad', desc: 'Transparencia en cada acción', icon: <Heart size={20} /> },
    { name: 'Innovación', desc: 'Siempre buscando mejores soluciones', icon: <Lightbulb size={20} /> },
    { name: 'Trabajo en Equipo', desc: 'Colaboración para lograr más', icon: <Users size={20} /> },
    { name: 'Compromiso', desc: 'Dedicación total al cliente', icon: <Handshake size={20} /> },
    { name: 'Sostenibilidad', desc: 'Cuidamos el medio ambiente', icon: <Leaf size={20} /> },
  ]

  return (
    <Section id="mission" spacing="lg">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-16 md:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest text-[#3CB4FF] mb-6">
          NUESTRO PROPÓSITO
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Misión y Visión</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] mx-auto rounded-full" />
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Conoce los pilares que guían nuestro trabajo diario y nos impulsan a ser cada vez mejores.
        </p>
      </Motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
        {items.map((item, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <Card padding="lg" hover>
              <div className="card-header-accent" aria-hidden="true" />
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border border-white/10 bg-white/10 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.content}</p>
                </div>
              </div>
            </Card>
          </Motion.div>
        ))}
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-60px' }}
      >
        <h3 className="text-2xl font-bold text-white text-center mb-10">
          <span className="bg-gradient-to-r from-[#3CB4FF] to-[#D21414] bg-clip-text text-transparent">
            Nuestros Valores
          </span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {values.map((value, index) => (
            <Motion.div
              key={value.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: '-40px' }}
            >
              <Card padding="md" hover className="text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="card-icon-wrap mx-auto" style={{ color: index % 2 === 0 ? '#3CB4FF' : '#D21414' }}>
                    {value.icon}
                  </div>
                  <h4 className="card-title text-center">{value.name}</h4>
                  <p className="card-body text-center text-xs">{value.desc}</p>
                </div>
              </Card>
            </Motion.div>
          ))}
        </div>
      </Motion.div>
    </Section>
  )
}
