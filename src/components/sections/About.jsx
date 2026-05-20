import { motion } from 'framer-motion'
import { Users, Award, TrendingUp } from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: Users,
      title: 'Equipo Profesional',
      description: 'Contamos con personal altamente capacitado y comprometido con la excelencia.',
    },
    {
      icon: Award,
      title: 'Calidad Garantizada',
      description: 'Standards de calidad en cada uno de nuestros servicios.',
    },
    {
      icon: TrendingUp,
      title: 'Resultados Medibles',
      description: 'Enfoque en resultados que impulsar el crecimiento de tu empresa.',
    },
  ]

  return (
    <section id="about" className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Sobre Nosotros</h2>
          <div className="w-24 h-1 bg-faguade-yellow mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-faguade-light-blue mb-6">
              ATENTO5 Servicios Generales E.I.R.L.
            </h3>
            <p className="text-gray-400 mb-6">
              Somos una empresa dedicada a ofrecer soluciones integrales para empresas de 
              diversos sectores. Notre compromiso es proporcionar servicios de excelencia 
              que contribuyan al crecimiento y éxito de nuestros clientes.
            </p>
            <p className="text-gray-400">
              Con años de experiencia en el mercado, hemos construido una reputación solida 
              basada en la calidad, profesionalismo y compromiso con cada proyecto.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-dark-800 p-6 rounded-lg text-center"
              >
                <feature.icon className="w-12 h-12 text-faguade-yellow mx-auto mb-4" />
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
