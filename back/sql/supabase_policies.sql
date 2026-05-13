-- Politicas RLS para backend actual usando clave publishable
-- Ejecutar en Supabase SQL Editor

begin;

alter table public.users enable row level security;
alter table public.producto enable row level security;
alter table public.imagen_producto enable row level security;
alter table public.comentario enable row level security;

-- USERS
-- Registro (insert) y login (select por email)
drop policy if exists users_select_public on public.users;
create policy users_select_public
  on public.users
  for select
  to anon, authenticated
  using (true);

drop policy if exists users_insert_public on public.users;
create policy users_insert_public
  on public.users
  for insert
  to anon, authenticated
  with check (true);

-- PRODUCTOS
-- Listado de productos (select) y alta de producto (insert)
drop policy if exists producto_select_public on public.producto;
create policy producto_select_public
  on public.producto
  for select
  to anon, authenticated
  using (true);

drop policy if exists producto_insert_public on public.producto;
create policy producto_insert_public
  on public.producto
  for insert
  to anon, authenticated
  with check (true);

-- IMAGEN_PRODUCTO
-- Carga y consulta de imagenes
drop policy if exists imagen_producto_select_public on public.imagen_producto;
create policy imagen_producto_select_public
  on public.imagen_producto
  for select
  to anon, authenticated
  using (true);

drop policy if exists imagen_producto_insert_public on public.imagen_producto;
create policy imagen_producto_insert_public
  on public.imagen_producto
  for insert
  to anon, authenticated
  with check (true);

-- COMENTARIO
-- Crear y listar comentarios
drop policy if exists comentario_select_public on public.comentario;
create policy comentario_select_public
  on public.comentario
  for select
  to anon, authenticated
  using (true);

drop policy if exists comentario_insert_public on public.comentario;
create policy comentario_insert_public
  on public.comentario
  for insert
  to anon, authenticated
  with check (true);

commit;
