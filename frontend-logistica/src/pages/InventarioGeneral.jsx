import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
const InventarioGeneral = () => {
    const [insumos, setInsumos] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    //Estado para controlar el insumo que se está editando en la ventana Modal
    const [insumoEditando, setInsumoEditando] = useState(null);

const obtenerDatos = async () => {
    setCargando(true);

    try {
        // Obtener la sesión activa de Supabase
        const {
            data: { session },
            error: errorSesion
        } = await supabase.auth.getSession();

        if (errorSesion || !session?.access_token) {
            throw new Error('No hay una sesión activa. Inicia sesión nuevamente.');
        }

        // Consultar el inventario enviando el token
        const respuesta = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/inventario`,
            {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            }
        );

        if (!respuesta.ok) {
            throw new Error(`Error del servidor: HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error('El servidor no devolvió una lista válida.');
        }

        setInsumos(datos);

        console.log(`Inventario cargado: ${datos.length} activos.`);

    } catch (error) {
        console.error('Error al obtener el inventario:', error);
        setInsumos([]);
    } finally {
        setCargando(false);
    }
};

useEffect(() => {
    obtenerDatos();
}, []);

    //FUNCIÓN ELIMINAR
    const handleEliminar = async (activo_fijo) => {
        const confirmar = window.confirm(`¿Está seguro de que desea eliminar el insumo con Activo Fijo: ${activo_fijo}?`);
        if (!confirmar) return;

       try {
    const {
        data: { session },
        error: errorSesion
    } = await supabase.auth.getSession();

    if (errorSesion || !session?.access_token) {
        alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
        return;
    }

    const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/inventario/eliminar/${encodeURIComponent(activo_fijo)}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        }
    );

    if (!respuesta.ok) {
        const errorDatos = await respuesta.json().catch(() => ({}));
        throw new Error(errorDatos.mensaje || `Error HTTP ${respuesta.status}`);
    }

    alert('Insumo eliminado con éxito.');
    await obtenerDatos();

} catch (error) {
    console.error('Error al eliminar:', error);
    alert(`No se pudo eliminar el insumo: ${error.message}`);
}
    };

    //FUNCIÓN GUARDAR EDICIÓN
  const handleGuardarEdicion = async (e) => {
    e.preventDefault();

    try {
        const {
            data: { session },
            error: errorSesion
        } = await supabase.auth.getSession();

        if (errorSesion || !session?.access_token) {
            alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
            return;
        }

        const respuesta = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/inventario/editar/${encodeURIComponent(insumoEditando.activo_fijo)}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    activo_fijo: insumoEditando.activo_fijo,
                    numero_inventario: insumoEditando.numero_inventario,
                    denominacion: insumoEditando.denominacion,
                    codigo_centro_costo: insumoEditando.centro_costo,
                    estado_fisico: insumoEditando.estado_fisico,
                    ubicacion: insumoEditando.ubicacion
                })
            }
        );

        if (!respuesta.ok) {
            const errorDatos = await respuesta.json().catch(() => ({}));
            throw new Error(
                errorDatos.mensaje || `Error HTTP ${respuesta.status}`
            );
        }

        alert('Insumo actualizado correctamente.');

        // Cerrar la ventana de edición
        setInsumoEditando(null);

        // Recargar el inventario
        await obtenerDatos();

    } catch (error) {
        console.error('Error al actualizar:', error);
        alert(`No se pudo actualizar el insumo: ${error.message}`);
    }
};

    const getEstadoStyle = (estado) => {
        const estiloBase = { padding: '6px 12px', borderRadius: '20px', color: 'white', fontWeight: 'bold', display: 'inline-block', fontSize: '0.85rem', minWidth: '80px', textAlign: 'center' };
        if (!estado) return { ...estiloBase, backgroundColor: '#6c757d' };
        const est = estado.toLowerCase();
        if (est === 'bueno') return { ...estiloBase, backgroundColor: '#28a745' };
        if (est === 'regular') return { ...estiloBase, backgroundColor: '#ffc107', color: 'black' };
        if (est === 'descarte') return { ...estiloBase, backgroundColor: '#dc3545' };
        return { ...estiloBase, backgroundColor: '#6c757d' };
    };

    const inputStyle = { width: '100%', padding: '8px', marginTop: '4px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };

    return (
        <div style={{ padding: '20px', height: '100%', boxSizing: 'border-box' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#1C3F8E' }}>Inventario General</h2>
            
            {cargando ? (
                <p>Cargando datos del servidor logístico...</p>
            ) : (
                <div style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', minWidth: '1000px' }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr style={{ backgroundColor: '#0056b3', color: 'white', textAlign: 'left' }}>
                                <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>No. Inventario</th>
                                <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Activo Fijo</th>
                                <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Denominación</th>
                                <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Centro de Costo</th>
                                <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Ubicación</th>
                                <th style={{ padding: '15px', borderBottom: '2px solid #ddd', textAlign: 'center' }}>Estado</th>
                                <th style={{ padding: '15px', borderBottom: '2px solid #ddd', textAlign: 'center', minWidth: '180px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {insumos.map((insumo, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{insumo.numero_inventario || 'Sin asignar'}</td>
                                    <td style={{ padding: '12px' }}>{insumo.activo_fijo}</td>
                                    <td style={{ padding: '12px' }}>{insumo.denominacion}</td>
                                    <td style={{ padding: '12px' }}>{insumo.centro_costo} - {insumo.denom_ceco}</td>
                                    <td style={{ padding: '12px' }}>{insumo.ubicacion || 'Sin asignar'}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <span style={getEstadoStyle(insumo.estado_fisico)}>
                                            {insumo.estado_fisico || 'Desconocido'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                            <button 
                                                onClick={() => setInsumoEditando(insumo)}
                                                style={{ padding: '6px 14px', backgroundColor: '#1C3F8E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleEliminar(insumo.activo_fijo)}
                                                style={{ padding: '6px 14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* VENTANA MODAL DE EDICIÓN */}
            {insumoEditando && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '500px', maxWidth: '90%' }}>
                        <h3 style={{ color: '#1C3F8E', marginTop: 0 }}>Editar Insumo</h3>
                        <form onSubmit={handleGuardarEdicion}>
                            <label><strong>Activo Fijo</strong></label>
                            <input type="text" value={insumoEditando.activo_fijo} onChange={(e) => setInsumoEditando({...insumoEditando, activo_fijo: e.target.value})} style={inputStyle} required />

                            <label><strong>No. Inventario</strong></label>
                            <input type="text" value={insumoEditando.numero_inventario || ''} onChange={(e) => setInsumoEditando({...insumoEditando, numero_inventario: e.target.value})} style={inputStyle} required />

                            <label><strong>Denominación</strong></label>
                            <input type="text" value={insumoEditando.denominacion} onChange={(e) => setInsumoEditando({...insumoEditando, denominacion: e.target.value})} style={inputStyle} required />

                            <label><strong>Código CeCo</strong></label>
                            <input type="text" value={insumoEditando.centro_costo} onChange={(e) => setInsumoEditando({...insumoEditando, centro_costo: e.target.value})} style={inputStyle} required />

                            <label><strong>Estado Físico</strong></label>
                            <select value={insumoEditando.estado_fisico || 'Bueno'} onChange={(e) => setInsumoEditando({...insumoEditando, estado_fisico: e.target.value})} style={inputStyle}>
                                <option value="Bueno">Bueno</option>
                                <option value="Regular">Regular</option>
                                <option value="Descarte">Descarte</option>
                            </select>

                            <label><strong>Ubicación</strong></label>
                            <input type="text" value={insumoEditando.ubicacion || ''} onChange={(e) => setInsumoEditando({...insumoEditando, ubicacion: e.target.value})} style={inputStyle} />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                                <button type="button" onClick={() => setInsumoEditando(null)} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#1C3F8E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventarioGeneral;