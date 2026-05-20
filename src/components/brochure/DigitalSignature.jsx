import { motion } from 'framer-motion';

const DigitalSignature = ({ representativeName = 'Representante Legal' }) => {
  return (
    <motion.div
      className="mt-8 pt-6 border-t border-white/10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <p className="text-white-dim/50 text-xs mb-2">Atentamente</p>
        <div className="inline-block">
          {/* Signature line */}
          <div className="w-48 h-px bg-white/30 mb-2" />
          {/* Name */}
          <p className="text-white font-medium text-sm">{representativeName}</p>
          <p className="text-celeste text-xs">Representante Legal</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DigitalSignature;