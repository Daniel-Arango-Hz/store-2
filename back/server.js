require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/routes");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path"); 
const app = express();
const PORT = process.env.PORT || 3060;

app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "APIS",
            description: "Documentación de la API para registrar y autenticar usuarios",
            version: "1.0.0",
        },
        servers: [
            { url: process.env.BASE_URL || "https://back-store-v1.onrender.com" } // Usa la URL del despliegue
        ],
    },
    apis: ["./routes/routes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ** Habilitar el JSON de Swagger para Postman **
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
});

// Rutas de autenticación
app.use("/api", authRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📄 Documentación Swagger en http://localhost:${PORT}/api-docs`);
    console.log(`📜 JSON disponible en http://localhost:${PORT}/api-docs.json`);
});
