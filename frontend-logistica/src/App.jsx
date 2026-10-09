import { useEffect, useState } from 'react';
import { supabase } from './config/supabaseClient';
import Login from './pages/Login';
import { LayoutDashboard, Search, PlusCircle, UserCircle } from 'lucide-react'; // Importamos los iconos
import InventarioGeneral from './pages/InventarioGeneral';
import BuscarInsumo from './pages/BuscarInsumo';
import RegistrarInsumo from './pages/RegistrarInsumo';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventario');

  //Función para los inicios de sesión
  
const [sesion, setSesion] = useState(null);
const [verificandoSesion, setVerificandoSesion] = useState(true);

useEffect(() => {
  let activo = true;

  supabase.auth.getSession().then(({ data }) => {
    if (activo) {
      setSesion(data.session);
      setVerificandoSesion(false);
    }
  }).catch(() => {
    if (activo) setVerificandoSesion(false);
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

if (verificandoSesion) {
  return <p style={{ padding: '30px' }}>Verificando sesión...</p>;
}

if (!sesion) {
  return <Login />;
}


  //Función para manejar los estilos dinámicos de los botones de forma limpia
  const getNavStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.5rem',
      width: '100%',
      border: 'none',
      // Fondo traslúcido si está activo
      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      // Borde izquierdo para indicar exactamente dónde estamos
      borderLeft: isActive ? '4px solid #60a5fa' : '4px solid transparent',
      // Letra blanca si está activo, grisácea si no
      color: isActive ? '#ffffff' : '#9ca3af',
      fontSize: '0.95rem',
      fontWeight: isActive ? '600' : '400',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* SIDEBAR POLISH */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'var(--color-primary)', // Azul corporativo
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', // Empuja el contenido hacia arriba y abajo
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)', // Sombra para separar la barra del contenido principal
        zIndex: 10 
      }}>
        
        <div>
          {/* Encabezado del Sistema */}
          <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
              Unidad Médica
            </h2>
            <p style={{ color: '#9ca3af', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
              Monitoreo Logístico
            </p>
          </div>

          {/* Navegación con Iconos Vectoriales */}
          <nav style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button onClick={() => setActiveTab('inventario')} style={getNavStyle('inventario')}>
              <LayoutDashboard size={20} strokeWidth={2.5} />
              Inventario General
            </button>
            
            <button onClick={() => setActiveTab('buscar')} style={getNavStyle('buscar')}>
              <Search size={20} strokeWidth={2.5} />
              Buscar Insumo
            </button>
            
            <button onClick={() => setActiveTab('registrar')} style={getNavStyle('registrar')}>
              <PlusCircle size={20} strokeWidth={2.5} />
              Registrar Insumo
            </button>
          </nav>
        </div>

        {/* Módulo Inferior: Usuario Activo */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <UserCircle size={32} color="#9ca3af" strokeWidth={1.5} />
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#ffffff', fontWeight: '500' }}>Administrador</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#10b981' }}>● En línea</p>
          </div>
        </div>

      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, backgroundColor: '#f9fafb', overflowY: 'auto' }}>
        {activeTab === 'inventario' && <InventarioGeneral />}
        {activeTab === 'buscar' && <BuscarInsumo />}
        {activeTab === 'registrar' && <RegistrarInsumo />}
      </main>

    </div>
  );
}