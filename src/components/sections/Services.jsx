import { motion } from 'framer-motion'
import { Wrench, Truck, Briefcase, Settings, Package, ClipboardCheck, Paintbrush, Construction, Sparkles, Zap, Trees, Lock, Lightbulb, Square, Droplets, Flame, Shield } from 'lucide-react'

const services = [
  {
    icon: Wrench,
    title: 'Mantenimiento General',
    description: 'Servicios de mantenimiento preventivo y correctivo para instalaciones y equipos.',
    accent: '#3CB4FF',
  },
  {
    icon: Paintbrush,
    title: 'Pintura y Acabados',
    description: 'Trabajos profesionales de pintura interior y exterior con acabados de excelencia.',
    accent: '#D21414',
  },
  {
    icon: Construction,
    title: 'Construcción',
    description: 'Proyectos de construcción, remodelaciones y ampliaciones de todo tipo.',
    accent: '#3CB4FF',
  },
  {
    icon: Truck,
    title: 'Transporte y Logística',
    description: 'Servicios de transporte de materiales, equipos y mobiliario.',
    accent: '#D21414',
  },
  {
    icon: Settings,
    title: 'Obras Civiles',
    description: 'Ejecución de obras civiles y proyectos de infraestructura de gran escala.',
    accent: '#3CB4FF',
  },
  {
    icon: Briefcase,
    title: 'Gestión de Proyectos',
    description: 'Administración, supervisión y gestión integral de proyectos de construcción.',
    accent: '#D21414',
  },
  {
    icon: Sparkles,
    title: 'Limpieza Industrial',
    description: 'Servicios especializados de limpieza para todo tipo de instalaciones.',
    accent: '#3CB4FF',
  },
  {
    icon: Zap,
    title: 'Instalaciones Eléctricas',
    description: 'Diseño e instalación de sistemas eléctricos residenciales e industriales.',
    accent: '#D21414',
  },
  {
    icon: Trees,
    title: 'Carpintería y Muebles',
    description: 'Fabricación y reparación de mobiliario de madera a medida.',
    accent: '#3CB4FF',
  },
  {
    icon: Trees,
    title: 'Servicios de Jardinería',
    description: 'Diseño, instalación y mantenimiento de áreas verdes.',
    accent: '#D21414',
  },
  {
    icon: Lock,
    title: 'Servicios de Seguridad',
    description: 'Instalación y mantenimiento de sistemas de seguridad.',
    accent: '#3CB4FF',
  },
  {
    icon: Lightbulb,
    title: 'Consultoría Técnica',
    description: 'Asesoría profesional en proyectos de construcción y servicios generales.',
    accent: '#D21414',
  },
  {
    icon: Square,
    title: 'Vidriería y Aluminio',
    description: 'Fabricación e instalación de ventanas, fachadas y estructuras de aluminio y vidrio.',
    accent: '#3CB4FF',
  },
  {
    icon: Droplets,
    title: 'Gasfitería',
    description: 'Instalación y reparación de redes de agua, desagüe y sistemas sanitarios.',
    accent: '#D21414',
  },
  {
    icon: Flame,
    title: 'Herrería',
    description: 'Fabricación y soldadura de estructuras metálicas, rejas, puertas y portones.',
    accent: '#3CB4FF',
  },
  {
    icon: Shield,
    title: 'Impermeabilización',
    description: 'Tratamiento y recubrimiento de superficies para protección contra filtraciones.',
    accent: '#D21414',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#0A1929]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest text-[#3CB4FF] mb-6">
            ¿QUÉ HACEMOS?
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Nuestros Servicios</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] mx-auto" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Soluciones integrales y especializadas para cada necesidad de tu empresa o proyecto. 
            Contamos con expertos en cada área para garantizar resultados excepcionales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl p-6 bg-white/5 border border-white/10 hover:border-[#3CB4FF]/30 hover:bg-white/10 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#3CB4FF] to-[#D21414] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 bg-white/10" style={{ color: service.accent }}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#3CB4FF] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}