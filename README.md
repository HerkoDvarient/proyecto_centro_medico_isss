# Sistema de Monitoreo Logístico - Unidad Médica de Cojutepeque

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de una aplicación web diseñada para mejorar y modernizar la gestión logística de los insumos en la Unidad Médica de Cojutepeque, centralizando la información para facilitar el control logístico y la toma de decisiones.

## Módulos Principales

La aplicación web se divide actualmente en tres módulos funcionales enfocados en la rapidez de uso:

1. **Inventario General:** Una tabla unificada que consolida todos los datos de los insumos, equipada con etiquetas semaforizadas (**Bueno, Regular, Descarte**) para una lectura visual rápida.

2. **Buscar Insumo:** Un buscador centralizado por **Código CeCo** o **Número de Inventario** que despliega una "Tarjeta de Perfil" detallada del insumo con opciones para editar o eliminar.

3. **Registrar Insumo:** Un formulario limpio estructurado en dos columnas para dar de alta nuevos equipos de manera intuitiva y simétrica.

## Diseño e Interfaz (UI/UX)

El desarrollo frontend sigue una filosofía de **minimalismo pulido** enfocado en el sector salud.

- **Paleta de Colores:** Uso de tonos blancos, grises y un azul marino institucional (`#1C3F8E`), reservando los colores llamativos únicamente para alertas y estados físicos.
- **Iconografía:** Integración de la librería `lucide-react` para mantener íconos vectoriales consistentes, limpios y elegantes en la barra lateral y botones.
- **Responsive:** Diseño preparado para ser adaptable y fluido sin saturar la visión del usuario.

## Tecnologías Utilizadas 

- **Frontend:** React.js inicializado y optimizado con Vite.
- **Backend:** API REST construida con Node.js y Express.
- **Base de Datos (Próximamente):** Preparado para integración con un motor SQL (MySQL/SQL Server) mediante el patrón Modelo-Vista-Controlador (MVC).

## Cómo ejecutar el proyecto en local

El proyecto cuenta con una arquitectura separada para el cliente y el servidor. Para probar la aplicación, sigue estos pasos:

### 1. Inicializar el Frontend (React + Vite)

Abre una terminal en la carpeta `frontend-logistica` y ejecuta:

```bash
npm install
npm run dev
```

La aplicación web estará disponible en:

**http://localhost:5173**

### 2. Configurar SQL Server

Antes de ejecutar el servidor backend, es necesario habilitar la conexión TCP/IP de SQL Server y establecer el puerto `1433`.

#### 1. Abrir Administrador de configuración

Abre el **Administrador de configuración de SQL Server (SQL Server Configuration Manager)** y acepta los permisos de administrador.

#### 2. Habilitar TCP/IP

En el panel izquierdo, despliega **Configuración de red de SQL Server** y selecciona **Protocolos de MSSQLSERVER** (o **SQLEXPRESS**). Haz clic derecho sobre **TCP/IP** y selecciona **Habilitar**.

#### 3. Fijar el Puerto 1433

Haz clic derecho en **TCP/IP** y selecciona **Propiedades**. Ve a la pestaña **Direcciones IP**, baja hasta la sección **IPAll**, borra cualquier número en **Puertos dinámicos TCP** y escribe `1433` en el campo **Puerto TCP**.

#### 4. Reiniciar el Servicio

Aplica los cambios y reinicia el servicio de **SQL Server** para que la nueva configuración tenga efecto.

### 3. Inicializar el Backend (Node.js)

Abre una segunda terminal en la carpeta `backend-logistica` y ejecuta:

```bash
npm install
node server.js
```

El servidor que expone la API estará escuchando en:

**http://localhost:3000**

> **Nota actual del desarrollo:** El frontend y la estructura del backend (Rutas, Controladores y Modelos) ya están completamente definidos. La inyección de la base de datos oficial se encuentra en fase de acoplamiento.
