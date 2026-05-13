# READMIN - Panel de Administracion

## 1. Objetivo
Este documento centraliza todo lo relacionado con el panel de administracion del frontend (`/admin`) y su integracion con backend (autenticacion por rol).

## 2. Estado actual
El panel admin esta implementado y disponible en el frontend con:

- Ruta protegida `/admin`
- Guard de acceso por rol admin
- Opcion de menu "Panel admin" visible solo para usuarios admin autenticados
- Vista con metricas, alertas de inventario y tabla de catalogo

## 3. Ubicacion de archivos

### Frontend (Angular)
- `front/src/app/admin/admin.component.ts`
- `front/src/app/admin/admin.component.html`
- `front/src/app/admin/admin.component.css`
- `front/src/app/auth/admin.guard.ts`
- `front/src/app/auth/auth.service.ts`
- `front/src/app/app.routes.ts`
- `front/src/app/shared/nav/nav.component.ts`
- `front/src/app/shared/nav/nav.component.html`

### Backend (Node/Express)
- `back/controllers/controllers.js` (login + JWT con role)

## 4. Flujo de acceso al panel admin

1. El usuario inicia sesion.
2. Backend responde `token` JWT con `role`.
3. Front guarda el token en `localStorage`.
4. `AuthService` decodifica el token y calcula `isAdmin()`.
5. La barra de navegacion muestra "Panel admin" solo si `isAdmin()` es `true`.
6. Al navegar a `/admin`, `adminGuard` valida:
   - No autenticado -> redirige a `/login`
   - Autenticado sin rol admin -> redirige a `/dashboard`
   - Admin -> permite acceso

## 5. Contrato de autenticacion (importante)

El backend de login debe incluir el rol dentro del JWT. Ejemplo de payload:

```json
{
  "id": 1,
  "email": "admin@tienda.com",
  "role": "admin"
}
```

Respuesta de login recomendada:

```json
{
  "message": "Inicio de sesion exitoso",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "admin@tienda.com",
    "role": "admin"
  }
}
```

## 6. Deteccion de rol en frontend

`AuthService` contempla estas variantes en el payload para mayor compatibilidad:

- `role`
- `rol`
- `user.role`
- `user.rol`

Todos los valores se normalizan en minusculas antes de comparar.

## 7. UI del panel admin

El panel incluye:

- Tarjetas KPI:
  - Total de productos
  - Stock total
  - Productos con descuento
  - Productos sin stock
- Alertas:
  - Productos con stock bajo (<= 5)
  - Productos agotados
- Tabla completa de catalogo con:
  - Imagen
  - Tipo
  - Precio
  - Descuento
  - Estado de stock

## 8. Requisitos de rol en base de datos

En la tabla `users`, el campo `role` debe contener valores consistentes. Recomendado:

- `admin`
- `cliente`

Si un usuario debe ver el panel admin, su `role` debe ser exactamente `admin` (sin espacios).

## 9. Checklist de verificacion rapida

1. En DB el usuario tiene `role = admin`.
2. Login devuelve JWT con `role`.
3. Se reinicia sesion (logout/login) para tomar token nuevo.
4. En navbar aparece "Panel admin" junto a "Cerrar sesion".
5. `/admin` abre sin redireccion.

## 10. Troubleshooting

### No aparece "Panel admin"
- Verificar que el token actual incluye `role`.
- Limpiar sesion (`localStorage.removeItem('token')`) y volver a loguear.
- Revisar que `role` sea `admin` y no `Admin`/`administrador`.

### Redirecciona a dashboard al entrar a `/admin`
- Usuario autenticado pero sin rol admin valido.

### Redirecciona a login al entrar a `/admin`
- No hay token activo o la sesion se perdio.

### No compila frontend en local
- Este proyecto usa Angular 19, requiere Node >= 18.19.
- Si tienes Node 12, `ng build` va a fallar por version.

## 11. Comandos utiles

### Backend
```bash
cd back
node server.js
```

### Frontend
```bash
cd front
ng serve
```

## 12. Mejoras sugeridas (siguiente fase)

- CRUD admin de productos (crear/editar/eliminar)
- Gestion de usuarios y roles desde panel
- Reportes de ventas
- Paginacion/filtros avanzados en tabla
- Auditoria de acciones admin
