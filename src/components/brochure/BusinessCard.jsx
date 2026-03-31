import { motion } from 'framer-motion';
import { User, Download } from 'lucide-react';
const BusinessCard = () => {
  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Ampuero Torres;Juan Jose;;;
FN:Juan Jose Ampuero Torres
TITLE:Gerente General
ORG:ATENTO5 SERVICIOS GENERALES E.I.R.L.
TEL;TYPE=CELL:+51955295390
EMAIL:contacto@atento5.com
URL:https://atento5.com
END:VCARD`;
    const blob = new Blob([vCardData], {
      type: 'text/vcard'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Juan_Ampuero_ATENTO5.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return <motion.div style={{
    background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.03), rgba(255, 153, 0, 0.03))',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '32px',
    marginTop: '40px',
    textAlign: 'center'
  }} initial={{
    opacity: 0,
    y: 30
  }} whileInView={{
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2
    }
  }} viewport={{
    once: true
  }} whileHover={{ transition: {
      duration: 0.1,
      delay: 0
    },
    scale: 1.02,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '-15px 0px 40px rgba(0, 195, 255, 0.25), 15px 0px 40px rgba(255, 153, 0, 0.25)'
  }}>
      <div style={{
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      margin: '0 auto 16px auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.15), rgba(255, 153, 0, 0.15))',
      border: '1px solid rgba(255, 153, 0, 0.4)',
      boxShadow: '0 0 20px rgba(0, 195, 255, 0.3), inset 0 0 10px rgba(255, 153, 0, 0.2)'
    }}>
        <User size={30} strokeWidth={2} style={{
        color: '#FF9900'
      }} />
      </div>
      
      <h3 style={{
      fontSize: '20px',
      fontWeight: 700,
      color: 'white',
      margin: 0
    }}>
        Juan Jose Ampuero Torres
      </h3>
      <p style={{
      fontSize: '14px',
      color: '#00C3FF',
      letterSpacing: '0.1em',
      margin: '4px 0 24px 0'
    }}>
        GERENTE GENERAL
      </p>

      <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    }}>
        <motion.button onClick={downloadVCard} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 28px',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: 600,
        background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.1), rgba(255, 153, 0, 0.1))',
        color: 'white',
        border: '1px solid rgba(0, 195, 255, 0.4)',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0, 195, 255, 0.2)'
      }} whileHover={{ transition: {
          duration: 0.1,
          delay: 0
        },
        background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.2), rgba(255, 153, 0, 0.2))',
        boxShadow: '-5px 0px 20px rgba(0, 195, 255, 0.4), 5px 0px 20px rgba(255, 153, 0, 0.4)'
      }} whileTap={{
        scale: 0.98
      }}>
          <Download size={18} color="#00C3FF" />
          Guardar Contacto
        </motion.button>
      </div>
    </motion.div>;
};
export default BusinessCard;