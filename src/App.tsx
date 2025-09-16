import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import Footer from './components/layout/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rutas protegidas de administración */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Agregar más rutas protegidas */}
          {/* <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminProducts />
              </ProtectedRoute>
            } 
          /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;