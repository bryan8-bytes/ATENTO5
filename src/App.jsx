import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MailProvider } from './context/MailContext';
import ProtectedRoute from './components/ProtectedRoute';
import Intro from './pages/Intro';
import Home from './pages/Home';
import Login from './pages/Login';
import ManagerProfile from './pages/ManagerProfile';
import QuotationGenerator from './pages/QuotationGenerator';
import PurchaseOrder from './pages/PurchaseOrder';
import EmailLauncher from './pages/EmailLauncher';
import Correo from './pages/Correo';
import CorreoLogin from './pages/CorreoLogin';

function App() {
  return (
    <AuthProvider>
      <MailProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/correo-login" element={<CorreoLogin />} />
            <Route path="/gerente-general" element={<ManagerProfile />} />
            <Route 
              path="/cotizador" 
              element={
                <ProtectedRoute>
                  <QuotationGenerator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/purchase-order" 
              element={
                <ProtectedRoute>
                  <PurchaseOrder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/email" 
              element={
                <ProtectedRoute>
                  <EmailLauncher />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/correo" 
              element={
                <ProtectedRoute>
                  <Correo />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </MailProvider>
    </AuthProvider>
  );
}

export default App;
