import { useState } from 'react';
import { motion } from 'framer-motion';

const BrochurePDF = ({ variant = 'floating' }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = '/ATENTO5-BROCHURE-2026.pdf';
    link.download = 'ATENTO5-BROCHURE-2026.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1500);
  };

  const downloadSvg = (
    <svg width={variant === 'inline' ? 24 : 36} height={variant === 'inline' ? 24 : 36} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="dlIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C3FF" />
          <stop offset="100%" stopColor="#FF9900" />
        </linearGradient>
      </defs>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="url(#dlIcon)" />
      <polyline points="7 10 12 15 17 10" stroke="url(#dlIcon)" />
      <line x1="12" y1="15" x2="12" y2="3" stroke="url(#dlIcon)" />
    </svg>
  );

  if (variant === 'inline') {
    return (
      <motion.button
        onClick={handleDownload}
        disabled={isDownloading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '18px 32px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(0,195,255,0.15), rgba(255,153,0,0.15))',
          color: 'white',
          border: '1.5px solid rgba(0,195,255,0.4)',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(0,195,255,0.2)',
        }}
      >
        {downloadSvg}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleDownload}
      disabled={isDownloading}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 74,
        height: 74,
        borderRadius: '50%',
        border: '2px solid rgba(255,153,0,0.2)',
        background: 'linear-gradient(135deg, rgba(0,195,255,0.1), rgba(255,153,0,0.1))',
        cursor: 'pointer',
        margin: '0 auto',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {downloadSvg}
      </motion.div>
    </motion.button>
  );
};

export default BrochurePDF;
