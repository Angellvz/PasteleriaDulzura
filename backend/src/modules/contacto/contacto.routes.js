const express = require('express');
const router = express.Router();
const { getContacto, actualizarContacto } = require('./contacto.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

router.get('/', getContacto);
router.put('/', verificarToken, upload.single('imagenHero'), actualizarContacto);

module.exports = router;
