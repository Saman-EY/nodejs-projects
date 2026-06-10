const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function SwaggerConfig(app) {
  const swaggerDocument = swaggerJsDoc({
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Shop",
        version: "1.0.0",
        description: "API documentation for Shop with express js",
        contact: {
          name: "Saman Ezzatabadi",
          email: "saman.ezzatabadi@gmail.com",
        },
      },
      tags: [
        { name: "Auth", description: "Authentication" },
        { name: "Products", description: "Product management" },
        { name: "Basket", description: "Shopping basket" },
        { name: "Orders", description: "Order management" },
        { name: "Payment", description: "Payment processing" },
        { name: "RBAC", description: "Role-based access control" },
      ],
      servers: [
    
        {
          url: "https://shop-express-kj5q.onrender.com",
          description: "Production server",
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      // ✅ optional - applies auth globally to all routes
      // security: [{ BearerAuth: [] }],
    },
    apis: [__dirname + "/../module/**/*.swagger.js"],
  });

  const swagger = swaggerUi.setup(swaggerDocument, {});
  app.use("/swagger", swaggerUi.serve, swagger);
}

module.exports = SwaggerConfig;
