// index.js — Punto de entrada de la aplicación.
// Solo arranca el servidor; la configuración de Express vive en app.js
// para poder reutilizarla (por ejemplo en tests) en las siguientes partes.

require('dotenv').config();            // Carga las variables de .env en process.env
const app = require('./app');          // Importa la aplicación Express ya configurada
const { registrarEvento } = require('./services/logger.service');

const PORT = process.env.PORT || 3000; // Puerto desde .env, con valor por defecto

app.listen(PORT, () => {
  console.log('Servidor iniciado');                       // Mensaje exigido por la consigna
  console.log(`Escuchando en http://localhost:${PORT}`);
  registrarEvento('INICIO_SERVIDOR', `puerto ${PORT}`);   // Deja constancia del arranque en log.txt
});
