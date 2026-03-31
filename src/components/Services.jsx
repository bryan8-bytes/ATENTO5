import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Paintbrush, Building2, Truck, Construction, ClipboardCheck, Sparkles, Zap, Trees, Lock, Lightbulb, FileCheck, Square, Droplets, Flame, Shield, ChevronDown, Plus, Minus } from 'lucide-react';

// Service images - using placeholder gradient backgrounds with icons
const getServiceImage = index => {
  return index % 2 === 0 ? 'linear-gradient(135deg, rgba(0,195,255,0.2), rgba(0,195,255,0.05))' : 'linear-gradient(135deg, rgba(255,153,0,0.2), rgba(255,153,0,0.05))';
};
const services = [{
  title: 'Mantenimiento General',
  desc: 'Servicios de mantenimiento preventivo y correctivo para instalaciones comerciales e industriales.',
  icon: <Wrench size={28} />,
  gradient: 'linear-gradient(135deg, rgba(0,195,255,0.2), rgba(6,182,212,0.1))',
  features: ['Preventivo', 'Correctivo', 'Industrial'],
  content: 'Realizamos mantenimiento integral de instalaciones comerciales, industriales y residenciales. Incluye revisiones periódicas, reparación de averías, cambio de componentes, pintura de áreas comunes, reparación de pisos, techos y paredes. Atendemos emergencias las 24 horas para garantizar la continuidad operativa de tu negocio.'
}, {
  title: 'Pintura y Acabados',
  desc: 'Trabajos profesionales de pintura interior y exterior con acabados de excelencia.',
  icon: <Paintbrush size={28} />,
  gradient: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.1))',
  features: ['Interior', 'Exterior', 'Decorativo'],
  content: 'Ejecutamos trabajos de pintura interior y exterior con técnicas profesionales y materiales de primera calidad. Incluye preparación de superficies, aplicación de primers, pinturas decorativas, texturados, acabados satinados y mates. Trabajamos en viviendas, oficinas, locales comerciales y fachadas completas.'
}, {
  title: 'Construcción',
  desc: 'Proyectos de construcción, remodelaciones y ampliaciones de todo tipo.',
  icon: <Building2 size={28} />,
  gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(234,179,8,0.1))',
  features: ['Remodelación', 'Ampliación', 'Obras nuevas'],
  content: 'Desarrollamos proyectos de construcción desde cero, remodelaciones integrales y ampliaciones de espacios. Cubrimos desde la planificación y diseño hasta la ejecución completa, incluyendo cimentación, estructura, techado, acabados e instalaciones. Cumplimos con todas las normativas técnicas y de seguridad vigentes.'
}, {
  title: 'Transporte y Logística',
  desc: 'Servicios de transporte de materiales, equipos y mobiliario.',
  icon: <Truck size={28} />,
  gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(6,182,212,0.1))',
  features: ['Carga', 'Logística', 'Mudanzas'],
  content: 'Brindamos servicios de transporte de materiales de construcción, equipos pesados y maquinaria. Realizamos mudanzas residenciales y comerciales con embalaje profesional, carga y descarga segura. Contamos con unidades de diferentes capacidades para adaptarnos a cada necesidad logística.'
}, {
  title: 'Obras Civiles',
  desc: 'Ejecución de obras civiles y proyectos de infraestructura de gran escala.',
  icon: <Construction size={28} />,
  gradient: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,179,8,0.1))',
  features: ['Infraestructura', 'Pavimentación', 'Estructuras'],
  content: 'Ejecutamos obras civiles de mediana y gran escala, incluyendo pavimentación de pistas y veredas, construcción de muros de contención, sistemas de drenaje, estructuras de concreto armado y obras de infraestructura vial. Garantizamos calidad en cada etapa del proceso constructivo.'
}, {
  title: 'Gestión de Proyectos',
  desc: 'Administración, supervisión y gestión integral de proyectos de construcción.',
  icon: <ClipboardCheck size={28} />,
  gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.1))',
  features: ['Supervisión', 'Planeamiento', 'Control'],
  content: 'Ofrecemos gestión integral de proyectos desde la concepción hasta la entrega. Incluye planificación de cronogramas, control de presupuestos, coordinación de proveedores, supervisión de obras en campo, gestión de permisos y licencias, y elaboración de informes de avance para el cliente.'
}, {
  title: 'Limpieza Industrial',
  desc: 'Servicios especializados de limpieza para todo tipo de instalaciones.',
  icon: <Sparkles size={28} />,
  gradient: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(6,182,212,0.1))',
  features: ['Industrial', 'Commercial', 'Especializada'],
  content: 'Realizamos limpieza profunda e industrial en fábricas, almacenes, centros comerciales y oficinas. Incluye lavado de fachadas, desinfección de ambientes, limpieza post-obra, mantenimiento de pisos industriales y limpieza de vidrios en altura. Utilizamos equipos especializados y productos certificados.'
}, {
  title: 'Instalaciones Eléctricas',
  desc: 'Diseño e instalación de sistemas eléctricos residenciales e industriales.',
  icon: <Zap size={28} />,
  gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1))',
  features: ['Instalación', 'Mantenimiento', 'Diseño'],
  content: 'Diseñamos e instalamos sistemas eléctricos completos para viviendas, locales comerciales e industrias. Incluye tableros eléctricos, cableado, canalizaciones, iluminación LED, sistemas de puesta a tierra, UPS y plantas eléctricas. Realizamos mantenimiento preventivo y correctivo con personal certificado.'
}, {
  title: 'Carpintería y Muebles',
  desc: 'Fabricación y reparación de mobiliario de madera a medida.',
  icon: <Trees size={28} />,
  gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.1))',
  features: ['Fabricación', 'Reparación', 'Muebles a medida'],
  content: 'Fabricamos muebles a medida en madera, melamina y MDF para hogares, oficinas y comercios. Incluye closets, cocinas, estantes, escritorios, puertas y ventanas. Realizamos reparación y restauración de mobiliario existente. Trabajamos con diseños personalizados según las necesidades del cliente.'
}, {
  title: 'Servicios de Jardinería',
  desc: 'Diseño, instalación y mantenimiento de áreas verdes.',
  icon: <Trees size={28} />,
  gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.1))',
  features: ['Diseño', 'Mantenimiento', 'Instalación'],
  content: 'Diseñamos, instalamos y mantenemos jardines y áreas verdes en viviendas, condominios y espacios corporativos. Incluye siembra de césped, plantas ornamentales, sistemas de riego automatizado, poda de árboles, control de plagas y paisajismo decorativo. Creamos espacios verdes funcionales y estéticos.'
}, {
  title: 'Servicios de Seguridad',
  desc: 'Instalación y mantenimiento de sistemas de seguridad.',
  icon: <Lock size={28} />,
  gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(6,182,212,0.1))',
  features: ['Cámaras', 'Alarmas', 'Control de acceso'],
  content: 'Instalamos sistemas de seguridad electrónica para hogares, oficinas y locales comerciales. Incluye cámaras de vigilancia CCTV, alarmas antirrobo, cercos eléctricos, control de acceso biométrico, videoporteros y monitoreo remoto. Ofrecemos mantenimiento preventivo y soporte técnico continuo.'
}, {
  title: 'Consultoría Técnica',
  desc: 'Asesoría profesional en proyectos de construcción y servicios generales.',
  icon: <Lightbulb size={28} />,
  gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(6,182,212,0.1))',
  features: ['Asesoría', 'Inspección', 'Dictámenes'],
  content: 'Brindamos asesoría técnica especializada para proyectos de construcción, remodelación y mantenimiento. Incluye inspecciones técnicas, dictámenes de seguridad, evaluación de estructuras, asesoría en normativa técnica, estudios de prefactibilidad y acompañamiento en procesos de licenciamiento municipal.'
}, {
  title: 'Vidriería y Aluminio',
  desc: 'Fabricación e instalación de ventanas, fachadas y estructuras de aluminio y vidrio.',
  icon: <Square size={28} />,
  gradient: 'linear-gradient(135deg, rgba(147,197,253,0.2), rgba(6,182,212,0.1))',
  features: ['Ventanas', 'Fachadas', 'Estructuras'],
  content: 'Fabricamos e instalamos ventanas, fachadas, divisiones de oficinas y estructuras de aluminio y vidrio templado. Incluye ventanas corredizas, de guillotina y fijas, muros cortina, puertas automáticas y manuales, vidrios laminados y doble vidriado. Trabajamos con perfiles de aluminio de alta resistencia.'
}, {
  title: 'Gasfitería',
  desc: 'Instalación y reparación de redes de agua, desagüe y sistemas sanitarios.',
  icon: <Droplets size={28} />,
  gradient: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(6,182,212,0.1))',
  features: ['Agua', 'Desagüe', 'Sanitarios'],
  content: 'Ejecutamos instalaciones y reparaciones de redes hidráulicas y sanitarias. Incluye instalación de tuberías de agua fría y caliente, sistemas de desagüe, pozos sépticos, bombas de presión, calentadores de agua, grifería y accesorios sanitarios. Atendemos emergencias de fugas y desazolve las 24 horas.'
}, {
  title: 'Herrería',
  desc: 'Fabricación y soldadura de estructuras metálicas, rejas, puertas y portones.',
  icon: <Flame size={28} />,
  gradient: 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(234,179,8,0.1))',
  features: ['Soldadura', 'Rejas', 'Estructuras'],
  content: 'Fabricamos estructuras metálicas, rejas de seguridad, puertas, portones, barandas, escaleras metálicas y techados livianos. Incluye soldadura MIG, TIG y por arco, corte y doblado de lámina, galvanizado y pintura industrial. Trabajamos con fierro, acero inoxidable y aluminio según la necesidad del proyecto.'
}, {
  title: 'Impermeabilización',
  desc: 'Tratamiento y recubrimiento de superficies para protección contra filtraciones de agua.',
  icon: <Shield size={28} />,
  gradient: 'linear-gradient(135deg, rgba(45,212,191,0.2), rgba(6,182,212,0.1))',
  features: ['Techos', 'Terrazas', 'Sótanos'],
  content: 'Aplicamos sistemas de impermeabilización para techos, terrazas, sótanos, tanques y piscinas. Incluye membranas asfálticas, impermeabilizantes acrílicos, sistemas cementosos y mantas termoselladas. Realizamos diagnóstico de filtraciones, reparación de goteras y mantenimiento preventivo de cubiertas existentes.'
}];
const Services = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return <section id="servicios" style={{
    padding: '120px 0',
    position: 'relative'
  }}>
      <div style={{
      maxWidth: '1400px',
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
            ¿QUÉ HACEMOS?
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
              Nuestros Servicios
            </span>
          </h2>
          <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'rgba(229, 231, 235, 0.5)',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.7
        }}>
            Soluciones integrales y especializadas para cada necesidad de tu empresa o proyecto. 
            Contamos con expertos en cada área para garantizar resultados excepcionales.
          </p>
        </motion.div>

        {/* Services Grid - 3 columns on desktop */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
          {services.map((service, index) => <motion.div key={index} style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
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
            delay: index * 0.08
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
              {/* Hover effect */}
              <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'linear-gradient(90deg, #00C3FF, #FF9900)',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease'
          }} />
              
              <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
                {/* Image instead of icon */}
                <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: getServiceImage(index),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: index % 2 === 0 ? '#00C3FF' : '#FF9900'
            }}>
                  {service.icon}
                </div>
                <motion.div onClick={(e) => { e.stopPropagation(); toggleExpand(index); }} style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: expandedIndex === index ? 'linear-gradient(135deg, rgba(0,195,255,0.25), rgba(255,153,0,0.25))' : 'rgba(255,255,255,0.04)',
              border: expandedIndex === index ? '1px solid rgba(0,195,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0
            }} whileHover={{
              scale: 1.15,
              background: 'linear-gradient(135deg, rgba(0,195,255,0.2), rgba(255,153,0,0.2))',
              boxShadow: index % 2 === 0 ? '0 0 20px rgba(0,195,255,0.4), 0 0 40px rgba(0,195,255,0.15)' : '0 0 20px rgba(255,153,0,0.4), 0 0 40px rgba(255,153,0,0.15)',
              borderColor: index % 2 === 0 ? 'rgba(0,195,255,0.6)' : 'rgba(255,153,0,0.6)'
            }} whileTap={{
              scale: 0.9
            }} transition={{
              duration: 0.2
            }}>
                  <AnimatePresence mode="wait">
                    {expandedIndex === index ? <motion.div key="minus" initial={{
                  scale: 0,
                  opacity: 0,
                  rotate: -90
                }} animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: 0
                }} exit={{
                  scale: 0,
                  opacity: 0,
                  rotate: 90
                }} transition={{
                  duration: 0.2
                }}>
                        <Minus size={20} color={index % 2 === 0 ? '#00C3FF' : '#FF9900'} strokeWidth={2.5} />
                      </motion.div> : <motion.div key="plus" initial={{
                  scale: 0,
                  opacity: 0,
                  rotate: 90
                }} animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: 0
                }} exit={{
                  scale: 0,
                  opacity: 0,
                  rotate: -90
                }} transition={{
                  duration: 0.2
                }}>
                        <Plus size={20} color={index % 2 === 0 ? '#00C3FF' : '#FF9900'} strokeWidth={2.5} />
                      </motion.div>}
                  </AnimatePresence>
                </motion.div>
              </div>
              
              <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '12px'
          }}>
                {service.title}
              </h3>
              <p style={{
            fontSize: '14px',
            color: 'rgba(229, 231, 235, 0.5)',
            lineHeight: 1.6,
            marginBottom: '16px'
          }}>
                {service.desc}
              </p>
              <AnimatePresence>
                {expandedIndex === index && <motion.p initial={{
              height: 0,
              opacity: 0
            }} animate={{
              height: 'auto',
              opacity: 1
            }} exit={{
              height: 0,
              opacity: 0
            }} transition={{
              duration: 0.3
            }} style={{
              fontSize: '14px',
              color: 'rgba(229, 231, 235, 0.45)',
              lineHeight: 1.7,
              marginBottom: '16px',
              overflow: 'hidden'
            }}>
                    {service.content}
                  </motion.p>}
              </AnimatePresence>
              
              {/* Features list */}
              <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
                {service.features.map((feature, fIndex) => <span key={fIndex} style={{
              padding: '4px 10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              fontSize: '11px',
              color: 'rgba(229, 231, 235, 0.5)'
            }}>
                    {feature}
                  </span>)}
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default Services;