// scripts/crear-bd.js — Crea la base de datos indicada en .env si todavía no existe.
// Uso: npm run db:create

require('dotenv').config();
const { Client } = require('pg');

const { DB_HOST = 'localhost', DB_PORT = 5432, DB_USER = 'postgres', DB_PASSWORD = '', DB_NAME = 'tp_integrador' } = process.env;

// El nombre va entre comillas en el SQL, así que se restringe a caracteres seguros
if (!/^[A-Za-z0-9_]+$/.test(DB_NAME)) {
  console.error('DB_NAME solo puede contener letras, números y guion bajo.');
  process.exit(1);
}

const main = async () => {
  // Se conecta a la base "postgres" (siempre existe) para poder crear la nuestra
  const client = new Client({ host: DB_HOST, port: Number(DB_PORT), user: DB_USER, password: DB_PASSWORD, database: 'postgres' });
  try {
    await client.connect();
    const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
    if (rowCount) {
      console.log(`La base de datos "${DB_NAME}" ya existe. No se hizo ningún cambio.`);
    } else {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Base de datos "${DB_NAME}" creada correctamente.`);
    }
  } catch (error) {
    console.error('No se pudo crear la base de datos:', error.message);
    console.error('Revisa DB_HOST, DB_PORT, DB_USER y DB_PASSWORD en tu archivo .env');
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
};

main();
