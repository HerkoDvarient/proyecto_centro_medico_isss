
# Sistema de Monitoreo Logístico
## Unidad Médica de Cojutepeque

###  Descripción del proyecto

Sistema web desarrollado para modernizar y centralizar la gestión del inventario de activos fijos de la Unidad Médica de Cojutepeque.

La aplicación facilita la consulta, organización y administración de información logística mediante una interfaz intuitiva, una API REST y una base de datos PostgreSQL alojada en Supabase.

###  Estado actual del proyecto

**Estado:** Desarrollo funcional.

**Avances confirmados:**

- Integración exitosa entre React, Express y Supabase.
- Migración de la base de datos a PostgreSQL.
- Recuperación de 767 registros de activos fijos.
- Consulta de activos y sus respectivos centros de costo.
- Visualización del Inventario General desde el navegador.
- Comunicación funcional entre frontend y backend.
- API REST operativa en el entorno local.

###  Módulos principales

#### 1. Inventario General

Módulo que presenta una tabla unificada con la información de los activos fijos.

**Campos principales:**

- Número de inventario.
- Número de activo fijo.
- Denominación.
- Código del centro de costo (CeCo).
- Denominación del centro de costo.
- Estado físico.
- Ubicación.

La interfaz contempla indicadores visuales para clasificar el estado de los activos como **Bueno, Regular o Descarte**.

**Estado:** Consulta y visualización funcionando.

#### 2. Buscar Insumo

Módulo diseñado para localizar activos mediante sus identificadores y consultar su información detallada.

Incluye opciones previstas para editar o eliminar registros.

**Estado:** Interfaz y rutas definidas; pendientes de validación funcional completa.

#### 3. Registrar Insumo

Formulario destinado al registro de nuevos activos fijos, incluyendo su asociación con un centro de costo.

**Estado:** Interfaz y ruta de registro definidas; pendiente de validación funcional y controles de autorización.

###  Diseño e interfaz (UI/UX)

La aplicación sigue una filosofía de **minimalismo institucional**, orientada a facilitar las tareas de administración logística.

- **Paleta de colores:** Blanco, gris y azul institucional `#1C3F8E`.
- **Iconografía:** Librería `lucide-react`.
- **Navegación:** Menú lateral para acceder a los módulos.
- **Tablas:** Presentación organizada de registros con desplazamiento.
- **Diseño adaptable:** Mejoras de visualización móvil previstas.

### 🛠️ Tecnologías utilizadas

| Componente | Tecnología |
|---|---|
| Frontend | React.js |
| Herramienta de desarrollo | Vite |
| Backend | Node.js |
| Framework del servidor | Express.js |
| Base de datos | PostgreSQL |
| Servicio de base de datos | Supabase |
| Comunicación | API REST |
| Iconografía | Lucide React |
| Control de versiones | Git y GitHub |

###  Arquitectura del sistema

El proyecto utiliza una arquitectura cliente-servidor.

```text
             USUARIO
                |
                v
       FRONTEND (REACT)
          Vite + UI
                |
                | HTTP / JSON
                v
       BACKEND (EXPRESS)
          Node.js API
                |
                | Supabase JS
                v
       SUPABASE POSTGRESQL
                |
         +------+------+
         |             |
         v             v
    activos_fijos  centros_costo
```

El backend organiza sus responsabilidades mediante rutas, controladores y modelos.

###  Estructura del proyecto

```text
proyecto_centro_medico_isss/
|
|-- frontend-logistica/
|   |-- src/
|   |-- package.json
|
|-- backend-logistica/
|   |-- src/
|   |   |-- config/
|   |   |   |-- db.js
|   |   |
|   |   |-- controllers/
|   |   |   |-- inventarioController.js
|   |   |
|   |   |-- models/
|   |   |   |-- inventarioModel.js
|   |   |
|   |   |-- routes/
|   |       |-- inventarioRoutes.js
|   |
|   |-- server.js
|   |-- .env
|   |-- package.json
|
|-- .gitignore
|-- README.md
```

