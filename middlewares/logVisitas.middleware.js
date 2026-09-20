// middlewares/logVisitas.middleware.js — Registra cada visita a una ruta.

const { registrarEvento } = require('../services/logger.service');

const logVisitas = (req, res, next) => {
  // Solo registramos rutas de la app (los estáticos ya fueron atendidos antes por express.static)
  registrarEvento('VISITA', `${req.method} ${req.originalUrl}`);
  next(); // Continúa con la siguiente función de la cadena
};

module.exports = { logVisitas };
