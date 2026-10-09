//backend-logistica/src/models/inventarioModel.js

const { supabase } = require('../config/db');

// =====================================================
// CONFIGURACIÓN GENERAL
// =====================================================

const TAMANO_PAGINA = 500;

const COLUMNAS = `
    numero_activo_fijo,
    numero_inventario,
    denominacion,
    estado_fisico,
    ubicado,
    centros_costo (
        codigo_centro_costo,
        denominacion
    )
`;

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

// Convertir el resultado de Supabase al formato de React
const formatearInsumo = (activo) => ({
    activo_fijo: activo.numero_activo_fijo,
    numero_inventario: activo.numero_inventario,
    denominacion: activo.denominacion,
    centro_costo: activo.centros_costo?.codigo_centro_costo ?? null,
    denom_ceco: activo.centros_costo?.denominacion ?? null,
    estado_fisico: activo.estado_fisico,
    ubicacion: activo.ubicado
});

// Verificar errores devueltos por Supabase
const verificarError = (error) => {
    if (error) {
        console.error('Error de Supabase:', error);
        throw error;
    }
};

// Crear errores personalizados
const crearError = (codigo, mensaje) => {
    const error = new Error(mensaje);
    error.code = codigo;
    return error;
};

// Buscar el ID de un centro de costo
const obtenerIdCentroCosto = async (codigo) => {
    if (typeof codigo !== 'string' || !codigo.trim()) {
        throw crearError(
            'CECO_NO_EXISTE',
            'Debes proporcionar un Código CeCo válido.'
        );
    }

    const { data, error } = await supabase
        .from('centros_costo')
        .select('id_centro_costo')
        .eq('codigo_centro_costo', codigo.trim())
        .maybeSingle();

    verificarError(error);

    if (!data) {
        throw crearError(
            'CECO_NO_EXISTE',
            'El Código CeCo ingresado no existe en el catálogo.'
        );
    }

    return data.id_centro_costo;
};

// Buscar por coincidencia exacta en ambos identificadores
// Se usan filtros .eq() independientes para evitar
// insertar texto del usuario en la sintaxis de .or()
const buscarCoincidencias = async (codigo, columnas = COLUMNAS) => {
    if (typeof codigo !== 'string' || !codigo.trim()) {
        throw crearError(
            'CODIGO_INVALIDO',
            'Debes proporcionar un código válido.'
        );
    }

    const valor = codigo.trim();

    const [porActivo, porInventario] = await Promise.all([
        supabase
            .from('activos_fijos')
            .select(columnas)
            .eq('numero_activo_fijo', valor),

        supabase
            .from('activos_fijos')
            .select(columnas)
            .eq('numero_inventario', valor)
    ]);

    verificarError(porActivo.error);
    verificarError(porInventario.error);

    const encontrados = new Map();

    for (const activo of [
        ...(porActivo.data || []),
        ...(porInventario.data || [])
    ]) {
        encontrados.set(activo.numero_activo_fijo, activo);
    }

    return Array.from(encontrados.values());
};

// Encontrar un único activo para editar o eliminar
const encontrarActivo = async (codigo) => {
    const coincidencias = await buscarCoincidencias(
        codigo,
        'numero_activo_fijo, numero_inventario'
    );

    if (coincidencias.length === 0) {
        throw crearError(
            'ACTIVO_NO_EXISTE',
            'El activo solicitado no existe.'
        );
    }

    if (coincidencias.length > 1) {
        throw crearError(
            'CODIGO_AMBIGUO',
            'El código coincide con varios activos.'
        );
    }

    return coincidencias[0].numero_activo_fijo;
};

// =====================================================
// 1. OBTENER TODOS LOS INSUMOS
// =====================================================

