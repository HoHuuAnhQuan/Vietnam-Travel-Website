import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProvincePage from './pages/ProvincePage';
import TourPage from './pages/TourPage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage'; 
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/province/:id" element={<ProvincePage />} />
      <Route path="/tour/:id" element={<TourPage />} /> 
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;