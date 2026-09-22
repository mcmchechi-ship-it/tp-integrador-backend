// controllers/home.controller.js — Lógica de respuesta de cada ruta.

const { leerUltimosRegistros } = require('../services/logger.service');

// GET / -> respuesta HTML renderizada con EJS (contenido dinámico)
const inicio = (req, res) => {
  res.render('index', {
    titulo: 'TP Integrador Backend',
    fecha: new Date().toLocaleString('es-CL'),
    rutas: [
      { metodo: 'GET', ruta: '/', descripcion: 'Esta página (HTML dinámico con EJS)' },
      { metodo: 'GET', ruta: '/status', descripcion: 'Estado del servidor en JSON' },
      { metodo: 'GET', ruta: '/visitas', descripcion: 'Últimos registros de log.txt' },
      { metodo: 'CRUD', ruta: '/api/usuarios', descripcion: 'API de usuarios y perfiles (PostgreSQL)' },
      { metodo: 'CRUD', ruta: '/api/proyectos', descripcion: 'API de proyectos (filtros y búsqueda)' },
      { metodo: 'CRUD', ruta: '/api/etiquetas', descripcion: 'API de etiquetas' },
    ],
  });
};

// GET /status -> respuesta JSON con el estado del servidor
const status = (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    data: {
      uptimeSegundos: Math.round(process.uptime()),
      nodeVersion: process.version,
      fecha: new Date().toISOString(),
    },
  });
};

// GET /visitas -> devuelve las últimas líneas del archivo plano de logs
const visitas = async (req, res, next) => {
  try {
    const registros = await leerUltimosRegistros(10);
    res.json({ status: 'ok', message: 'Últimos registros', data: registros });
  } catch (error) {
    next(error); // Delegamos al middleware de errores
  }
};

module.exports = { inicio, status, visitas };
