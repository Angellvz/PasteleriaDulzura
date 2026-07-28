import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';

const ArticuloDetalle = () => {
  const { slug } = useParams();

  const { data: articulo, isLoading, error } = useQuery({
    queryKey: ['articulo-detalle', slug],
    queryFn: async () => {
      const res = await api.get(`/blog/${slug}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-dulzura-cream">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dulzura-pink"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !articulo) {
    return (
      <div className="min-h-screen flex flex-col bg-dulzura-cream">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <h2 className="font-serif text-3xl font-bold text-dulzura-chocolate">Artículo no encontrado</h2>
          <Link to="/blog" className="mt-4 px-6 py-2.5 rounded-full bg-dulzura-chocolate text-white font-bold text-sm">
            Volver al Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dulzura-cream">
      <Header />

      <main className="flex-grow py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-dulzura-chocolate/70 hover:text-dulzura-chocolate font-semibold text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Blog</span>
        </Link>

        <article className="bg-white rounded-3xl p-8 md:p-12 border border-dulzura-rose/50 shadow-xl space-y-8">
          
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-dulzura-chocolate/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-dulzura-pink" />
                {new Date(articulo.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-dulzura-pink" />
                Por {articulo.autor}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-dulzura-chocolate leading-tight">
              {articulo.titulo}
            </h1>

            <p className="text-dulzura-chocolate/80 text-lg font-serif italic max-w-2xl mx-auto">
              "{articulo.resumenCorto}"
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden h-72 sm:h-96 border border-dulzura-rose/40 shadow-md">
            <img
              src={articulo.imagenUrl}
              alt={articulo.titulo}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenido del Artículo */}
          <div className="prose prose-lg max-w-none text-dulzura-chocolate leading-relaxed whitespace-pre-line space-y-4 pt-4 border-t border-dulzura-rose/30">
            {articulo.contenido}
          </div>

          {/* CTA Footer del artículo */}
          <div className="pt-8 border-t border-dulzura-rose/40 bg-dulzura-warmGray rounded-2xl p-6 text-center space-y-3">
            <h3 className="font-serif text-xl font-bold text-dulzura-chocolate">¿Te tentaste con algo dulce?</h3>
            <p className="text-dulzura-chocolate/70 text-sm">Explora nuestro catálogo completo y realiza tu pedido directo por WhatsApp.</p>
            <Link
              to="/productos"
              className="inline-block px-8 py-3 rounded-full bg-dulzura-chocolate text-white font-bold text-sm shadow-md hover:bg-dulzura-darkChoco transition-all"
            >
              Ver Catálogo de Productos
            </Link>
          </div>

        </article>

      </main>

      <Footer contacto={contacto} />
    </div>
  );
};

export default ArticuloDetalle;
