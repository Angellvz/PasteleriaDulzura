const prisma = require('../../config/db');
const slugify = require('slugify');
const { deleteLocalFile } = require('../../utils/fileHelper');

const getArticulos = async (req, res, next) => {
  try {
    const { publicadoOnly } = req.query;
    const where = publicadoOnly === 'true' ? { publicado: true } : {};

    const articulos = await prisma.articulo.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(articulos);
  } catch (error) {
    next(error);
  }
};

const getArticuloBySlugOrId = async (req, res, next) => {
  try {
    const { param } = req.params;
    const articulo = await prisma.articulo.findFirst({
      where: {
        OR: [{ id: param }, { slug: param }]
      }
    });

    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    res.json(articulo);
  } catch (error) {
    next(error);
  }
};

const crearArticulo = async (req, res, next) => {
  try {
    const { titulo, resumenCorto, contenido, imagenUrl, autor, publicado } = req.body;

    if (!titulo || !resumenCorto || !contenido) {
      return res.status(400).json({ error: 'Título, resumen corto y contenido son obligatorios' });
    }

    const baseSlug = slugify(titulo, { lower: true, strict: true });
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const urlImagenFinal = req.file 
      ? (req.file.path && req.file.path.startsWith('http') ? req.file.path : `/uploads/blog/${req.file.filename}`)
      : (imagenUrl || '/images/blog-default.jpg');

    const nuevoArticulo = await prisma.articulo.create({
      data: {
        titulo,
        slug,
        resumenCorto,
        contenido,
        imagenUrl: urlImagenFinal,
        autor: autor || 'Pastelería Dulzura',
        publicado: publicado !== undefined ? Boolean(publicado) : true
      }
    });

    res.status(201).json(nuevoArticulo);
  } catch (error) {
    next(error);
  }
};

const actualizarArticulo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, resumenCorto, contenido, imagenUrl, autor, publicado } = req.body;

    const articuloExistente = await prisma.articulo.findUnique({ where: { id } });
    if (!articuloExistente) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    const data = {};
    if (titulo !== undefined) {
      data.titulo = titulo;
      const baseSlug = slugify(titulo, { lower: true, strict: true });
      data.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }
    if (resumenCorto !== undefined) data.resumenCorto = resumenCorto;
    if (contenido !== undefined) data.contenido = contenido;
    if (autor !== undefined) data.autor = autor;
    if (publicado !== undefined) data.publicado = Boolean(publicado);

    let nuevaImagen = null;
    if (req.file) {
      nuevaImagen = req.file.path && req.file.path.startsWith('http') ? req.file.path : `/uploads/blog/${req.file.filename}`;
    } else if (imagenUrl && imagenUrl !== articuloExistente.imagenUrl) {
      nuevaImagen = imagenUrl;
    }

    if (nuevaImagen) {
      data.imagenUrl = nuevaImagen;
      await deleteLocalFile(articuloExistente.imagenUrl);
    }

    const articuloActualizado = await prisma.articulo.update({
      where: { id },
      data
    });

    res.json(articuloActualizado);
  } catch (error) {
    next(error);
  }
};

const eliminarArticulo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const articuloExistente = await prisma.articulo.findUnique({ where: { id } });
    if (articuloExistente && articuloExistente.imagenUrl) {
      await deleteLocalFile(articuloExistente.imagenUrl);
    }
    await prisma.articulo.delete({ where: { id } });
    res.json({ message: 'Artículo eliminado con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticulos,
  getArticuloBySlugOrId,
  crearArticulo,
  actualizarArticulo,
  eliminarArticulo
};
