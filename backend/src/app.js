const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./modules/auth/auth.routes');
const categoriasRoutes = require('./modules/categorias/categorias.routes');
const productosRoutes = require('./modules/productos/productos.routes');
const ofertasRoutes = require('./modules/ofertas/ofertas.routes');
const blogRoutes = require('./modules/blog/blog.routes');
const contactoRoutes = require('./modules/contacto/contacto.routes');
const uploadRoutes = require('./modules/upload/upload.routes');
const { manejarErrores } = require('./middlewares/error.middleware');

const app = express();

// Middlewares globales
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta de subidas físicamente como estático
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de API REST
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ofertas', ofertasRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/upload', uploadRoutes);

// Ruta de diagnóstico / Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Pastelería Dulzura API',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use(manejarErrores);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🍰 Servidor Pastelería Dulzura corriendo en puerto http://localhost:${PORT}`);
  });
}

module.exports = app;