const obtenerTodosLosInsumos = async () => {
    try {
        const todos = [];
        let inicio = 0;

        while (true) {
            const { data, error } = await supabase
                .from('activos_fijos')
                .select(COLUMNAS)
                .order('numero_activo_fijo', {
                    ascending: true
                })
                .range(
                    inicio,
                    inicio + TAMANO_PAGINA - 1
                );

            verificarError(error);

            const registros = data || [];

            todos.push(...registros);

            if (registros.length < TAMANO_PAGINA) {
                break;
            }

            inicio += TAMANO_PAGINA;
        }

        console.log(
            `Inventario consultado: ${todos.length} activos.`
        );

        return todos.map(formatearInsumo);

    } catch (error) {
        console.error('Error al obtener inventario:', error);
        throw error;
    }
};

// =====================================================
// 2. BUSCAR UN INSUMO POR CÓDIGO
// =====================================================

const buscarInsumoPorCodigo = async (codigo) => {
    try {
        const encontrados = await buscarCoincidencias(codigo);

        return encontrados.map(formatearInsumo);

    } catch (error) {
        console.error('Error al buscar activo:', error);
        throw error;
    }
};

// =====================================================
// 3. REGISTRAR NUEVO INSUMO
// =====================================================

const registrarNuevoInsumo = async (datos) => {
    try {
        const idCentroCosto = await obtenerIdCentroCosto(
            datos.codigo_centro_costo
        );

        const nuevoActivo = {
            numero_activo_fijo: datos.activo_fijo,
            numero_inventario: datos.numero_inventario || null,
            denominacion: datos.denominacion,
            id_centro_costo: idCentroCosto,
            estado_fisico: datos.estado_fisico || null,
            ubicado: datos.ubicacion || null
        };

        const { data, error } = await supabase
            .from('activos_fijos')
            .insert(nuevoActivo)
            .select('numero_activo_fijo')
            .single();

        verificarError(error);

        return data;

    } catch (error) {
        console.error('Error al registrar activo:', error);
        throw error;
    }
};

// =====================================================
// 4. ACTUALIZAR / EDITAR INSUMO
// =====================================================

const actualizarInsumo = async (codigo, datos) => {
    try {
        const activoOriginal = await encontrarActivo(codigo);

        const idCentroCosto = await obtenerIdCentroCosto(
            datos.codigo_centro_costo
        );

        const datosActualizados = {
            numero_activo_fijo: datos.activo_fijo,
            numero_inventario: datos.numero_inventario || null,
            denominacion: datos.denominacion,
            id_centro_costo: idCentroCosto,
            estado_fisico: datos.estado_fisico || null,
            ubicado: datos.ubicacion || null
        };

        const { data, error } = await supabase
            .from('activos_fijos')
            .update(datosActualizados)
            .eq('numero_activo_fijo', activoOriginal)
            .select('numero_activo_fijo')
            .maybeSingle();

        verificarError(error);

        if (!data) {
            throw crearError(
                'ACTIVO_NO_EXISTE',
                'No se encontró el activo para actualizar.'
            );
        }

        return data;

    } catch (error) {
        console.error('Error al actualizar activo:', error);
        throw error;
    }
};

// =====================================================
// 5. ELIMINAR INSUMO
// =====================================================

const eliminarInsumo = async (codigo) => {
    try {
        const activoOriginal = await encontrarActivo(codigo);

        const { data, error } = await supabase
            .from('activos_fijos')
            .delete()
            .eq('numero_activo_fijo', activoOriginal)
            .select('numero_activo_fijo')
            .maybeSingle();

        verificarError(error);

        if (!data) {
            throw crearError(
                'ACTIVO_NO_EXISTE',
                'No se encontró el activo para eliminar.'
            );
        }

        return data;

    } catch (error) {
        console.error('Error al eliminar activo:', error);
        throw error;
    }
};

// =====================================================
// EXPORTACIÓN DE FUNCIONES
// =====================================================

module.exports = {
    obtenerTodosLosInsumos,
    buscarInsumoPorCodigo,
    registrarNuevoInsumo,
    actualizarInsumo,
    eliminarInsumo
};
