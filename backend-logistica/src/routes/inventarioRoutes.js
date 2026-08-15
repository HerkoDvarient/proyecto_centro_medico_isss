//backend-logistica/src/routes/inventarioRoutes.js
const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// RUTA: para obtener todos los insumos(Inventario General)
router.get('/', inventarioController.getInventario);

// RUTA: Buscar por código específico
router.get('/buscar/:codigo', inventarioController.buscarInsumo);

// RUTA: Recibe datos para registrar mediante el método POST
router.post('/registrar', inventarioController.registrarInsumo);

// RUTA: Editar un insumo
router.put('/editar/:codigo', inventarioController.editarInsumo);

// RUTA: Eliminar un insumo
router.delete('/eliminar/:codigo', inventarioController.borrarInsumo);

module.exports = router;