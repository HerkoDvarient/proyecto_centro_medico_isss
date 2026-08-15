//backend-logistica/src/models/inventarioModel.js
const { sql, poolPromise } = require('../config/db');

// FUNCIÓN: Obtener todos los insumos
const obtenerTodosLosInsumos = async () => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request().query(`
            SELECT 
                af.numero_activo_fijo AS activo_fijo,
                af.numero_inventario,
                af.denominacion, 
                cc.codigo_centro_costo AS centro_costo, 
                cc.denominacion AS denom_ceco,
                af.estado_fisico,
                af.ubicado AS ubicacion
            FROM activos_fijos AS af
            LEFT JOIN centros_costo AS cc 
                ON af.id_centro_costo = cc.id_centro_costo
        `);
        return resultado.recordset; 
    } catch (error) {
        console.error('Error en inventarioModel:', error);
        throw new Error('Error al ejecutar la consulta en la base de datos');
    }
};

// FUNCIÓN: Buscar por código
const buscarInsumoPorCodigo = async (codigo) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('codigo', sql.VarChar, codigo) //Pasa el dato de forma segura
            .query(`
                SELECT 
                    af.numero_activo_fijo AS activo_fijo,
                    af.numero_inventario,
                    af.denominacion, 
                    cc.codigo_centro_costo AS centro_costo, 
                    cc.denominacion AS denom_ceco,
                    af.estado_fisico,
                    af.ubicado AS ubicacion
                FROM activos_fijos AS af
                LEFT JOIN centros_costo AS cc 
                    ON af.id_centro_costo = cc.id_centro_costo
                WHERE af.numero_inventario = @codigo OR af.numero_activo_fijo = @codigo
            `);
        return resultado.recordset; 
    } catch (error) {
        console.error('Error al buscar en inventarioModel:', error);
        throw new Error('Error al buscar en la base de datos');
    }
};

// FUNCIÓN: Registrar un nuevo insumo
const registrarNuevoInsumo = async (datos) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('numero_activo_fijo', sql.VarChar, datos.activo_fijo)
            .input('numero_inventario', sql.VarChar, datos.numero_inventario)
            .input('denominacion', sql.VarChar, datos.denominacion)
            .input('codigo_centro_costo', sql.VarChar, datos.codigo_centro_costo)
            .input('estado_fisico', sql.VarChar, datos.estado_fisico)
            .input('ubicado', sql.VarChar, datos.ubicacion)
            .query(`
                INSERT INTO activos_fijos (
                    numero_activo_fijo, 
                    numero_inventario, 
                    denominacion, 
                    id_centro_costo, 
                    estado_fisico, 
                    ubicado
                )
                VALUES (
                    @numero_activo_fijo, 
                    @numero_inventario, 
                    @denominacion, 
                    (SELECT id_centro_costo FROM centros_costo WHERE codigo_centro_costo = @codigo_centro_costo), 
                    @estado_fisico, 
                    @ubicado
                )
            `);
        return resultado;
    } catch (error) {
        console.error('Error al registrar en inventarioModel:', error);
        throw error; //Re lanza el error original con códigos de SQL Server
    }
};

// FUNCIÓN: Actualizar/Editar datos de un insumo
const actualizarInsumo = async (codigoIdentificador, datos) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('codigoIdentificador', sql.VarChar, codigoIdentificador)
            .input('numero_activo_fijo', sql.VarChar, datos.activo_fijo)
            .input('numero_inventario', sql.VarChar, datos.numero_inventario)
            .input('denominacion', sql.VarChar, datos.denominacion)
            .input('codigo_centro_costo', sql.VarChar, datos.codigo_centro_costo)
            .input('estado_fisico', sql.VarChar, datos.estado_fisico)
            .input('ubicado', sql.VarChar, datos.ubicacion)
            .query(`
                UPDATE activos_fijos
                SET 
                    numero_activo_fijo = @numero_activo_fijo,
                    numero_inventario = @numero_inventario,
                    denominacion = @denominacion,
                    id_centro_costo = (SELECT id_centro_costo FROM centros_costo WHERE codigo_centro_costo = @codigo_centro_costo),
                    estado_fisico = @estado_fisico,
                    ubicado = @ubicado
                WHERE numero_activo_fijo = @codigoIdentificador OR numero_inventario = @codigoIdentificador
            `);
        return resultado;
    } catch (error) {
        console.error('Error al actualizar en inventarioModel:', error);
        throw error;
    }
};

// FUNCIÓN: Eliminar un insumo
const eliminarInsumo = async (codigo) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('codigo', sql.VarChar, codigo)
            .query(`
                DELETE FROM activos_fijos 
                WHERE numero_activo_fijo = @codigo OR numero_inventario = @codigo
            `);
        return resultado;
    } catch (error) {
        console.error('Error al eliminar en inventarioModel:', error);
        throw error;
    }
};

module.exports = {
    obtenerTodosLosInsumos,
    buscarInsumoPorCodigo,
    registrarNuevoInsumo,
    actualizarInsumo, 
    eliminarInsumo    //Se exportan las funciones
};
