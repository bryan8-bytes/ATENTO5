import { motion } from 'framer-motion'
import { Wrench, Truck, Briefcase, Settings, Package, ClipboardCheck } from 'lucide-react'

const services = [
  {
    icon: Wrench,
    title: 'Mantenimiento General',
    description: 'Servicios de mantenimiento preventivo y correctivo para instalaciones y equipos.',
  },
  {
    icon: Truck,
    title: 'Logística',
    description: 'Soluciones logísticas integral para transporte y distribución de mercancía.',
  },
  {
    icon: Briefcase,
    title: 'Consultoría',
    description: 'Asesoría profesional para optimizar procesos y mejorar la eficiencia de tu empresa.',
  },
  {
    icon: Settings,
    title: 'Servicios Industriales',
    description: 'Mantenimiento industrial especializado para maquinaria y equipos.',
  },
  {
    icon: Package,
    title: 'Gestión de Activos',
    description: 'Administración y control de activos empresariales.',
  },
  {
    icon: ClipboardCheck,
    title: 'Inspecciones Técnicas',
    description: 'Evaluaciones técnicas y certificaciones de cumplimiento normativo.',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Nuestros Servicios</h2>
          <div className="w-24 h-1 bg-faguade-yellow mx-auto" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios para cubrir las necesidades de tu empresa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-dark-800 p-8 rounded-xl hover:bg-dark-700 transition-colors duration-300 group"
            >
              <service.icon className="w-12 h-12 text-faguade-light-blue mb-4 group-hover:text-faguade-yellow transition-colors" />
              <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
