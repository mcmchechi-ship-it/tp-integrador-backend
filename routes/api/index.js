// routes/api/index.js — Agrupa todas las rutas de la API bajo /api

const express = require('express');
const usuarios = require('./usuarios.routes');
const proyectos = require('./proyectos.routes');
const etiquetas = require('./etiquetas.routes');

const router = express.Router();

router.use('/usuarios', usuarios);
router.use('/proyectos', proyectos);
router.use('/etiquetas', etiquetas);

module.exports = router;
