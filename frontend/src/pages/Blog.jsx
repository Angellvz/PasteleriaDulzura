import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

const Blog = () => {
  const { data: articulos = [], isLoading } = useQuery({
    queryKey: ['blog-list'],
    queryFn: async () => {
      const res = await api.get('/blog?publicadoOnly=true');
      return res.data;
    }
  });

  const { data: contacto } = useQuery({
    queryKey: ['contacto-info'],
    queryFn: async () => {
      const res = await api.get('/contacto');
      return res.data;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-dulzura-cream">
      <Header />

      <main className="flex-grow py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dulzura-rose border border-dulzura-pink/30 text-dulzura-chocolate text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-4 h-4 text-dulzura-pink" />
            <span>El Rincón Dulce</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dulzura-chocolate">
            Blog de Pastelería & Panadería
          </h1>
          <p className="text-dulzura-chocolate/75 text-base sm:text-lg mt-3 leading-relaxed">
            Descubre recetas, consejos de repostería, tendencias en eventos y secretos para elegir la torta perfecta.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-dulzura-pink"></div>
            <p className="mt-3 text-sm text-dulzura-chocolate/70">Cargando publicaciones...</p>
          </div>
        ) : articulos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dulzura-rose/50 p-8">
            <p className="font-serif text-2xl font-bold text-dulzura-chocolate">Próximamente nuevas historias</p>
            <p className="text-dulzura-chocolate/60 text-sm mt-2">Estamos preparando deliciosos artículos para ti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articulos.map((art) => (
              <article key={art.id} className="bg-white rounded-3xl overflow-hidden border border-dulzura-rose/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1">
                <div className="h-56 overflow-hidden">
                  <img
                    src={art.imagenUrl}
                    alt={art.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-dulzura-chocolate/60 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-dulzura-pink" />
                        {new Date(art.createdAt).toLocaleDateString('es-PE')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-dulzura-pink" />
                        {art.autor}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-dulzura-chocolate hover:text-dulzura-pink transition-colors line-clamp-2">
                      <Link to={`/blog/${art.slug}`}>{art.titulo}</Link>
                    </h2>
                    <p className="text-dulzura-chocolate/75 text-sm mt-2 line-clamp-3 leading-relaxed">
                      {art.resumenCorto}
                    </p>
                  </div>
                  <Link
                    to={`/blog/${art.slug}`}
                    className="inline-flex items-center gap-1.5 text-dulzura-chocolate font-bold text-xs hover:text-dulzura-pink transition-colors pt-2 border-t border-dulzura-rose/30"
                  >
                    <span>Leer Artículo Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </main>

      <Footer contacto={contacto} />
    </div>
  );
};

export default Blog;
