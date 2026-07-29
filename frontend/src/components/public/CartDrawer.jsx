import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, Calendar, MapPin, User, Phone, MessageSquare, Sparkles } from 'lucide-react';

const DISTRITOS_AREQUIPA = [
  'Cayma',
  'Yanahuara',
  'Cercado (Centro Histórico)',
  'José Luis Bustamante y Rivero',
  'Sachaca',
  'Alto Selva Alegre',
  'Cerro Colorado',
  'Paucarpata',
  'Socabaya',
  'Jacobo Hunter',
  'Miraflores',
  'Otro distrito (Consultar)'
];

const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart, totalAmount, totalItemsCount } = useCart();
  
  const [tipoAtencion, setTipoAtencion] = useState('pedido'); // 'pedido' | 'cotizacion'
  const [tipoEntrega, setTipoEntrega] = useState('delivery'); // 'delivery' | 'recojo'
  
  const [clienteNombre, setClienteNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [distrito, setDistrito] = useState(DISTRITOS_AREQUIPA[0]);
  const [direccion, setDireccion] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [horaEntrega, setHoraEntrega] = useState('');
  const [observaciones, setObservaciones] = useState('');

  if (!isCartOpen) return null;

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const numeroWsp = '51987654321'; // Número por defecto de Pastelería Dulzura Arequipa

    let mensaje = `*🍰 PASTELERÍA DULZURA - AREQUIPA*\n`;
    mensaje += `*${tipoAtencion === 'pedido' ? '🛒 NUEVO PEDIDO' : '📝 SOLICITUD DE COTIZACIÓN'}*\n`;
    mensaje += `--------------------------------------\n\n`;

    mensaje += `*👤 DATOS DEL CLIENTE:*\n`;
    mensaje += `• *Nombre:* ${clienteNombre || 'Cliente'}\n`;
    if (telefono) mensaje += `• *Teléfono:* ${telefono}\n`;
    mensaje += `• *Modalidad:* ${tipoEntrega === 'delivery' ? `🚚 Delivery en ${distrito}` : '🏪 Recojo en Tienda'}\n`;
    if (tipoEntrega === 'delivery' && direccion) {
      mensaje += `• *Dirección:* ${direccion}\n`;
    }
    if (fechaEntrega) mensaje += `• *Fecha solicitada:* ${fechaEntrega} ${horaEntrega ? `a las ${horaEntrega}` : ''}\n`;
    
    mensaje += `\n*📦 DETALLE DEL CARRITO:*\n`;
    cart.forEach((item, index) => {
      mensaje += `${index + 1}. *${item.nombre}* x${item.cantidad} - S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
      if (item.notas) mensaje += `   └ _Nota: ${item.notas}_\n`;
    });

    mensaje += `\n--------------------------------------\n`;
    if (tipoAtencion === 'pedido') {
      mensaje += `*💰 TOTAL ESTIMADO:* S/ ${totalAmount.toFixed(2)}\n`;
    } else {
      mensaje += `*💰 SUB-TOTAL PRODUCTOS BASE:* S/ ${totalAmount.toFixed(2)}\n`;
      mensaje += `_(Sujeto a cotización de acabados o personalización especial)_\n`;
    }

    if (observaciones) {
      mensaje += `\n*💬 DETALLES ADICIONALES / DEDICATORIA:*\n"${observaciones}"\n`;
    }

    mensaje += `\n¡Quedo a la espera de su confirmación para coordinar el pago y entrega! Gracias. 😊`;

    const encodedText = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${numeroWsp}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-[100dvh]">
          {/* Header */}
          <div className="p-5 bg-dulzura-chocolate text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-dulzura-pink/20 text-dulzura-pink">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold">Carrito Dulzura</h2>
                <p className="text-xs text-dulzura-pink/90">{totalItemsCount} {totalItemsCount === 1 ? 'producto seleccionado' : 'productos seleccionados'}</p>
              </div>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Type Switcher */}
          <div className="p-3 bg-dulzura-warmGray border-b border-gray-200 flex gap-2">
            <button
              onClick={() => setTipoAtencion('pedido')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                tipoAtencion === 'pedido'
                  ? 'bg-dulzura-chocolate text-white shadow-xs scale-102'
                  : 'bg-white text-dulzura-chocolate hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-dulzura-pink" />
              <span>Realizar Pedido</span>
            </button>
            <button
              onClick={() => setTipoAtencion('cotizacion')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                tipoAtencion === 'cotizacion'
                  ? 'bg-dulzura-chocolate text-white shadow-xs scale-102'
                  : 'bg-white text-dulzura-chocolate hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Solicitar Cotización</span>
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-3">
                <div className="w-20 h-20 rounded-full bg-dulzura-rose/30 flex items-center justify-center text-dulzura-chocolate/50">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-lg font-bold text-dulzura-chocolate">Tu carrito está vacío</h3>
                <p className="text-xs text-dulzura-chocolate/60 max-w-xs">
                  Explora nuestras deliciosas tortas, postres y productos de pastelería artesanal en Arequipa.
                </p>
              </div>
            ) : (
              <>
                {/* List of items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase text-dulzura-chocolate/70">
                    <span>Productos</span>
                    <button 
                      onClick={clearCart} 
                      className="text-red-500 hover:underline flex items-center gap-1 text-[11px] lowercase"
                    >
                      <Trash2 className="w-3 h-3" /> vaciar
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3 bg-white rounded-2xl border border-gray-100 shadow-xs flex gap-3 items-center hover:border-dulzura-pink/40 transition-colors"
                    >
                      <img 
                        src={item.imagenUrl} 
                        alt={item.nombre} 
                        className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-dulzura-chocolate truncate">{item.nombre}</h4>
                        <p className="text-xs text-dulzura-chocolate/70 font-semibold">
                          S/ {item.precio.toFixed(2)} c/u
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <button
                              onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                              className="px-2 py-0.5 hover:bg-gray-200 text-dulzura-chocolate"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-dulzura-chocolate">{item.cantidad}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                              className="px-2 py-0.5 hover:bg-gray-200 text-dulzura-chocolate"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-dulzura-chocolate ml-auto">
                            S/ {(item.precio * item.cantidad).toFixed(2)}
                          </span>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form fields for delivery & contact */}
                <form onSubmit={handleSendWhatsApp} className="pt-4 border-t border-gray-100 space-y-3">
                  <h3 className="text-xs font-bold uppercase text-dulzura-chocolate/80 tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-dulzura-pink" />
                    Datos del Pedido en Arequipa
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Tu Nombre *"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-dulzura-pink"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono / WhatsApp"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-dulzura-pink"
                    />
                  </div>

                  {/* Delivery vs Pick up selector */}
                  <div className="flex gap-2 text-xs">
                    <label className={`flex-1 p-2 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-semibold transition-all ${
                      tipoEntrega === 'delivery' ? 'border-dulzura-chocolate bg-dulzura-rose/20 text-dulzura-chocolate' : 'border-gray-200 text-gray-500'
                    }`}>
                      <input 
                        type="radio" 
                        name="tipoEntrega" 
                        value="delivery"
                        checked={tipoEntrega === 'delivery'}
                        onChange={() => setTipoEntrega('delivery')}
                        className="hidden"
                      />
                      <MapPin className="w-3.5 h-3.5 text-dulzura-pink" />
                      Delivery Arequipa
                    </label>
                    <label className={`flex-1 p-2 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-semibold transition-all ${
                      tipoEntrega === 'recojo' ? 'border-dulzura-chocolate bg-dulzura-rose/20 text-dulzura-chocolate' : 'border-gray-200 text-gray-500'
                    }`}>
                      <input 
                        type="radio" 
                        name="tipoEntrega" 
                        value="recojo"
                        checked={tipoEntrega === 'recojo'}
                        onChange={() => setTipoEntrega('recojo')}
                        className="hidden"
                      />
                      <ShoppingBag className="w-3.5 h-3.5 text-dulzura-chocolate" />
                      Recojo en Tienda
                    </label>
                  </div>

                  {tipoEntrega === 'delivery' && (
                    <div className="space-y-2">
                      <select
                        value={distrito}
                        onChange={(e) => setDistrito(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-dulzura-pink bg-white"
                      >
                        {DISTRITOS_AREQUIPA.map((d) => (
                          <option key={d} value={d}>Distrito: {d}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Dirección exacta o referencia..."
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-dulzura-pink"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-dulzura-chocolate uppercase mb-1">Fecha Preferida</label>
                      <input
                        type="date"
                        value={fechaEntrega}
                        onChange={(e) => setFechaEntrega(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-dulzura-pink bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-dulzura-chocolate uppercase mb-1">Hora Estimada</label>
                      <input
                        type="time"
                        value={horaEntrega}
                        onChange={(e) => setHoraEntrega(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-dulzura-pink bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-dulzura-chocolate uppercase mb-1">
                      Dedicatoria o Notas de Personalización
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej. Escribir 'Feliz Cumpleaños Mamá' en la torta, colores de la temática..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-dulzura-pink resize-none"
                    />
                  </div>

                  {/* Summary & Submit */}
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold text-dulzura-chocolate">
                      <span>Total estimado:</span>
                      <span className="text-lg font-serif text-dulzura-darkChoco">S/ {totalAmount.toFixed(2)}</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {tipoAtencion === 'pedido' 
                          ? 'Enviar Pedido por WhatsApp' 
                          : 'Solicitar Cotización por WhatsApp'
                        }
                      </span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
