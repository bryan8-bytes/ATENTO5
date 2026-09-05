import { motion as Motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Section from './ui/Section'
import Card from './ui/Card'

const Location = () => {
  const address = "Asoc. Villa el Rosario, MZ D, Lote 1, Calle 3, Chaclacayo, Lima, Perú";
  const mapCoordinates = "-11.973216269159373,-76.76746054003218";
  const mapUrl = `https://maps.google.com/maps?q=${mapCoordinates}&hl=es&z=18&output=embed`;

  return (
    <Section id="ubicacion" spacing="lg">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-16 md:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest text-[#3CB4FF] mb-6">
          <MapPin size={14} /> ENCUÉNTRANOS
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-[#3CB4FF] to-[#D21414] bg-clip-text text-transparent">Nuestra Ubicación</span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] mx-auto rounded-full" />
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">{address}</p>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">Visítanos en nuestras oficinas. Estamos ubicados estratégicamente para atenderte.</p>
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Card padding="none" hover={false} className="location-map-card overflow-hidden">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de ATENTO5"
          />
        </Card>
      </Motion.div>
    </Section>
  )
}

export default Location