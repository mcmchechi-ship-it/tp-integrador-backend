// utils/respuesta.js — Formato único de respuesta de la API: { status, message, data }.

const ok = (res, data = null, message = 'Operación exitosa', codigo = 200) =>
  res.status(codigo).json({ status: 'ok', message, data });

const creado = (res, data, message = 'Recurso creado correctamente') => ok(res, data, message, 201);

const fallo = (res, codigo, message, data = null) =>
  res.status(codigo).json({ status: 'error', message, data });

module.exports = { ok, creado, fallo };
