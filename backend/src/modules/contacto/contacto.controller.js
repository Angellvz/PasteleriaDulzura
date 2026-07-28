const prisma = require('../../config/db');

const getContacto = async (req, res, next) => {
  try {
    let contacto = await prisma.contacto.findFirst();
    if (!contacto) {
      contacto = await prisma.contacto.create({
        data: {
          telefonoWhatsapp: '51987654321',
          direccion: 'Av. Primavera 456, Santiago de Surco, Lima',
          horarios: 'Lun - Sáb: 8:00 AM - 8:00 PM | Dom: 9:00 AM - 3:00 PM',
          redesSociales: JSON.stringify({
            facebook: 'https://facebook.com/pasteleriadulzura',
            instagram: 'https://instagram.com/pasteleriadulzura'
          }),
          emailContacto: 'pedidos@pasteleriadulzura.pe',
          mensajePlantillaWhatsapp: 'Hola Pastelería Dulzura, me gustaría pedir: {producto} (Precio: S/{precio}). ¿Tienen disponibilidad?'
        }
      });
    }

    res.json(contacto);
  } catch (error) {
    next(error);
  }
};

const actualizarContacto = async (req, res, next) => {
  try {
    let contacto = await prisma.contacto.findFirst();
    const {
      telefonoWhatsapp,
      direccion,
      horarios,
      redesSociales,
      emailContacto,
      mensajePlantillaWhatsapp
    } = req.body;

    const data = {
      telefonoWhatsapp,
      direccion,
      horarios,
      emailContacto,
      mensajePlantillaWhatsapp
    };

    if (redesSociales !== undefined) {
      data.redesSociales = typeof redesSociales === 'object' ? JSON.stringify(redesSociales) : redesSociales;
    }

    if (contacto) {
      contacto = await prisma.contacto.update({
        where: { id: contacto.id },
        data
      });
    } else {
      contacto = await prisma.contacto.create({ data });
    }

    res.json(contacto);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacto,
  actualizarContacto
};
