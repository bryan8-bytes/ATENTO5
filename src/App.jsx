import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Intro from './pages/Intro';
import Home from './pages/Home';
import Login from './pages/Login';
import ManagerProfile from './pages/ManagerProfile';
import QuotationGenerator from './pages/QuotationGenerator';
import PurchaseOrder from './pages/PurchaseOrder';
import EmailLauncher from './pages/EmailLauncher';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;