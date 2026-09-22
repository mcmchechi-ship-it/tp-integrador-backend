// index.js — Punto de entrada de la aplicación.
// Conecta a PostgreSQL, sincroniza las tablas y luego levanta el servidor.

require('dotenv').config();            // Carga las variables de .env en process.env
const app = require('./app');          // Aplicación Express ya configurada
const { sequelize, config } = require('./config/database');
require('./models');                   // Registra modelos y relaciones antes de sincronizar
const { registrarEvento } = require('./services/logger.service');

const PORT = process.env.PORT || 3000; // Puerto desde .env, con valor por defecto

const iniciar = async () => {
  try {
    await sequelize.authenticate();    // Comprueba que PostgreSQL responde
    await sequelize.sync();            // Crea las tablas que aún no existan (no borra datos)
    console.log(`Base de datos conectada: ${config.database}@${config.host}:${config.port}`);
  } catch (error) {
    console.error('No se pudo conectar a PostgreSQL:', error.message);
    console.error('Revisa que el servicio esté activo y que los datos DB_* de tu archivo .env sean correctos.');
    console.error('Si la base de datos no existe todavía, ejecuta: npm run db:create');
    registrarEvento('ERROR_BD', error.message.replace(/\s+/g, ' '));
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('Servidor iniciado');                       // Mensaje exigido por la consigna
    console.log(`Escuchando en http://localhost:${PORT}`);
    registrarEvento('INICIO_SERVIDOR', `puerto ${PORT}`);   // Deja constancia del arranque en log.txt
  });
};

iniciar();
