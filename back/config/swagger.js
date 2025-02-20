const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Usuarios",
            version: "1.0.0",
            description: "Documentación de la API de registro de usuarios con Supabase",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Servidor local",
            },
        ],
    },
    apis: ["./routes/*.js"], // Escaneará las rutas en la carpeta routes
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
