import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import Home from './pages/Home';
import ManagerProfile from './pages/ManagerProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gerente-general" element={<ManagerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;