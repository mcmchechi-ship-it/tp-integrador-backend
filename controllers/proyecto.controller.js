// controllers/proyecto.controller.js

const servicio = require('../services/proyecto.service');
const { ok, creado } = require('../utils/respuesta');

const listar = async (req, res) => ok(res, await servicio.listar(req.query), 'Proyectos obtenidos');
const obtener = async (req, res) => ok(res, await servicio.obtener(req.params.id), 'Proyecto obtenido');
const crear = async (req, res) => creado(res, await servicio.crear(req.body), 'Proyecto creado correctamente');
const actualizar = async (req, res) => ok(res, await servicio.actualizar(req.params.id, req.body), 'Proyecto actualizado');
const eliminar = async (req, res) => {
  await servicio.eliminar(req.params.id);
  return ok(res, null, 'Proyecto eliminado');
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
