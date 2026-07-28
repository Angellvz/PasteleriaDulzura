import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { solicitarPedidoWhatsApp } from '../../services/pedido';

const OfferCarousel = ({ ofertas, contacto }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!ofertas || ofertas.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ofertas.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ofertas]);

  if (!ofertas || ofertas.length === 0) return null;

  const current = ofertas[currentIndex];

  const handlePedidoOferta = (oferta) => {
    solicitarPedidoWhatsApp(
      { nombre: `OFERTA: ${oferta.titulo}`, precio: oferta.precioOferta || 0 },
      contacto?.mensajePlantillaWhatsapp,
      contacto?.telefonoWhatsapp
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dulzura-darkChoco via-dulzura-chocolate to-dulzura-darkChoco text-white shadow-xl my-8">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-dulzura-pink/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center min-h-[360px] p-8 md:p-12 gap-8">
        
        {/* Left Column: Text Info */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dulzura-pink/20 border border-dulzura-pink/40 text-dulzura-rose text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-dulzura-gold animate-pulse" />
            <span>Oferta Exclusiva de la Semana</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-dulzura-cream leading-tight">
            {current.titulo}
          </h2>

          <p className="text-dulzura-cream/80 text-base md:text-lg leading-relaxed">
            {current.descripcionCorta}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {current.porcentajeDescuento && (
              <span className="px-4 py-2 bg-dulzura-softRed text-white text-lg font-bold rounded-2xl shadow-sm">
                -{current.porcentajeDescuento}% OFF
              </span>
            )}

            {current.precioOferta && (
              <div className="flex flex-col">
                <span className="text-xs text-dulzura-cream/60">Precio Especial</span>
                <span className="text-3xl font-serif font-bold text-dulzura-rose">
                  S/ {current.precioOferta.toFixed(2)}
                </span>
              </div>
            )}

            <button
              onClick={() => handlePedidoOferta(current)}
              className="ml-auto md:ml-0 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Aprovechar por WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group">
          <img
            src={current.imagenUrl}
            alt={current.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

      </div>

      {/* Navigation Controls */}
      {ofertas.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + ofertas.length) % ofertas.length)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1 px-2">
            {ofertas.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-dulzura-pink' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % ofertas.length)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OfferCarousel;
