const manejarErrores = (err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(status).json({ error: message });
};

module.exports = { manejarErrores };
