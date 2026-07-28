const express = require('express');
const router = express.Router();
const { getContacto, actualizarContacto } = require('./contacto.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');

router.get('/', getContacto);
router.put('/', verificarToken, actualizarContacto);

module.exports = router;
