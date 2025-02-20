const express = require("express");
const router = express.Router();
const controllers = require("../controllers/controllers");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         first_name:
 *           type: string
 *           description: Nombre del usuario
 *         last_name:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         phone:
 *           type: string
 *           description: Teléfono del usuario
 *         role:
 *           type: string
 *           description: Rol del usuario (por defecto "cliente")
 *       example:
 *         first_name: Juan
 *         last_name: Pérez
 *         email: juan@example.com
 *         password: "12345678"
 *         phone: "1234567890"
 *         role: cliente
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea un nuevo usuario con rol "cliente" y devuelve un token JWT.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: Error en la solicitud (faltan datos o usuario ya existe)
 */
router.post("/register", controllers.registerUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicia sesión
 *     description: Verifica credenciales y devuelve un token JWT.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *             example:
 *               email: juan@example.com
 *               password: "12345678"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Usuario no encontrado o contraseña incorrecta
 */
router.post("/login", controllers.login);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Agregar un nuevo producto
 *     description: Inserta un nuevo producto en la base de datos.
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_producto:
 *                 type: string
 *                 example: "Laptop Gamer"
 *               descripcion_producto:
 *                 type: string
 *                 example: "Laptop con procesador i7 y tarjeta gráfica RTX 3060"
 *               stock_disponible:
 *                 type: integer
 *                 example: 10
 *               tipo:
 *                 type: string
 *                 example: "Electrónica"
 *               color:
 *                 type: string
 *                 example: "Negro"
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 1499.99
 *     responses:
 *       201:
 *         description: Producto agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto agregado exitosamente"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre_producto:
 *                       type: string
 *                       example: "Laptop Gamer"
 *                     descripcion_producto:
 *                       type: string
 *                       example: "Laptop con procesador i7 y tarjeta gráfica RTX 3060"
 *                     stock_disponible:
 *                       type: integer
 *                       example: 10
 *                     tipo:
 *                       type: string
 *                       example: "Electrónica"
 *                     color:
 *                       type: string
 *                       example: "Negro"
 *                     precio:
 *                       type: number
 *                       format: float
 *                       example: 1499.99
 *       400:
 *         description: Error en la solicitud (datos incorrectos o faltantes)
 *       500:
 *         description: Error del servidor
 */
router.post("/productos", controllers.addProduct);

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Subir imagen de producto
 *     description: Guarda una imagen en la carpeta del producto y la registra en la base de datos.
 *     tags:
 *       - Imágenes
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: imagen
 *         type: file
 *         required: true
 *         description: La imagen del producto.
 *       - in: formData
 *         name: codigo_producto
 *         type: integer
 *         required: true
 *         description: Código del producto al que pertenece la imagen.
 *     responses:
 *       201:
 *         description: Imagen subida exitosamente.
 *       400:
 *         description: Datos incorrectos o faltantes.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/upload", controllers.uploadImage);


/**
 * @swagger
 * /api/comentarios:
 *   post:
 *     summary: Agregar un comentario
 *     description: Permite a un usuario agregar un comentario sobre un producto.
 *     tags:
 *       - Comentarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo_cliente:
 *                 type: integer
 *                 example: 1
 *               codigo_producto:
 *                 type: integer
 *                 example: 2
 *               texto:
 *                 type: string
 *                 example: "Muy buen producto, recomendado"
 *     responses:
 *       201:
 *         description: Comentario agregado exitosamente
 *       400:
 *         description: Faltan datos
 *       500:
 *         description: Error interno del servidor
 */
// Ruta para agregar un comentario
router.post("/comentarios", controllers.addComentario);

/**
 * @swagger
 * /api/comentarios/{codigo_producto}:
 *   get:
 *     summary: Obtener comentarios de un producto
 *     description: Obtiene todos los comentarios de un producto específico, incluyendo información del usuario.
 *     tags:
 *       - Comentarios
 *     parameters:
 *       - in: path
 *         name: codigo_producto
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *       400:
 *         description: Código de producto no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
// Ruta para obtener comentarios de un producto
router.get("/comentarios/:codigo_producto", controllers.getComentariosByProducto);

/* @swagger
 * /productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     responses:
 *       200:
 *         description: Lista de todos los productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   precio:
 *                     type: number
 *                     format: float
 *       500:
 *         description: Error del servidor
 */

router.get("/productos", controllers.getAllProducts);
module.exports = router;
