import { motion } from 'framer-motion';
import { Download, FileText, Eye, Sparkles } from 'lucide-react';
import BrochurePDF from './BrochurePDF';
import ModernAnimatedLogo from '../ui/ModernAnimatedLogo';
import BusinessCard from './BusinessCard';
const BrochureSection = () => {
  return <section id="brochure" style={{
    padding: '140px 0',
    position: 'relative',
    background: 'linear-gradient(180deg, rgba(5, 11, 20, 0) 0%, rgba(10, 38, 71, 0.4) 50%, rgba(5, 11, 20, 0) 100%)',
    overflow: 'hidden'
  }}>
      {/* Animated Background Elements */}
      <motion.div style={{
      position: 'absolute',
      top: '20%',
      right: '10%',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(0, 195, 255, 0.12) 0%, transparent 70%)',
      filter: 'blur(80px)',
      borderRadius: '50%'
    }} animate={{
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5]
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut'
    }} />

      <motion.div style={{
      position: 'absolute',
      bottom: '15%',
      left: '8%',
      width: '350px',
      height: '350px',
      background: 'radial-gradient(circle, rgba(255, 153, 0, 0.1) 0%, transparent 70%)',
      filter: 'blur(70px)',
      borderRadius: '50%'
    }} animate={{
      scale: [1, 1.15, 1],
      opacity: [0.4, 0.7, 0.4]
    }} transition={{
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 1
    }} />

      {/* Grid Pattern */}
      <div style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `
          linear-gradient(rgba(0, 195, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 195, 255, 0.02) 1px, transparent 1px)
        `,
      backgroundSize: '50px 50px',
      opacity: 0.5
    }} />

      <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px',
      position: 'relative',
      zIndex: 10
    }}>
        {/* Section Header */}
        <motion.div style={{
        textAlign: 'center',
        marginBottom: '80px'
      }} initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.7
      }}>
          {/* Badge */}
          <motion.div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 28px',
          borderRadius: '30px',
          fontSize: '13px',
          fontWeight: 600,
          background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.15), rgba(255, 153, 0, 0.08))',
          color: '#FF9900',
          border: '1px solid rgba(255, 153, 0, 0.3)',
          marginBottom: '24px',
          letterSpacing: '0.1em'
        }} animate={{
          boxShadow: ['0 0 20px rgba(255, 153, 0, 0.2)', '0 0 40px rgba(255, 153, 0, 0.4)', '0 0 20px rgba(255, 153, 0, 0.2)']
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}>
            <Sparkles size={16} />
            BROCHURE CORPORATIVO
          </motion.div>

          {/* Title */}
          <h2 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          color: 'white',
          marginBottom: '20px',
          lineHeight: 1.1
        }}>
            Descarga Nuestro{' '}
            <span style={{
            background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
              Brochure
            </span>
          </h2>

          {/* Description */}
          <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'rgba(229, 231, 235, 0.6)',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.8
        }}>
            Conoce todos nuestros servicios, proyectos y la experiencia que nos respalda. 
            Descarga nuestro brochure corporativo en formato PDF de alta calidad.
          </p>
        </motion.div>

        {/* Brochure Preview & Download */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '50px',
        alignItems: 'center'
      }}>
          {/* Brochure Preview Card */}
          <motion.div initial={{
          opacity: 0,
          x: -40
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.7
        }} style={{
          background: 'linear-gradient(135deg, rgba(10, 38, 71, 0.9), rgba(11, 25, 44, 0.95))',
          border: '1px solid rgba(0, 195, 255, 0.2)',
          borderRadius: '28px',
          padding: '50px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
            {/* Decorative Elements */}
            <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(0, 195, 255, 0.15) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />

            <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 153, 0, 0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />

            <div style={{
            position: 'relative',
            zIndex: 1
          }}>
              {/* Logo */}
              <div style={{
              marginBottom: '40px',
              display: 'flex',
              justifyContent: 'center',
              transform: 'translateY(-20px)'
            }}>
                <ModernAnimatedLogo size="medium" showText={false} />
              </div>

              {/* Preview Icon */}
              <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.2), rgba(6, 182, 212, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '28px',
              border: '2px solid rgba(0, 195, 255, 0.2)'
            }}>
                <FileText size={40} color="#00C3FF" />
              </div>

              <h3 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '16px'
            }}>
                Brochure Corporativo
              </h3>

              <p style={{
              fontSize: '15px',
              color: 'rgba(229, 231, 235, 0.6)',
              lineHeight: 1.8,
              marginBottom: '28px'
            }}>
                Documento completo con información sobre nuestra empresa, servicios, 
                proyectos destacados y datos de contacto.
              </p>

              {/* Features List */}
              <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
                {[{
                icon: '📋',
                text: 'Perfil de la empresa'
              }, {
                icon: '🔧',
                text: 'Catálogo de servicios'
              }, {
                icon: '🏗️',
                text: 'Proyectos realizados'
              }, {
                icon: '📞',
                text: 'Información de contacto'
              }].map((item, index) => <motion.div key={index} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.2 + index * 0.1
                }
              }} viewport={{
                once: true
              }}>
                <motion.div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '14px',
                color: 'rgba(229, 231, 235, 0.8)',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }} whileHover={{ transition: {
                  duration: 0.1,
                  delay: 0
                },
                background: 'rgba(0, 195, 255, 0.08)',
                borderColor: 'rgba(0, 195, 255, 0.2)',
                x: 5
              }} transition={{ duration: 0.1 }}>
                    <span style={{
                  fontSize: '18px'
                }}>{item.icon}</span>
                    <span style={{
                  fontWeight: 500
                }}>{item.text}</span>
                  </motion.div>
                </motion.div>)}
              </div>
            </div>
          </motion.div>

          {/* Download Section */}
          <motion.div initial={{
          opacity: 0,
          x: 40
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.7,
          delay: 0.2
        }} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}>
            {/* Download Card */}
            <motion.div style={{
            background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.08) 0%, rgba(255, 153, 0, 0.05) 100%)',
            border: '2px solid rgba(0, 195, 255, 0.25)',
            borderRadius: '28px',
            padding: '45px 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }} whileHover={{ transition: {
              duration: 0.1,
              delay: 0
            },
            scale: 1.02
          }} transition={{
            duration: 0.3
          }}>
              {/* Animated Background */}
              <motion.div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(0, 195, 255, 0.1) 0%, transparent 70%)'
            }} animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }} />

              {/* Download Icon */}
              <motion.div style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.2), rgba(0, 195, 255, 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
              border: '3px solid rgba(0, 195, 255, 0.3)',
              position: 'relative',
              zIndex: 2
            }} animate={{
              boxShadow: ['0 0 30px rgba(0, 195, 255, 0.3)', '0 0 60px rgba(0, 195, 255, 0.5)', '0 0 30px rgba(0, 195, 255, 0.3)']
            }} transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}>
                <motion.div animate={{
                y: [0, -8, 0]
              }} transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}>
                  <Download size={44} color="#00C3FF" strokeWidth={2.5} />
                </motion.div>
              </motion.div>

              <h4 style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '12px',
              position: 'relative',
              zIndex: 2
            }}>
                Descarga Gratuita
              </h4>

              <p style={{
              fontSize: '14px',
              color: 'rgba(229, 231, 235, 0.6)',
              marginBottom: '28px',
              lineHeight: 1.7,
              position: 'relative',
              zIndex: 2
            }}>
                Obtén nuestro brochure en formato PDF de alta calidad. 
                Compatible con todos los dispositivos.
              </p>

              {/* Download Button */}
              <div style={{
              position: 'relative',
              zIndex: 2
            }}>
                <BrochurePDF variant="inline" />
              </div>
            </motion.div>

            {/* Info Cards */}
            <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '18px'
          }}>
              {[{
              value: 'PDF',
              label: 'Formato',
              color: '#00C3FF'
            }, {
              value: '10+',
              label: 'Páginas',
              color: '#FF9900'
            }].map((stat, index) => <motion.div key={index} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center'
            }} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.4 + index * 0.1
              }
            }} viewport={{
              once: true
            }} whileHover={{ transition: {
                duration: 0.1,
                delay: 0
              },
              borderColor: `${stat.color}40`,
              background: `${stat.color}08`
            }}>
                  <div style={{
                fontSize: '32px',
                fontWeight: 800,
                color: stat.color,
                marginBottom: '6px'
              }}>
                    {stat.value}
                  </div>
                  <div style={{
                fontSize: '12px',
                color: 'rgba(229, 231, 235, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                    {stat.label}
                  </div>
                </motion.div>)}
            </div>

            <BusinessCard />

            {/* Trust Badges */}
            <motion.div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }} initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.6
          }}>
              {[{
              icon: '✓',
              text: 'Sin registro'
            }, {
              icon: '✓',
              text: '100% Gratis'
            }, {
              icon: '✓',
              text: 'Acceso inmediato'
            }].map((badge, index) => <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'rgba(229, 231, 235, 0.6)'
            }}>
                  <span style={{
                color: '#00C3FF',
                fontWeight: 'bold'
              }}>
                    {badge.icon}
                  </span>
                  {badge.text}
                </div>)}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default BrochureSection;