import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Lightbulb, Award, Handshake } from 'lucide-react';
import logo from '../assets/Logo Atento5.png';

const ManagerProfile = () => {
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #050B14 0%, #0A1929 100%)',
      color: 'white',
      padding: '40px 24px',
      fontFamily: '"Inter", system-ui, sans-serif'
    }}>
      <motion.div
        style={{ maxWidth: '900px', margin: '0 auto' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Navigation Header */}
        <header style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '40px' }}>
          <motion.div
            whileHover={{ transition: { duration: 0.1, delay: 0 }, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div onClick={() => navigate(-1)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              textDecoration: 'none', fontSize: '15px', fontWeight: 800,
              padding: '12px 28px', borderRadius: '30px', cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.1), rgba(255, 153, 0, 0.1))',
              border: '1px solid rgba(255, 153, 0, 0.3)',
              boxShadow: '0 0 15px rgba(0, 195, 255, 0.1), inset 0 0 10px rgba(255, 153, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 195, 255, 0.2), rgba(255, 153, 0, 0.2))';
              e.currentTarget.style.boxShadow = '-8px 0px 20px rgba(0, 195, 255, 0.4), 8px 0px 20px rgba(255, 153, 0, 0.4)'; 
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 195, 255, 0.1), rgba(255, 153, 0, 0.1))';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 195, 255, 0.1), inset 0 0 10px rgba(255, 153, 0, 0.1)'; 
              e.currentTarget.style.borderColor = 'rgba(255, 153, 0, 0.3)';
            }}
            >
              <motion.div
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={20} color="#00C3FF" />
              </motion.div>
              <span style={{
                background: 'linear-gradient(90deg, #00C3FF 0%, #FF9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.5px'
              }}>
                Volver Atrás
              </span>
            </div>
          </motion.div>
        </header>

        {/* Corporate Letter Document Container */}
        <div style={{
          background: 'rgba(11, 18, 30, 0.95)',
          border: '1px solid rgba(0, 195, 255, 0.15)',
          borderRadius: '24px',
          padding: 'clamp(30px, 6vw, 80px)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Background Glow */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '5px',
            background: 'linear-gradient(90deg, #00C3FF, #FF9900)'
          }} />

          {/* Letterhead */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '30px', marginBottom: '40px' }}>
            <img src={logo} alt="ATENTO5 Logo" style={{ height: '70px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(0, 195, 255, 0.3))' }} />
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 4px 0', letterSpacing: '4px' }}>
                CARTA DE PRESENTACIÓN
              </h1>
              <h2 style={{
                fontSize: '1rem',
                fontWeight: 800,
                margin: '0 0 8px 0',
                letterSpacing: '1px',
                background: 'linear-gradient(90deg, #00C3FF 0%, #FF9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ATENTO5 SERVICIOS GENERALES E.I.R.L.
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(229, 231, 235, 0.5)', margin: 0 }}>
                Lima, Perú &bull; 2026
              </p>
            </div>
          </div>

          {/* Salutation */}
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            marginBottom: '30px',
            background: 'linear-gradient(90deg, #00C3FF 0%, #FF9900 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.5px'
          }}>
            A nuestros distinguidos clientes, aliados estratégicos y futuros colaboradores:
          </h3>

          {/* Core Text */}
          <div style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.9,
            textAlign: 'justify',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <p>
              Es un verdadero honor dirigirme a ustedes en representación de <strong style={{
                background: 'linear-gradient(90deg, #00C3FF 0%, #FF9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 800
              }}>ATENTO5 SERVICIOS GENERALES E.I.R.L.</strong> Nuestra empresa nació con un propósito claro y contundente: revolucionar la gestión integral de infraestructuras corporativas, industriales y comerciales en el Perú, elevando los estándares de calidad, seguridad y eficiencia.
            </p>
            <p>
              Entendemos que el éxito de sus operaciones depende directamente del estado y la funcionalidad de sus instalaciones. Por ello, no nos consideramos simples proveedores; nos posicionamos como <strong>socios estratégicos altamente comprometidos</strong> con la continuidad y el desarrollo de sus negocios. Nuestro equipo multidisciplinario evalúa, diseña y ejecuta soluciones a la medida, asegurando que cada proyecto, desde un mantenimiento preventivo hasta intervenciones de alta complejidad, se entregue a tiempo y con excelencia corporativa demostrable.
            </p>
            <p>
              En un entorno competitivo e impredecible, la tranquilidad térmica y estructural de sus oficinas o naves industriales es el pilar para sostener el ritmo productivo. Es bajo esta premisa que hemos estructurado nuestras operaciones, garantizando transparencia técnica, optimización exhaustiva de presupuestos y una capacidad de respuesta gerencial inmediata ante cualquier desafío o requerimiento imprevisto.
            </p>
          </div>

          {/* Core Values Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', margin: '50px 0' }}>
            <div style={{ background: 'rgba(0, 195, 255, 0.05)', borderRadius: '16px', padding: '30px', border: '1px solid rgba(0, 195, 255, 0.15)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
                <Target color="#00C3FF" size={24} /> Nuestra Misión
              </h4>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7, textAlign: 'justify' }}>
                Proveer soluciones expertas en servicios generales que garanticen el óptimo funcionamiento, seguridad y estética de las instalaciones de nuestros clientes. Ejecutamos cada proyecto con precisión analítica e integridad corporativa incuestionable.
              </p>
            </div>
            
            <div style={{ background: 'rgba(255, 153, 0, 0.05)', borderRadius: '16px', padding: '30px', border: '1px solid rgba(255, 153, 0, 0.15)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
                <Lightbulb color="#FF9900" size={24} /> Nuestra Visión
              </h4>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7, textAlign: 'justify' }}>
                Consolidarnos como la corporación líder a nivel nacional en mantenimiento integral y arquitectura corporativa, reconocidos por nuestra innovación sustentable, fiabilidad estructural e inquebrantable compromiso con la satisfacción total del cliente.
              </p>
            </div>
          </div>

          <div style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.9,
            textAlign: 'justify',
            marginBottom: '50px'
          }}>
            <p>
              Queremos reiterar nuestra absoluta disposición para atender la agenda y requerimientos corporativos de su empresa. Permítanos demostrarle mediante resultados tangibles cómo la experiencia y la profunda dedicación del equipo de ATENTO5 pueden sumar un valor diferenciador, sostenido y cuantificable a su organización.
            </p>
            <p style={{ marginTop: '20px' }}>
              Agradeciendo de antemano la confianza que se digna depositar en nuestra gestión, quedamos a su entera y permanente disposición.
            </p>
          </div>

          {/* Signature Block */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '30px',
            marginTop: '40px'
          }}>
            {/* Minimalist Signature Representation */}
            <div style={{
              fontFamily: '"Brush Script MT", "Segoe Print", cursive',
              fontSize: '36px',
              marginBottom: '10px',
              opacity: 0.9,
              background: 'linear-gradient(90deg, #00C3FF 0%, #FF9900 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              paddingRight: '10px'
            }}>
              Juan Ampuero T.
            </div>
            <h5 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: '0 0 6px 0' }}>Juan Jose Ampuero Torres</h5>
            <p style={{
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              margin: '0 0 4px 0',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #00C3FF 0%, #FF9900 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>GERENTE GENERAL</p>
            <p style={{
              fontSize: '0.85rem',
              marginTop: '4px',
              background: 'linear-gradient(90deg, #00C3FF 0%, #FF9900 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700
            }}>ATENTO5 SERVICIOS GENERALES E.I.R.L.</p>
          </div>
        </div>

        {/* Corporate Focus Tags */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '40px', paddingBottom: '40px' }}>
          {[
            { icon: <ShieldCheck size={18} />, text: 'Compromiso Total' },
            { icon: <Award size={18} />, text: 'Calidad Impecable' },
            { icon: <Handshake size={18} />, text: 'Socios Estratégicos' }
          ].map((tag, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', fontWeight: 500 }}>
              {tag.icon} {tag.text}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Reusable mock icon due to lucide import limits if ShieldCheck isn't exported in original environment.
const ShieldCheck = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default ManagerProfile;