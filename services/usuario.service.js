// services/usuario.service.js — Lógica de negocio y acceso a datos de usuarios y perfiles.

const { Op } = require('sequelize');
const { Usuario, Perfil, Proyecto, sequelize } = require('../models');
const AppError = require('../utils/AppError');
const { leerPaginacion, leerOrden, armarPagina } = require('../utils/paginacion');

// Solo estos campos se aceptan desde el cliente (evita "mass assignment")
const CAMPOS_USUARIO = ['nombre', 'email', 'password', 'rol', 'activo'];
// Al CREAR no se acepta "rol": cualquier persona podría registrarse como admin.
// El rol solo se cambia con PUT, que en la Parte 3 quedará protegido con JWT y permiso de admin.
const CAMPOS_USUARIO_ALTA = CAMPOS_USUARIO.filter((campo) => campo !== 'rol');
const CAMPOS_PERFIL = ['bio', 'telefono', 'ciudad'];

const filtrar = (objeto = {}, permitidos) =>
  Object.fromEntries(Object.entries(objeto).filter(([clave]) => permitidos.includes(clave)));

// Convierte "true"/"false" de la URL en booleano; si no es ninguno, error 400
const leerBooleano = (valor, nombre) => {
  if (valor === undefined) return undefined;
  if (valor === 'true') return true;
  if (valor === 'false') return false;
  throw new AppError(400, `El parámetro "${nombre}" debe ser true o false`);
};

// GET /api/usuarios?q=&rol=&activo=&page=&limit=&orden=
const listar = async (query) => {
  const { pagina, limite, offset } = leerPaginacion(query);
  const order = leerOrden(query.orden, ['id', 'nombre', 'email', 'createdAt'], [['id', 'ASC']]);
  const where = {};

  if (query.q) {
    // Búsqueda dinámica: coincidencia parcial e insensible a mayúsculas en nombre o email
    where[Op.or] = [
      { nombre: { [Op.iLike]: `%${query.q}%` } },
      { email: { [Op.iLike]: `%${query.q}%` } },
    ];
  }
  if (query.rol) {
    if (!['admin', 'usuario'].includes(query.rol)) throw new AppError(400, 'El filtro "rol" debe ser admin o usuario');
    where.rol = query.rol;
  }
  const activo = leerBooleano(query.activo, 'activo');
  if (activo !== undefined) where.activo = activo;

  const { rows, count } = await Usuario.findAndCountAll({
    where, order, limit: limite, offset,
    include: [{ model: Perfil, as: 'perfil' }],
    distinct: true,
  });
  return { items: rows, paginacion: armarPagina(count, pagina, limite) };
};

// GET /api/usuarios/:id  (incluye perfil y proyectos)
const obtener = async (id) => {
  const usuario = await Usuario.findByPk(id, {
    include: [
      { model: Perfil, as: 'perfil' },
      { model: Proyecto, as: 'proyectos', attributes: ['id', 'titulo', 'estado', 'fechaLimite'] },
    ],
  });
  if (!usuario) throw new AppError(404, 'Usuario no encontrado');
  return usuario;
};

// POST /api/usuarios  (puede traer un objeto "perfil"; usuario y perfil se crean en una transacción)
const crear = async (body = {}) => {
  const id = await sequelize.transaction(async (t) => {
    const usuario = await Usuario.create(filtrar(body, CAMPOS_USUARIO_ALTA), { transaction: t });
    if (body.perfil) {
      await Perfil.create({ ...filtrar(body.perfil, CAMPOS_PERFIL), usuarioId: usuario.id }, { transaction: t });
    }
    return usuario.id;
  });
  // La consulta final se hace ya con la transacción confirmada
  return obtener(id);
};

// PUT /api/usuarios/:id
const actualizar = async (id, body = {}) => {
  const usuario = await Usuario.scope('conPassword').findByPk(id);
  if (!usuario) throw new AppError(404, 'Usuario no encontrado');
  await usuario.update(filtrar(body, CAMPOS_USUARIO));
  return obtener(id);
};

// DELETE /api/usuarios/:id  (borra también su perfil y sus proyectos por CASCADE)
const eliminar = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new AppError(404, 'Usuario no encontrado');
  await usuario.destroy();
};

// GET /api/usuarios/:id/perfil
const obtenerPerfil = async (usuarioId) => {
  const perfil = await Perfil.findOne({ where: { usuarioId } });
  if (!perfil) {
    const existe = await Usuario.findByPk(usuarioId);
    throw new AppError(404, existe ? 'El usuario todavía no tiene perfil' : 'Usuario no encontrado');
  }
  return perfil;
};

// PUT /api/usuarios/:id/perfil  (crea el perfil si no existe, o lo actualiza)
const guardarPerfil = async (usuarioId, body = {}) => {
  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) throw new AppError(404, 'Usuario no encontrado');
  const datos = filtrar(body, CAMPOS_PERFIL);
  const perfil = await Perfil.findOne({ where: { usuarioId } });
  return perfil ? perfil.update(datos) : Perfil.create({ ...datos, usuarioId });
};

module.exports = { listar, obtener, crear, actualizar, eliminar, obtenerPerfil, guardarPerfil };
