import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import OfferCarousel from '../components/public/OfferCarousel';
import ProductCard from '../components/public/ProductCard';
import CategoryIcon from '../components/common/CategoryIcon';
import {
  Cake,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  MessageCircle,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';

const Home = () => {
  // Fetch Ofertas
  const { data: ofertas = [] } = useQuery({
    queryKey: ['ofertas-home'],
    queryFn: async () => {
      const res = await api.get('/ofertas?soloActivas=true');
      return res.data;
    }
  });

  // Fetch Categorías
  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias-home'],
    queryFn: async () => {
      const res = await api.get('/categorias?soloActivas=true');
      return res.data;
    }
  });

  // Fetch Productos Destacados
  const { data: productosDestacados = [] } = useQuery({
    queryKey: ['productos-destacados'],
    queryFn: async () => {
      const res = await api.get('/productos?destacado=true');
      return res.data;
    }
  });

  // Fetch Blog
  const { data: articulos = [] } = useQuery({
    queryKey: ['blog-home'],
    queryFn: async () => {
      const res = await api.get('/blog?publicadoOnly=true');
      return res.data;
    }
  });

  // Fetch Contacto
  const { data: contacto } = useQuery({
    queryKey: ['contacto-info'],
    queryFn: async () => {
      const res = await api.get('/contacto');
      return res.data;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-dulzura-cream font-sans">
      <Header />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-b from-dulzura-rose/30 via-dulzura-cream to-dulzura-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Text content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dulzura-rose border border-dulzura-pink/30 text-dulzura-chocolate text-xs font-bold tracking-wider uppercase shadow-xs">
                  <Cake className="w-4 h-4 text-dulzura-pink" />
                  <span>Pastelería Artesanal en Arequipa</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-dulzura-chocolate leading-tight">
                  Pasteles & Postres horneados con <span className="text-dulzura-pink underline decoration-dulzura-rose underline-offset-8">amor puro</span>
                </h1>

                <p className="text-dulzura-chocolate/80 text-lg md:text-xl leading-relaxed max-w-2xl">
                  Tortas personalizadas para tus eventos, postres individuales irresistibles, bocaditos por mayor para reuniones y delivery a todos los distritos de Arequipa.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    to="/productos"
                    className="px-8 py-4 rounded-full bg-dulzura-chocolate hover:bg-dulzura-darkChoco text-white font-semibold text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <span>Explorar Catálogo</span>
                    <ArrowRight className="w-5 h-5 text-dulzura-pink" />
                  </Link>
                  <Link
                    to="/contacto"
                    className="px-8 py-4 rounded-full bg-white hover:bg-dulzura-rose/30 text-dulzura-chocolate font-semibold text-base border-2 border-dulzura-rose shadow-md transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    <span>Pedidos por Mayor</span>
                  </Link>
                </div>

                {/* Features badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-dulzura-rose/50">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-dulzura-pink shrink-0" />
                    <span className="text-xs font-medium text-dulzura-chocolate">Ingredientes 100% Naturales</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-dulzura-pink shrink-0" />
                    <span className="text-xs font-medium text-dulzura-chocolate">Delivery en Todo Arequipa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="w-6 h-6 text-dulzura-pink shrink-0" />
                    <span className="text-xs font-medium text-dulzura-chocolate">Atención Personalizada</span>
                  </div>
                </div>
              </div>

              {/* Hero Image Collage (Primero en móvil para alto impacto visual) */}
              <div className="lg:col-span-5 relative order-first lg:order-last">
                <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-square group">
                    <img
                      src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop"
                      alt="Torta Selva Negra Pastelería Dulzura Arequipa"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 text-white p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 sm:hidden">
                      <span className="text-xs font-bold block">✨ Repostería Fina & Artesanal</span>
                      <span className="text-[10px] text-white/90">Cayma, Yanahuara y todo Arequipa</span>
                    </div>
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-dulzura-rose flex items-center gap-3 max-w-[240px] sm:max-w-xs shadow-pink-200/50">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-dulzura-rose flex items-center justify-center shrink-0">
                      <Cake className="w-5 h-5 sm:w-6 sm:h-6 text-dulzura-chocolate" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dulzura-chocolate">+1,500 Clientes Felices</p>
                      <p className="text-[10px] sm:text-[11px] text-dulzura-chocolate/70">Tortas finas en Arequipa</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 1. SECCIÓN: OFERTAS ACTIVAS */}
        {ofertas.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <OfferCarousel ofertas={ofertas} contacto={contacto} />
          </section>
        )}

        {/* 2. SECCIÓN: CATEGORÍAS DESTACADAS CON ÍCONOS */}
        <section className="py-16 bg-white border-y border-dulzura-rose/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-widest text-dulzura-pink uppercase">Explora por Especialidad</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dulzura-chocolate mt-2">
                Nuestras Categorías Principales
              </h2>
              <p className="text-dulzura-chocolate/70 mt-3 text-base">
                Selecciona la categoría que deseas y descubre toda nuestra variedad de creaciones recién horneadas.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categorias.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/productos?categoria=${cat.slug}`}
                  className="group p-8 rounded-3xl bg-dulzura-warmGray hover:bg-dulzura-rose/40 border border-dulzura-rose/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white group-hover:bg-dulzura-chocolate text-dulzura-chocolate group-hover:text-white flex items-center justify-center shadow-md transition-colors duration-300 mb-4">
                    <CategoryIcon name={cat.icono || cat.slug} className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-dulzura-chocolate group-hover:text-dulzura-darkChoco">
                    {cat.nombre}
                  </h3>
                  <span className="text-xs text-dulzura-pink font-semibold mt-2 group-hover:underline">
                    Ver Productos →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. SECCIÓN: PRODUCTOS DESTACADOS */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-dulzura-pink uppercase">Las Favoritas de Arequipa</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dulzura-chocolate mt-2">
                Productos Destacados
              </h2>
            </div>
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 text-dulzura-chocolate font-bold text-sm hover:text-dulzura-pink transition-colors"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productosDestacados.map((prod) => (
              <ProductCard key={prod.id} producto={prod} contacto={contacto} />
            ))}
          </div>
        </section>

        {/* 4. SECCIÓN: BLOG */}
        {articulos.length > 0 && (
          <section className="py-20 bg-dulzura-warmGray border-t border-dulzura-rose/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold tracking-widest text-dulzura-pink uppercase">Secretos de Pastelería</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dulzura-chocolate mt-2">
                    Últimas Publicaciones del Blog
                  </h2>
                </div>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-dulzura-chocolate font-bold text-sm hover:text-dulzura-pink transition-colors"
                >
                  <span>Ir al Blog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articulos.slice(0, 3).map((art) => (
                  <article key={art.id} className="bg-white rounded-3xl overflow-hidden border border-dulzura-rose/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                    <img src={art.imagenUrl} alt={art.titulo} className="h-48 w-full object-cover" />
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-dulzura-chocolate hover:text-dulzura-pink transition-colors">
                          <Link to={`/blog/${art.slug}`}>{art.titulo}</Link>
                        </h3>
                        <p className="text-dulzura-chocolate/70 text-sm mt-2 line-clamp-2">
                          {art.resumenCorto}
                        </p>
                      </div>
                      <Link to={`/blog/${art.slug}`} className="text-xs font-bold text-dulzura-pink hover:underline">
                        Leer Artículo Completo →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer contacto={contacto} />
    </div>
  );
};

export default Home;
