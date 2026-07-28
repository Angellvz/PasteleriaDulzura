/**
 * Servicio de procesamiento de pedidos (Fase 1: WhatsApp | Fase futura: Izipay)
 */
export const solicitarPedidoWhatsApp = (producto, plantillaWhatsapp, telefonoWhatsapp) => {
  const phoneClean = (telefonoWhatsapp || '51987654321').replace(/\D/g, '');
  
  const plantillaDefault = "Hola Pastelería Dulzura, me gustaría pedir: {producto} (Precio: S/ {precio}). ¿Tienen disponibilidad?";
  const plantilla = plantillaWhatsapp || plantillaDefault;

  const precioFormatted = typeof producto.precio === 'number' ? producto.precio.toFixed(2) : producto.precio;
  
  const mensajeFinal = plantilla
    .replace('{producto}', producto.nombre)
    .replace('{precio}', precioFormatted);

  const url = `https://wa.me/${phoneClean}?text=${encodeURIComponent(mensajeFinal)}`;
  window.open(url, '_blank');
};
