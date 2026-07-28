const prisma = require('../../config/db');
const slugify = require('slugify');

const getCategorias = async (req, res, next) => {
  try {
    const { soloActivas } = req.query;
    const where = soloActivas === 'true' ? { activo: true } : {};
    
    const categorias = await prisma.categoria.findMany({
      where,
      orderBy: { orden: 'asc' },
      include: {
        _count: {
          select: { productos: true }
        }
      }
    });
    res.json(categorias);
  } catch (error) {
    next(error);
  }
};

const getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { productos: true }
    });
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

const crearCategoria = async (req, res, next) => {
  try {
    const { nombre, icono, orden, activo } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const slug = slugify(nombre, { lower: true, strict: true });
    
    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre,
        slug: slug + '-' + Date.now().toString().slice(-4),
        icono: icono || 'Cake',
        orden: orden ? parseInt(orden) : 0,
        activo: activo !== undefined ? Boolean(activo) : true
      }
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    next(error);
  }
};

const actualizarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, icono, orden, activo } = req.body;

    const data = {};
    if (nombre) {
      data.nombre = nombre;
      data.slug = slugify(nombre, { lower: true, strict: true });
    }
    if (icono !== undefined) data.icono = icono;
    if (orden !== undefined) data.orden = parseInt(orden);
    if (activo !== undefined) data.activo = Boolean(activo);

    const categoriaActualizada = await prisma.categoria.update({
      where: { id },
      data
    });

    res.json(categoriaActualizada);
  } catch (error) {
    next(error);
  }
};

const eliminarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.categoria.delete({ where: { id } });
    res.json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};
