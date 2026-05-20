import { motion } from 'framer-motion'
import { Eye, Target } from 'lucide-react'

export default function MissionVision() {
  return (
    <section id="mission" className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Misión y Visión</h2>
          <div className="w-24 h-1 bg-faguade-yellow mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-dark-800 p-8 rounded-xl"
          >
            <Target className="w-12 h-12 text-faguade-light-blue mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-4">Misión</h3>
            <p className="text-gray-400">
              Proporcionar servicios generales de alta calidad que superen las expectativas 
              de nuestros clientes, contribuyendo al desarrollo sostenible de sus empresas 
              mediante soluciones integrales, eficientes y personalizadas.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-dark-800 p-8 rounded-xl"
          >
            <Eye className="w-12 h-12 text-faguade-yellow mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-4">Visión</h3>
            <p className="text-gray-400">
              Ser la empresa líder en servicios generales en el mercado nacional, 
              reconocida por nuestra excelencia operativa, innovación constante y 
              compromiso inquebrantable con la satisfacción del cliente.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
