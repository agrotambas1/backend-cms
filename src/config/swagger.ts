import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerDefinition = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LG Sinarmas CMS API",
      version: "1.0.0",
      description: "API documentation for LG Sinarmas CMS",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../routes/cms/*.ts"),
    // path.join(__dirname, "../routes/public/*.ts"),
    path.join(__dirname, "../docs/schemas/*.yaml"),
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerDefinition);
