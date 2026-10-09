
import { useState, useEffect } from 'react';
import { supabase } from './config/supabaseClient';

import {
  LayoutDashboard,
  Search,
  PlusCircle,
  UserCircle,
  LogOut
} from 'lucide-react';

import InventarioGeneral from './pages/InventarioGeneral';
import BuscarInsumo from './pages/BuscarInsumo';
import RegistrarInsumo from './pages/RegistrarInsumo';
import Login from './pages/Login';

export default function App() {

  // ==========================================
  // ESTADOS GENERALES
  // ==========================================

  const [activeTab, setActiveTab] = useState('inventario');
  const [sesion, setSesion] = useState(null);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  // ==========================================
  // VERIFICAR SESIÓN DE SUPABASE
  // ==========================================

  useEffect(() => {
    let activo = true;

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        if (activo) {
          setSesion(data.session);
          setVerificandoSesion(false);
        }
      })
      .catch((error) => {
        console.error('Error al verificar sesión:', error);

        if (activo) {
          setVerificandoSesion(false);
        }
      });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
        if (activo) {
          setSesion(nuevaSesion);
          setVerificandoSesion(false);
        }
      });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const cerrarSesion = async () => {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas cerrar sesión?'
    );

    if (!confirmar) return;

    setCerrandoSesion(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setSesion(null);
      setActiveTab('inventario');

    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('No se pudo cerrar la sesión. Inténtalo nuevamente.');

    } finally {
      setCerrandoSesion(false);
    }
  };

  // ==========================================
  // VERIFICANDO AUTENTICACIÓN
  // ==========================================

  if (verificandoSesion) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        color: '#1C3F8E',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h3>Verificando sesión...</h3>
      </div>
    );
  }

  // ==========================================
  // MOSTRAR LOGIN SI NO HAY SESIÓN
  // ==========================================

  if (!sesion) {
    return <Login />;
  }

  // ==========================================
  // ESTILOS DINÁMICOS DE NAVEGACIÓN
  // ==========================================

  const getNavStyle = (tabName) => {
    const isActive = activeTab === tabName;

    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.5rem',
      width: '100%',
      border: 'none',
      backgroundColor: isActive
        ? 'rgba(255, 255, 255, 0.1)'
        : 'transparent',
      borderLeft: isActive
        ? '4px solid #60a5fa'
        : '4px solid transparent',
      color: isActive ? '#ffffff' : '#9ca3af',
      fontSize: '0.95rem',
      fontWeight: isActive ? '600' : '400',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out'
    };
  };

  // ==========================================
  // INTERFAZ PRINCIPAL DEL SISTEMA
  // ==========================================

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>

      {/* ======================================
          BARRA LATERAL
      ====================================== */}

      <aside style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: 'var(--color-primary, #203F89)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        zIndex: 10
      }}>

        <div>

          {/* ENCABEZADO */}

          <div style={{
            padding: '2rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>

            <h2 style={{
              color: '#ffffff',
              margin: 0,
              fontSize: '1.25rem',
              letterSpacing: '0.5px'
            }}>
              Unidad Médica
            </h2>

            <p style={{
              color: '#9ca3af',
              margin: '0.25rem 0 0 0',
              fontSize: '0.85rem'
            }}>
              Monitoreo Logístico
            </p>

          </div>

          {/* MENÚ DE NAVEGACIÓN */}

          <nav style={{
            padding: '1.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>

            <button
              type="button"
              onClick={() => setActiveTab('inventario')}
              style={getNavStyle('inventario')}
            >
              <LayoutDashboard size={20} strokeWidth={2.5} />
              Inventario General
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('buscar')}
              style={getNavStyle('buscar')}
            >
              <Search size={20} strokeWidth={2.5} />
              Buscar Insumo
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('registrar')}
              style={getNavStyle('registrar')}
            >
              <PlusCircle size={20} strokeWidth={2.5} />
              Registrar Insumo
            </button>

          </nav>

        </div>

        {/* ======================================
            USUARIO CONECTADO
        ====================================== */}

        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>

            <UserCircle
              size={34}
              color="#c7d7ff"
              strokeWidth={1.5}
            />

            <div style={{
              minWidth: 0,
              flex: 1
            }}>

              <p style={{
                margin: 0,
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.85rem'
              }}>
                Usuario conectado
              </p>

              {/* CORREO DEL USUARIO ACTUAL */}

              <p style={{
                margin: '4px 0',
                color: '#c7d7ff',
                fontSize: '0.72rem',
                overflowWrap: 'anywhere'
              }}>
                {sesion?.user?.email || 'Sin correo'}
              </p>

              <p style={{
                margin: 0,
                color: '#4ade80',
                fontSize: '0.75rem'
              }}>
                ● En línea
              </p>

            </div>

          </div>

          {/* BOTÓN CERRAR SESIÓN */}

          <button
            type="button"
            onClick={cerrarSesion}
            disabled={cerrandoSesion}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              cursor: cerrandoSesion ? 'wait' : 'pointer',
              opacity: cerrandoSesion ? 0.6 : 1,
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <LogOut size={18} />

            {cerrandoSesion
              ? 'Cerrando sesión...'
              : 'Cerrar sesión'}
          </button>

        </div>

      </aside>

      {/* ======================================
          ÁREA PRINCIPAL
      ====================================== */}

      <main style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: '#f9fafb',
        overflowY: 'auto'
      }}>

        {activeTab === 'inventario' && (
          <InventarioGeneral />
        )}

        {activeTab === 'buscar' && (
          <BuscarInsumo />
        )}

        {activeTab === 'registrar' && (
          <RegistrarInsumo />
        )}

      </main>

    </div>
  );
}
