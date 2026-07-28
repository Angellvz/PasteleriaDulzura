import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, Tag, Eye, ShoppingBag } from 'lucide-react';
import { solicitarPedidoWhatsApp } from '../../services/pedido';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ producto, contacto }) => {
  const { addToCart } = useCart();

  const handlePedir = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!producto.disponible) return;
    solicitarPedidoWhatsApp(
      producto,
      contacto?.mensajePlantillaWhatsapp,
      contacto?.telefonoWhatsapp
    );
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!producto.disponible) return;
    addToCart(producto, 1);
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-dulzura-rose/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      
      {/* Contenedor de Imagen */}
      <div className="relative h-56 w-full overflow-hidden bg-dulzura-warmGray">
        <img
          src={producto.imagenUrl}
          alt={producto.nombre}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !producto.disponible ? 'grayscale opacity-75' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {producto.categoria && (
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-dulzura-chocolate text-xs font-bold rounded-full shadow-sm border border-white/40">
              {producto.categoria.nombre}
            </span>
          )}
          {producto.destacado && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-dulzura-pink text-white text-xs font-bold rounded-full shadow-md">
              <Sparkles className="w-3 h-3" />
              Favorito
            </span>
          )}
        </div>

        {/* Badge Agotado */}
        {!producto.disponible && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-sm shadow-lg tracking-wider uppercase">
              Agotado
            </span>
          </div>
        )}

        {/* Quick view button */}
        <Link
          to={`/producto/${producto.id}`}
          className="absolute bottom-3 right-3 p-2.5 bg-white/90 hover:bg-white text-dulzura-chocolate rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-2 group-hover:translate-y-0"
          title="Ver detalle del producto"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* Detalle del producto */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <Link to={`/producto/${producto.id}`}>
            <h3 className="font-serif text-xl font-bold text-dulzura-chocolate hover:text-dulzura-pink transition-colors line-clamp-1">
              {producto.nombre}
            </h3>
          </Link>
          <p className="text-dulzura-chocolate/70 text-sm mt-2 line-clamp-2 leading-relaxed">
            {producto.descripcion}
          </p>
        </div>

        <div className="pt-2 border-t border-dulzura-rose/30 space-y-3">
          {/* Precios */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-dulzura-chocolate/60 block">Precio por menor</span>
              <span className="font-serif text-2xl font-bold text-dulzura-chocolate">
                S/ {producto.precio.toFixed(2)}
              </span>
            </div>
            {producto.precioMayor && (
              <div className="text-right">
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  Por Mayor
                </span>
                <span className="font-serif text-lg font-bold text-emerald-700 block">
                  S/ {producto.precioMayor.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!producto.disponible}
              className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                producto.disponible
                  ? 'bg-dulzura-rose/60 hover:bg-dulzura-rose border border-dulzura-pink/40 text-dulzura-darkChoco active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Añadir a la Canastilla"
            >
              <ShoppingBag className="w-4 h-4 text-dulzura-chocolate" />
              <span>+ Canastilla</span>
            </button>

            <button
              onClick={handlePedir}
              disabled={!producto.disponible}
              className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                producto.disponible
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Pedir Ya</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
