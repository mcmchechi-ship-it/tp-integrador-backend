// middlewares/errores.middleware.js — Manejo centralizado de 404 y errores.
// Traduce errores de Sequelize y de validación a respuestas claras con formato { status, message, data }.

const { registrarEvento } = require('../services/logger.service');
const AppError = require('../utils/AppError');

const notFound = (req, res) => {
  registrarEvento('ERROR_404', req.originalUrl);
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada', data: null });
};

// Convierte los errores de Sequelize en [{ campo, mensaje }]
const detalleValidacion = (err) =>
  (err.errors || []).map((e) => ({ campo: e.path, mensaje: e.message }));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let codigo = 500;
  let mensaje = 'Error interno del servidor';
  let detalles = null;

  if (err instanceof AppError) {
    codigo = err.statusCode;
    mensaje = err.message;
    detalles = err.detalles;
  } else if (err.name === 'SequelizeValidationError') {
    codigo = 400;
    mensaje = 'Datos inválidos';
    detalles = detalleValidacion(err);
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    codigo = 409;
    mensaje = 'El registro ya existe';
    detalles = detalleValidacion(err);
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    codigo = 409;
    mensaje = 'La operación viola una relación con otro registro';
  } else if (err.name === 'SequelizeDatabaseError') {
    // Ej.: valor con formato incorrecto para el tipo de columna
    codigo = 400;
    mensaje = 'Los datos enviados no son válidos para la base de datos';
  } else if (err.type === 'entity.parse.failed') {
    codigo = 400;
    mensaje = 'El cuerpo de la petición no es un JSON válido';
  }

  // Los errores 5xx se registran con detalle en log.txt y consola; los 4xx solo se registran
  if (codigo >= 500) {
    console.error(err);
    registrarEvento('ERROR_500', `${req.originalUrl} ${err.message}`);
  } else {
    registrarEvento(`ERROR_${codigo}`, `${req.method} ${req.originalUrl}`);
  }

  res.status(codigo).json({ status: 'error', message: mensaje, data: detalles });
};

module.exports = { notFound, errorHandler };
