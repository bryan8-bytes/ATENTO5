import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CorreoLogin = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imapPassword, setImapPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password, imapPassword);
      navigate('/correo');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(email, password, name || email.split('@')[0], imapPassword, 'user');
      navigate('/correo');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] flex items-center justify-center p-4 relative overflow-hidden font-sans antialiased text-slate-200">
      {/* Background gradients and glowing orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(60,180,255,0.05)_0%,rgba(5,11,20,0.98)_80%)] pointer-events-none z-0" />
      <motion.div
        className="absolute top-[-10%] left-[25%] w-[450px] h-[450px] rounded-full bg-linear-to-br from-[#3CB4FF]/12 to-transparent blur-[80px] pointer-events-none z-0"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[25%] w-[450px] h-[450px] rounded-full bg-linear-to-br from-[#D21414]/9 to-transparent blur-[80px] pointer-events-none z-0"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative w-full bg-gradient-to-b from-[#0B1220]/80 to-[#050B14]/90 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_30px_rgba(60,180,255,0.05)] overflow-hidden">
          {/* Top glow line indicator */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#3CB4FF] to-transparent" />

          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#3CB4FF]/10 border border-[#3CB4FF]/30 rounded-2xl mb-4 shadow-[0_0_15px_rgba(60,180,255,0.15)]">
              <Mail className="text-[#3CB4FF]" size={26} />
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text text-transparent mb-2">
              Sistema de Correo Atento5
            </h1>
            <p className="text-xs text-slate-400 font-semibold tracking-wide">
              {isRegister ? 'REGISTRA TU CUENTA EMPRESARIAL' : 'ACCEDE A TU CORREO EMPRESARIAL'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl flex items-center gap-2.5 text-red-400 text-xs font-semibold"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login/Register form */}
          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#3CB4FF] transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800/50 focus:border-[#3CB4FF]/40 focus:ring-1 focus:ring-[#3CB4FF]/30 rounded-xl text-sm text-slate-200 placeholder-slate-505 focus:outline-none transition-all"
                  placeholder="tu-email@atento5.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Contraseña del Sistema
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#3CB4FF] transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-955/40 border border-slate-800/50 focus:border-[#3CB4FF]/40 focus:ring-1 focus:ring-[#3CB4FF]/30 rounded-xl text-sm text-slate-200 placeholder-slate-505 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Contraseña de Correo IMAP/SMTP
              </label>
              <div className="relative group">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#3CB4FF] transition-colors" size={18} />
                <input
                  type="password"
                  value={imapPassword}
                  onChange={(e) => setImapPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-955/40 border border-slate-800/50 focus:border-[#3CB4FF]/40 focus:ring-1 focus:ring-[#3CB4FF]/30 rounded-xl text-sm text-slate-200 placeholder-slate-550 focus:outline-none transition-all"
                  placeholder="Contraseña de tu correo @atento5.com"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-955/40 border border-slate-800/50 focus:border-[#3CB4FF]/40 focus:ring-1 focus:ring-[#3CB4FF]/30 rounded-xl text-sm text-slate-200 placeholder-slate-550 focus:outline-none transition-all"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#D21414] to-[#3CB4FF] hover:brightness-110 disabled:brightness-75 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/10 active:scale-[0.98] cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isRegister ? 'Registrando...' : 'Iniciando...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                disabled={loading}
                className="px-5 py-3.5 bg-slate-800/40 hover:bg-slate-850 hover:text-white text-slate-350 rounded-xl text-sm font-bold transition-all border border-slate-700/30 cursor-pointer"
              >
                {isRegister ? 'Cancelar' : 'Registrarse'}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-[#3CB4FF]/5 border border-[#3CB4FF]/10 rounded-xl">
            <p className="text-[11px] text-[#3CB4FF]/80 text-center leading-relaxed">
              <strong>Nota:</strong> La contraseña de correo IMAP/SMTP se usa para conectar con tu servidor de correo real @atento5.com mediante SSL/TLS.
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/home')}
            className="text-[#3CB4FF] hover:text-[#3CB4FF]/85 font-bold transition-colors text-sm hover:underline cursor-pointer"
          >
            ← Volver al inicio
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CorreoLogin;
