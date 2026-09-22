// models/proyecto.model.js — Entidad Proyecto (pertenece a un usuario: relación 1:N).

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ESTADOS = ['pendiente', 'en_progreso', 'completado'];

const Proyecto = sequelize.define('Proyecto', {
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El título es obligatorio' },
      len: { args: [3, 150], msg: 'El título debe tener entre 3 y 150 caracteres' },
    },
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM(...ESTADOS),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: { args: [ESTADOS], msg: `El estado debe ser uno de: ${ESTADOS.join(', ')}` },
    },
  },
  fechaLimite: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: { isDate: { msg: 'La fecha límite debe tener formato AAAA-MM-DD' } },
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'proyectos',
});

Proyecto.ESTADOS = ESTADOS;

module.exports = Proyecto;
