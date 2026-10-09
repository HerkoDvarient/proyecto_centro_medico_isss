
const InventarioModel = require('../models/inventarioModel');

// =====================================================
// MANEJO CENTRALIZADO DE ERRORES
// Compatible con Supabase PostgreSQL
// =====================================================

const responderError = (res, error, operacion) => {
    console.error(`Error al ${operacion}:`, error);

    // Registro duplicado (clave primaria o restricción UNIQUE)
    if (error.code === '23505') {
        return res.status(409).json({
            mensaje: 'El Activo Fijo o el Número de Inventario ya se encuentra registrado en el sistema.'
        });
    }

    // Centro de costo inexistente
    if (
        error.code === 'CECO_NO_EXISTE' ||
        error.code === '23503'
    ) {
        return res.status(400).json({
            mensaje: 'El Código CeCo ingresado no existe en el catálogo de Centros de Costo.'
        });
    }

    // Campo obligatorio vacío
    if (error.code === '23502') {
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios para completar la operación.'
        });
    }

    // Restricción CHECK incumplida
    if (error.code === '23514') {
        return res.status(400).json({
            mensaje: 'Uno de los valores ingresados no es válido. Verifica el estado físico.'
        });
    }

    // Activo inexistente
    if (error.code === 'ACTIVO_NO_EXISTE') {
        return res.status(404).json({
            mensaje: 'El activo solicitado no existe en el inventario.'
        });
    }

    // Código que coincide con más de un activo
    if (error.code === 'CODIGO_AMBIGUO') {
        return res.status(409).json({
            mensaje: 'El código ingresado coincide con varios activos. Utiliza un identificador único.'
        });
    }

    // Error general
    return res.status(500).json({
        mensaje: `Error interno al ${operacion}.`
    });
};

// =====================================================
// CONTROLADOR: OBTENER TODOS LOS INSUMOS
// GET /api/inventario
// =====================================================

const getInventario = async (req, res) => {
    try {
        const insumos = await InventarioModel.obtenerTodosLosInsumos();

        return res.status(200).json(insumos);

    } catch (error) {
        return responderError(res, error, 'obtener el inventario');
    }
};

// =====================================================
// CONTROLADOR: BUSCAR UN INSUMO
// GET /api/inventario/buscar/:codigo
// =====================================================

const buscarInsumo = async (req, res) => {
    try {
        const { codigo } = req.params;

        if (!codigo || !codigo.trim()) {
            return res.status(400).json({
                mensaje: 'Debes proporcionar un código para realizar la búsqueda.'
            });
        }

        const insumos = await InventarioModel.buscarInsumoPorCodigo(
            codigo.trim()
        );

        if (!insumos || insumos.length === 0) {
            return res.status(404).json({
                mensaje: 'Insumo no encontrado.'
            });
        }

        if (insumos.length > 1) {
            return res.status(409).json({
                mensaje: 'El código coincide con varios activos.'
            });
        }

        return res.status(200).json(insumos[0]);

    } catch (error) {
        return responderError(res, error, 'buscar el insumo');
    }
};

// =====================================================
// CONTROLADOR: REGISTRAR UN INSUMO
// POST /api/inventario/registrar
// =====================================================

const registrarInsumo = async (req, res) => {
    try {
        const nuevoInsumo = req.body;

        if (
            !nuevoInsumo ||
            !nuevoInsumo.activo_fijo ||
            !nuevoInsumo.denominacion ||
            !nuevoInsumo.codigo_centro_costo
        ) {
            return res.status(400).json({
                mensaje: 'Debes completar los campos obligatorios: Activo Fijo, Denominación y Código CeCo.'
            });
        }

        await InventarioModel.registrarNuevoInsumo(nuevoInsumo);

        return res.status(201).json({
            mensaje: '¡Insumo registrado exitosamente en la base de datos!'
        });

    } catch (error) {
        return responderError(res, error, 'registrar el insumo');
    }
};

// =====================================================
// CONTROLADOR: ACTUALIZAR / EDITAR INSUMO
// PUT /api/inventario/editar/:codigo
// =====================================================

const editarInsumo = async (req, res) => {
    try {
        const { codigo } = req.params;
        const datosActualizados = req.body;

        if (!codigo || !codigo.trim()) {
            return res.status(400).json({
                mensaje: 'Debes indicar el código del activo que deseas editar.'
            });
        }

        if (
            !datosActualizados ||
            !datosActualizados.activo_fijo ||
            !datosActualizados.denominacion ||
            !datosActualizados.codigo_centro_costo
        ) {
            return res.status(400).json({
                mensaje: 'Faltan datos obligatorios para actualizar el activo.'
            });
        }

        await InventarioModel.actualizarInsumo(
            codigo.trim(),
            datosActualizados
        );

        return res.status(200).json({
            mensaje: '¡Insumo actualizado exitosamente!'
        });

    } catch (error) {
        return responderError(res, error, 'actualizar el insumo');
    }
};

// =====================================================
// CONTROLADOR: ELIMINAR UN INSUMO
// DELETE /api/inventario/eliminar/:codigo
// =====================================================

const borrarInsumo = async (req, res) => {
    try {
        const { codigo } = req.params;

        if (!codigo || !codigo.trim()) {
            return res.status(400).json({
                mensaje: 'Debes indicar el código del activo que deseas eliminar.'
            });
        }

        await InventarioModel.eliminarInsumo(codigo.trim());

        return res.status(200).json({
            mensaje: '¡Insumo eliminado correctamente de la base de datos!'
        });

    } catch (error) {
        return responderError(res, error, 'eliminar el insumo');
    }
};

// =====================================================
// EXPORTACIÓN DE CONTROLADORES
// =====================================================

module.exports = {
    getInventario,
    buscarInsumo,
    registrarInsumo,
    editarInsumo,
    borrarInsumo
};
