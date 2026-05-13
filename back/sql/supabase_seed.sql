-- Datos de prueba para Supabase
-- Ejecutar despues de supabase_schema.sql y supabase_policies.sql

begin;

-- Password plano para pruebas: 12345678
-- Hash bcrypt generado con bcryptjs
-- $2b$10$IfSls2xLJDcb6NJguzOOc./fu3oyHXQ9oeyBQiqnCDi4NIhaj1T4e

-- 1) Usuarios
insert into public.users (first_name, last_name, role, email, password, phone)
values
  ('Juan', 'Perez', 'cliente', 'juan@example.com', '$2b$10$IfSls2xLJDcb6NJguzOOc./fu3oyHXQ9oeyBQiqnCDi4NIhaj1T4e', '3001112233'),
  ('Maria', 'Gomez', 'cliente', 'maria@example.com', '$2b$10$IfSls2xLJDcb6NJguzOOc./fu3oyHXQ9oeyBQiqnCDi4NIhaj1T4e', '3004445566')
on conflict (email)
do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  role = excluded.role,
  password = excluded.password,
  phone = excluded.phone;

-- 2) Productos
insert into public.producto (nombre_producto, descripcion_producto, stock_disponible, tipo, color, precio)
select *
from (
  values
    ('Laptop Gamer', 'Laptop de alto rendimiento para gaming y edicion.', 8, 'Electronica', 'Negro', 1499.99),
    ('Laptop Gamer 2', 'Version avanzada con mejor GPU y refrigeracion.', 6, 'Electronica', 'Gris', 1699.99),
    ('Smartphone Pro', 'Telefono gama alta con gran camara y bateria.', 20, 'Electronica', 'Azul', 999.99),
    ('Teclado Mecanico', 'Teclado mecanico RGB para productividad y juegos.', 25, 'Perifericos', 'Negro', 89.90),
    ('Monitor 4K', 'Monitor UHD 4K de 27 pulgadas.', 12, 'Electronica', 'Negro', 349.00),
    ('Audifonos Inalambricos', 'Sonido envolvente y cancelacion de ruido.', 30, 'Audio', 'Blanco', 129.50),
    ('Reloj Inteligente', 'Seguimiento de salud y notificaciones.', 18, 'Wearables', 'Negro', 199.99),
    ('Cafetera Automatica', 'Cafetera con molienda integrada y temporizador.', 10, 'Hogar', 'Plateado', 259.00),
    ('Camara de Seguridad', 'Camara IP con vision nocturna y deteccion de movimiento.', 22, 'Hogar', 'Blanco', 79.90),
    ('Mochila de Viaje', 'Mochila impermeable con compartimento para laptop.', 35, 'Accesorios', 'Verde', 59.99),
    ('Silla Ergonomica', 'Silla ajustable para oficina y home office.', 14, 'Muebles', 'Gris', 229.00)
) as p (nombre_producto, descripcion_producto, stock_disponible, tipo, color, precio)
where not exists (
  select 1 from public.producto pr where pr.nombre_producto = p.nombre_producto
);

-- 3) Imagenes de productos
insert into public.imagen_producto (ruta_imagen, nombre_imagen, codigo_producto)
select i.ruta_imagen, i.nombre_imagen, p.id
from (
  values
    ('Laptop Gamer', '/images/Laptop_Gamer/imagen_seed_1.jpg', 'imagen_seed_1.jpg'),
    ('Laptop Gamer 2', '/images/Laptop_Gamer2/imagen_seed_2.jpg', 'imagen_seed_2.jpg'),
    ('Smartphone Pro', '/images/Smartphone_Pro/imagen_seed_3.jpg', 'imagen_seed_3.jpg'),
    ('Teclado Mecanico', '/images/Teclado_Mecánico/imagen_seed_4.jpg', 'imagen_seed_4.jpg'),
    ('Monitor 4K', '/images/Monitor_4K/imagen_seed_5.jpg', 'imagen_seed_5.jpg'),
    ('Audifonos Inalambricos', '/images/Audífonos_Inalámbricos/imagen_seed_6.jpg', 'imagen_seed_6.jpg'),
    ('Reloj Inteligente', '/images/Reloj_Inteligente/imagen_seed_7.jpg', 'imagen_seed_7.jpg'),
    ('Cafetera Automatica', '/images/Cafetera_Automática/imagen_seed_8.jpg', 'imagen_seed_8.jpg'),
    ('Camara de Seguridad', '/images/Cámara_de_Seguridad/imagen_seed_9.jpg', 'imagen_seed_9.jpg'),
    ('Mochila de Viaje', '/images/Mochila_de_Viaje/imagen_seed_10.jpg', 'imagen_seed_10.jpg'),
    ('Silla Ergonomica', '/images/Silla_Ergonómica/imagen_seed_11.jpg', 'imagen_seed_11.jpg')
) as i (nombre_producto, ruta_imagen, nombre_imagen)
join public.producto p on p.nombre_producto = i.nombre_producto
where not exists (
  select 1
  from public.imagen_producto ip
  where ip.codigo_producto = p.id
    and ip.nombre_imagen = i.nombre_imagen
);

-- 4) Comentarios
insert into public.comentario (codigo_cliente, codigo_producto, texto)
select u.id, p.id, c.texto
from (
  values
    ('juan@example.com', 'Laptop Gamer', 'Excelente rendimiento para juegos actuales.'),
    ('maria@example.com', 'Smartphone Pro', 'Muy buena camara y bateria duradera.'),
    ('juan@example.com', 'Silla Ergonomica', 'Comoda para trabajar varias horas.')
) as c (email_usuario, nombre_producto, texto)
join public.users u on u.email = c.email_usuario
join public.producto p on p.nombre_producto = c.nombre_producto
where not exists (
  select 1
  from public.comentario co
  where co.codigo_cliente = u.id
    and co.codigo_producto = p.id
    and co.texto = c.texto
);

commit;
