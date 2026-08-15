//backend-logistica/src/controllers/inventarioController.js
const InventarioModel = require('../models/inventarioModel');

//CONTROLADOR: Obtener todos los insumos
const getInventario = async (req, res) => {
    try {
        const insumos = await InventarioModel.obtenerTodosLosInsumos();
        res.status(200).json(insumos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno al obtener el inventario', error: error.message });
    }
};

// CONTROLADOR: Buscar un insumo
const buscarInsumo = async (req, res) => {
    try {
        const { codigo } = req.params; // Extraemos el código de la URL
        const insumos = await InventarioModel.buscarInsumoPorCodigo(codigo);
        
        //Si el arreglo viene vacío, el insumo no existe
        if (insumos.length === 0) {
            return res.status(404).json({ mensaje: 'Insumo no encontrado.' });
        }
        
        //Si lo encuentra, enviamos el primer(y único) resultado
        res.status(200).json(insumos[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno al buscar el insumo', error: error.message });
    }
};

// CONTROLADOR: Registrar un insumo
const registrarInsumo = async (req, res) => {
    try {
        const nuevoInsumo = req.body;
        await InventarioModel.registrarNuevoInsumo(nuevoInsumo);
        
        res.status(201).json({ mensaje: '¡Insumo registrado exitosamente en la base de datos!' });
    } catch (error) {
        console.error('Error en registrarInsumo:', error);

        //Códigos 2627 o 2601 en SQL Server son duplicados
        const sqlNumber = error.number || (error.originalError && error.originalError.number);

        if (sqlNumber === 2627 || sqlNumber === 2601) {
            return res.status(400).json({ 
                mensaje: 'El Activo Fijo o el Número de Inventario ya se encuentra registrado en el sistema.' 
            });
        }

        //Si el Código CeCo no existe y provoca que id_centro_costo quede nulo(error 515)
        if (sqlNumber === 515) {
            return res.status(400).json({ 
                mensaje: 'El Código CeCo ingresado no existe en el catálogo de Centros de Costo.' 
            });
        }

        //Error general
        res.status(500).json({ 
            mensaje: 'Error interno al registrar el insumo en el servidor.' 
        });
    }
};

// CONTROLADOR: Actualizar/Editar Insumo
const editarInsumo = async (req, res) => {
    try {
        const { codigo } = req.params;
        const datosActualizados = req.body;
        
        await InventarioModel.actualizarInsumo(codigo, datosActualizados);
        res.status(200).json({ mensaje: '¡Insumo actualizado exitosamente!' });
    } catch (error) {
        console.error('Error en editarInsumo:', error);
        res.status(500).json({ mensaje: 'Error interno al actualizar el insumo', error: error.message });
    }
};

// CONTROLADOR: Eliminar Insumo
const borrarInsumo = async (req, res) => {
    try {
        const { codigo } = req.params;
        await InventarioModel.eliminarInsumo(codigo);
        res.status(200).json({ mensaje: '¡Insumo eliminado correctamente de la base de datos!' });
    } catch (error) {
        console.error('Error en borrarInsumo:', error);
        res.status(500).json({ mensaje: 'Error interno al eliminar el insumo', error: error.message });
    }
};

module.exports = {
    getInventario,
    buscarInsumo,
    registrarInsumo,
    editarInsumo,
    borrarInsumo
};