const supabase = require("../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const registerUser = async (req, res) => {
    const { first_name, last_name, email, password, phone } = req.body;
    
    try {
        // Validar que todos los campos sean proporcionados
        if (!first_name || !last_name || !email || !password || !phone) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Asignar siempre el rol "cliente"
        const role = "cliente";

        // Insertar usuario en Supabase
        const { data, error } = await supabase
            .from("users")
            .insert([{ first_name, last_name, role, email, password: hashedPassword, phone }])
            .select();

        if (error) throw error;

        // Generar token JWT
        const token = jwt.sign({ id: data[0].id, email: data[0].email, role: data[0].role }, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        res.status(201).json({ message: "Usuario registrado con éxito", token, user: data[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !users) return res.status(400).json({ error: "Usuario no encontrado" });

        const validPassword = await bcrypt.compare(password, users.password);
        if (!validPassword) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: users.id, email: users.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener el producto antes de llamar a `multer`
const getProductName = async (codigo_producto) => {
    try {
        const { data: producto, error } = await supabase
            .from("producto")
            .select("nombre_producto")
            .eq("id", codigo_producto)
            .single();

        if (error || !producto) return null;
        return producto.nombre_producto.replace(/\s+/g, "_"); // Reemplazar espacios con "_"
    } catch (err) {
        return null;
    }
};

// Configuración de Multer
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const { codigo_producto } = req.body;

        if (!codigo_producto) return cb(new Error("Debe proporcionar un código de producto"), null);

        const nombreProducto = await getProductName(codigo_producto);
        if (!nombreProducto) return cb(new Error("Producto no encontrado"), null);

        const productDir = path.join(__dirname, "../images", nombreProducto);

        if (!fs.existsSync(productDir)) {
            fs.mkdirSync(productDir, { recursive: true });
        }

        cb(null, productDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + "_" + uniqueSuffix);
    }
});

const upload = multer({ storage }).array("imagen", 5); // Permite hasta 5 imágenes

const uploadImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        try {
            const { codigo_producto } = req.body;
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: "No se ha enviado ninguna imagen" });
            }

            const imagenes = req.files.map(file => ({
                ruta_imagen: `/images/${file.destination.split("/").pop()}/${file.filename}`,
                nombre_imagen: file.filename,
                codigo_producto
            }));

            // Insertar en la base de datos
            const { data, error } = await supabase
                .from("imagen_producto")
                .insert(imagenes)
                .select();

            if (error) throw error;

            res.status(201).json({ message: "Imágenes subidas exitosamente", imagenes: data });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

const addProduct = async (req, res) => {
    const { nombre_producto, descripcion_producto, stock_disponible, tipo, color, precio } = req.body;

    try {
        // Validar que los campos obligatorios estén presentes
        if (!nombre_producto || stock_disponible === undefined || !precio) {
            return res.status(400).json({ error: "Los campos nombre_producto, stock_disponible y precio son obligatorios" });
        }

        // Insertar el producto en Supabase
        const { data, error } = await supabase
            .from("producto")
            .insert([{ nombre_producto, descripcion_producto, stock_disponible, tipo, color, precio }])
            .select();

        if (error) throw error;

        res.status(201).json({ message: "Producto agregado exitosamente", product: data[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        // Consultar todos los productos
        const { data: productos, error: productosError } = await supabase
            .from("producto")
            .select("*"); // Obtener todos los productos

        if (productosError) throw productosError;
        if (!productos || productos.length === 0) {
            return res.status(404).json({ error: "No hay productos disponibles" });
        }

        // Consultar todas las imágenes
        const { data: imagenes, error: imagenesError } = await supabase
            .from("imagen_producto")
            .select("id_imagen, ruta_imagen, nombre_imagen, codigo_producto");

        if (imagenesError) throw imagenesError;

        // Asociar imágenes a cada producto
        const productosConImagenes = productos.map((producto) => {
            return {
                ...producto,
                imagenes: imagenes.filter((img) => img.codigo_producto === producto.id)
            };
        });

        res.status(200).json({ productos: productosConImagenes });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error al obtener los productos" });
    }
};
// Agregar un nuevo comentario
const addComentario = async (req, res) => {
    try {
        const { codigo_cliente, codigo_producto, texto } = req.body;

        // Verificar que todos los campos fueron enviados
        if (!codigo_cliente || !codigo_producto || !texto) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Intentar insertar el comentario en Supabase
        const { data, error } = await supabase
            .from("comentario")  // Nombre de la tabla en singular
            .insert([{ codigo_cliente, codigo_producto, texto }])
            .select();

        // **Logs para depuración**
        console.log("➡️ Datos enviados a Supabase:", { codigo_cliente, codigo_producto, texto });
        console.log("📌 Respuesta de Supabase - Data:", data);
        console.log("📌 Respuesta de Supabase - Error:", error);

        // Si hay un error, mostrar detalles
        if (error) {
            return res.status(500).json({ error: error.message || "Error desconocido en Supabase" });
        }

        res.status(201).json({ message: "Comentario agregado exitosamente", data });
    } catch (error) {
        console.error("⚠️ Error inesperado al agregar comentario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getComentariosByProducto = async (req, res) => {
    try {
        const { codigo_producto } = req.params;

        // Verificar que se envió el código del producto
        if (!codigo_producto) {
            return res.status(400).json({ error: "Debe proporcionar un código de producto" });
        }

        console.log(`📌 Buscando comentarios para el producto ID: ${codigo_producto}`);

        // Consultar comentarios y unir con la tabla "users"
        const { data, error } = await supabase
            .from("comentario")
            .select(`
                id_comentario,
                texto,
                fecha_creacion,
                users (id, first_name, last_name)
            `)
            .eq("codigo_producto", codigo_producto);

        // 📌 Logs de depuración
        console.log("📌 Comentarios obtenidos:", JSON.stringify(data, null, 2));
        console.log("📌 Error de Supabase:", error);

        if (error) {
            return res.status(500).json({ error: error.message || "Error desconocido en Supabase" });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron comentarios para este producto" });
        }

        res.status(200).json({ comentarios: data });
    } catch (error) {
        console.error("⚠️ Error inesperado al obtener comentarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    registerUser,
    login,
    addProduct,
    uploadImage,
    addComentario,
    getComentariosByProducto,
    getAllProducts
};