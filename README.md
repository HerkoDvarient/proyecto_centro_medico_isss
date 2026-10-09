# Sistema de Monitoreo Logístico
## Unidad Médica de Cojutepeque

**Estado:** Desarrollo funcional con despliegue web operativo.

**Aplicación:** https://proyecto-centro-medico-isss-dfij.vercel.app  
**API REST:** https://proyecto-centro-medico-isss.onrender.com

## 1. Descripción

Sistema web para centralizar la consulta y administración del inventario de activos fijos de la Unidad Médica de Cojutepeque, El Salvador. Combina una interfaz React, una API REST desarrollada con Express y una base de datos PostgreSQL administrada por Supabase.

La aplicación está publicada en Internet y puede utilizarse desde navegadores de computadora y dispositivos móviles, con inicio de sesión mediante Supabase Auth. No requiere mantener encendida la computadora de desarrollo.

> **Alcance:** El acceso, la autenticación y la consulta del inventario están comprobados. Antes de utilizarlo como sistema institucional definitivo deben completarse las pruebas de escritura, la autorización por roles y las revisiones de seguridad.

## 2. Estado actual

- Integración de **React + Vite**, **Node.js + Express** y **Supabase PostgreSQL**.
- Migración y consulta comprobada de **767 activos fijos** y **10 centros de costo**.
- Visualización del inventario general y su relación con centros de costo.
- Autenticación y cierre de sesión mediante **Supabase Auth**.
- Rutas del inventario protegidas mediante un token de acceso válido.
- Frontend desplegado en **Vercel** y backend desplegado en **Render**.
- Consulta del inventario comprobada desde diferentes navegadores y dispositivos.
- Uso de variables de entorno para configurar los servicios sin publicar claves secretas.

Los conteos indicados corresponden a los datos verificados durante el desarrollo y pueden cambiar.

## 3. Módulos

### Inventario General

Tabla de activos fijos con número de inventario, número de activo fijo, denominación, centro de costo, ubicación, estado físico y acciones. La consulta y visualización están verificadas.

### Buscar Insumo

Búsqueda de activos por identificador y acceso a acciones de edición y eliminación. **Pendiente:** completar las pruebas funcionales y de permisos.

### Registrar Insumo

Formulario para incorporar activos y asociarlos con un centro de costo. **Pendiente:** completar las pruebas de registro, validación y permisos.

### Autenticación

Inicio y cierre de sesión mediante Supabase Auth. El frontend obtiene un token de acceso y lo envía a la API en las solicitudes de inventario.

## 4. Tecnologías

| Capa | Tecnología o servicio | Responsabilidad |
|---|---|---|
| Interfaz | React | Componentes y vistas del sistema |
| Desarrollo y compilación | Vite | Servidor de desarrollo y compilación del frontend |
| Servidor | Node.js | Entorno de ejecución del backend |
| API | Express | Endpoints HTTP y lógica del servidor |
| Base de datos | PostgreSQL | Persistencia de los registros |
| Base de datos y autenticación | Supabase | PostgreSQL administrado y Supabase Auth |
| Publicación del frontend | Vercel | Alojamiento de los archivos compilados |
| Publicación del backend | Render | Ejecución de Node.js y la API REST |
| Iconografía | Lucide React | Iconos de la interfaz |
| Versionado | Git y GitHub | Historial del código y conexión con despliegues |

## 5. Arquitectura

```text
Usuario (PC o teléfono)
          |
          | HTTPS
          v
Vercel: React (compilado con Vite)
          |                    \
          | HTTPS + JSON        \ Inicio de sesión
          | Token de acceso      v
          v                 Supabase Auth
Render: Node.js + Express
       API REST
          |
          | Supabase JS
          v
Supabase: PostgreSQL
          |
          +-- activos_fijos
          +-- centros_costo
```

**Flujo de consulta:**

1. El usuario abre la interfaz alojada en Vercel.
2. Inicia sesión con Supabase Auth.
3. React solicita `/api/inventario` al backend de Render y envía el token de acceso.
4. Express valida la autenticación y consulta los datos en Supabase.
5. La API devuelve una respuesta JSON y React presenta los registros.

### ¿Qué es una API REST?

