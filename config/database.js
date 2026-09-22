// config/database.js — Conexión a PostgreSQL con Sequelize.
// Todos los datos sensibles se leen desde variables de entorno (.env).

require('dotenv').config();
const { Sequelize } = require('sequelize');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'tp_integrador',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: 'postgres',
  // Muestra las consultas SQL en consola solo si DB_LOGGING=true
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  define: {
    underscored: false,   // Columnas en camelCase (usuarioId, fechaLimite)
    timestamps: true,     // createdAt y updatedAt automáticos
  },
});

module.exports = { sequelize, config };
