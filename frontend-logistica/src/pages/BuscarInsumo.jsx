import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient';

const BuscarInsumo = () => {
    const [busqueda, setBusqueda] = useState('');
    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [insumoEditando, setInsumoEditando] = useState(null);

    const handleBuscar = async (e) => {
        if (e) e.preventDefault();
        if (!busqueda.trim()) return;

        setCargando(true);
        setError('');
        setResultado(null);

        try {
            const {
    data: { session },
    error: errorSesion
} = await supabase.auth.getSession();

if (errorSesion || !session?.access_token) {
    throw new Error('Debes iniciar sesión nuevamente.');
}

const respuesta = await fetch(
    `http://localhost:3000/api/inventario/buscar/${encodeURIComponent(busqueda.trim())}`,
    {
        headers: {
            Authorization: `Bearer ${session.access_token}`
        }
    }
);

if (!respuesta.ok && respuesta.status !== 404) {
    throw new Error(`Error al buscar: HTTP ${respuesta.status}`);
}
            if (respuesta.status === 404) {
                setError('No se encontró ningún insumo con ese código en la base de datos.');
                setCargando(false);
                return;
            }
            const datos = await respuesta.json();
            setResultado(datos);
        } catch (err) {
            console.error('Error:', err);
            setError('Error de conexión con el servidor logístico.');
        } finally {
            setCargando(false);
        }
    };

    //Eliminar desde busqueda 
    const handleEliminar = async () => {
        const confirmar = window.confirm(`¿Está seguro de eliminar el insumo: ${resultado.denominacion}?`);
        if (!confirmar) return;

        try {
            const {
    data: { session },
    error: errorSesion
} = await supabase.auth.getSession();

if (errorSesion || !session?.access_token) {
    throw new Error('Debes iniciar sesión nuevamente.');
}

const respuesta = await fetch(
    `http://localhost:3000/api/inventario/eliminar/${encodeURIComponent(resultado.activo_fijo)}`,
    {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${session.access_token}`
        }
    }
);
        } catch (err) {
            console.error(err);
            alert('Error de conexión.');
        }
    };

    //Guardar edición desde busqueda
    const handleGuardarEdicion = async (e) => {
        e.preventDefault();
        try {
            const {
    data: { session },
    error: errorSesion
} = await supabase.auth.getSession();

if (errorSesion || !session?.access_token) {
    throw new Error('Debes iniciar sesión nuevamente.');
}
            const respuesta = await fetch(`http://localhost:3000/api/inventario/editar/${insumoEditando.activo_fijo}`, {
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
            });

            if (respuesta.ok) {
                alert('Insumo actualizado con éxito.');
                setInsumoEditando(null);
                handleBuscar(); // Se vuelve a consultar para refrescar la tarjeta
            } else {
                alert('Error al actualizar.');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión.');
        }
    };

    const getEstadoStyle = (estado) => {
        const estiloBase = { padding: '6px 12px', borderRadius: '20px', color: 'white', fontWeight: 'bold', display: 'inline-block', fontSize: '0.9rem' };
        if (!estado) return { ...estiloBase, backgroundColor: '#6c757d' };
        const est = estado.toLowerCase();
        if (est === 'bueno') return { ...estiloBase, backgroundColor: '#28a745' };
        if (est === 'regular') return { ...estiloBase, backgroundColor: '#ffc107', color: 'black' };
        if (est === 'descarte') return { ...estiloBase, backgroundColor: '#dc3545' };
        return { ...estiloBase, backgroundColor: '#6c757d' };
    };

    const inputStyle = { width: '100%', padding: '8px', marginTop: '4px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#1C3F8E', textAlign: 'center', marginBottom: '30px' }}>Buscar Insumo</h2>

            <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
                <input 
                    type="text" 
                    placeholder="Ingrese Activo Fijo o No. de Inventario..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ padding: '12px 20px', fontSize: '1rem', width: '100%', maxWidth: '400px', borderRadius: '25px', border: '1px solid #ccc', outline: 'none' }}
                />
                <button type="submit" disabled={cargando} style={{ padding: '12px 25px', fontSize: '1rem', backgroundColor: '#1C3F8E', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {cargando ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {error && <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>{error}</div>}

            {resultado && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
                    <h3 style={{ margin: '0 0 20px 0', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#333' }}>{resultado.denominacion}</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div><p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>Número de Inventario</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{resultado.numero_inventario || 'Sin asignar'}</p></div>
                        <div><p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>Activo Fijo</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{resultado.activo_fijo}</p></div>
                        <div><p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>Centro de Costo</p><p style={{ margin: 0, fontWeight: 'bold' }}>{resultado.centro_costo} - {resultado.denom_ceco}</p></div>
                        <div><p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>Estado Físico</p><span style={getEstadoStyle(resultado.estado_fisico)}>{resultado.estado_fisico || 'Desconocido'}</span></div>
                    </div>

                    <div style={{ marginTop: '20px', backgroundColor: '#e9ecef', padding: '15px', borderRadius: '8px' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#495057', fontSize: '0.9rem', fontWeight: 'bold' }}>Ubicación Actual:</p>
                        <p style={{ margin: 0, fontSize: '1.2rem', color: '#212529' }}>{resultado.ubicacion || 'Sin asignar'}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }}>
                        <button onClick={() => setInsumoEditando(resultado)} style={{ padding: '8px 20px', backgroundColor: '#1C3F8E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Editar Datos</button>
                        <button onClick={handleEliminar} style={{ padding: '8px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                    </div>
                </div>
            )}

            {/* MODAL DE EDICIÓN */}
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

export default BuscarInsumo;