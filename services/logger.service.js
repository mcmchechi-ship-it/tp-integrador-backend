// services/logger.service.js — Persistencia en archivo plano (fs) para logs.

const fs = require('fs');
const path = require('path');
const { formatearFechaHora } = require('../utils/fecha');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'log.txt');

// Estructura mínima exigida: [YYYY-MM-DD] [HH:MM:SS] <evento> <detalle>
const FORMATO_VALIDO = /^\[\d{4}-\d{2}-\d{2}\] \[\d{2}:\d{2}:\d{2}\] \S+ .+$/;

// Valida que la línea contenga fecha, hora y ruta/detalle
const esLineaValida = (linea) => FORMATO_VALIDO.test(linea);

// Agrega una línea al final de log.txt usando fs.appendFile()
const registrarEvento = (evento, detalle) => {
  const { fecha, hora } = formatearFechaHora(new Date());
  const linea = `[${fecha}] [${hora}] ${evento} ${detalle}`;

  if (!esLineaValida(linea)) {
    console.error('Línea de log con formato inválido:', linea);
    return;
  }

  fs.mkdirSync(LOG_DIR, { recursive: true }); // Garantiza que exista /logs
  fs.appendFile(LOG_FILE, linea + '\n', (err) => {
    if (err) console.error('No se pudo escribir en log.txt:', err.message);
  });
};

// Lee las últimas N líneas del log
const leerUltimosRegistros = async (cantidad = 10) => {
  try {
    const contenido = await fs.promises.readFile(LOG_FILE, 'utf8');
    return contenido.split('\n').filter(Boolean).slice(-cantidad);
  } catch (err) {
    if (err.code === 'ENOENT') return []; // Aún no existe el archivo
    throw err;
  }
};

module.exports = { registrarEvento, leerUltimosRegistros, esLineaValida, LOG_FILE };
