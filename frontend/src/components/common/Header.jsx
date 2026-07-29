import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, PhoneCall, Menu, X, MapPin, Phone, Cake } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { openCart, totalItemsCount } = useCart();

  // Consulta dinámica de datos de contacto desde el CRUD del admin
  const { data: contacto } = useQuery({
    queryKey: ['contacto-header'],
    queryFn: async () => {
      try {
        const res = await api.get('/contacto');
        return res.data;
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5
  });

  const direccion = contacto?.direccion || 'Av. Cayma 456, Arequipa';
  const rawTel = contacto?.telefonoWhatsapp || '51987654321';
  const cleanTel = rawTel.replace(/\D/g, '') || '51987654321';
  const displayTel = rawTel.startsWith('+') ? rawTel : `+${rawTel}`;
  
  let redes = { facebook: 'https://facebook.com/pasteleriadulzura', instagram: 'https://instagram.com/pasteleriadulzura' };
  if (contacto?.redesSociales) {
    try {
      const parsed = typeof contacto.redesSociales === 'string' ? JSON.parse(contacto.redesSociales) : contacto.redesSociales;
      if (parsed.facebook) redes.facebook = parsed.facebook;
      if (parsed.instagram) redes.instagram = parsed.instagram;
    } catch (e) {}
  }

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
      
      {/* Barra Superior Animada Marquee Carrusel (Con datos dinámicos del CRUD) */}
      <div className="bg-dulzura-darkChoco text-dulzura-cream text-[11px] sm:text-xs py-1.5 overflow-hidden border-b border-white/10 select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          
          {/* Ticker Content 1 */}
          <span className="inline-flex items-center gap-1.5 text-dulzura-rose font-medium">
            <MapPin className="w-3.5 h-3.5 text-dulzura-pink shrink-0" />
            <span>{direccion}</span>
          </span>
          <span className="text-white/30">•</span>
          <a href={`https://wa.me/${cleanTel}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-dulzura-pink transition-colors font-semibold">
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>WhatsApp: {displayTel}</span>
          </a>
          <span className="text-white/30">•</span>
          <span className="inline-flex items-center gap-1.5 text-amber-200">
            <Cake className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Tortas Personalizadas & Bocaditos por Mayor</span>
          </span>
          <span className="text-white/30">•</span>
          <span className="inline-flex items-center gap-1.5 text-dulzura-rose">
            <span>🛵 Delivery en Cayma, Yanahuara y todo Arequipa</span>
          </span>
          <span className="text-white/30">•</span>
          <div className="inline-flex items-center gap-2">
            <span className="text-dulzura-pink/80 font-bold">Síguenos:</span>
            {redes.facebook && <a href={redes.facebook} target="_blank" rel="noreferrer" className="hover:text-dulzura-pink transition-colors">Facebook</a>}
            {redes.instagram && <a href={redes.instagram} target="_blank" rel="noreferrer" className="hover:text-dulzura-pink transition-colors">Instagram</a>}
          </div>
          <span className="text-white/30">•</span>

          {/* Ticker Content Duplicado para Bucle Infinito Perfecto */}
          <span className="inline-flex items-center gap-1.5 text-dulzura-rose font-medium">
            <MapPin className="w-3.5 h-3.5 text-dulzura-pink shrink-0" />
            <span>{direccion}</span>
          </span>
          <span className="text-white/30">•</span>
          <a href={`https://wa.me/${cleanTel}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-dulzura-pink transition-colors font-semibold">
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>WhatsApp: {displayTel}</span>
          </a>
          <span className="text-white/30">•</span>
          <span className="inline-flex items-center gap-1.5 text-amber-200">
            <Cake className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Tortas Personalizadas & Bocaditos por Mayor</span>
          </span>
          <span className="text-white/30">•</span>
          <span className="inline-flex items-center gap-1.5 text-dulzura-rose">
            <span>🛵 Delivery en Cayma, Yanahuara y todo Arequipa</span>
          </span>
          <span className="text-white/30">•</span>
          <div className="inline-flex items-center gap-2">
            <span className="text-dulzura-pink/80 font-bold">Síguenos:</span>
            {redes.facebook && <a href={redes.facebook} target="_blank" rel="noreferrer" className="hover:text-dulzura-pink transition-colors">Facebook</a>}
            {redes.instagram && <a href={redes.instagram} target="_blank" rel="noreferrer" className="hover:text-dulzura-pink transition-colors">Instagram</a>}
          </div>
          <span className="text-white/30">•</span>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 md:h-28 lg:h-32 py-1.5">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group py-1 shrink-0">
            <img 
              src="/images/logo.png" 
              alt="Pastelería Dulzura Arequipa" 
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
            />
          </Link>

          {/* Desktop Nav con Subtítulos e Indicador Animado */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-semibold transition-all group ${
                  isActive(link.path)
                    ? 'text-dulzura-darkChoco font-bold'
                    : 'text-dulzura-chocolate/80 hover:text-dulzura-chocolate'
                }`}
              >
                <span>{link.name}</span>
                {/* Línea animada inferior al hacer hover o estar activo */}
                <span 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full bg-dulzura-pink transition-all duration-300 ${
                    isActive(link.path) ? 'w-3/4' : 'w-0 group-hover:w-2/3'
                  }`} 
                />
              </Link>
            ))}
          </nav>

          {/* Contact CTA & Cart button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative px-4 py-2 rounded-full bg-dulzura-rose/50 hover:bg-dulzura-rose border border-dulzura-pink/40 text-dulzura-chocolate text-sm font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-95 hover:scale-105"
              title="Ver Carrito de Pedidos"
            >
              <ShoppingBag className="w-4 h-4 text-dulzura-chocolate" />
              <span>Carrito</span>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-dulzura-chocolate text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dulzura-chocolate text-white text-sm font-medium hover:bg-dulzura-darkChoco shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
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
              aria-label="Ver Carrito"
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
              className="p-2.5 rounded-2xl bg-dulzura-rose/40 text-dulzura-chocolate hover:bg-dulzura-rose transition-colors"
              aria-label="Menú principal"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden bg-dulzura-cream border-b border-dulzura-rose/50 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-2xl text-base font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-dulzura-chocolate text-white shadow-xs'
                    : 'text-dulzura-chocolate hover:bg-dulzura-rose/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-dulzura-rose/40 space-y-2">
            <Link
              to="/contacto"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-dulzura-chocolate text-white text-center font-bold flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <PhoneCall className="w-4 h-4 text-dulzura-pink" />
              <span>Pedidos por Mayor</span>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
