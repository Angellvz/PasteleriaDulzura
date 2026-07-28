const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('./productos.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', verificarToken, upload.single('imagen'), crearProducto);
router.put('/:id', verificarToken, upload.single('imagen'), actualizarProducto);
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;
