import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Verify token with backend only if not a local fallback session
        if (token && !token.startsWith('local_')) {
          verifyToken(token);
        }
      } catch (e) {
        console.error('Error parsing session data', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      // If network fails (e.g. on Vercel without local backend), maintain session
      console.warn('Backend unavailable, maintaining local session:', error.message);
    }
  };

  const login = async (email, password, imapPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      // If IMAP password provided, update user record
      if (imapPassword) {
        try {
          await fetch(`${API_URL}/auth/update-imap`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({ imapPassword })
          });
        } catch (error) {
          console.error('Failed to update IMAP password:', error);
        }
      }

      return data.user;
    } catch (error) {
      // Fallback for Vercel / server offline (avoids "Failed to fetch" breaking login)
      const isNetworkError = error.name === 'TypeError' ||
                             (error.message && error.message.includes('Failed to fetch')) ||
                             (error.message && error.message.includes('NetworkError')) ||
                             (error.message && error.message.includes('network'));

      if (isNetworkError) {
        const found = AUTHORIZED_USERS.find(
          u => u.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (found) {
          if (found.password === password) {
            const { password: _, ...userProfile } = found;
            const fallbackToken = `local_${Date.now()}`;
            localStorage.setItem('token', fallbackToken);
            localStorage.setItem('user', JSON.stringify(userProfile));
            setUser(userProfile);
            return userProfile;
          } else {
            throw new Error('La contraseña ingresada es incorrecta.');
          }
        } else {
          throw new Error('El correo electrónico no está registrado o no tiene acceso administrativo.');
        }
      }

      throw error;
    }
  };

  const register = async (email, password, name, imapPassword, role = 'user') => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, imapPassword, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
