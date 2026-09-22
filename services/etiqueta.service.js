// services/etiqueta.service.js — CRUD de etiquetas (lado N:M de los proyectos).

const { Op } = require('sequelize');
const { Etiqueta, Proyecto } = require('../models');
const AppError = require('../utils/AppError');

const CAMPOS = ['nombre', 'color'];
const filtrar = (o = {}) => Object.fromEntries(Object.entries(o).filter(([k]) => CAMPOS.includes(k)));

const listar = async (query) => {
  const where = query.q ? { nombre: { [Op.iLike]: `%${query.q}%` } } : {};
  return Etiqueta.findAll({ where, order: [['nombre', 'ASC']] });
};

const obtener = async (id) => {
  const etiqueta = await Etiqueta.findByPk(id, {
    include: [{ model: Proyecto, as: 'proyectos', attributes: ['id', 'titulo', 'estado'], through: { attributes: [] } }],
  });
  if (!etiqueta) throw new AppError(404, 'Etiqueta no encontrada');
  return etiqueta;
};

const crear = (body) => Etiqueta.create(filtrar(body));

const actualizar = async (id, body) => {
  const etiqueta = await Etiqueta.findByPk(id);
  if (!etiqueta) throw new AppError(404, 'Etiqueta no encontrada');
  return etiqueta.update(filtrar(body));
};

const eliminar = async (id) => {
  const etiqueta = await Etiqueta.findByPk(id);
  if (!etiqueta) throw new AppError(404, 'Etiqueta no encontrada');
  await etiqueta.destroy(); // Sequelize limpia también las filas de la tabla intermedia
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
