import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/public/CartDrawer';
import WhatsAppWidget from './components/common/WhatsAppWidget';
import PrivateRoute from './routes/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Blog from './pages/Blog';
import ArticuloDetalle from './pages/ArticuloDetalle';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';

// Admin Pages
import Login from './pages/admin/Login';
import DashboardProductos from './pages/admin/DashboardProductos';
import DashboardCategorias from './pages/admin/DashboardCategorias';
import DashboardOfertas from './pages/admin/DashboardOfertas';
import DashboardBlog from './pages/admin/DashboardBlog';
import DashboardContacto from './pages/admin/DashboardContacto';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <CartDrawer />
            <WhatsAppWidget />
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<ArticuloDetalle />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />

              {/* Login Admin */}
              <Route path="/admin/login" element={<Login />} />

              {/* Rutas Privadas /admin/* */}
              <Route element={<PrivateRoute />}>
                <Route path="/admin" element={<DashboardProductos />} />
                <Route path="/admin/productos" element={<DashboardProductos />} />
                <Route path="/admin/categorias" element={<DashboardCategorias />} />
                <Route path="/admin/ofertas" element={<DashboardOfertas />} />
                <Route path="/admin/blog" element={<DashboardBlog />} />
                <Route path="/admin/contacto" element={<DashboardContacto />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
