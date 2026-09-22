// models/etiqueta.model.js — Etiquetas para clasificar proyectos (relación N:M).

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Etiqueta = sequelize.define('Etiqueta', {
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: { name: 'etiquetas_nombre_unico', msg: 'Ya existe una etiqueta con ese nombre' },
    validate: {
      notEmpty: { msg: 'El nombre de la etiqueta es obligatorio' },
      len: { args: [2, 50], msg: 'El nombre debe tener entre 2 y 50 caracteres' },
    },
    set(valor) {
      this.setDataValue('nombre', typeof valor === 'string' ? valor.trim().toLowerCase() : valor);
    },
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    validate: { is: { args: /^#[0-9a-fA-F]{6}$/, msg: 'El color debe ser hexadecimal, por ejemplo #1f6feb' } },
  },
}, {
  tableName: 'etiquetas',
});

module.exports = Etiqueta;
