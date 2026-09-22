// models/perfil.model.js — Datos extendidos de un usuario (relación 1:1).

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Perfil = sequelize.define('Perfil', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // "unique" es lo que garantiza que sea 1:1 y no 1:N
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: { len: { args: [0, 500], msg: 'La bio no puede superar los 500 caracteres' } },
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: { args: /^[0-9+\-\s()]{6,20}$/, msg: 'El teléfono solo admite números, +, -, espacios y paréntesis (6 a 20 caracteres)' },
    },
  },
  ciudad: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  // Se usará en la Parte 3 para guardar la ruta de la imagen subida
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'perfiles',
});

module.exports = Perfil;
