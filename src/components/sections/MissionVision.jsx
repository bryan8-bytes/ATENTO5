import { motion } from 'framer-motion'
import { Target, Eye, Award, Heart, Lightbulb, Users, Handshake, Leaf, CheckCircle2 } from 'lucide-react'

export default function MissionVision() {
  const items = [
    {
      title: 'Misión',
      content: 'Proporcionar servicios generales de la más alta calidad, superando las expectativas de nuestros clientes mediante un equipo profesional comprometido, innovación constante y valores sólidos que nos distinguen como líderes en el sector.',
      icon: <Target size={36} style={{ color: '#3CB4FF' }} />,
      accent: '#3CB4FF',
    },
    {
      title: 'Visión',
      content: 'Ser líderes indiscutibles en el sector de servicios generales en Perú y Latinoamérica, reconocidos por la excelencia operativa, confiabilidad absoluta y compromiso genuino con el desarrollo sostenible de nuestros clientes y la comunidad.',
      icon: <Eye size={36} style={{ color: '#D21414' }} />,
      accent: '#D21414',
    },
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
    <section id="mission" className="py-24 bg-[#050B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest text-[#3CB4FF] mb-6">
            NUESTRO PROPÓSITO
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Misión y Visión</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] mx-auto" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Conoce los pilares que guían nuestro trabajo diario y nos impulsan a ser cada vez mejores.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative rounded-[32px] p-8 bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group hover:border-[#3CB4FF]/30 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#3CB4FF] to-[#D21414]" />
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px]" style={{ background: `${item.accent}15` }} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-white/10 bg-white/10">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            <span className="bg-gradient-to-r from-[#3CB4FF] to-[#D21414] bg-clip-text text-transparent">
              Nuestros Valores
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={value.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-5 border border-white/10 bg-white/5 hover:border-[#3CB4FF]/30 hover:bg-white/10 transition-all duration-300 text-center group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/10 bg-white/10" style={{ color: index % 2 === 0 ? '#3CB4FF' : '#D21414' }}>
                  {value.icon}
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">{value.name}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}