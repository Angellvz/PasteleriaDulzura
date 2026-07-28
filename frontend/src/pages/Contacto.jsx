import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Phone, MapPin, Clock, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { solicitarPedidoWhatsApp } from '../services/pedido';

const Contacto = () => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const { data: contacto } = useQuery({
    queryKey: ['contacto-info'],
    queryFn: async () => {
      const res = await api.get('/contacto');
      return res.data;
    }
  });

  const handleEnviarConsulta = (e) => {
    e.preventDefault();
    if (!mensaje) return;

    const textoFinal = `Hola Pastelería Dulzura, mi nombre es ${nombre || 'un cliente'} (Tel: ${telefono || 'No especificado'}). Mensaje: ${mensaje}`;
    const phoneClean = (contacto?.telefonoWhatsapp || '51987654321').replace(/\D/g, '');
    const url = `https://wa.me/${phoneClean}?text=${encodeURIComponent(textoFinal)}`;
    
    window.open(url, '_blank');
    setEnviado(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dulzura-cream">
      <Header />

      <main className="flex-grow py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-dulzura-pink uppercase">Estamos para Atenderte</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dulzura-chocolate">
            Contacto & Ubicación
          </h1>
          <p className="text-dulzura-chocolate/75 text-lg leading-relaxed">
            ¿Tienes alguna consulta sobre cotizaciones por mayor, eventos o pedidos especiales? Escríbenos o visítanos en nuestro local.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Columna Izquierda: Datos de Contacto */}
          <div className="lg:col-span-5 space-y-8 bg-white p-8 md:p-10 rounded-3xl border border-dulzura-rose/50 shadow-xl">
            <h2 className="font-serif text-2xl font-bold text-dulzura-chocolate pb-4 border-b border-dulzura-rose/30">
              Información de Atención
            </h2>

            <div className="space-y-6 text-dulzura-chocolate">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-dulzura-rose/60 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-dulzura-chocolate" />
                </div>
                <div>
                  <strong className="block text-base">Dirección de la Pastelería:</strong>
                  <p className="text-dulzura-chocolate/80 text-sm mt-0.5">{contacto?.direccion || 'Av. Cayma 456, Cayma, Arequipa'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <strong className="block text-base">WhatsApp de Pedidos:</strong>
                  <p className="text-dulzura-chocolate/80 text-sm mt-0.5">+{contacto?.telefonoWhatsapp || '51987654321'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-dulzura-rose/60 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-dulzura-chocolate" />
                </div>
                <div>
                  <strong className="block text-base">Horario Comercial:</strong>
                  <p className="text-dulzura-chocolate/80 text-sm mt-0.5">{contacto?.horarios || 'Lun - Sáb: 8:00 am - 8:00 pm | Dom: 9:00 am - 3:00 pm'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-dulzura-rose/60 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-dulzura-chocolate" />
                </div>
                <div>
                  <strong className="block text-base">Correo Electrónico:</strong>
                  <p className="text-dulzura-chocolate/80 text-sm mt-0.5">{contacto?.emailContacto || 'pedidos@pasteleriadulzura.pe'}</p>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-dulzura-rose/30">
              <button
                onClick={() => solicitarPedidoWhatsApp({ nombre: 'Consulta Rápida', precio: 0 }, contacto?.mensajePlantillaWhatsapp, contacto?.telefonoWhatsapp)}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-3 shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Abrir Chat de WhatsApp Directo</span>
              </button>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Mensaje */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-dulzura-rose/50 shadow-xl">
            <h2 className="font-serif text-2xl font-bold text-dulzura-chocolate mb-2">
              Envíanos un Mensaje
            </h2>
            <p className="text-dulzura-chocolate/70 text-sm mb-6">
              Completa el formulario y te redirigiremos a WhatsApp con tu consulta estructurada.
            </p>

            {enviado ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-emerald-900">¡Mensaje Preparado!</h3>
                <p className="text-emerald-800 text-sm">Se ha abierto WhatsApp para que confirmes tu envío.</p>
                <button
                  onClick={() => setEnviado(false)}
                  className="px-6 py-2 rounded-full bg-emerald-600 text-white font-semibold text-xs"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnviarConsulta} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-dulzura-chocolate uppercase mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María García"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-dulzura-rose/60 focus:border-dulzura-pink outline-none text-sm text-dulzura-chocolate"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dulzura-chocolate uppercase mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 987654321"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-dulzura-rose/60 focus:border-dulzura-pink outline-none text-sm text-dulzura-chocolate"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dulzura-chocolate uppercase mb-1">Tu Consulta o Pedido Especial</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Escribe aquí los detalles del pastel, fecha de tu evento o cantidad de bocaditos..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-dulzura-rose/60 focus:border-dulzura-pink outline-none text-sm text-dulzura-chocolate"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-dulzura-chocolate hover:bg-dulzura-darkChoco text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-4 h-4 text-dulzura-pink" />
                  <span>Enviar Consulta por WhatsApp</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      <Footer contacto={contacto} />
    </div>
  );
};

export default Contacto;
