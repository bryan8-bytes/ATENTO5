import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Intro from './pages/Intro';
import Home from './pages/Home';
import Login from './pages/Login';
import ManagerProfile from './pages/ManagerProfile';
import CorreoLogin from './pages/CorreoLogin';

const QuotationGenerator = React.lazy(() => import('./pages/QuotationGenerator'));
const PurchaseOrder = React.lazy(() => import('./pages/PurchaseOrder'));
const Correo = React.lazy(() => import('./pages/Correo'));
const LetterheadGenerator = React.lazy(() => import('./pages/LetterheadGenerator'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gerente-general" element={<ManagerProfile />} />
          <Route 
            path="/cotizador" 
            element={
              <ProtectedRoute>
                <React.Suspense fallback={<div className="page-suspense" />}>
                  <QuotationGenerator />
                </React.Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/purchase-order" 
            element={
              <ProtectedRoute>
                <React.Suspense fallback={<div className="page-suspense" />}>
                  <PurchaseOrder />
                </React.Suspense>
              </ProtectedRoute>
            } 
          />
          <Route path="/correo-login" element={<CorreoLogin />} />
          <Route
            path="/hoja-membretada"
            element={
              <ProtectedRoute>
                <React.Suspense fallback={<div className="page-suspense" />}>
                  <LetterheadGenerator />
                </React.Suspense>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/correo" 
            element={
              <ProtectedRoute>
                <React.Suspense fallback={<div className="page-suspense" />}>
                  <Correo />
                </React.Suspense>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
