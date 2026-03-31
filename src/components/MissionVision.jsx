import { motion } from 'framer-motion';
import { Target, Eye, Award, Heart, Lightbulb, Users, Handshake, Leaf } from 'lucide-react';
const MissionVision = () => {
  const items = [{
    title: 'Misión',
    content: 'Proporcionar servicios generales de la más alta calidad, superando las expectativas de nuestros clientes mediante un equipo profesional comprometido, innovación constante y valores sólidos que nos distinguen como líderes en el sector.',
    icon: <Target size={36} style={{
      color: '#00C3FF'
    }} />,
    gradient: 'linear-gradient(135deg, rgba(0,195,255,0.25), rgba(0,195,255,0.05))'
  }, {
    title: 'Visión',
    content: 'Ser líderes indiscutibles en el sector de servicios generales en Perú y Latinoamérica, reconocidos por la excelencia operativa, confiabilidad absoluta y compromiso genuino con el desarrollo sostenible de nuestros clientes y la comunidad.',
    icon: <Eye size={36} style={{
      color: '#FF9900'
    }} />,
    gradient: 'linear-gradient(135deg, rgba(255,153,0,0.25), rgba(255,153,0,0.05))'
  }];
  const values = [{
    name: 'Excelencia',
    desc: 'Superamos estándares en cada proyecto',
    icon: <Award size={20} />
  }, {
    name: 'Integridad',
    desc: 'Transparencia en cada acción',
    icon: <Heart size={20} />
  }, {
    name: 'Innovación',
    desc: 'Siempre buscando mejores soluciones',
    icon: <Lightbulb size={20} />
  }, {
    name: 'Trabajo en Equipo',
    desc: 'Colaboración para lograr más',
    icon: <Users size={20} />
  }, {
    name: 'Compromiso',
    desc: 'Dedicación total al cliente',
    icon: <Handshake size={20} />
  }, {
    name: 'Sostenibilidad',
    desc: 'Cuidamos el medio ambiente',
    icon: <Leaf size={20} />
  }];
  return <section id="mision-vision" style={{
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
            NUESTRO PROPÓSITO
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
              Misión y Visión
            </span>
          </h2>
          <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'rgba(229, 231, 235, 0.5)',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.7
        }}>
            Conoce los pilares que guían nuestro trabajo diario y nos impulsan a ser cada vez mejores.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '32px',
        marginBottom: '80px'
      }}>
          {items.map((item, index) => <motion.div key={index} style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '28px',
          padding: '48px 40px',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: index * 0.2
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
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #00C3FF, #FF9900)'
          }} />
              
              <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: item.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            border: '1px solid rgba(0, 195, 255, 0.2)'
          }}>
                {item.icon}
              </div>

              <h3 style={{
            fontSize: '30px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '20px'
          }}>
                {item.title}
              </h3>

              <p style={{
            fontSize: '16px',
            color: 'rgba(229, 231, 235, 0.6)',
            lineHeight: 1.8
          }}>
                {item.content}
              </p>
            </motion.div>)}
        </div>

        {/* Values Grid */}
        <motion.div style={{
        textAlign: 'center'
      }} initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }}>
          <h3 style={{
          fontSize: '24px',
          fontWeight: 700,
          marginBottom: '40px'
        }}>
            <span style={{
            background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
              Nuestros Valores
            </span>
          </h3>
          
          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}>
            {values.map((value, index) => <motion.div key={index} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px 16px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              delay: index * 0.1
            }
          }} viewport={{
            once: true
          }} whileHover={{ transition: {
              duration: 0.1,
              delay: 0
            },
            scale: 1.05,
            background: 'linear-gradient(135deg, rgba(0,195,255,0.1) 0%, rgba(255,153,0,0.1) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '-10px 0px 30px rgba(0, 195, 255, 0.4), 10px 0px 30px rgba(255, 153, 0, 0.4)'
          }}>
                <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: index % 2 === 0 ? 'linear-gradient(135deg, rgba(0,195,255,0.2), rgba(0,195,255,0.05))' : 'linear-gradient(135deg, rgba(255,153,0,0.2), rgba(255,153,0,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: index % 2 === 0 ? '#00C3FF' : '#FF9900'
            }}>
                  {value.icon}
                </div>
                <div>
                  <h4 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'white',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                    {value.name}
                  </h4>
                  <p style={{
                fontSize: '12px',
                color: 'rgba(229, 231, 235, 0.5)',
                lineHeight: 1.5,
                textAlign: 'center'
              }}>
                    {value.desc}
                  </p>
                </div>
              </motion.div>)}
          </div>
        </motion.div>
      </div>
    </section>;
};
export default MissionVision;