import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Finance Manager API",
    version: "1.0.0",
    description:
      "Documentación de la API para la prueba técnica de Finance Manager",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["src/pages/api/*.ts", "src/pages/api/*/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
