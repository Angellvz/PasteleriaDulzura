/**
 * Módulo de Abstracción de Pagos (Preparado para Futuras Pasarelas como Izipay)
 * MODO_PAGO = "whatsapp" | "izipay"
 */

class PaymentProvider {
  static getMode() {
    return process.env.MODO_PAGO || 'whatsapp';
  }

  static async procesarPedido(producto, plantillaMensaje, telefono) {
    const modo = this.getMode();

    if (modo === 'izipay') {
      // Futura integración Izipay Perú
      // const session = await izipaySdk.createToken({ amount: producto.precio });
      // return { status: 'redirect_izipay', url: session.paymentUrl };
      throw new Error('Integración de Izipay aún no está activa en este entorno');
    }

    // Modo por defecto: WhatsApp
    const mensaje = (plantillaMensaje || 'Hola, quisiera pedir: {producto} - S/{precio}')
      .replace('{producto}', producto.nombre)
      .replace('{precio}', producto.precio.toFixed(2));

    const phoneClean = (telefono || '51987654321').replace(/\D/g, '');
    const url = `https://wa.me/${phoneClean}?text=${encodeURIComponent(mensaje)}`;

    return {
      status: 'redirect_whatsapp',
      url
    };
  }
}

module.exports = PaymentProvider;
