// app.js — Configuración de Express: motor de vistas, middlewares y rutas.

const path = require('path');
const express = require('express');
const router = require('./routes');                       // Router principal (routes/index.js)
const { logVisitas } = require('./middlewares/logVisitas.middleware');
const { notFound, errorHandler } = require('./middlewares/errores.middleware');

const app = express();

// Motor de plantillas EJS: las vistas están en /views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Permite leer JSON en el body (se usará en las Partes 2 y 3)
app.use(express.json());

// Sirve los archivos estáticos (CSS, imágenes, HTML) de la carpeta /public
app.use(express.static(path.join(__dirname, 'public')));

// Registra cada visita en logs/log.txt (fecha, hora, ruta)
app.use(logVisitas);

// Conecta el router externo con las rutas del sistema
app.use('/', router);

// Manejo de rutas inexistentes (404) y de errores (500)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
