// utils/AppError.js — Error controlado con código HTTP propio.
// Los servicios lanzan AppError y el middleware de errores lo convierte en respuesta JSON.

class AppError extends Error {
  constructor(statusCode, message, detalles = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.detalles = detalles;
  }
}

module.exports = AppError;
