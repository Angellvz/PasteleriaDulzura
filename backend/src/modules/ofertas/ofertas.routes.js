const express = require('express');
const router = express.Router();
const {
  getOfertas,
  crearOferta,
  actualizarOferta,
  eliminarOferta
} = require('./ofertas.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

router.get('/', getOfertas);
router.post('/', verificarToken, upload.single('imagen'), crearOferta);
router.put('/:id', verificarToken, upload.single('imagen'), actualizarOferta);
router.delete('/:id', verificarToken, eliminarOferta);

module.exports = router;
