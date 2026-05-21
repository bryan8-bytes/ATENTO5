import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, LockKeyhole, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Logo Atento5.png';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Get redirection path, defaults to /home
  const from = location.state?.from?.pathname || '/home';

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      // Success! The useEffect will redirect because user changes
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Inténtelo de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: '#050B14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      zIndex: 9999,
      padding: '1.5rem',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
    }}>
      {/* Background gradients and glowing orbs */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 15% 20%, rgba(60, 180, 255, 0.08) 0%, transparent 55%), radial-gradient(circle at 85% 80%, rgba(210, 20, 20, 0.06) 0%, transparent 55%), #050B14',
      }} />

      <motion.div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '25%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(60, 180, 255, 0.12) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '25%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(210, 20, 20, 0.09) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Back button */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 20 }}>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '8px 16px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(60, 180, 255, 0.3)';
              e.currentTarget.style.color = '#3CB4FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <ArrowLeft size={16} />
            <span>Volver a la web</span>
          </motion.button>
        </Link>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(135deg, rgba(10, 18, 32, 0.8) 0%, rgba(5, 10, 20, 0.9) 100%)',
          border: '1.5px solid rgba(60, 180, 255, 0.15)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(60, 180, 255, 0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* Glow Line Indicator */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #3CB4FF, #D21414, transparent)'
        }} />

        {/* Logo and title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', marginBottom: '16px' }}
          >
            <img src={logo} alt="Atento5 Logo" style={{ height: '70px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(60, 180, 255,0.5))' }} />
          </motion.div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '0.05em',
            margin: '0 0 6px 0',
            textAlign: 'center'
          }}>
            Panel Administrativo
          </h2>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.45)',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.5
          }}>
            Inicia sesión con tu correo corporativo de Atento5 para gestionar cotizaciones y órdenes de compra.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Email field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Correo Electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="nombre@atento5.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '14px 16px 14px 44px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.25s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3CB4FF';
                  e.target.style.boxShadow = '0 0 15px rgba(60, 180, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Contraseña
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '14px 44px 14px 44px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.25s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#D21414';
                  e.target.style.boxShadow = '0 0 15px rgba(210, 20, 20, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Alert Error Box */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  color: '#ef4444',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #3CB4FF 0%, #D21414 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '10px',
              boxShadow: '0 4px 15px rgba(60, 180, 255, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderTopColor: 'white',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <LockKeyhole size={18} />
                <span>ACCEDER AL PANEL</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>

        </form>

        {/* Decorative footer */}
        <div style={{
          marginTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.05em'
        }}>
          <span>ATENTO5 SERVICIOS GENERALES</span>
          <span>&bull;</span>
          <span>HOSTINGPERU.COM</span>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default Login;
