import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

const AUTHORIZED_USERS = [
  {
    email: 'Juan.ampuero@atento5.com',
    password: '4B@}K?3DmgR!Nuq@',
    name: 'Juan Ampuero',
    role: 'Administrador General',
    avatar: 'JA'
  },
  {
    email: 'Corina.anorga@atento5.com',
    password: '5VWwcTyp3iB8PY7',
    name: 'Corina Anorga',
    role: 'Finanzas',
    avatar: 'CA'
  },
  {
    email: 'Proyectos@atento5.com',
    password: '7ZjFHR#HtwbW53(C',
    name: 'Proyectos',
    role: 'Gestión de Proyectos',
    avatar: 'PR'
  },
  {
    email: 'Ventas@atento5.com',
    password: 'MV}FgL4xmGkt4cav',
    name: 'Ventas',
    role: 'Gestión Comercial',
    avatar: 'VE'
  },
  {
    email: 'Operaciones@atento5.com',
    password: 'rHxl.dgL&!tNgSeT',
    name: 'Operaciones',
    role: 'Operaciones',
    avatar: 'OP'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user session is persisted in localStorage
    const savedUser = localStorage.getItem('a5_admin_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing session data', e);
        localStorage.removeItem('a5_admin_session');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate slight network latency for premium micro-animations
      setTimeout(() => {
        const foundUser = AUTHORIZED_USERS.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (!foundUser) {
          reject(new Error('El correo electrónico no está registrado o no tiene acceso administrativo.'));
          return;
        }

        if (foundUser.password !== password) {
          reject(new Error('La contraseña ingresada es incorrecta.'));
          return;
        }

        // Exclude the password before saving to state and localStorage
        const { password: _, ...userSession } = foundUser;
        setUser(userSession);
        localStorage.setItem('a5_admin_session', JSON.stringify(userSession));
        resolve(userSession);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('a5_admin_session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
