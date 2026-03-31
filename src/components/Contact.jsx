import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Star } from 'lucide-react';
const Contact = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/51955295390', '_blank');
  };
  const contactInfo = [{
    title: 'Teléfono Principal',
    value: '+51 955 295 390',
    icon: <Phone size={20} />,
    description: 'ATENCIÓN 24/7'
  }, {
    title: 'Teléfono Secundario',
    value: '+51 928 006 765',
    icon: <Phone size={20} />,
    description: 'Línea alternativa'
  }, {
    title: 'Correo',
    value: 'contacto@atento5.com',
    icon: <Mail size={20} />,
    description: 'Respondemos en 24h'
  }, {
    title: 'Ubicación',
    value: 'Lima, Perú',
    icon: <MapPin size={20} />,
    description: 'Cobertura nacional'
  }, {
    title: 'Horario',
    value: 'Lun - Sáb: 8:00 - 18:00',
    icon: <Clock size={20} />,
    description: 'Emergencias 24/7'
  }];
  const testimonials = [{
    name: 'Carlos Mendoza',
    company: 'Empresa Constructora Mendoza',
    text: 'Excelente servicio, cumplimiento total en los plazos acordados. Recomendados 100%.',
    rating: 5
  }, {
    name: 'María Fernández',
    company: 'Inmobiliaria Premium',
    text: 'Professionalismo excepcional. El equipo de ATENTO5 transformó nuestras oficinas.',
    rating: 5
  }, {
    name: 'Roberto Díaz',
    company: 'Corporación Díaz S.A.C.',
    text: 'Desde que los contrató, no hemos tenido problemas de mantenimiento. Excelentes.',
    rating: 5
  }];
  return <section id="contacto" style={{
    padding: '120px 0',
    position: 'relative'
  }}>
      <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px'
    }}>
        {/* Section Header */}
        <motion.div style={{
        textAlign: 'center',
        marginBottom: '70px'
      }} initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
          <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '10px 24px',
          borderRadius: '30px',
          fontSize: '12px',
          fontWeight: 600,
          background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.15), rgba(255, 153, 0, 0.15))',
          color: '#00C3FF',
          border: '1px solid rgba(0, 195, 255, 0.3)',
          marginBottom: '20px',
          letterSpacing: '0.1em'
        }}>
            HABLEMOS
          </div>
          <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          marginBottom: '20px'
        }}>
            <span style={{
            background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
              Contáctenos
            </span>
          </h2>
          <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'rgba(229, 231, 235, 0.5)',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.7
        }}>
            Estamos listos para ayudarte. Contáctanos por cualquiera de nuestros canales y obtén una respuesta rápida.
          </p>
        </motion.div>

        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '40px',
        marginBottom: '80px'
      }}>
          {/* Contact Cards */}
          <motion.div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }} initial={{
          opacity: 0,
          x: -30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            {contactInfo.map((info, index) => <motion.div key={index} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              delay: index * 0.1
            }
          }} viewport={{
            once: true
          }} whileHover={{ transition: {
              duration: 0.1,
              delay: 0
            },
            scale: 1.05,
            background: 'linear-gradient(135deg, rgba(0,195,255,0.05) 0%, rgba(255,153,0,0.05) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '-5px 0px 20px rgba(0, 195, 255, 0.3), 5px 0px 20px rgba(255, 153, 0, 0.3)'
          }}>
                <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: index % 2 === 0 ? 'linear-gradient(135deg, rgba(0, 195, 255, 0.2), rgba(0, 195, 255, 0.05))' : 'linear-gradient(135deg, rgba(255, 153, 0, 0.2), rgba(255, 153, 0, 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: index % 2 === 0 ? '#00C3FF' : '#FF9900'
            }}>
                  {info.icon}
                </div>
                <div>
                  <p style={{
                fontSize: '12px',
                color: 'rgba(229, 231, 235, 0.4)',
                marginBottom: '2px'
              }}>
                    {info.title}
                  </p>
                  <p style={{
                fontSize: '16px',
                color: 'white',
                fontWeight: 600,
                marginBottom: '2px'
              }}>
                    {info.value}
                  </p>
                  <p style={{
                fontSize: '11px',
                color: 'rgba(0, 195, 255, 0.6)'
              }}>
                    {info.description}
                  </p>
                </div>
              </motion.div>)}

            {/* WhatsApp Button */}
            <motion.button onClick={handleWhatsApp} style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '20px 32px',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '15px',
            background: 'linear-gradient(135deg, #00C3FF, #FF9900)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginTop: '8px',
            boxShadow: '0 4px 25px rgba(0, 195, 255, 0.3)'
          }} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              delay: 0.4
            }
          }} viewport={{
            once: true
          }} whileHover={{ transition: {
              duration: 0.1,
              delay: 0
            },
            scale: 1.05,
            boxShadow: '-10px 0px 30px rgba(0, 195, 255, 0.4), 10px 0px 30px rgba(255, 153, 0, 0.4)'
          }} whileTap={{
            scale: 0.98
          }}>
              <MessageCircle size={20} />
              Escribir por WhatsApp
            </motion.button>
          </motion.div>

          {/* Testimonials */}
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            <h3 style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '28px',
            textAlign: 'center'
          }}>
              <span style={{
              background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
                Lo que dicen nuestros clientes
              </span>
            </h3>
            
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
              {testimonials.map((testimonial, index) => <motion.div key={index} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '24px'
            }} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: index * 0.15
              }
            }} viewport={{
              once: true
            }} whileHover={{ transition: {
                duration: 0.1,
                delay: 0
              },
              scale: 1.01,
              background: 'rgba(255, 255, 255, 0.03)'
            }}>
                  <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '12px'
              }}>
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={16} fill={index % 2 === 0 ? "#00C3FF" : "#FF9900"} color={index % 2 === 0 ? "#00C3FF" : "#FF9900"} />)}
                  </div>
                  <p style={{
                fontSize: '14px',
                color: 'rgba(229, 231, 235, 0.7)',
                lineHeight: 1.7,
                marginBottom: '16px',
                fontStyle: 'italic'
              }}>
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p style={{
                  fontSize: '15px',
                  color: 'white',
                  fontWeight: 600
                }}>
                      {testimonial.name}
                    </p>
                    <p style={{
                  fontSize: '12px',
                  color: 'rgba(229, 231, 235, 0.4)'
                }}>
                      {testimonial.company}
                    </p>
                  </div>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default Contact;