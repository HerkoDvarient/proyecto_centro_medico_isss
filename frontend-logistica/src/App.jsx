
import { useState } from 'react';
import InventarioGeneral from './pages/InventarioGeneral';
import BuscarInsumo from './pages/BuscarInsumo';
import RegistrarInsumo from './pages/RegistrarInsumo';

function App() {
  //Estado para controlar qué módulo/página estamos viendo
  const [activeTab, setActiveTab] = useState('inventario');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar / Menú Lateral */}
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Unidad Médica</h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Monitoreo Logístico</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('inventario')}
            style={navButtonStyle(activeTab === 'inventario')}>
             Inventario General
          </button>
          
          <button 
            onClick={() => setActiveTab('buscar')}
            style={navButtonStyle(activeTab === 'buscar')}>
             Buscar Insumo
          </button>
          
          <button 
            onClick={() => setActiveTab('registrar')}
            style={navButtonStyle(activeTab === 'registrar')}>
             Registrar Insumo
          </button>
        </nav>
      </aside>

      {/* Área de Contenido Principal */}
      <main style={{ flex: 1, backgroundColor: '#f9fafb', overflowY: 'auto' }}>
      {activeTab === 'inventario' && <InventarioGeneral />}
      {activeTab === 'buscar' && <BuscarInsumo />}
      {activeTab === 'registrar' && <RegistrarInsumo />}      
      </main>

    </div>
  );
}

//Estilos dinámicos para los botones de navegación
const navButtonStyle = (isActive) => ({
  width: '100%',
  padding: '0.75rem 1rem',
  textAlign: 'left',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
  color: '#ffffff',
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  fontWeight: isActive ? 'bold' : 'normal'
});

export default App;