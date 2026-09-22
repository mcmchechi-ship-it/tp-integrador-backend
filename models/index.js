// models/index.js — Reúne los modelos y define TODAS las relaciones en un solo lugar.

const { sequelize } = require('../config/database');
const Usuario = require('./usuario.model');
const Perfil = require('./perfil.model');
const Proyecto = require('./proyecto.model');
const Etiqueta = require('./etiqueta.model');

// ── 1:1  Usuario ↔ Perfil ───────────────────────────────────────────
Usuario.hasOne(Perfil, { foreignKey: 'usuarioId', as: 'perfil', onDelete: 'CASCADE' });
Perfil.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// ── 1:N  Usuario → Proyectos ────────────────────────────────────────
Usuario.hasMany(Proyecto, { foreignKey: 'usuarioId', as: 'proyectos', onDelete: 'CASCADE' });
Proyecto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'responsable' });

// ── N:M  Proyectos ↔ Etiquetas (tabla intermedia proyecto_etiquetas) ─
Proyecto.belongsToMany(Etiqueta, {
  through: 'proyecto_etiquetas',
  foreignKey: 'proyectoId',
  otherKey: 'etiquetaId',
  as: 'etiquetas',
  timestamps: false,
});
Etiqueta.belongsToMany(Proyecto, {
  through: 'proyecto_etiquetas',
  foreignKey: 'etiquetaId',
  otherKey: 'proyectoId',
  as: 'proyectos',
  timestamps: false,
});

module.exports = { sequelize, Usuario, Perfil, Proyecto, Etiqueta };