Es la interfaz HTTP que permite al frontend solicitar información u operaciones al backend. **La API está programada con Express; Render es el servicio que la aloja.**

### ¿Qué hace Vite?

Vite proporciona el entorno de desarrollo local y compila el frontend mediante `npm run build`. **Vite no es un servidor de base de datos ni la API de producción.** Vercel publica el resultado compilado.

### ¿Es un sistema gratuito o una API?

**Es una aplicación web completa que incluye una API REST y utiliza servicios en la nube.** En la etapa de desarrollo se han empleado opciones gratuitas o de recursos limitados de Vercel, Render y Supabase. No son servidores dedicados propios ni implican disponibilidad o capacidad ilimitadas.

## 6. Servicios y limitaciones

| Plataforma | Función | Consideración |
|---|---|---|
| Vercel | Servir el frontend | Límites y condiciones según el plan |
| Render | Ejecutar la API REST | En ciertos planes gratuitos puede suspender el servicio tras inactividad y tardar en reactivarse |
| Supabase | PostgreSQL y autenticación | Cuotas, recursos y políticas de inactividad según el plan |
| GitHub | Código fuente y versiones | Acceso sujeto a los permisos del repositorio |

Los límites de cada proveedor pueden cambiar. Para uso institucional deben evaluarse disponibilidad, copias de seguridad, rendimiento, seguridad y condiciones comerciales.

## 7. Estructura del repositorio

```text
proyecto_centro_medico_isss/
├── frontend-logistica/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabaseClient.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── InventarioGeneral.jsx
│   │   │   ├── BuscarInsumo.jsx
│   │   │   └── RegistrarInsumo.jsx
│   │   └── App.jsx
│   └── package.json
├── backend-logistica/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/inventarioController.js
│   │   ├── models/inventarioModel.js
│   │   └── routes/inventarioRoutes.js
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

Los archivos de entorno locales no deben versionarse.

## 8. Base de datos

La base de datos utiliza **PostgreSQL alojado en Supabase**.

**`centros_costo`**: `id_centro_costo`, `codigo_centro_costo`, `denominacion`.

**`activos_fijos`**: `numero_activo_fijo`, `numero_inventario`, `denominacion`, `id_centro_costo`, `estado_fisico`, `ubicado`.

Las tablas se relacionan mediante `id_centro_costo`.

**Datos verificados:** 767 activos fijos y 10 centros de costo.

## 9. Instalación y ejecución local

### Requisitos

- Node.js y npm.
- Git.
- Acceso autorizado al repositorio privado y al proyecto Supabase.
- Variables de entorno válidas.

### 9.1. Clonar el proyecto

```bash
git clone https://github.com/HerkoDvarient/proyecto_centro_medico_isss.git
cd proyecto_centro_medico_isss
```

### 9.2. Backend

```bash
cd backend-logistica
npm install
```

Crear `backend-logistica/.env`:

```dotenv
SUPABASE_URL=https://TU_PROYECTO.supabase.co
SUPABASE_SECRET_KEY=TU_CLAVE_SECRETA
PORT=3000
```

Iniciar:

```bash
npm start
```

API local: `http://localhost:3000`  
Prueba de funcionamiento: `http://localhost:3000/api/test`

### 9.3. Frontend

Abrir otra terminal desde la raíz del repositorio:

```bash
cd frontend-logistica
npm install
```

Crear `frontend-logistica/.env.local`:

```dotenv
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA
VITE_API_URL=http://localhost:3000
```

Iniciar:

```bash
npm run dev
```

La dirección habitual es `http://localhost:5173`. Para consultar el inventario localmente, el backend debe estar ejecutándose.

> **Seguridad:** Las variables `VITE_` quedan disponibles en el frontend compilado. Nunca colocar claves secretas o privilegiadas en ellas. La clave `SUPABASE_SECRET_KEY` debe permanecer únicamente en el backend.

