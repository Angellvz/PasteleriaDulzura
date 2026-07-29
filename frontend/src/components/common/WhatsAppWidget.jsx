import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Cake, ShoppingBag, Clock, Send, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const WhatsAppIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const WhatsAppWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  // No mostrar el botón de WhatsApp en la administración
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const { data: contacto } = useQuery({
    queryKey: ['public-contacto-widget'],
    queryFn: async () => {
      try {
        const res = await api.get('/contacto');
        return res.data;
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 10
  });

  const telefonoWsp = contacto?.telefonoWhatsapp || '51987654321';

  const sendWspMessage = (text) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${telefonoWsp}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  const options = [
    {
      icon: Cake,
      title: 'Tortas Personalizadas',
      desc: 'Cotizar diseño, temática y sabores especiales',
      msg: 'Hola Pastelería Dulzura, quisiera cotizar una Torta Personalizada para un evento especial 🎂✨'
    },
    {
      icon: ShoppingBag,
      title: 'Realizar un Pedido',
      desc: 'Consultar disponibilidad de tortas y postres de hoy',
      msg: 'Hola Pastelería Dulzura, me gustaría consultar la carta y hacer un pedido de hoy 🍰'
    },
    {
      icon: Clock,
      title: 'Horarios y Delivery',
      desc: 'Cobertura de envíos y atención en local',
      msg: 'Hola Pastelería Dulzura, quisiera información sobre los horarios de atención y zonas de delivery en Arequipa 🛵'
    }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center animate-pulse"
          aria-label="Abrir chat de WhatsApp"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
          </span>
          <WhatsAppIcon className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* Interactive Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-dulzura-rose/50 transform transition-all animate-slideUp">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                  <WhatsAppIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold flex items-center gap-1.5">
                    Pastelería Dulzura
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </h3>
                  <p className="text-xs text-emerald-100 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse inline-block"></span>
                    Atención personalizada en Arequipa
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Quick Options */}
            <div className="p-5 space-y-4 bg-dulzura-cream/40">
              <p className="text-xs text-dulzura-chocolate/70 font-medium text-center">
                ¿En qué podemos ayudarte hoy? Selecciona una opción:
              </p>

              <div className="space-y-2.5">
                {options.map((opt, idx) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => sendWspMessage(opt.msg)}
                      className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-dulzura-rose/30 border border-dulzura-rose/60 shadow-xs hover:shadow-md transition-all duration-200 group flex items-start gap-3 transform hover:-translate-y-0.5 active:scale-98"
                    >
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-dulzura-chocolate group-hover:text-emerald-800 transition-colors">
                          {opt.title}
                        </h4>
                        <p className="text-[11px] text-dulzura-chocolate/60 line-clamp-1 mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom message input */}
              <div className="pt-2 border-t border-dulzura-rose/40">
                <label className="block text-[11px] font-bold text-dulzura-chocolate/70 mb-1">
                  O escribe tu consulta personalizada:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. ¿Tienen torta tres leches hoy?"
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customMsg.trim()) {
                        sendWspMessage(customMsg);
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
                  />
                  <button
                    onClick={() => {
                      if (customMsg.trim()) sendWspMessage(customMsg);
                    }}
                    disabled={!customMsg.trim()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 text-white transition-all flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
              <span className="text-[10px] text-gray-400">
                Respuesta rápida por WhatsApp • Pastelería Dulzura
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
