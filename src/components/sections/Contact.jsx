import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Loader2, CheckCircle, AlertCircle, Star } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    message: ''
  })

  const [focusedField, setFocusedField] = useState(null)

  const handleWhatsApp = () => {
    window.open('https://wa.me/51955295390', '_blank')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        submitting: false,
        success: false,
        message: 'Por favor, completa todos los campos requeridos.'
      })
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
        setStatus({
          submitting: false,
          success: true,
          message: '¡Mensaje enviado con éxito! Nos pondremos en contacto a la brevedad.'
        })
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => {
          setStatus(prev => prev.success ? { submitting: false, success: null, message: '' } : prev)
        }, 5000)
      } else {
        setStatus({
          submitting: false,
          success: false,
          message: data.message || 'Hubo un error al enviar. Por favor, contáctanos por WhatsApp.'
        })
      }
    } catch (error) {
      console.warn('PHP no disponible, usando fallback mailto:', error)
      const subject = encodeURIComponent(`Consulta Web - ${formData.name}`)
      const body = encodeURIComponent(
        `Nombre: ${formData.name}\nCorreo: ${formData.email}\nTeléfono: ${formData.phone || 'No especificado'}\n\nMensaje:\n${formData.message}`
      )
      window.location.href = `mailto:Juan.ampuero@atento5.com?subject=${subject}&body=${body}`
      setStatus({
        submitting: false,
        success: true,
        message: 'Se abrió tu cliente de correo con el mensaje listo para enviar.'
      })
      setFormData({ name: '', email: '', phone: '', message: '' })
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono Principal',
      detail: '+51 955 295 390',
      sub: 'ATENCIÓN 24/7',
      accent: '#3CB4FF',
    },
    {
      icon: Phone,
      title: 'Teléfono Secundario',
      detail: '+51 928 006 765',
      sub: 'Línea alternativa',
      accent: '#D21414',
    },
    {
      icon: Mail,
      title: 'Correo',
      detail: 'Juan.ampuero@atento5.com',
      sub: 'Respondemos en 24h',
      accent: '#3CB4FF',
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      detail: 'Lima, Perú',
      sub: 'Cobertura nacional',
      accent: '#D21414',
    },
    {
      icon: Clock,
      title: 'Horario',
      detail: 'Lun - Sáb: 8:00 - 18:00',
      sub: 'Emergencias 24/7',
      accent: '#3CB4FF',
    },
  ]

  const testimonials = [
    {
      name: 'Carlos Mendoza',
      company: 'Empresa Constructora Mendoza',
      text: 'Excelente servicio, cumplimiento total en los plazos acordados. Recomendados 100%.',
      rating: 5,
    },
    {
      name: 'María Fernández',
      company: 'Inmobiliaria Premium',
      text: 'Profesionalismo excepcional. El equipo de ATENTO5 transformó nuestras oficinas.',
      rating: 5,
    },
    {
      name: 'Roberto Díaz',
      company: 'Corporación Díaz S.A.C.',
      text: 'Desde que los contratamos, no hemos tenido problemas de mantenimiento. Excelentes.',
      rating: 5,
    },
  ]

  const inputStyle = (fieldName) => ({
    width: '100%',
    background: 'linear-gradient(135deg, #060b13 0%, #0a111e 100%)',
    border: `1px solid ${focusedField === fieldName ? '#3CB4FF' : 'rgba(255, 255, 255, 0.08)'}`,
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    boxShadow: focusedField === fieldName ? '0 0 15px rgba(60, 180, 255, 0.25)' : 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit'
  })

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(229, 231, 235, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '6px',
    display: 'block'
  }

  return (
    <section id="contact" className="py-24 bg-[#050B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest text-[#3CB4FF] mb-6">
            HABLEMOS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Contáctenos</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] mx-auto" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Estamos listos para ayudarte. Contáctanos por cualquiera de nuestros canales y obtén una respuesta rápida.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-[#3CB4FF]/20 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-white/10" style={{ color: info.accent }}>
                  <info.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{info.title}</p>
                  <p className="text-white font-semibold text-sm">{info.detail}</p>
                  <p className="text-xs text-[#3CB4FF]/60">{info.sub}</p>
                </div>
              </motion.div>
            ))}

            <motion.button
              onClick={handleWhatsApp}
              className="w-full mt-4 inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_10px_30px_rgba(37,211,102,0.25)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="w-5 h-5" />
              Escribir por WhatsApp
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 border border-[#3CB4FF]/10 bg-white/[0.02] backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            <div className="text-left mb-6">
              <h3 className="text-xl font-bold text-white mb-1">Envíanos un Mensaje</h3>
              <p className="text-sm text-gray-400">Déjanos tus datos y nos pondremos en contacto contigo lo antes posible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label style={labelStyle}>Nombre Completo <span style={{ color: '#D21414' }}>*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} placeholder="Nombre Completo" required style={inputStyle('name')} />
              </div>
              <div>
                <label style={labelStyle}>Correo Electrónico <span style={{ color: '#D21414' }}>*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder="Correo Electrónico" required style={inputStyle('email')} />
              </div>
              <div>
                <label style={labelStyle}>Teléfono / WhatsApp</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} placeholder="Teléfono / WhatsApp" style={inputStyle('phone')} />
              </div>
              <div>
                <label style={labelStyle}>Mensaje <span style={{ color: '#D21414' }}>*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)} placeholder="Mensaje" required rows={4} style={{ ...inputStyle('message'), minHeight: '110px', resize: 'none' }} />
              </div>

              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3 p-4 rounded-xl text-sm leading-relaxed"
                    style={{
                      background: status.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${status.success ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                      color: status.success ? '#4ade80' : '#f87171',
                    }}
                  >
                    {status.success ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                    <span>{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={status.submitting}
                className="w-full py-4 bg-gradient-to-r from-[#3CB4FF] to-[#D21414] text-white font-bold rounded-xl hover:brightness-110 transition-all duration-300 shadow-[0_4px_20px_rgba(60,180,255,0.25)] flex items-center justify-center gap-3 disabled:opacity-75"
                whileHover={status.submitting ? {} : { scale: 1.02, boxShadow: '-10px 0px 25px rgba(60,180,255,0.35), 10px 0px 25px rgba(210,20,20,0.35)' }}
                whileTap={status.submitting ? {} : { scale: 0.98 }}
              >
                {status.submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enviando Mensaje...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar Mensaje</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            <span className="bg-gradient-to-r from-[#3CB4FF] to-[#D21414] bg-clip-text text-transparent">
              Opiniones de Nuestros Clientes
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="rounded-2xl p-7 border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
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
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}