## 10. Endpoints de la API REST

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/test` | Verificar que el servidor responde |
| GET | `/api/inventario` | Consultar el inventario |
| GET | `/api/inventario/buscar/:codigo` | Buscar un activo |
| POST | `/api/inventario/registrar` | Registrar un activo |
| PUT | `/api/inventario/editar/:codigo` | Editar un activo |
| DELETE | `/api/inventario/eliminar/:codigo` | Eliminar un activo |

Las rutas bajo `/api/inventario` requieren un token de acceso válido:

```http
Authorization: Bearer TOKEN_DE_ACCESO
```

**Verificado:** `/api/test`, autenticación y consulta general. **Por validar:** pruebas completas de búsqueda, registro, edición, eliminación y autorización específica.

## 11. Despliegue en Internet

### Frontend: Vercel

- **URL:** https://proyecto-centro-medico-isss-dfij.vercel.app
- **Directorio raíz:** `frontend-logistica`
- **Build:** `npm run build`
- **Directorio de salida:** `dist`

Variables de entorno configuradas en Vercel:

```dotenv
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA
VITE_API_URL=https://proyecto-centro-medico-isss.onrender.com
```

Vite incorpora estas variables durante la compilación; después de cambiarlas, debe realizarse un nuevo despliegue.

### Backend: Render

- **URL:** https://proyecto-centro-medico-isss.onrender.com
- **Directorio raíz:** `backend-logistica`
- **Build:** `npm ci`
- **Inicio:** `npm start`

Variables de entorno configuradas en Render:

```dotenv
SUPABASE_URL=https://TU_PROYECTO.supabase.co
SUPABASE_SECRET_KEY=TU_CLAVE_SECRETA
NODE_ENV=production
```

Render proporciona la variable `PORT` en el entorno de despliegue.

### Base de datos y autenticación: Supabase

Supabase aloja PostgreSQL y administra el inicio de sesión. El backend utiliza la clave privada del servicio y valida el token del usuario antes de responder a las rutas de inventario.

### Actualizaciones

```text
Cambios locales → Git commit → Git push → GitHub
                                       |
                                       +→ Vercel (frontend)
                                       +→ Render (backend)
```

Los despliegues automáticos dependen de que ambas plataformas estén conectadas al repositorio y a la rama correspondiente.

## 12. Seguridad y responsabilidades

**Implementado:**

- Inicio de sesión con Supabase Auth.
- Validación de tokens para rutas de inventario.
- Separación de configuración pública y claves secretas.
- HTTPS en los servicios publicados.
- Repositorio privado y exclusión de archivos `.env`.

**Pendiente antes de producción institucional:**

- Implementar **roles y permisos** por operación (lectura, registro, edición y eliminación).
- Restringir el alta de usuarios a personas autorizadas.
- Validar exhaustivamente los datos recibidos por formularios y API.
- Revisar las políticas de acceso a datos y la configuración CORS.
- Implementar y probar respaldos y restauración.
- Realizar pruebas de seguridad y auditoría de operaciones.

**Autenticación no equivale a autorización:** validar que una sesión existe no determina si ese usuario debe poder editar o eliminar registros.

## 13. Diseño e interfaz

La interfaz sigue una línea visual institucional con colores blanco, gris y azul (`#1C3F8E`), menú lateral, iconografía Lucide React, tablas de inventario e indicadores de estado. Se ha comprobado el acceso desde escritorio y móvil; permanecen previstas mejoras de adaptación para pantallas pequeñas.

## 14. Próximas mejoras

- Validación integral de búsqueda, registro, edición y eliminación.
- Roles y permisos administrativos.
- Filtros, búsquedas avanzadas y paginación.
- Mejoras de usabilidad móvil, incluyendo la opción de leer códigos de barra a través la camara del dispositivo.
- Validaciones y mensajes de error más claros.
- Manejo de tiempos de espera cuando el backend se reactiva.
- Copias de seguridad y pruebas de recuperación.
- Pruebas de rendimiento, seguridad y funcionamiento.

## 15. Objetivo

Contribuir a la modernización de los procesos logísticos de la Unidad Médica de Cojutepeque mediante una aplicación web que centralice la consulta y administración del inventario institucional, integrando una interfaz moderna, una API REST y una base de datos PostgreSQL en la nube.

---

**Sistema de Monitoreo Logístico — Unidad Médica de Cojutepeque**  
Proyecto de desarrollo de software con arquitectura cliente-servidor, autenticación y servicios en la nube.

