// scripts/seed.js — Carga datos de ejemplo.
//   npm run db:seed   -> carga los datos solo si la base está vacía
//   npm run db:reset  -> BORRA todas las tablas, las recrea y carga los datos de ejemplo

require('dotenv').config();
const { sequelize, Usuario, Perfil, Proyecto, Etiqueta } = require('../models');

const reset = process.argv.includes('--reset');

const main = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: reset }); // force:true elimina y recrea las tablas

  if (!reset && (await Usuario.count()) > 0) {
    console.log('La base ya tiene datos. Usa "npm run db:reset" si quieres borrarlos y volver a cargar el ejemplo.');
    return;
  }

  // Se crean en orden para que los ids sean predecibles (Ana=1, Luis=2, Sofía=3)
  const ana = await Usuario.create({ nombre: 'Ana Pérez', email: 'ana@ejemplo.com', password: 'clave12345', rol: 'admin' });
  const luis = await Usuario.create({ nombre: 'Luis Soto', email: 'luis@ejemplo.com', password: 'clave12345' });
  const sofia = await Usuario.create({ nombre: 'Sofía Rojas', email: 'sofia@ejemplo.com', password: 'clave12345' });

  await Perfil.bulkCreate([
    { usuarioId: ana.id, bio: 'Líder técnica del equipo backend.', telefono: '+56 9 1111 2222', ciudad: 'Punta Arenas' },
    { usuarioId: luis.id, bio: 'Desarrollador full stack.', telefono: '+56 9 3333 4444', ciudad: 'Santiago' },
  ]);

  const backend = await Etiqueta.create({ nombre: 'backend', color: '#1f6feb' });
  const frontend = await Etiqueta.create({ nombre: 'frontend', color: '#8250df' });
  const urgente = await Etiqueta.create({ nombre: 'urgente', color: '#cf222e' });
  const docs = await Etiqueta.create({ nombre: 'documentación', color: '#2da44e' });

  const p1 = await Proyecto.create({ titulo: 'API de usuarios', descripcion: 'CRUD de usuarios con PostgreSQL', estado: 'en_progreso', fechaLimite: '2026-10-15', usuarioId: ana.id });
  const p2 = await Proyecto.create({ titulo: 'Panel de administración', descripcion: 'Interfaz web para gestionar datos', estado: 'pendiente', fechaLimite: '2026-11-30', usuarioId: luis.id });
  const p3 = await Proyecto.create({ titulo: 'Manual de instalación', descripcion: 'Guía para desplegar el backend', estado: 'completado', usuarioId: sofia.id });
  const p4 = await Proyecto.create({ titulo: 'Migración de datos antiguos', descripcion: 'Importar registros del sistema anterior', estado: 'pendiente', fechaLimite: '2026-09-01', usuarioId: ana.id });

  await p1.setEtiquetas([backend, urgente]);
  await p2.setEtiquetas([frontend]);
  await p3.setEtiquetas([docs]);
  await p4.setEtiquetas([backend, urgente]);

  console.log('Datos de ejemplo cargados: 3 usuarios, 2 perfiles, 4 etiquetas y 4 proyectos.');
  console.log('Contraseña de los usuarios de ejemplo: clave12345');
};

main()
  .catch((error) => {
    console.error('Error al cargar los datos:', error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
