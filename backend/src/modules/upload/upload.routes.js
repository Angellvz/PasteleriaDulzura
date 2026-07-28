const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload.middleware');
const { verificarToken } = require('../../middlewares/auth.middleware');

router.post('/', verificarToken, upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  const folder = req.body.tipoFolder || 'productos';
  const url = `/uploads/${folder}/${req.file.filename}`;

  res.json({
    message: 'Imagen subida correctamente',
    imagenUrl: url,
    filename: req.file.filename
  });
});

module.exports = router;
