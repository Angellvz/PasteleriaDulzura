import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { solicitarPedidoWhatsApp } from '../services/pedido';
import { useCart } from '../context/CartContext';
import { MessageCircle, ArrowLeft, Sparkles, ShieldCheck, Clock, CheckCircle, AlertCircle, ShoppingBag, Plus, Minus } from 'lucide-react';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState('');
  const { addToCart, openCart } = useCart();

  const { data: producto, isLoading, error } = useQuery({
    queryKey: ['producto-detalle', id],
    queryFn: async () => {
      const res = await api.get(`/productos/${id}`);
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

  if (error || !producto) {
    return (
      <div className="min-h-screen flex flex-col bg-dulzura-cream">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <AlertCircle className="w-16 h-16 text-dulzura-pink mb-4" />
          <h2 className="font-serif text-3xl font-bold text-dulzura-chocolate">Producto No Encontrado</h2>
          <p className="text-dulzura-chocolate/70 mt-2">El producto que buscas no existe o ha sido retirado.</p>
          <Link to="/productos" className="mt-6 px-6 py-3 rounded-full bg-dulzura-chocolate text-white font-bold text-sm">
            Volver al Catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePedir = () => {
    solicitarPedidoWhatsApp(
      producto,
      contacto?.mensajePlantillaWhatsapp,
      contacto?.telefonoWhatsapp
    );
  };

  const handleAddToCart = () => {
    addToCart(producto, cantidad, notas);
    openCart();
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": producto.nombre,
    "image": [producto.imagenUrl],
    "description": producto.descripcion,
    "brand": {
      "@type": "Brand",
      "name": "Pastelería Dulzura Arequipa"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "PEN",
      "price": producto.precio,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": producto.disponible ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Pastelería Dulzura Arequipa"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dulzura-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Header />

      <main className="flex-grow py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Volver */}
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 text-dulzura-chocolate/70 hover:text-dulzura-chocolate font-semibold text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-dulzura-rose/50 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Imagen del producto */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-dulzura-rose/40 aspect-square">
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
                className={`w-full h-full object-cover ${!producto.disponible ? 'grayscale opacity-75' : ''}`}
              />
              {producto.destacado && (
                <div className="absolute top-4 left-4 bg-dulzura-pink text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Favorito de la Casa</span>
                </div>
              )}
            </div>
          </div>

          {/* Información del Producto */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              {producto.categoria && (
                <span className="text-xs font-bold uppercase tracking-wider text-dulzura-pink bg-dulzura-rose/50 px-3 py-1 rounded-full">
                  {producto.categoria.nombre}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-dulzura-chocolate mt-3">
                {producto.nombre}
              </h1>
            </div>

            {/* Disponibilidad */}
            <div className="flex items-center gap-2">
              {producto.disponible ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                  Disponible para pedido hoy en Arequipa
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  <AlertCircle className="w-4 h-4" />
                  Agotado temporalmente
                </span>
              )}
            </div>

            {/* Precios */}
            <div className="p-6 rounded-2xl bg-dulzura-warmGray border border-dulzura-rose/30 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-dulzura-chocolate/70">Precio por Menor:</span>
                <span className="font-serif text-3xl font-bold text-dulzura-chocolate">
                  S/ {producto.precio.toFixed(2)}
                </span>
              </div>
              {producto.precioMayor && (
                <div className="flex items-baseline justify-between pt-2 border-t border-dulzura-rose/20">
                  <span className="text-sm font-semibold text-emerald-700">Precio por Mayor (Eventos/Pedidos grandes):</span>
                  <span className="font-serif text-xl font-bold text-emerald-700">
                    S/ {producto.precioMayor.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <h3 className="font-serif text-lg font-bold text-dulzura-chocolate mb-2">Descripción del Producto</h3>
              <p className="text-dulzura-chocolate/80 text-base leading-relaxed whitespace-pre-line">
                {producto.descripcion}
              </p>
            </div>

            {/* Controles de Cantidad y Notas */}
            {producto.disponible && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold uppercase text-dulzura-chocolate">Cantidad:</label>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="px-3 py-2 text-dulzura-chocolate hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-sm font-bold text-dulzura-chocolate">{cantidad}</span>
                    <button
                      onClick={() => setCantidad(cantidad + 1)}
                      className="px-3 py-2 text-dulzura-chocolate hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-dulzura-chocolate ml-auto">
                    Subtotal: S/ {(producto.precio * cantidad).toFixed(2)}
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Instrucciones especiales o dedicatoria opcional..."
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-dulzura-pink"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!producto.disponible}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  producto.disponible
                    ? 'bg-dulzura-rose/70 hover:bg-dulzura-rose border border-dulzura-pink/40 text-dulzura-darkChoco active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <ShoppingBag className="w-5 h-5 text-dulzura-chocolate" />
                <span>Agregar a Canastilla</span>
              </button>

              <button
                onClick={handlePedir}
                disabled={!producto.disponible}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  producto.disponible
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{producto.disponible ? 'Pedir por WhatsApp' : 'Producto Agotado'}</span>
              </button>
            </div>

            {/* Garantía */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-dulzura-rose/30 text-xs text-dulzura-chocolate/75">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-dulzura-pink shrink-0" />
                <span>Elaborado el mismo día de entrega</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-dulzura-pink shrink-0" />
                <span>Delivery a todo Arequipa con coordinación previa</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer contacto={contacto} />
    </div>
  );
};

export default ProductoDetalle;
