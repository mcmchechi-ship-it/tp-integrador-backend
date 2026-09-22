// controllers/usuario.controller.js — Recibe la petición HTTP, llama al servicio y responde.

const servicio = require('../services/usuario.service');
const { ok, creado } = require('../utils/respuesta');

const listar = async (req, res) => ok(res, await servicio.listar(req.query), 'Usuarios obtenidos');
const obtener = async (req, res) => ok(res, await servicio.obtener(req.params.id), 'Usuario obtenido');
const crear = async (req, res) => creado(res, await servicio.crear(req.body), 'Usuario creado correctamente');
const actualizar = async (req, res) => ok(res, await servicio.actualizar(req.params.id, req.body), 'Usuario actualizado');
const eliminar = async (req, res) => {
  await servicio.eliminar(req.params.id);
  return ok(res, null, 'Usuario eliminado');
};
const obtenerPerfil = async (req, res) => ok(res, await servicio.obtenerPerfil(req.params.id), 'Perfil obtenido');
const guardarPerfil = async (req, res) => ok(res, await servicio.guardarPerfil(req.params.id, req.body), 'Perfil guardado');

module.exports = { listar, obtener, crear, actualizar, eliminar, obtenerPerfil, guardarPerfil };
