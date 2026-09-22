// services/proyecto.service.js — Lógica de negocio y acceso a datos de proyectos.

const { Op } = require('sequelize');
const { Proyecto, Usuario, Etiqueta } = require('../models');
const AppError = require('../utils/AppError');
const { leerPaginacion, leerOrden, armarPagina } = require('../utils/paginacion');

const CAMPOS_PROYECTO = ['titulo', 'descripcion', 'estado', 'fechaLimite', 'usuarioId'];

const filtrar = (objeto = {}, permitidos) =>
  Object.fromEntries(Object.entries(objeto).filter(([clave]) => permitidos.includes(clave)));

// Incluye al responsable (sin datos sensibles) y las etiquetas (sin la tabla intermedia)
const incluirRelaciones = (filtroEtiqueta) => [
  { model: Usuario, as: 'responsable', attributes: ['id', 'nombre', 'email'] },
  {
    model: Etiqueta,
    as: 'etiquetas',
    through: { attributes: [] },
    ...(filtroEtiqueta ? { where: filtroEtiqueta, required: true } : {}),
  },
];

// Comprueba que existan todos los ids de etiquetas recibidos
const validarEtiquetas = async (ids) => {
  if (!Array.isArray(ids) || ids.some((n) => !Number.isInteger(n) || n < 1)) {
    throw new AppError(400, '"etiquetas" debe ser un arreglo de ids enteros positivos, por ejemplo [1, 2]');
  }
  const unicos = [...new Set(ids)];
  const encontradas = await Etiqueta.count({ where: { id: unicos } });
  if (encontradas !== unicos.length) throw new AppError(404, 'Alguna de las etiquetas indicadas no existe');
  return unicos;
};

const validarUsuario = async (usuarioId) => {
  if (!Number.isInteger(usuarioId) || usuarioId < 1) {
    throw new AppError(400, '"usuarioId" es obligatorio y debe ser un entero positivo');
  }
  if (!(await Usuario.findByPk(usuarioId))) throw new AppError(404, 'El usuario responsable no existe');
};

// GET /api/proyectos?q=&estado=&usuarioId=&etiqueta=&vencidos=&page=&limit=&orden=
const listar = async (query) => {
  const { pagina, limite, offset } = leerPaginacion(query);
  const order = leerOrden(query.orden, ['id', 'titulo', 'estado', 'fechaLimite', 'createdAt'], [['id', 'ASC']]);
  const where = {};

  if (query.q) {
    where[Op.or] = [
      { titulo: { [Op.iLike]: `%${query.q}%` } },
      { descripcion: { [Op.iLike]: `%${query.q}%` } },
    ];
  }
  if (query.estado) {
    if (!Proyecto.ESTADOS.includes(query.estado)) {
      throw new AppError(400, `El filtro "estado" debe ser uno de: ${Proyecto.ESTADOS.join(', ')}`);
    }
    where.estado = query.estado;
  }
  if (query.usuarioId) {
    const uid = Number(query.usuarioId);
    if (!Number.isInteger(uid) || uid < 1) throw new AppError(400, 'El filtro "usuarioId" debe ser un entero positivo');
    where.usuarioId = uid;
  }
  if (query.vencidos === 'true') {
    // Proyectos con fecha límite pasada que aún no están completados
    where.fechaLimite = { [Op.lt]: new Date().toISOString().slice(0, 10) };
    where.estado = { [Op.ne]: 'completado' };
  }

  // Filtrar por etiqueta: acepta id numérico o nombre
  let filtroEtiqueta = null;
  if (query.etiqueta) {
    filtroEtiqueta = /^\d+$/.test(query.etiqueta)
      ? { id: Number(query.etiqueta) }
      : { nombre: String(query.etiqueta).toLowerCase() };
  }

  const { rows, count } = await Proyecto.findAndCountAll({
    where, order, limit: limite, offset, distinct: true,
    include: incluirRelaciones(filtroEtiqueta),
  });
  return { items: rows, paginacion: armarPagina(count, pagina, limite) };
};

const obtener = async (id) => {
  const proyecto = await Proyecto.findByPk(id, { include: incluirRelaciones() });
  if (!proyecto) throw new AppError(404, 'Proyecto no encontrado');
  return proyecto;
};

// POST /api/proyectos   body: { titulo, descripcion?, estado?, fechaLimite?, usuarioId, etiquetas?: [ids] }
const crear = async (body = {}) => {
  await validarUsuario(body.usuarioId);
  const ids = body.etiquetas === undefined ? undefined : await validarEtiquetas(body.etiquetas);
  const proyecto = await Proyecto.create(filtrar(body, CAMPOS_PROYECTO));
  if (ids) await proyecto.setEtiquetas(ids);
  return obtener(proyecto.id);
};

// PUT /api/proyectos/:id   (si viene "etiquetas", reemplaza el conjunto completo)
const actualizar = async (id, body = {}) => {
  const proyecto = await Proyecto.findByPk(id);
  if (!proyecto) throw new AppError(404, 'Proyecto no encontrado');
  if (body.usuarioId !== undefined) await validarUsuario(body.usuarioId);
  const ids = body.etiquetas === undefined ? undefined : await validarEtiquetas(body.etiquetas);
  await proyecto.update(filtrar(body, CAMPOS_PROYECTO));
  if (ids) await proyecto.setEtiquetas(ids);
  return obtener(id);
};

const eliminar = async (id) => {
  const proyecto = await Proyecto.findByPk(id);
  if (!proyecto) throw new AppError(404, 'Proyecto no encontrado');
  await proyecto.destroy();
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
