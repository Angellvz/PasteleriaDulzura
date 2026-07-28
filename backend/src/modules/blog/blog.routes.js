const express = require('express');
const router = express.Router();
const {
  getArticulos,
  getArticuloBySlugOrId,
  crearArticulo,
  actualizarArticulo,
  eliminarArticulo
} = require('./blog.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

router.get('/', getArticulos);
router.get('/:param', getArticuloBySlugOrId);
router.post('/', verificarToken, upload.single('imagen'), crearArticulo);
router.put('/:id', verificarToken, upload.single('imagen'), actualizarArticulo);
router.delete('/:id', verificarToken, eliminarArticulo);

module.exports = router;
