import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Loader2, CheckCircle, AlertCircle, Star } from 'lucide-react'
import Button from '../ui/Button'
import Section from '../ui/Section'
import Card from '../ui/Card'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState({ submitting: false, success: null, message: '' })

  const handleWhatsApp = () => {
    window.open('https://wa.me/51955295390', '_blank')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ submitting: false, success: false, message: 'Por favor, completa todos los campos requeridos.' })
      return
    }

    setStatus({ submitting: true, success: null, message: '' })

    try {
      const response = await fetch('/send_contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus({ submitting: false, success: true, message: '¡Mensaje enviado con éxito! Nos pondremos en contacto a la brevedad.' })
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setStatus(prev => prev.success ? { submitting: false, success: null, message: '' } : prev), 5000)
      } else {
        setStatus({ submitting: false, success: false, message: data.message || 'Hubo un error al enviar. Por favor, contáctanos por WhatsApp.' })
      }
    } catch (error) {
      console.warn('PHP no disponible, usando fallback mailto:', error)
      const subject = encodeURIComponent(`Consulta Web - ${formData.name}`)
      const body = encodeURIComponent(`Nombre: ${formData.name}\nCorreo: ${formData.email}\nTeléfono: ${formData.phone || 'No especificado'}\n\nMensaje:\n${formData.message}`)
      window.location.href = `mailto:Juan.ampuero@atento5.com?subject=${subject}&body=${body}`
      setStatus({ submitting: false, success: true, message: 'Se abrió tu cliente de correo con el mensaje listo para enviar.' })
      setFormData({ name: '', email: '', phone: '', message: '' })
    }
  }

  const contactInfo = [
    { icon: Phone, title: 'Teléfono Principal', detail: '+51 955 295 390', sub: 'ATENCIÓN 24/7', accent: '#3CB4FF' },
    { icon: Phone, title: 'Teléfono Secundario', detail: '+51 928 006 765', sub: 'Línea alternativa', accent: '#D21414' },
    { icon: Mail, title: 'Correo', detail: 'Juan.ampuero@atento5.com', sub: 'Respondemos en 24h', accent: '#3CB4FF' },
    { icon: MapPin, title: 'Ubicación', detail: 'Lima, Perú', sub: 'Cobertura nacional', accent: '#D21414' },
    { icon: Clock, title: 'Horario', detail: 'Lun - Sáb: 8:00 - 18:00', sub: 'Emergencias 24/7', accent: '#3CB4FF' },
  ]

  const testimonials = [
    { name: 'Carlos Mendoza', company: 'Empresa Constructora Mendoza', text: 'Excelente servicio, cumplimiento total en los plazos acordados. Recomendados 100%.', rating: 5 },
    { name: 'María Fernández', company: 'Inmobiliaria Premium', text: 'Profesionalismo excepcional. El equipo de ATENTO5 transformó nuestras oficinas.', rating: 5 },
    { name: 'Roberto Díaz', company: 'Corporación Díaz S.A.C.', text: 'Desde que los contratamos, no hemos tenido problemas de mantenimiento. Excelentes.', rating: 5 },
  ]

  return (
    <Section id="contact" spacing="lg">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-16 md:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest text-[#3CB4FF] mb-6">
          HABLEMOS
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Contáctenos</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] mx-auto rounded-full" />
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Estamos listos para ayudarte. Contáctanos por cualquiera de nuestros canales y obtén una respuesta rápida.
        </p>
      </Motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-4"
        >
          {contactInfo.map((info, index) => (
            <Card key={info.title} padding="md" hover={false} className="flex items-center gap-4">
              <div className="contact-info-icon" style={{ color: info.accent }}>
                <info.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="contact-info-title">{info.title}</p>
                <p className="contact-info-detail">{info.detail}</p>
                <p className="contact-info-sub">{info.sub}</p>
              </div>
            </Card>
          ))}

          <Button
            variant="gradient"
            size="lg"
            block
            icon={<MessageCircle className="w-5 h-5" />}
            motionProps={{ whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } }}
            onClick={handleWhatsApp}
            className="mt-4"
          >
            Escribir por WhatsApp
          </Button>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <Card padding="lg" hover={false}>
            <div className="text-left mb-6">
              <h3 className="text-xl font-bold text-white mb-1">Envíanos un Mensaje</h3>
              <p className="text-sm text-gray-400">Déjanos tus datos y nos pondremos en contacto contigo lo antes posible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="contact-label">Nombre Completo <span className="contact-label-required">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre Completo" required className="contact-input" />
              </div>
              <div>
                <label className="contact-label">Correo Electrónico <span className="contact-label-required">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Correo Electrónico" required className="contact-input" />
              </div>
              <div>
                <label className="contact-label">Teléfono / WhatsApp</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono / WhatsApp" className="contact-input" />
              </div>
              <div>
                <label className="contact-label">Mensaje <span className="contact-label-required">*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Mensaje" required rows={4} className="contact-input" style={{ minHeight: '110px', resize: 'none' }} />
              </div>

              <AnimatePresence mode="wait">
                {status.message && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`contact-status ${status.success ? 'contact-status-success' : 'contact-status-error'}`}
                  >
                    {status.success ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                    <span>{status.message}</span>
                  </Motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={status.submitting}
                loading={status.submitting}
                variant="gradient"
                size="lg"
                className="w-full"
                motionProps={{ whileHover: status.submitting ? {} : { scale: 1.02 }, whileTap: status.submitting ? {} : { scale: 0.98 } }}
              >
                {status.submitting ? 'Enviando Mensaje...' : 'Enviar Mensaje'}
              </Button>
            </form>
          </Card>
        </Motion.div>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-16"
      >
        <h3 className="text-2xl font-bold text-white text-center mb-10">
          <span className="bg-gradient-to-r from-[#3CB4FF] to-[#D21414] bg-clip-text text-transparent">
            Opiniones de Nuestros Clientes
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: '-40px' }}
              className="contact-testimonial"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill={index % 2 === 0 ? '#3CB4FF' : '#D21414'} color={index % 2 === 0 ? '#3CB4FF' : '#D21414'} />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">"{testimonial.text}"</p>
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">{testimonial.name}</p>
                <p className="text-gray-500 text-xs">{testimonial.company}</p>
              </div>
            </Motion.div>
          ))}
        </div>
      </Motion.div>
    </Section>
  )
}
