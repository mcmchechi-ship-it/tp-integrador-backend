// utils/paginacion.js — Lee y valida ?page, ?limit y ?orden de la URL.

const AppError = require('./AppError');

const LIMITE_MAXIMO = 50;

// Devuelve { pagina, limite, offset }
const leerPaginacion = (query) => {
  const pagina = query.page === undefined ? 1 : Number(query.page);
  const limite = query.limit === undefined ? 10 : Number(query.limit);

  if (!Number.isInteger(pagina) || pagina < 1) {
    throw new AppError(400, 'El parámetro "page" debe ser un entero mayor o igual a 1');
  }
  if (!Number.isInteger(limite) || limite < 1 || limite > LIMITE_MAXIMO) {
    throw new AppError(400, `El parámetro "limit" debe ser un entero entre 1 y ${LIMITE_MAXIMO}`);
  }
  return { pagina, limite, offset: (pagina - 1) * limite };
};

// Convierte "campo" o "-campo" en [['campo','ASC']] / [['campo','DESC']] validando contra una lista blanca
const leerOrden = (valor, camposPermitidos, porDefecto) => {
  if (!valor) return porDefecto;
  const desc = valor.startsWith('-');
  const campo = desc ? valor.slice(1) : valor;
  if (!camposPermitidos.includes(campo)) {
    throw new AppError(400, `No se puede ordenar por "${campo}". Campos permitidos: ${camposPermitidos.join(', ')}`);
  }
  return [[campo, desc ? 'DESC' : 'ASC']];
};

const armarPagina = (total, pagina, limite) => ({
  total,
  pagina,
  limite,
  totalPaginas: Math.max(1, Math.ceil(total / limite)),
});

module.exports = { leerPaginacion, leerOrden, armarPagina };
