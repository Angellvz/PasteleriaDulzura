const prisma = require('../../config/db');
const { deleteLocalFile } = require('../../utils/fileHelper');

const getProductos = async (req, res, next) => {
  try {
    const { categoriaId, categoriaSlug, destacado, disponible, q } = req.query;
    
    const where = {};
    if (categoriaId) where.categoriaId = categoriaId;
    if (categoriaSlug) {
      where.categoria = { slug: categoriaSlug };
    }
    if (destacado !== undefined) where.destacado = destacado === 'true';
    if (disponible !== undefined) where.disponible = disponible === 'true';
    if (q) {
      where.OR = [
        { nombre: { contains: q } },
        { descripcion: { contains: q } }
      ];
    }

    const productos = await prisma.producto.findMany({
      where,
      include: { categoria: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const getProductoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: { categoria: true }
    });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    next(error);
  }
};

const parseBoolean = (val, defaultValue = false) => {
  if (val === undefined || val === null) return defaultValue;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    if (s === 'true' || s === '1') return true;
    if (s === 'false' || s === '0') return false;
  }
  return Boolean(val);
};

const crearProducto = async (req, res, next) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      precioMayor,
      categoriaId,
      imagenUrl,
      disponible,
      destacado
    } = req.body;

    if (!nombre || !descripcion || !precio || !categoriaId) {
      return res.status(400).json({ error: 'Nombre, descripción, precio y categoría son obligatorios' });
    }

    // Ruta por defecto si no viene imagen
    const urlImagenFinal = req.file ? `/uploads/productos/${req.file.filename}` : (imagenUrl || '/images/placeholder.jpg');

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        precioMayor: precioMayor ? parseFloat(precioMayor) : null,
        categoriaId,
        imagenUrl: urlImagenFinal,
        disponible: parseBoolean(disponible, true),
        destacado: parseBoolean(destacado, false)
      },
      include: { categoria: true }
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    next(error);
  }
};

const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      precio,
      precioMayor,
      categoriaId,
      imagenUrl,
      disponible,
      destacado
    } = req.body;

    const productoExistente = await prisma.producto.findUnique({ where: { id } });
    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const data = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (precio !== undefined) data.precio = parseFloat(precio);
    if (precioMayor !== undefined) data.precioMayor = precioMayor ? parseFloat(precioMayor) : null;
    if (categoriaId !== undefined) data.categoriaId = categoriaId;
    if (disponible !== undefined) data.disponible = parseBoolean(disponible, productoExistente.disponible);
    if (destacado !== undefined) data.destacado = parseBoolean(destacado, productoExistente.destacado);

    let nuevaImagen = null;
    if (req.file) {
      nuevaImagen = `/uploads/productos/${req.file.filename}`;
    } else if (imagenUrl && imagenUrl !== productoExistente.imagenUrl) {
      nuevaImagen = imagenUrl;
    }

    if (nuevaImagen) {
      data.imagenUrl = nuevaImagen;
      await deleteLocalFile(productoExistente.imagenUrl);
    }

    const productoActualizado = await prisma.producto.update({
      where: { id },
      data,
      include: { categoria: true }
    });

    res.json(productoActualizado);
  } catch (error) {
    next(error);
  }
};

const eliminarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productoExistente = await prisma.producto.findUnique({ where: { id } });
    if (productoExistente && productoExistente.imagenUrl) {
      await deleteLocalFile(productoExistente.imagenUrl);
    }
    await prisma.producto.delete({ where: { id } });
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
