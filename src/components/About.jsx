import { motion } from 'framer-motion';
import { Users, Award, Handshake, Clock, ScrollText, ShieldCheck, CheckCircle2 } from 'lucide-react';
const About = () => {
  const features = [{
    title: 'Equipo Profesional',
    desc: 'Personal altamente capacitado y comprometido con la excelencia en cada trabajo',
    icon: <Users size={28} />,
    stat: '50+',
    gradient: 'linear-gradient(135deg, rgba(0,195,255,0.2), rgba(0,195,255,0.05))'
  }, {
    title: 'Calidad Garantizada',
    desc: 'Estándares rigurosos de calidad en cada proyecto que ejecutamos',
    icon: <Award size={28} />,
    stat: '100%',
    gradient: 'linear-gradient(135deg, rgba(255,153,0,0.2), rgba(255,153,0,0.05))'
  }, {
    title: 'Compromiso Real',
    desc: 'Dedicación total a cada cliente, superando expectativas',
    icon: <Handshake size={28} />,
    stat: '500+',
    gradient: 'linear-gradient(135deg, rgba(0,195,255,0.2), rgba(255,153,0,0.1))'
  }, {
    title: 'Experiencia Comprobada',
    desc: 'Años de trayectoria exitosa en el sector de servicios generales',
    icon: <Clock size={28} />,
    stat: '10+',
    gradient: 'linear-gradient(135deg, rgba(255,153,0,0.2), rgba(0,195,255,0.1))'
  }];
  const timeline = [{
    year: '2014',
    title: 'Fundación',
    desc: 'Inicio de operaciones como empresa de servicios generales'
  }, {
    year: '2016',
    title: 'Expansión',
    desc: 'Ampliación de servicios a construcción y obras civiles'
  }, {
    year: '2019',
    title: 'Reconocimiento',
    desc: 'Certificación de calidad y primeros premios sectoriales'
  }, {
    year: '2024',
    title: 'Liderazgo',
    desc: 'Posicionamiento como empresa líder en el mercado'
  }];
  return <section id="nosotros" style={{
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
            SOMOS ATENTO5
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
              Sobre Nosotros
            </span>
          </h2>
          <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'rgba(229, 231, 235, 0.5)',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.7
        }}>
            Conoce más sobre ATENTO5 y nuestra trayectoria en el sector de servicios generales. 
            Somos tu socio estratégico para soluciones integrales.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '32px',
        marginBottom: '80px'
      }}>
          {/* Main Card - Historia */}
          <motion.div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '24px',
          padding: '40px',
          backdropFilter: 'blur(10px)'
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
            <h3 style={{
            fontSize: '26px',
            fontWeight: 700,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
              <ScrollText size={24} style={{
              color: '#00C3FF'
            }} />
              <span style={{
              background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
                Nuestra Historia
              </span>
            </h3>
            <div style={{
            color: 'rgba(229, 231, 235, 0.7)',
            lineHeight: 1.9,
            fontSize: '15px'
          }}>
              <p style={{
              marginBottom: '20px'
            }}>
                <strong style={{
                background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>ATENTO5 SERVICIOS GENERALES E.I.R.L.</strong> es una empresa líder en el sector de servicios generales, fundada con la visión de proporcionar soluciones integrales de la más alta calidad.
              </p>
              <p style={{
              marginBottom: '20px'
            }}>
                A lo largo de nuestra trayectoria, hemos construido una sólida reputación basado en la <span style={{
                color: '#00C3FF',
                fontWeight: 600
              }}>excelencia, integridad y compromiso</span> con cada proyecto. Nuestra capacidad de adaptarnos a las necesidades específicas de cada cliente nos ha permitido crecer y consolidarnos.
              </p>
              <p>
                Hoy, continuamos innovando y mejorando nuestros servicios para mantener nuestro posicionamiento como la opción preferida de empresas y particulares que buscan <span style={{
                color: '#FF9900',
                fontWeight: 600
              }}>calidad, confiabilidad y excelencia</span>.
              </p>
            </div>
          </motion.div>

          {/*why choose us */}
          <motion.div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '24px',
          padding: '40px',
          backdropFilter: 'blur(10px)'
        }} initial={{
          opacity: 0,
          x: 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h3 style={{
            fontSize: '26px',
            fontWeight: 700,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
              <ShieldCheck size={24} style={{
              color: '#FF9900'
            }} />
              <span style={{
              background: 'linear-gradient(135deg, #FF9900 0%, #00C3FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
                ¿Por Qué Elegirnos?
              </span>
            </h3>
            <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
              {['Garantía total en todos nuestros servicios', 'Equipo técnico especializado y certificado', 'Materiales de primera calidad', 'Precios competitivos sin sacrificar calidad', 'Cumplimiento estricto de plazos', 'Asesoría técnica gratuita'].map((item, i) => <motion.li key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 0',
              borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              fontSize: '15px',
              color: 'rgba(229, 231, 235, 0.7)'
            }} initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1
            }}>
                  <CheckCircle2 size={18} style={{
                color: i % 2 === 0 ? '#00C3FF' : '#FF9900',
                flexShrink: 0,
                marginTop: '3px'
              }} />
                  <span>{item}</span>
                </motion.li>)}
            </ul>
          </motion.div>
        </div>

        {/* Timeline - Nuestra Trayectoria */}
        <motion.div style={{
        marginBottom: '80px'
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
          <h3 style={{
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 700,
          color: 'white',
          marginBottom: '50px'
        }}>
            Nuestra Trayectoria
          </h3>
          
          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
            {timeline.map((item, index) => <motion.div key={index} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '20px',
            padding: '28px',
            textAlign: 'center',
            position: 'relative'
          }} initial={{
            opacity: 0,
            y: 30
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
            scale: 1.05,
            borderColor: 'rgba(0, 195, 255, 0.5)',
            boxShadow: '0 10px 30px rgba(0, 195, 255, 0.15), 0 -10px 30px rgba(255, 153, 0, 0.15)'
          }}>
                <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00C3FF, #FF9900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: 'white'
            }}>
                  {item.year}
                </div>
                <h4 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'white',
              marginTop: '20px',
              marginBottom: '10px'
            }}>
                  {item.title}
                </h4>
                <p style={{
              fontSize: '13px',
              color: 'rgba(229, 231, 235, 0.5)',
              lineHeight: 1.6
            }}>
                  {item.desc}
                </p>
              </motion.div>)}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
          {features.map((feature, index) => <motion.div key={index} style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }} initial={{
          opacity: 0,
          y: 30
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
          borderColor: 'rgba(0, 195, 255, 0.4)',
          boxShadow: '0 10px 30px rgba(0, 195, 255, 0.15), 0 -10px 30px rgba(255, 153, 0, 0.15)'
        }}>
              {/* Stat badge */}
              <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: feature.gradient,
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#00C3FF'
          }}>
                {feature.stat}
              </div>
              
              <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: feature.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            color: '#00C3FF'
          }}>
                {feature.icon}
              </div>
              <h4 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'white',
            marginBottom: '10px'
          }}>
                {feature.title}
              </h4>
              <p style={{
            fontSize: '14px',
            color: 'rgba(229, 231, 235, 0.5)',
            lineHeight: 1.6
          }}>
                {feature.desc}
              </p>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default About;