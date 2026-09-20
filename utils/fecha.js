// utils/fecha.js — Utilidad para formatear fecha y hora de forma estable.

const dosDigitos = (n) => String(n).padStart(2, '0');

const formatearFechaHora = (d) => ({
  fecha: `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}`,
  hora: `${dosDigitos(d.getHours())}:${dosDigitos(d.getMinutes())}:${dosDigitos(d.getSeconds())}`,
});

module.exports = { formatearFechaHora };
