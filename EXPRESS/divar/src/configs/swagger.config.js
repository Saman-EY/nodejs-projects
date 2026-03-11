const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function SwaggerConfig(app) {
  const swaggerDocument = swaggerJsDoc({
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Divar Api",
        description: "Divar Api description ...",
        version: "1.0.0",
      },
    },
    apis: [__dirname + "/../modules/**/*.swagger.js"],
  });

  const swagger = swaggerUi.setup(swaggerDocument, {});
  app.use("/swagger", swaggerUi.serve, swagger);
}

// const swaggerConfig = swaggerUi.setup(swaggerDocument);

module.exports = SwaggerConfig;