**Nota:** El archivo `.env` debe existir únicamente en el entorno de ejecución y no debe subirse al repositorio.

###  Base de datos

La aplicación utiliza **Supabase PostgreSQL**.

#### Tabla: centros_costo

Almacena los centros de costo institucionales.

Campos principales:

- `id_centro_costo`
- `codigo_centro_costo`
- `denominacion`

#### Tabla: activos_fijos

Almacena la información de los activos del inventario.

Campos principales:

- `numero_activo_fijo`
- `numero_inventario`
- `denominacion`
- `id_centro_costo`
- `estado_fisico`
- `ubicado`

Ambas tablas están relacionadas mediante `id_centro_costo`.

**Datos verificados:**

- 767 activos fijos consultados correctamente.
- 10 centros de costo registrados durante la migración.

###  Instalación y ejecución local

#### Requisitos previos

- Node.js y npm.
- Git.
- Acceso autorizado al proyecto de Supabase.
- Credenciales de conexión correspondientes.

#### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd proyecto_centro_medico_isss
```

#### 2. Configurar el backend

Abrir una terminal en la carpeta del backend:

```bash
cd backend-logistica
npm install
```

Crear el archivo `.env`:

```dotenv
SUPABASE_URL=https://TU_PROYECTO.supabase.co
SUPABASE_SECRET_KEY=TU_CLAVE_SECRETA
PORT=3000
```

Las credenciales deben mantenerse privadas y no deben incluirse en el código fuente.

Iniciar el servidor:

```bash
node server.js
```

La API estará disponible en:

http://localhost:3000

#### 3. Configurar el frontend

Abrir una segunda terminal desde la raíz del proyecto:

```bash
cd frontend-logistica
npm install
npm run dev
```

La aplicación estará disponible normalmente en:

http://localhost:5173

**Importante:** El backend debe permanecer ejecutándose para que el frontend pueda consultar los datos.

### 🔌 Endpoints de la API REST

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/test` | Verificar el servidor |
| GET | `/api/inventario` | Obtener el inventario general |
| GET | `/api/inventario/buscar/:codigo` | Buscar un activo |
| POST | `/api/inventario/registrar` | Registrar un activo |
| PUT | `/api/inventario/editar/:codigo` | Editar un activo |
| DELETE | `/api/inventario/eliminar/:codigo` | Eliminar un activo |

**Estado:** La consulta general está verificada. Las demás operaciones requieren pruebas adicionales y autorización antes de habilitarse en producción.

###  Seguridad

- Las credenciales de Supabase se administran mediante variables de entorno.
- El archivo `.env` debe estar incluido en `.gitignore`.
- Las claves privilegiadas de Supabase solo deben utilizarse en el backend.
- El repositorio de GitHub debe mantenerse privado.
- Las operaciones de escritura requieren autenticación y autorización antes del despliegue público.
- No deben almacenarse contraseñas ni claves secretas en el repositorio.

###  Despliegue web

Se contempla publicar el sistema mediante servicios de alojamiento en la nube:

| Componente | Plataforma prevista |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Base de datos | Supabase |

El objetivo es permitir el acceso desde computadoras, teléfonos y tablets mediante una dirección HTTPS.

**Estado:** Despliegue pendiente de configuración y pruebas de seguridad.

###  Próximas mejoras

- Publicación de la aplicación en Internet.
- Implementación de autenticación y permisos.
- Pruebas de registro, búsqueda, edición y eliminación.
- Mejoras en la presentación de tablas.
- Optimización para dispositivos móviles.
- Filtros y búsquedas avanzadas.
- Validación de formularios.
- Pruebas integrales del sistema.

###  Objetivo del proyecto

Contribuir a la modernización de los procesos logísticos de la Unidad Médica de Cojutepeque mediante una herramienta web que facilite el control, la consulta y la administración del inventario institucional.

