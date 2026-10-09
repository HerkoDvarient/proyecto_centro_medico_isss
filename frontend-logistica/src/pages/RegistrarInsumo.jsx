import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient';

const RegistrarInsumo = () => {
    const [formData, setFormData] = useState({
        numero_inventario: '',
        activo_fijo: '',
        denominacion: '',
        codigo_centro_costo: '',
        centro_costo_nombre: '',
        estado_fisico: 'Bueno',
        ubicacion: ''
    });

    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const {
    data: { session },
    error: errorSesion
} = await supabase.auth.getSession();

if (errorSesion || !session?.access_token) {
    throw new Error('Debes iniciar sesión nuevamente.');
}
            const respuesta = await fetch('http://localhost:3000/api/inventario/registrar', {
                method: 'POST',
                headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`
},
                body: JSON.stringify(formData)
            });

            const datos = await respuesta.json(); //Lee la respuesta JSON del servidor

            if (respuesta.ok) {
                setMensaje({ tipo: 'exito', texto: datos.mensaje || '¡Insumo registrado correctamente!' });
                setFormData({
                    numero_inventario: '',
                    activo_fijo: '',
                    denominacion: '',
                    codigo_centro_costo: '',
                    centro_costo_nombre: '',
                    estado_fisico: 'Bueno',
                    ubicacion: ''
                });
            } else {
                //Muestra el mensaje exacto que nos envió el Backend
                setMensaje({ tipo: 'error', texto: datos.mensaje || 'Hubo un problema al registrar el insumo.' });
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje({ tipo: 'error', texto: 'Error de conexión con el servidor logístico.' });
        } finally {
            setCargando(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#1C3F8E', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Registrar Nuevo Insumo</h2>

            {/* Mensajes de feedback */}
            {mensaje.texto && (
                <div style={{ 
                    padding: '15px', 
                    marginBottom: '20px', 
                    borderRadius: '5px',
                    backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
                    color: mensaje.tipo === 'exito' ? '#155724' : '#842029'
                }}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    
                    {/* Número de Inventario */}
                    <div>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Número de Inventario</label>
                        <input 
                            type="text" 
                            name="numero_inventario" 
                            value={formData.numero_inventario} 
                            onChange={handleChange} 
                            style={inputStyle} 
                            placeholder="ej. 351800583" 
                            required 
                        />
                    </div>

                    {/* Activo Fijo */}
                    <div>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Activo Fijo</label>
                        <input 
                            type="text" 
                            name="activo_fijo" 
                            value={formData.activo_fijo} 
                            onChange={handleChange} 
                            style={inputStyle} 
                            placeholder="ej. 200000123" 
                            required 
                        />
                    </div>

                    {/* Denominación / Descripción (Fila completa) */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Denominación / Descripción</label>
                        <input 
                            type="text" 
                            name="denominacion" 
                            value={formData.denominacion} 
                            onChange={handleChange} 
                            style={inputStyle} 
                            placeholder="ej. Silla de ruedas para adultos" 
                            required 
                        />
                    </div>

                     {/* Centro de Costo (Nombre) */}
                    <div>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Centro de Costo</label>
                        <input 
                            type="text" 
                            name="centro_costo_nombre" 
                            value={formData.centro_costo_nombre} 
                            onChange={handleChange} 
                            style={inputStyle} 
                            placeholder="ej. SERVICIOS GENERALES" 
                            required 
                        />
                    </div>

                    {/* Código CeCo */}
                    <div>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Código CeCo</label>
                        <input 
                            type="text" 
                            name="codigo_centro_costo" 
                            value={formData.codigo_centro_costo} 
                            onChange={handleChange} 
                            style={inputStyle} 
                            placeholder="ej. A000/548102" 
                            required 
                        />
                    </div>

                    {/* Estado Físico */}
                    <div>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Estado Físico</label>
                        <select 
                            name="estado_fisico" 
                            value={formData.estado_fisico} 
                            onChange={handleChange} 
                            style={inputStyle} 
                            required
                        >
                            <option value="Bueno">Bueno</option>
                            <option value="Regular">Regular</option>
                            <option value="Descarte">Descarte</option>
                        </select>
                    </div>

                    {/* Ubicación */}
                    <div>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Ubicación</label>
                        <input 
                            type="text" 
                            name="ubicacion" 
                            value={formData.ubicacion} 
                            onChange={handleChange} 
                            style={inputStyle} 
                            placeholder="ej. Consultorio 3 - Pediatría" 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                    <button 
                        type="submit" 
                        disabled={cargando}
                        style={{
                            padding: '12px 30px', 
                            backgroundColor: '#1C3F8E', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: cargando ? 'not-allowed' : 'pointer', 
                            fontWeight: 'bold', 
                            fontSize: '1rem'
                        }}>
                        {cargando ? 'Guardando...' : 'Guardar Registro'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrarInsumo;