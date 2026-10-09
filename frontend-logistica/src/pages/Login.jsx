
import { useState } from 'react';
import { supabase } from '../config/supabaseClient';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const { error: errorLogin } =
        await supabase.auth.signInWithPassword({
          email: correo.trim(),
          password: contrasena
        });

      if (errorLogin) {
        throw errorLogin;
      }

      // App.jsx detectará automáticamente
      // la nueva sesión de Supabase.
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError('No se pudo iniciar sesión. Verifica tu correo y contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f3f6fb',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#1C3F8E',
          marginBottom: '8px'
        }}>
          Unidad Médica
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px'
        }}>
          Sistema de Monitoreo Logístico
        </p>

        <h2 style={{
          color: '#1C3F8E',
          fontSize: '20px',
          marginBottom: '24px'
        }}>
          Iniciar sesión
        </h2>

        <form onSubmit={iniciarSesion}>
          <label htmlFor="correo">
            Correo electrónico
          </label>

          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            autoComplete="username"
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '8px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              boxSizing: 'border-box'
            }}
          />

          <label htmlFor="contrasena">
            Contraseña
          </label>

          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
            autoComplete="current-password"
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '8px',
              marginBottom: '24px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              boxSizing: 'border-box'
            }}
          />

          {error && (
            <p role="alert" style={{
              color: '#dc2626',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#1C3F8E',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: cargando ? 'wait' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: cargando ? 0.7 : 1
            }}
          >
            {cargando ? 'Verificando...' : 'Ingresar al sistema'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#777',
          marginTop: '24px'
        }}>
          Acceso exclusivo para personal autorizado
        </p>
      </div>
    </div>
  );
}
