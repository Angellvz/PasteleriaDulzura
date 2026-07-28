import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CategoryFilter from '../components/public/CategoryFilter';
import ProductCard from '../components/public/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const Productos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaQuery = searchParams.get('categoria') || '';
  const [busqueda, setBusqueda] = useState('');

  // Fetch Categorías
  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias-list'],
    queryFn: async () => {
      const res = await api.get('/categorias?soloActivas=true');
      return res.data;
    }
  });

  // Fetch Productos
  const { data: productos = [], isLoading } = useQuery({
    queryKey: ['productos-list', categoriaQuery, busqueda],
    queryFn: async () => {
      let url = '/productos?';
      if (categoriaQuery) url += `categoriaSlug=${categoriaQuery}&`;
      if (busqueda) url += `q=${encodeURIComponent(busqueda)}&`;
      const res = await api.get(url);
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

  const handleSelectCategoria = (slug) => {
    if (slug) {
      setSearchParams({ categoria: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dulzura-cream">
      <Header />

      <main className="flex-grow py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Banner de Título */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dulzura-chocolate">
            Nuestro Catálogo Artesanal
          </h1>
          <p className="text-dulzura-chocolate/75 text-base sm:text-lg mt-3 leading-relaxed">
            Descubre nuestras tortas finas, postres individuales, bocaditos por mayor para eventos y pan recién horneado. Haz tu pedido directo a nuestro WhatsApp.
          </p>
        </div>

        {/* Buscador */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dulzura-chocolate/40" />
            <input
              type="text"
              placeholder="Buscar por nombre (ej. Selva Negra, Alfajores, ciabatta)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-dulzura-rose/60 focus:border-dulzura-pink focus:ring-2 focus:ring-dulzura-pink/20 outline-none text-dulzura-chocolate shadow-sm"
            />
          </div>
        </div>

        {/* Categorías Filter */}
        <CategoryFilter
          categorias={categorias}
          categoriaSeleccionada={categoriaQuery}
          onSelectCategoria={handleSelectCategoria}
        />

        {/* Listado de Productos */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-dulzura-pink"></div>
            <p className="mt-3 text-sm text-dulzura-chocolate/70">Cargando delicias...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dulzura-rose/50 my-8 p-8">
            <p className="font-serif text-2xl font-bold text-dulzura-chocolate">No encontramos productos en esta sección</p>
            <p className="text-dulzura-chocolate/60 text-sm mt-2">Prueba con otra palabra de búsqueda o categoría.</p>
            <button
              onClick={() => { setBusqueda(''); handleSelectCategoria(''); }}
              className="mt-4 px-6 py-2.5 rounded-full bg-dulzura-rose text-dulzura-chocolate font-bold text-xs"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-8">
            {productos.map((prod) => (
              <ProductCard key={prod.id} producto={prod} contacto={contacto} />
            ))}
          </div>
        )}

      </main>

      <Footer contacto={contacto} />
    </div>
  );
};

export default Productos;
