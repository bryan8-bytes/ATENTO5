import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const Location = () => {
  const mapCoordinates = "-11.973306,-76.767500";
  const mapUrl = `https://maps.google.com/maps?q=${mapCoordinates}&hl=es&z=16&output=embed`;

  return (
    <section id="ubicacion" style={{ padding: '120px 0', background: 'rgba(5, 11, 20, 1)', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '60px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
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
            <MapPin size={14} />
            ENCUÉNTRANOS
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
              backgroundClip: 'text',
            }}>
              Nuestra Ubicación
            </span>
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'rgba(229, 231, 235, 0.5)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            Visita nuestras oficinas. Estamos ubicados estratégicamente para atender a nuestros clientes en toda la región.
          </p>
        </motion.div>

        {/* Map Embed */}
        <motion.div
          style={{
            height: '450px',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '-10px 0px 40px rgba(0, 195, 255, 0.2), 10px 0px 40px rgba(255, 153, 0, 0.2)'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default Location;