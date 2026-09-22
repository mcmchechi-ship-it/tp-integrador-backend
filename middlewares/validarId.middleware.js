// middlewares/validarId.middleware.js — Comprueba que :id sea un entero positivo antes de tocar la BD.

const AppError = require('../utils/AppError');

const validarId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return next(new AppError(400, 'El id debe ser un número entero positivo'));
  }
  req.params.id = id;
  return next();
};

module.exports = { validarId };
