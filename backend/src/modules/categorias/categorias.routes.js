const express = require('express');
const router = express.Router();
const {
  getCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} = require('./categorias.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');

router.get('/', getCategorias);
router.get('/:id', getCategoriaById);
router.post('/', verificarToken, crearCategoria);
router.put('/:id', verificarToken, actualizarCategoria);
router.delete('/:id', verificarToken, eliminarCategoria);

module.exports = router;
