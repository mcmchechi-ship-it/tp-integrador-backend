// middlewares/errores.middleware.js — Manejo centralizado de 404 y 500.
// Usa el formato de respuesta { status, message, data } que se mantendrá en la API.

const { registrarEvento } = require('../services/logger.service');

const notFound = (req, res) => {
  registrarEvento('ERROR_404', req.originalUrl);
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada', data: null });
};

// Express reconoce un manejador de errores por sus 4 parámetros
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  registrarEvento('ERROR_500', `${req.originalUrl} ${err.message}`);
  res.status(500).json({ status: 'error', message: 'Error interno del servidor', data: null });
};

module.exports = { notFound, errorHandler };
