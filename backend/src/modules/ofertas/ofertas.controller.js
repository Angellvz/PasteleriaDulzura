const prisma = require('../../config/db');
const { deleteLocalFile } = require('../../utils/fileHelper');

const getOfertas = async (req, res, next) => {
  try {
    const { soloActivas } = req.query;
    const where = soloActivas === 'true' ? { activo: true } : {};

    const ofertas = await prisma.oferta.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(ofertas);
  } catch (error) {
    next(error);
  }
};

const crearOferta = async (req, res, next) => {
  try {
    const {
      titulo,
      descripcionCorta,
      porcentajeDescuento,
      precioOferta,
      productoId,
      imagenUrl,
      fechaInicio,
      fechaFin,
      activo
    } = req.body;

    if (!titulo || !descripcionCorta) {
      return res.status(400).json({ error: 'Título y descripción corta son requeridos' });
    }

    const urlImagenFinal = req.file ? `/uploads/ofertas/${req.file.filename}` : (imagenUrl || '/images/oferta-default.jpg');

    const nuevaOferta = await prisma.oferta.create({
      data: {
        titulo,
        descripcionCorta,
        porcentajeDescuento: porcentajeDescuento ? parseFloat(porcentajeDescuento) : null,
        precioOferta: precioOferta ? parseFloat(precioOferta) : null,
        productoId: productoId || null,
        imagenUrl: urlImagenFinal,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        activo: activo !== undefined ? Boolean(activo) : true
      }
    });

    res.status(201).json(nuevaOferta);
  } catch (error) {
    next(error);
  }
};

const actualizarOferta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcionCorta,
      porcentajeDescuento,
      precioOferta,
      productoId,
      imagenUrl,
      fechaInicio,
      fechaFin,
      activo
    } = req.body;

    const ofertaExistente = await prisma.oferta.findUnique({ where: { id } });
    if (!ofertaExistente) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    const data = {};
    if (titulo !== undefined) data.titulo = titulo;
    if (descripcionCorta !== undefined) data.descripcionCorta = descripcionCorta;
    if (porcentajeDescuento !== undefined) data.porcentajeDescuento = porcentajeDescuento ? parseFloat(porcentajeDescuento) : null;
    if (precioOferta !== undefined) data.precioOferta = precioOferta ? parseFloat(precioOferta) : null;
    if (productoId !== undefined) data.productoId = productoId || null;
    if (fechaInicio !== undefined) data.fechaInicio = fechaInicio ? new Date(fechaInicio) : null;
    if (fechaFin !== undefined) data.fechaFin = fechaFin ? new Date(fechaFin) : null;
    if (activo !== undefined) data.activo = Boolean(activo);

    let nuevaImagen = null;
    if (req.file) {
      nuevaImagen = `/uploads/ofertas/${req.file.filename}`;
    } else if (imagenUrl && imagenUrl !== ofertaExistente.imagenUrl) {
      nuevaImagen = imagenUrl;
    }

    if (nuevaImagen) {
      data.imagenUrl = nuevaImagen;
      await deleteLocalFile(ofertaExistente.imagenUrl);
    }

    const ofertaActualizada = await prisma.oferta.update({
      where: { id },
      data
    });

    res.json(ofertaActualizada);
  } catch (error) {
    next(error);
  }
};

const eliminarOferta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ofertaExistente = await prisma.oferta.findUnique({ where: { id } });
    if (ofertaExistente && ofertaExistente.imagenUrl) {
      await deleteLocalFile(ofertaExistente.imagenUrl);
    }
    await prisma.oferta.delete({ where: { id } });
    res.json({ message: 'Oferta eliminada con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOfertas,
  crearOferta,
  actualizarOferta,
  eliminarOferta
};
