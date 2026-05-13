# Store-2

Aplicacion ecommerce full stack con frontend en Angular SSR y backend en Node.js/Express conectado a Supabase (PostgreSQL).

## Descripcion general

Este repositorio contiene:

- Frontend: tienda online con catalogo, detalle de producto, carrito, checkout, login, registro y panel admin.
- Backend: API REST para autenticacion, productos, imagenes y comentarios.
- Base de datos: scripts SQL para esquema, politicas RLS y datos semilla en Supabase.

## Arquitectura

- Frontend: Angular 19 + SSR
- Backend: Node.js + Express
- DB: Supabase PostgreSQL
- Auth: JWT (jsonwebtoken)
- Docs API: Swagger

## Estructura del proyecto

- [front](front)
	- Aplicacion Angular (UI, rutas, servicios)
- [back](back)
	- API Express, controladores, rutas y archivos SQL
- [back/sql/supabase_schema.sql](back/sql/supabase_schema.sql)
	- Esquema de tablas
- [back/sql/supabase_policies.sql](back/sql/supabase_policies.sql)
	- Politicas RLS
- [back/sql/supabase_seed.sql](back/sql/supabase_seed.sql)
	- Datos de prueba
- [READMIN.md](READMIN.md)
	- Documentacion especifica del panel admin

## Requisitos

- Node.js 18.19 o superior
- npm 9 o superior
- Cuenta/proyecto en Supabase

Nota importante:

- Angular 19 no compila con Node 12.
- Si aparece error de version al ejecutar build, actualiza Node a 18.19+.

## Configuracion de entorno

Crear archivo .env en la carpeta back con:

SUPABASE_URL=tu_url_de_supabase
SUPABASE_API_KEY=tu_supabase_key
JWT_SECRET=tu_secreto_jwt
PORT=3060
BASE_URL=http://localhost:3060

Referencias en codigo:

- [back/config/config.js](back/config/config.js)
- [back/server.js](back/server.js)

## Instalacion local

### 1) Backend

1. Entrar a [back](back)
2. Instalar dependencias
3. Ejecutar servidor

Comandos:

cd back
npm install
node server.js

Servidor local esperado:

- API: http://localhost:3060
- Swagger UI: http://localhost:3060/api-docs
- Swagger JSON: http://localhost:3060/api-docs.json

### 2) Frontend

1. Entrar a [front](front)
2. Instalar dependencias
3. Levantar entorno de desarrollo

Comandos:

cd front
npm install
npm start

Frontend local esperado:

- App: http://localhost:4200

## Base de datos (Supabase)

Ejecutar en este orden dentro del SQL Editor de Supabase:

1. [back/sql/supabase_schema.sql](back/sql/supabase_schema.sql)
2. [back/sql/supabase_policies.sql](back/sql/supabase_policies.sql)
3. [back/sql/supabase_seed.sql](back/sql/supabase_seed.sql)

Tablas principales:

- users
- producto
- imagen_producto
- comentario

## Modulos funcionales

### Frontend

- Dashboard y listado de productos
- Filtros por categoria, color, ofertas y busqueda
- Detalle de producto
- Carrito y checkout
- Registro e inicio de sesion
- Panel admin protegido por rol

Rutas principales definidas en:

- [front/src/app/app.routes.ts](front/src/app/app.routes.ts)

### Backend

Endpoints principales:

- POST /api/register
- POST /api/login
- GET /api/productos
- POST /api/productos
- POST /api/upload
- POST /api/comentarios
- GET /api/comentarios/:codigo_producto

Definidas en:

- [back/routes/routes.js](back/routes/routes.js)

Lgica de negocio en:

- [back/controllers/controllers.js](back/controllers/controllers.js)

## Rol admin

- El backend firma el JWT con role en login.
- El frontend muestra opcion de panel admin solo si role es admin.
- Ruta admin protegida con guard.

Documentacion detallada:

- [READMIN.md](READMIN.md)

## Docker

Existen Dockerfiles por servicio:

- [back/dockerfile](back/dockerfile)
- [front/Dockerfile](front/Dockerfile)

Observaciones:

- Backend expone puerto 3060.
- Frontend sirve build estatico en puerto 4200 por defecto.

## Problemas conocidos

- Hay URLs mixtas local/remoto para imagenes y API en algunos componentes del frontend.
- Para desarrollo local consistente, conviene unificar base URL via configuracion de entorno frontend.

## Proximos pasos recomendados

1. Unificar URLs de API e imagenes por ambiente (dev/prod).
2. Agregar script npm start en backend.
3. Agregar pruebas (unitarias e integracion).
4. Definir pipeline CI/CD para front y back.
