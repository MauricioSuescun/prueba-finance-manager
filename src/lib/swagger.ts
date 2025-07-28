import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Finance Manager API",
    version: "1.0.0",
    description: "API completa para la gestión de finanzas personales y empresariales",
    contact: {
      name: "Finance Manager Team",
      email: "support@financemanager.com"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de desarrollo",
    },
    {
      url: "https://tu-app.vercel.app",
      description: "Servidor de producción",
    },
  ],
  components: {
    securitySchemes: {
      session: {
        type: "apiKey",
        in: "cookie",
        name: "auth-session",
        description: "Sesión de autenticación requerida para todos los endpoints"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "clx1234567890"
          },
          name: {
            type: "string",
            nullable: true,
            example: "Juan Pérez"
          },
          email: {
            type: "string",
            format: "email",
            example: "juan@example.com"
          },
          phone: {
            type: "string",
            nullable: true,
            example: "+1234567890"
          },
          role: {
            type: "string",
            enum: ["ADMIN", "USER"],
            example: "ADMIN"
          },
          emailVerified: {
            type: "boolean",
            example: true
          },
          image: {
            type: "string",
            nullable: true,
            example: "https://avatars.githubusercontent.com/u/123456"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-15T00:00:00.000Z"
          }
        }
      },
      Movement: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "clx1234567890"
          },
          concept: {
            type: "string",
            example: "Salario enero"
          },
          amount: {
            type: "number",
            description: "Monto del movimiento (positivo para ingresos, negativo para egresos)",
            example: 2500.00
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2024-01-15T00:00:00.000Z"
          },
          user: {
            $ref: "#/components/schemas/User"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-15T00:00:00.000Z"
          }
        }
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Error interno del servidor"
          },
          details: {
            type: "string",
            example: "Detalles adicionales del error"
          }
        }
      }
    }
  },
  security: [
    {
      session: []
    }
  ],
  tags: [
    {
      name: "Movements",
      description: "Operaciones relacionadas con movimientos financieros"
    },
    {
      name: "Users", 
      description: "Gestión de usuarios del sistema (solo administradores)"
    },
    {
      name: "Reports",
      description: "Generación de reportes financieros (solo administradores)"
    },
    {
      name: "Auth",
      description: "Autenticación y gestión de sesiones"
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ["src/pages/api/*.ts", "src/pages/api/*/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
