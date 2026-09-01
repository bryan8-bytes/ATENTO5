import { motion as Motion } from 'framer-motion'
import { Wrench, Truck, Briefcase, Settings, Package, ClipboardCheck, Paintbrush, Construction, Sparkles, Zap, Trees, Lock, Lightbulb, Square, Droplets, Flame, Shield } from 'lucide-react'
import Section from '../ui/Section'
import Card from '../ui/Card'

const services = [
  { icon: Wrench, title: 'Mantenimiento General', description: 'Servicios de mantenimiento preventivo y correctivo para instalaciones y equipos.', accent: '#3CB4FF' },
  { icon: Paintbrush, title: 'Pintura y Acabados', description: 'Trabajos profesionales de pintura interior y exterior con acabados de excelencia.', accent: '#D21414' },
  { icon: Construction, title: 'Construcción', description: 'Proyectos de construcción, remodelaciones y ampliaciones de todo tipo.', accent: '#3CB4FF' },
  { icon: Truck, title: 'Transporte y Logística', description: 'Servicios de transporte de materiales, equipos y mobiliario.', accent: '#D21414' },
  { icon: Settings, title: 'Obras Civiles', description: 'Ejecución de obras civiles y proyectos de infraestructura de gran escala.', accent: '#3CB4FF' },
  { icon: Briefcase, title: 'Gestión de Proyectos', description: 'Administración, supervisión y gestión integral de proyectos de construcción.', accent: '#D21414' },
  { icon: Sparkles, title: 'Limpieza Industrial', description: 'Servicios especializados de limpieza para todo tipo de instalaciones.', accent: '#3CB4FF' },
  { icon: Zap, title: 'Instalaciones Eléctricas', description: 'Diseño e instalación de sistemas eléctricos residenciales e industriales.', accent: '#D21414' },
  { icon: Trees, title: 'Carpintería y Muebles', description: 'Fabricación y reparación de mobiliario de madera a medida.', accent: '#3CB4FF' },
  { icon: Trees, title: 'Servicios de Jardinería', description: 'Diseño, instalación y mantenimiento de áreas verdes.', accent: '#D21414' },
  { icon: Lock, title: 'Servicios de Seguridad', description: 'Instalación y mantenimiento de sistemas de seguridad.', accent: '#3CB4FF' },
  { icon: Lightbulb, title: 'Consultoría Técnica', description: 'Asesoría profesional en proyectos de construcción y servicios generales.', accent: '#D21414' },
  { icon: Square, title: 'Vidriería y Aluminio', description: 'Fabricación e instalación de ventanas, fachadas y estructuras de aluminio y vidrio.', accent: '#3CB4FF' },
  { icon: Droplets, title: 'Gasfitería', description: 'Instalación y reparación de redes de agua, desagüe y sistemas sanitarios.', accent: '#D21414' },
  { icon: Flame, title: 'Herrería', description: 'Fabricación y soldadura de estructuras metálicas, rejas, puertas y portones.', accent: '#3CB4FF' },
  { icon: Shield, title: 'Impermeabilización', description: 'Tratamiento y recubrimiento de superficies para protección contra filtraciones.', accent: '#D21414' },
]

export default function Services() {
  return (
    <Section id="services" background="bg-[#0A1929]" spacing="lg">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-16 md:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest text-[#3CB4FF] mb-6">
          ¿QUÉ HACEMOS?
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Nuestros Servicios</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] mx-auto rounded-full" />
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Soluciones integrales y especializadas para cada necesidad de tu empresa o proyecto. 
          Contamos con expertos en cada área para garantizar resultados excepcionales.
        </p>
      </Motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service, index) => (
          <Motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: '-40px' }}
          >
            <Card hover padding="md">
              <div className="card-icon-wrap" style={{ color: service.accent }}>
                <service.icon className="w-7 h-7" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-body">{service.description}</p>
                </div>
              </div>
              <div className="card-badge" style={{ color: service.accent, borderColor: `${service.accent}40` }}>
                {index + 1}
              </div>
            </Card>
          </Motion.div>
        ))}
      </div>
    </Section>
  )
}
