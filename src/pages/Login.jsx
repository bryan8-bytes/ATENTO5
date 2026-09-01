import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, LockKeyhole, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import logo from '../assets/Logo Atento5.png';
import './Login.css';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/home';

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
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Inténtelo de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-backdrop" aria-hidden="true" />
      <div className="login-orb login-orb-1" aria-hidden="true" />
      <div className="login-orb login-orb-2" aria-hidden="true" />

      <Link to="/home" className="login-back-button">
        <ArrowLeft size={16} />
        <span>Volver a la web</span>
      </Link>

      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="login-card"
      >
        <div className="login-glow-line" aria-hidden="true" />

        <div className="login-header">
          <Motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', marginBottom: 16 }}
          >
            <img src={logo} alt="Atento5 Logo" className="login-logo" loading="lazy" />
          </Motion.div>
          <h2 className="login-title">Panel Administrativo</h2>
          <p className="login-subtitle">
            Inicia sesión con tu correo corporativo de Atento5 para gestionar cotizaciones y órdenes de compra.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Correo Electrónico</label>
            <div className="login-input-wrap">
              <div className="login-input-icon"><Mail size={18} /></div>
              <input
                type="email"
                placeholder="nombre@atento5.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="login-input"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Contraseña</label>
            <div className="login-input-wrap">
              <div className="login-input-icon"><Lock size={18} /></div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="login-input"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                className="login-password-toggle"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <Motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="login-error"
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{error}</span>
              </Motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            variant="gradient"
            size="lg"
            className="w-full"
            style={{ marginTop: '10px' }}
            motionProps={{ whileHover: isSubmitting ? {} : { scale: 1.02 }, whileTap: isSubmitting ? {} : { scale: 0.98 } }}
          >
            {isSubmitting ? 'Iniciando sesión...' : (
              <>
                <LockKeyhole size={18} />
                <span>ACCEDER AL PANEL</span>
              </>
            )}
          </Button>
        </form>

        <div className="login-footer">
          <span>ATENTO5 SERVICIOS GENERALES</span>
          <span>•</span>
          <span>HOSTINGPERU.COM</span>
        </div>
      </Motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loginSpin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default Login;