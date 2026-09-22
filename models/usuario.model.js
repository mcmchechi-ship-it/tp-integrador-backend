// models/usuario.model.js — Entidad Usuario.
// La contraseña se guarda siempre cifrada (bcrypt) y nunca se devuelve en las consultas.

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' },
      len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' },
    },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: { name: 'usuarios_email_unico', msg: 'Ya existe un usuario con ese email' },
    validate: {
      isEmail: { msg: 'El email no tiene un formato válido' },
    },
    set(valor) {
      // Normaliza: sin espacios y en minúsculas
      this.setDataValue('email', typeof valor === 'string' ? valor.trim().toLowerCase() : valor);
    },
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      // Se valida el texto plano; el hash se genera después, en el hook
      len: { args: [8, 72], msg: 'La contraseña debe tener entre 8 y 72 caracteres' },
    },
  },
  rol: {
    type: DataTypes.ENUM('admin', 'usuario'),
    allowNull: false,
    defaultValue: 'usuario',
    validate: {
      isIn: { args: [['admin', 'usuario']], msg: 'El rol debe ser "admin" o "usuario"' },
    },
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'usuarios',
  // Por defecto la contraseña NO se incluye en las consultas
  defaultScope: { attributes: { exclude: ['password'] } },
  // Scope especial para cuando se necesite verificar la contraseña (login, Parte 3)
  scopes: { conPassword: { attributes: {} } },
  hooks: {
    // Cifra la contraseña antes de guardar (al crear o si cambió)
    beforeSave: async (usuario) => {
      if (usuario.changed('password')) {
        usuario.password = await bcrypt.hash(usuario.password, 10);
      }
    },
  },
});

// Compara una contraseña en texto plano con el hash guardado
Usuario.prototype.verificarPassword = function verificarPassword(textoPlano) {
  return bcrypt.compare(textoPlano, this.password);
};

module.exports = Usuario;
