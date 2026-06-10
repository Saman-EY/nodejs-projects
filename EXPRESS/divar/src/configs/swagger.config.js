const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function SwaggerConfig(app) {
  const swaggerDocument = swaggerJsDoc({
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Divar Demo Api",
        version: "1.0.0",
        description: "Divar Demo Api description ...",
        contact: {
          name: "Saman Ezzatabadi",
          email: "saman.ezzatabadi@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
        {
          url: "",
          description: "Production server",
        },
      ],
      
    },
    apis: [__dirname + "/../modules/**/*.swagger.js"],
  });

  const swagger = swaggerUi.setup(swaggerDocument, {});
  app.use("/swagger", swaggerUi.serve, swagger);
}

// const swaggerConfig = swaggerUi.setup(swaggerDocument);

module.exports = SwaggerConfig;
