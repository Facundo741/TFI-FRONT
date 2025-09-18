import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CartPage from "./pages/CartPage";

// 🔹 Importar AuthProvider
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Página de productos para todos los usuarios */}
          <Route path="/products" element={<ProductsPage />} />

          {/* Página del carrito */}
          <Route path="/cart" element={<CartPage />} />

          {/* Rutas protegidas admin */}
          <Route element={<ProtectedRoute roleRequired="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
