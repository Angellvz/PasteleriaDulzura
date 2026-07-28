import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cake, ShoppingBag, BookOpen, HeartHandshake, PhoneCall, Menu, X, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { openCart, totalItemsCount } = useCart();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/productos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Contacto', path: '/contacto' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-dulzura-cream/95 backdrop-blur-md border-b border-dulzura-rose/50 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 md:h-28 lg:h-32 py-1.5">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group py-1 shrink-0">
            <img 
              src="/images/logo.png" 
              alt="Pastelería Dulzura Arequipa" 
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-dulzura-rose/60 text-dulzura-darkChoco font-semibold shadow-xs'
                    : 'text-dulzura-chocolate/80 hover:text-dulzura-chocolate hover:bg-dulzura-rose/30'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Contact CTA & Cart button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative px-4 py-2 rounded-full bg-dulzura-rose/50 hover:bg-dulzura-rose border border-dulzura-pink/40 text-dulzura-chocolate text-sm font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-95"
              title="Ver Canastilla de Pedidos"
            >
              <ShoppingBag className="w-4 h-4 text-dulzura-chocolate" />
              <span>Canastilla</span>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-dulzura-chocolate text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dulzura-chocolate text-white text-sm font-medium hover:bg-dulzura-darkChoco shadow-md hover:shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4 text-dulzura-pink" />
              <span>Pedidos por Mayor</span>
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-dulzura-chocolate text-white shadow-md active:scale-95"
              aria-label="Ver Canastilla"
            >
              <ShoppingBag className="w-5 h-5 text-dulzura-pink" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-dulzura-pink text-dulzura-chocolate text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-dulzura-chocolate hover:bg-dulzura-rose/40 focus:outline-none"
              aria-label="Abrir menú"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-dulzura-cream border-b border-dulzura-rose/50 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? 'bg-dulzura-rose text-dulzura-darkChoco font-semibold'
                  : 'text-dulzura-chocolate/80 hover:bg-dulzura-rose/30'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-dulzura-rose/40 flex flex-col gap-2">
            <Link
              to="/contacto"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-dulzura-chocolate text-white text-base font-medium shadow-sm"
            >
              Haz tu Pedido Vía WhatsApp
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
