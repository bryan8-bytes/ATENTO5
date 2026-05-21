import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3CB4FF',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(60, 180, 255, 0.1)',
            borderTopColor: '#3CB4FF',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: '500' }}>Verificando credenciales...</span>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  if (!user) {
    // Save the visited path so we can redirect back after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
