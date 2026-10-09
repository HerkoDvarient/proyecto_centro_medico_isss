//backend-logistica/src/routes/inventarioRoutes.js

const express = require('express');
const router = express.Router();

const inventarioController = require('../controllers/inventarioController');

const {
    verificarAutenticacion
} = require('../middlewares/authMiddleware');

// Todas las rutas de inventario requieren autenticación.
router.use(verificarAutenticacion);

// CONSULTAR INVENTARIO
router.get('/', inventarioController.getInventario);

// BUSCAR ACTIVO
router.get('/buscar/:codigo', inventarioController.buscarInsumo);

// REGISTRAR ACTIVO
router.post('/registrar', inventarioController.registrarInsumo);

// EDITAR ACTIVO
router.put('/editar/:codigo', inventarioController.editarInsumo);

// ELIMINAR ACTIVO
router.delete('/eliminar/:codigo', inventarioController.borrarInsumo);

module.exports = router;
