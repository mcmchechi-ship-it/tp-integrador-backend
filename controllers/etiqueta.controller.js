// controllers/etiqueta.controller.js

const servicio = require('../services/etiqueta.service');
const { ok, creado } = require('../utils/respuesta');

const listar = async (req, res) => ok(res, await servicio.listar(req.query), 'Etiquetas obtenidas');
const obtener = async (req, res) => ok(res, await servicio.obtener(req.params.id), 'Etiqueta obtenida');
const crear = async (req, res) => creado(res, await servicio.crear(req.body), 'Etiqueta creada correctamente');
const actualizar = async (req, res) => ok(res, await servicio.actualizar(req.params.id, req.body), 'Etiqueta actualizada');
const eliminar = async (req, res) => {
  await servicio.eliminar(req.params.id);
  return ok(res, null, 'Etiqueta eliminada');
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
