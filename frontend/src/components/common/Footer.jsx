import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Phone, MapPin, Clock, Mail, Instagram, Facebook, Heart } from 'lucide-react';

const Footer = ({ contacto }) => {
  const redes = contacto?.redesSociales ? (typeof contacto.redesSociales === 'string' ? JSON.parse(contacto.redesSociales) : contacto.redesSociales) : {};

  return (
    <footer className="bg-dulzura-chocolate text-dulzura-cream pt-16 pb-8 border-t-4 border-dulzura-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Columna 1: Marca & Eslogan */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/images/logo.png" 
                alt="Pastelería Dulzura Arequipa" 
                className="h-24 sm:h-32 w-auto object-contain hover:opacity-90 transition-opacity" 
              />
            </Link>
            <p className="text-dulzura-cream/80 text-sm leading-relaxed">
              Dedicados a endulzar tus momentos especiales con tortas artesanales, postres selectos, bocaditos por mayor para eventos y pan recién horneado cada mañana.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {redes.facebook && (
                <a href={redes.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-dulzura-pink rounded-full transition-colors">
                  <Facebook className="w-4 h-4 text-white" />
                </a>
              )}
              {redes.instagram && (
                <a href={redes.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-dulzura-pink rounded-full transition-colors">
                  <Instagram className="w-4 h-4 text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-dulzura-rose mb-4">Navegación</h3>
            <ul className="space-y-2.5 text-sm text-dulzura-cream/80">
              <li><Link to="/" className="hover:text-dulzura-pink transition-colors">Inicio & Ofertas</Link></li>
              <li><Link to="/productos" className="hover:text-dulzura-pink transition-colors">Catálogo de Productos</Link></li>
              <li><Link to="/blog" className="hover:text-dulzura-pink transition-colors">Blog Dulzura</Link></li>
              <li><Link to="/nosotros" className="hover:text-dulzura-pink transition-colors">Nuestra Historia</Link></li>
              <li><Link to="/contacto" className="hover:text-dulzura-pink transition-colors">Contacto & Ubicación</Link></li>
            </ul>
          </div>

          {/* Columna 3: Categorías Populares */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-dulzura-rose mb-4">Especialidades</h3>
            <ul className="space-y-2.5 text-sm text-dulzura-cream/80">
              <li><Link to="/productos?categoria=tortas" className="hover:text-dulzura-pink transition-colors">Tortas de Cumpleaños</Link></li>
              <li><Link to="/productos?categoria=postres" className="hover:text-dulzura-pink transition-colors">Postres Individuales</Link></li>
              <li><Link to="/productos?categoria=bocaditos" className="hover:text-dulzura-pink transition-colors">Bocaditos para Eventos</Link></li>
              <li><Link to="/productos?categoria=panes" className="hover:text-dulzura-pink transition-colors">Panes con Masa Madre</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-dulzura-rose mb-4">Visítanos & Pedidos</h3>
            <ul className="space-y-3 text-sm text-dulzura-cream/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-dulzura-pink shrink-0 mt-0.5" />
                <span>{contacto?.direccion || 'Av. Cayma 456, Cayma, Arequipa'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-dulzura-pink shrink-0" />
                <span>WhatsApp: +{contacto?.telefonoWhatsapp || '51987654321'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-dulzura-pink shrink-0 mt-0.5" />
                <span>{contacto?.horarios || 'Lun-Sáb 8am-8pm | Dom 9am-3pm'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-dulzura-cream/60 gap-4 border-t border-white/10 mt-8">
          <p>© {new Date().getFullYear()} Pastelería Dulzura. Todos los derechos reservados.</p>
          <p>
            Hecho por{' '}
            <a
              href="https://venturadigital.net.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dulzura-cream/80 font-semibold hover:text-white hover:underline transition-colors"
            >
              VenturaDigital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
