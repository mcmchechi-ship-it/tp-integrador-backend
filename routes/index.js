// routes/index.js — Router principal. Solo define rutas y delega en los controladores.

const express = require('express');
const { inicio, status, visitas } = require('../controllers/home.controller');
const apiRouter = require('./api');

const router = express.Router();

router.get('/', inicio);           // Ruta pública HTML (vista EJS)
router.get('/status', status);     // Ruta pública JSON
router.get('/visitas', visitas);   // Ruta pública JSON: últimos registros del log

router.use('/api', apiRouter);     // API REST (Parte 2)

module.exports = router;
