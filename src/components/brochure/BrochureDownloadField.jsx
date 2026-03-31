import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, FileText, CheckCircle, Sparkles, FolderOpen, Wrench, Building2, Phone, FileSignature } from 'lucide-react';
import ModernAnimatedLogo from '../ui/ModernAnimatedLogo';
import BrochurePDF from './BrochurePDF';
import BusinessCard from './BusinessCard';
const BrochureDownloadField = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  return <section id="brochure-download" style={{
    padding: '140px 0',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #050B14 0%, #0A1929 50%, #050B14 100%)'
  }}>




      {/* Main Content Container */}
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      position: 'relative',
      zIndex: 10
    }}>
        {/* Main Card */}
        <motion.div style={{
        background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(5, 11, 20, 0.95) 100%)',
        border: '1px solid rgba(0, 195, 255, 0.2)',
        borderRadius: '40px',
        padding: '80px 60px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }} initial={{
        opacity: 0,
        y: 60
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8,
        ease: 'easeOut'
      }}>
          {/* Decorative Corner Elements */}
          <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200px',
          height: '200px',
          borderTop: '3px solid rgba(0, 195, 255, 0.3)',
          borderLeft: '3px solid rgba(0, 195, 255, 0.3)',
          borderRadius: '40px 0 0 0'
        }} />
          
          <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '200px',
          height: '200px',
          borderBottom: '3px solid rgba(255, 153, 0, 0.3)',
          borderRight: '3px solid rgba(255, 153, 0, 0.3)',
          borderRadius: '0 0 40px 0'
        }} />

          {/* Animated Logo Centered at Top */}
          <div style={{
          marginBottom: '60px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          transform: 'translateY(-30px)'
        }}>
            <ModernAnimatedLogo size="large" showText={true} variant="brochure" disableRings={true} />
          </div>

          {/* Content Grid */}
          <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'stretch'
        }}>
            {/* Left Side - Info */}
            <motion.div style={{
            display: 'flex',
            flexDirection: 'column'
          }} initial={{
            opacity: 0,
            x: -40
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              {/* Badge */}
              <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.15), rgba(255, 153, 0, 0.15))',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 20px rgba(0, 195, 255, 0.2), inset 0 0 10px rgba(255, 153, 0, 0.1)',
              marginBottom: '24px'
            }}>
                <Sparkles size={16} color="#FF9900" />
                <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#00C3FF',
                letterSpacing: '0.05em'
              }}>
                  BROCHURE CORPORATIVO 2026
                </span>
              </div>

              {/* Title */}
              <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'white',
              marginBottom: '20px',
              lineHeight: 1.1
            }}>
                Descarga Nuestro
                <br />
                <span style={{
                background: 'linear-gradient(135deg, #00C3FF 0%, #FF9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                  Brochure Completo
                </span>
              </h2>

              {/* Description */}
              <p style={{
              fontSize: '16px',
              color: 'rgba(229, 231, 235, 0.7)',
              lineHeight: 1.8,
              marginBottom: '30px'
            }}>
                Conoce todos nuestros servicios, proyectos destacados y la experiencia 
                que nos respalda como líderes en servicios generales e industriales.
              </p>

              {/* Features */}
              <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
                {[{
                icon: <FolderOpen size={20} />,
                text: 'Perfil completo de la empresa',
                color: '#00C3FF'
              }, {
                icon: <Wrench size={20} />,
                text: 'Catálogo detallado de servicios',
                color: '#FF9900'
              }, {
                icon: <Building2 size={20} />,
                text: 'Proyectos realizados',
                color: '#00C3FF'
              }, {
                icon: <Phone size={20} />,
                text: 'Información de contacto',
                color: '#FF9900'
              }].map((item, index) => <motion.div key={index} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.3 + index * 0.1
                }
              }} viewport={{
                once: true
              }}>
                    <motion.div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }} whileHover={{ transition: {
                  duration: 0.1,
                  delay: 0
                },
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                x: 10,
                boxShadow: `-8px 0px 20px ${item.color}30, 8px 0px 20px ${item.color === '#00C3FF' ? '#FF9900' : '#00C3FF'}30`
              }} transition={{ duration: 0.1 }}>
                    <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${item.color}20, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  border: `1px solid ${item.color}40`
                }}>
                      {item.icon}
                    </div>
                    <span style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 500
                }}>
                      {item.text}
                    </span>
                  </motion.div>
                </motion.div>)}
              </div>

              <BusinessCard />

            </motion.div>

            {/* Right Side - Download & Presentation Cards */}
            <motion.div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            justifyContent: 'space-between',
            height: '100%'
          }} initial={{
            opacity: 0,
            x: 40
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }}>
              <motion.div style={{
              background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.08) 0%, rgba(255, 153, 0, 0.05) 100%)',
              border: '2px solid rgba(0, 195, 255, 0.25)',
              borderRadius: '32px',
              padding: '50px 40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} whileHover={{ transition: {
                duration: 0.1,
                delay: 0
              },
              scale: 1.02,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              boxShadow: '-15px 0px 40px rgba(0, 195, 255, 0.25), 15px 0px 40px rgba(255, 153, 0, 0.25)'
            }} transition={{
              duration: 0.3
            }}>


                {/* Download Icon with Pulse Animation */}
                <div style={{
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px',
                position: 'relative',
                zIndex: 2
              }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
                  animation: 'downloadPulse 2s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 12px rgba(0, 195, 255, 0.5))',
                  stroke: 'url(#mainDownloadGradient)'
                }}>
                    <defs>
                      <linearGradient id="mainDownloadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00C3FF" />
                        <stop offset="100%" stopColor="#FF9900" />
                      </linearGradient>
                    </defs>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>

                {/* Title */}
                <h3 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'white',
                marginBottom: '12px',
                position: 'relative',
                zIndex: 2
              }}>
                  Descarga Gratuita
                </h3>

                {/* Subtitle */}
                <p style={{
                fontSize: '14px',
                color: 'rgba(229, 231, 235, 0.6)',
                marginBottom: '30px',
                lineHeight: 1.6,
                position: 'relative',
                zIndex: 2
              }}>
                  PDF de alta calidad • Compatible con todos los dispositivos
                </p>

                {/* Download Button */}
                <div style={{
                position: 'relative',
                zIndex: 2
              }}>
                  <BrochurePDF variant="inline" />
                </div>

                {/* Stats */}
                <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginTop: '30px',
                paddingTop: '30px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                zIndex: 2
              }}>
                  {[{
                  value: '10+',
                  label: 'Páginas'
                }, {
                  value: 'PDF',
                  label: 'Formato'
                }, {
                  value: 'HD',
                  label: 'Calidad'
                }].map((stat, index) => <motion.div key={index} initial={{
                  opacity: 0,
                  y: 20
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: 0.6 + index * 0.1
                }}>
                      <div style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #00C3FF, #FF9900)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '4px'
                  }}>
                        {stat.value}
                      </div>
                      <div style={{
                    fontSize: '11px',
                    color: 'rgba(229, 231, 235, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                        {stat.label}
                      </div>
                    </motion.div>)}
                </div>
              </motion.div>

              {/* Carta de Presentación Card */}
              <motion.div style={{
              background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.08) 0%, rgba(0, 195, 255, 0.05) 100%)',
              border: '1px solid rgba(255, 153, 0, 0.2)',
              borderRadius: '24px',
              padding: '30px',
              marginTop: '24px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.7
            }}>
                <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(255, 153, 0, 0.15) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />

                <h4 style={{
                fontSize: '22px',
                fontWeight: 800,
                marginBottom: '12px',
                position: 'relative',
                zIndex: 2,
                background: 'linear-gradient(135deg, #00C3FF, #FF9900)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                  <FileSignature size={24} color="#00C3FF" />
                  Carta de Presentación
                </h4>
                
                <p style={{
                fontSize: '14px',
                color: 'rgba(229, 231, 235, 0.6)',
                lineHeight: 1.6,
                marginBottom: '24px',
                position: 'relative',
                zIndex: 2
              }}>
                  Descubre la trayectoria empresarial, filosofía de marca y visión estratégica de ATENTO5 de la mano de nuestra Gerencia General. Nuestro compromiso corporativo contigo.
                </p>

                <div style={{
                position: 'relative',
                zIndex: 2
              }}>
                  <Link to="/gerente-general" style={{
                  textDecoration: 'none',
                  width: '100%'
                }}>
                    <motion.button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px 32px',
                    borderRadius: '16px',
                    fontSize: '15px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.1), rgba(0, 195, 255, 0.1))',
                    color: 'white',
                    border: '1px solid rgba(255, 153, 0, 0.4)',
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: '0 8px 30px rgba(255, 153, 0, 0.2)'
                  }} whileHover={{ transition: {
                      duration: 0.1,
                      delay: 0
                    },
                    scale: 1.02,
                    background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.2), rgba(0, 195, 255, 0.2))',
                    boxShadow: '-10px 0px 30px rgba(255, 153, 0, 0.4), 10px 0px 30px rgba(0, 195, 255, 0.4)'
                  }} whileTap={{
                    scale: 0.98
                  }}>
                      <FileSignature size={20} />
                      Ver Carta de Presentación
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '24px'
            }} initial={{
              opacity: 0
            }} whileInView={{
              opacity: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.8
            }}>
                {[{
                icon: <CheckCircle size={16} />,
                text: 'Sin registro'
              }, {
                icon: <CheckCircle size={16} />,
                text: '100% Gratis'
              }, {
                icon: <CheckCircle size={16} />,
                text: 'Acceso inmediato'
              }].map((badge, index) => <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'rgba(229, 231, 235, 0.5)'
              }}>
                    <span style={{
                  color: '#00C3FF'
                }}>{badge.icon}</span>
                    {badge.text}
                  </div>)}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default BrochureDownloadField;