import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Cake,
  Package,
  Tags,
  Sparkles,
  FileText,
  PhoneCall,
  LogOut,
  Menu,
  X,
  UserCheck,
  ExternalLink
} from 'lucide-react';

const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Productos', path: '/admin/productos', icon: Package },
    { name: 'Categorías', path: '/admin/categorias', icon: Tags },
    { name: 'Ofertas', path: '/admin/ofertas', icon: Sparkles },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Datos de Contacto', path: '/admin/contacto', icon: PhoneCall }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dulzura-warmGray flex">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-dulzura-darkChoco text-white border-r border-white/10 shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dulzura-pink flex items-center justify-center shadow-md">
            <Cake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-dulzura-cream">Panel Dulzura</h1>
            <span className="text-xs text-dulzura-pink font-medium">Administrador</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-dulzura-pink text-white shadow-md'
                    : 'text-dulzura-cream/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-dulzura-cream/80 hover:bg-white/10 transition-colors"
          >
            <span>Ver Sitio Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-dulzura-rose/50 h-16 px-3 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-dulzura-chocolate hover:bg-dulzura-rose/30 rounded-lg shrink-0"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-sm sm:text-lg md:text-xl font-bold text-dulzura-chocolate truncate min-w-0 leading-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-dulzura-rose/40 rounded-full text-[11px] sm:text-xs font-medium text-dulzura-chocolate">
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-dulzura-pink shrink-0" />
              <span className="truncate max-w-[80px] sm:max-w-none">Hola, <strong>{user?.usuario || 'Admin'}</strong></span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative flex-1 max-w-xs w-full bg-dulzura-darkChoco text-white p-6 flex flex-col justify-between z-10 animate-fade-in">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Cake className="w-6 h-6 text-dulzura-pink" />
                    <span className="font-serif text-lg font-bold">Admin Dulzura</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="mt-6 space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                          active ? 'bg-dulzura-pink text-white' : 'text-dulzura-cream/80 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/20"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
