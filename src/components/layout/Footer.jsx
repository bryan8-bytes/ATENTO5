import { motion } from 'framer-motion'
import logoA5 from '../../logo_a5.png'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-900 py-12 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoA5} alt="ATENTO5" className="h-10 sm:h-12 w-auto object-contain hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-gray-400 mb-4">
              Servicios Generales E.I.R.L. - Soluciones integrales con excelencia 
              y compromiso para tu empresa.
            </p>
            <p className="text-gray-500 text-sm">
              © {currentYear} ATENTO5. Todos los derechos reservados.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-gray-400 hover:text-faguade-light-blue transition-colors">Inicio</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-faguade-light-blue transition-colors">Nosotros</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-faguade-light-blue transition-colors">Servicios</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-faguade-light-blue transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Mantenimiento General</li>
              <li>Logística</li>
              <li>Consultoría</li>
              <li>Servicios Industriales</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
