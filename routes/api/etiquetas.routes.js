// routes/api/etiquetas.routes.js — Endpoints REST de /api/etiquetas

const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const { validarId } = require('../../middlewares/validarId.middleware');
const c = require('../../controllers/etiqueta.controller');

const router = express.Router();

router.get('/', asyncHandler(c.listar));
router.post('/', asyncHandler(c.crear));
router.get('/:id', validarId, asyncHandler(c.obtener));
router.put('/:id', validarId, asyncHandler(c.actualizar));
router.delete('/:id', validarId, asyncHandler(c.eliminar));

module.exports = router;
