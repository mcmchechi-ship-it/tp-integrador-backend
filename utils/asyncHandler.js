// utils/asyncHandler.js — Envuelve controladores async para enviar cualquier error al middleware de errores.

module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
