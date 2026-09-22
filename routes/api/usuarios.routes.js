// routes/api/usuarios.routes.js — Endpoints REST de /api/usuarios

const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const { validarId } = require('../../middlewares/validarId.middleware');
const c = require('../../controllers/usuario.controller');

const router = express.Router();

router.get('/', asyncHandler(c.listar));
router.post('/', asyncHandler(c.crear));
router.get('/:id', validarId, asyncHandler(c.obtener));
router.put('/:id', validarId, asyncHandler(c.actualizar));
router.delete('/:id', validarId, asyncHandler(c.eliminar));

// Perfil del usuario (relación 1:1)
router.get('/:id/perfil', validarId, asyncHandler(c.obtenerPerfil));
router.put('/:id/perfil', validarId, asyncHandler(c.guardarPerfil));

module.exports = router;
