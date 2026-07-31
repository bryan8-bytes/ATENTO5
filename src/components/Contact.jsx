import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Star, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, success: null, message: '' });
  const [focusedField, setFocusedField] = useState(null);

  const handleWhatsApp = () => { window.open('https://wa.me/51955295390', '_blank'); };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ submitting: false, success: false, message: 'Por favor, completa todos los campos requeridos.' });
      return;
    }
    setStatus({ submitting: true, success: null, message: '' });
    try {
      const response = await fetch('/send_contact.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus({ submitting: false, success: true, message: '¡Mensaje enviado con éxito! Nos pondremos en contacto a la brevedad.' });
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => { setStatus(prev => prev.success ? { submitting: false, success: null, message: '' } : prev); }, 5000);
      } else {
        setStatus({ submitting: false, success: false, message: data.message || 'Hubo un error al enviar. Por favor, contáctanos por WhatsApp.' });
      }
    } catch (error) {
      console.warn('PHP no disponible, usando fallback mailto:', error);
      const subject = encodeURIComponent(`Consulta Web - ${formData.name}`);
      const body = encodeURIComponent(`Nombre: ${formData.name}\nCorreo: ${formData.email}\nTeléfono: ${formData.phone || 'No especificado'}\n\nMensaje:\n${formData.message}`);
      window.location.href = `mailto:Juan.ampuero@atento5.com?subject=${subject}&body=${body}`;
      setStatus({ submitting: false, success: true, message: 'Se abrió tu cliente de correo con el mensaje listo para enviar.' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  const contactInfo = [{
    title: 'Teléfono Principal', value: '+51 955 295 390', icon: <Phone size={20} />, description: 'ATENCIÓN 24/7'
  }, {
    title: 'Teléfono Secundario', value: '+51 928 006 765', icon: <Phone size={20} />, description: 'Línea alternativa'
  }, {
    title: 'Correo', value: 'Juan.ampuero@atento5.com', icon: <Mail size={20} />, description: 'Respondemos en 24h'
  }, {
    title: 'Ubicación', value: 'Lima, Perú', icon: <MapPin size={20} />, description: 'Cobertura nacional'
  }, {
    title: 'Horario', value: 'Lun - Sáb: 8:00 - 18:00', icon: <Clock size={20} />, description: 'Emergencias 24/7'
  }];

  const testimonials = [{
    name: 'Carlos Mendoza', company: 'Empresa Constructora Mendoza', text: 'Excelente servicio, cumplimiento total en los plazos acordados. Recomendados 100%.', rating: 5
  }, {
    name: 'María Fernández', company: 'Inmobiliaria Premium', text: 'Profesionalismo excepcional. El equipo de ATENTO5 transformó nuestras oficinas.', rating: 5
  }, {
    name: 'Roberto Díaz', company: 'Corporación Díaz S.A.C.', text: 'Desde que los contratamos, no hemos tenido problemas de mantenimiento. Excelentes.', rating: 5
  }];

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
  });

  const labelStyle = {
    fontSize: '11px', fontWeight: '600', color: 'rgba(229, 231, 235, 0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'block'
  };

  return <section id="contacto" style={{ padding: '140px 0', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(60, 180, 255, 0.03) 0%, transparent 60%)' }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div style={{ textAlign: 'center', marginBottom: '80px' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 24px', borderRadius: '30px', fontSize: '12px', fontWeight: 600, background: 'linear-gradient(135deg, rgba(60, 180, 255, 0.15), rgba(210, 20, 20, 0.15))', color: '#3CB4FF', border: '1px solid rgba(60, 180, 255, 0.3)', marginBottom: '20px', letterSpacing: '0.1em' }}>HABLEMOS</div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '20px' }}>
            <span style={{ background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Contáctenos</span>
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(229, 231, 235, 0.5)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>Estamos listos para ayudarte. Contáctanos por cualquiera de nuestros canales y obtén una respuesta rápida.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', marginBottom: '80px' }}>
          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            {contactInfo.map((info, index) => <motion.div key={index} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }} viewport={{ once: true }} whileHover={{ transition: { duration: 0.1, delay: 0 }, scale: 1.03, background: 'linear-gradient(135deg, rgba(60, 180, 255,0.05) 0%, rgba(210, 20, 20,0.05) 100%)', borderColor: 'rgba(255, 255, 255, 0.1)', boxShadow: '-5px 0px 20px rgba(60, 180, 255, 0.15), 5px 0px 20px rgba(210, 20, 20, 0.15)' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: index % 2 === 0 ? 'linear-gradient(135deg, rgba(60, 180, 255, 0.2), rgba(60, 180, 255, 0.05))' : 'linear-gradient(135deg, rgba(210, 20, 20, 0.2), rgba(210, 20, 20, 0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: index % 2 === 0 ? '#3CB4FF' : '#D21414' }}>{info.icon}</div>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(229, 231, 235, 0.4)', marginBottom: '2px' }}>{info.title}</p>
                  <p style={{ fontSize: '16px', color: 'white', fontWeight: 600, marginBottom: '2px' }}>{info.value}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(60, 180, 255, 0.6)' }}>{info.description}</p>
                </div>
              </motion.div>)}

            <motion.button onClick={handleWhatsApp} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px 32px', borderRadius: '14px', fontWeight: 700, fontSize: '15px',
              background: 'linear-gradient(135deg, #3CB4FF, #D21414)', color: 'white', border: 'none', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 25px rgba(60, 180, 255, 0.3)'
            }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }} viewport={{ once: true }} whileHover={{ transition: { duration: 0.1, delay: 0 }, scale: 1.03, boxShadow: '-10px 0px 30px rgba(60, 180, 255, 0.4), 10px 0px 30px rgba(210, 20, 20, 0.4)' }} whileTap={{ scale: 0.98 }}>
              <MessageCircle size={20} /> Escribir por WhatsApp
            </motion.button>
          </motion.div>

          <motion.div style={{
            background: 'rgba(10, 25, 47, 0.25)', border: '1px solid rgba(60, 180, 255, 0.12)', borderRadius: '24px', padding: '40px 30px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)',
            display: 'flex', flexDirection: 'column', gap: '24px'
          }} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div style={{ textAlign: 'left', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', margin: '0 0 6px 0' }}>Envíanos un Mensaje</h3>
              <p style={{ fontSize: '13px', color: 'rgba(229, 231, 235, 0.5)', margin: 0 }}>Déjanos tus datos y nos pondremos en contacto contigo lo antes posible.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>Nombre Completo <span style={{ color: '#D21414' }}>*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} placeholder="Nombre Completo" required style={inputStyle('name')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>Correo Electrónico <span style={{ color: '#D21414' }}>*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder="Correo Electrónico" required style={inputStyle('email')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>Teléfono / WhatsApp</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} placeholder="Teléfono / WhatsApp" style={inputStyle('phone')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>Mensaje <span style={{ color: '#D21414' }}>*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)} placeholder="Mensaje" required rows={4} style={{ ...inputStyle('message'), minHeight: '110px', resize: 'none' }} />
              </div>

              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.4',
                    background: status.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${status.success ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                    color: status.success ? '#4ade80' : '#f87171', marginTop: '6px'
                  }}>
                    {status.success ? <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#4ade80' }} /> : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#f87171' }} />}
                    <span>{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={status.submitting} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
                background: 'linear-gradient(135deg, #3CB4FF, #D21414)', color: 'white', border: 'none', cursor: status.submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(60, 180, 255, 0.25)', marginTop: '10px', opacity: status.submitting ? 0.75 : 1, transition: 'box-shadow 0.3s ease'
              }} whileHover={status.submitting ? {} : { scale: 1.02, boxShadow: '-10px 0px 25px rgba(60, 180, 255, 0.35), 10px 0px 25px rgba(210, 20, 20, 0.35)' }} whileTap={status.submitting ? {} : { scale: 0.98 }}>
                {status.submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Enviando Mensaje...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Enviar Mensaje</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} style={{ marginTop: '80px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '35px', textAlign: 'center' }}>
            <span style={{ background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Opiniones de Nuestros Clientes</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {testimonials.map((testimonial, index) => <motion.div key={index} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '28px' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0, transition: { delay: index * 0.15, duration: 0.5 } }} viewport={{ once: true }} whileHover={{ transition: { duration: 0.15, delay: 0 }, scale: 1.02, background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={16} fill={index % 2 === 0 ? '#3CB4FF' : '#D21414'} color={index % 2 === 0 ? '#3CB4FF' : '#D21414'} />)}
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(229, 231, 235, 0.7)', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>"{testimonial.text}"</p>
                <div>
                  <p style={{ fontSize: '15px', color: 'white', fontWeight: 600, margin: '0 0 2px 0' }}>{testimonial.name}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(229, 231, 235, 0.4)', margin: 0 }}>{testimonial.company}</p>
                </div>
              </motion.div>)}
          </div>
        </motion.div>
      </div>
    </section>;
};
export default Contact;