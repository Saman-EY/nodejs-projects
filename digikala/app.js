const { config } = require("dotenv");
const express = require("express");
const { sequelize } = require("./config/sequelize");
config();
async function main() {
  const app = express();
  require("./module/product/product.model")
  await sequelize.sync({ force: true });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    return res.status(404).json({
      message: "not found route",
    });
  });

  app.use((err, req, res, next) => {
    const status = err?.status ?? 500;
    const message = err?.message ?? "internal server error";

    return res.status(status).json({
      message,
    });
  });

  const PORT = process.env.PORT ?? 3002;

  app.listen(PORT, () => {
    console.log("server running on http://localhost:" + PORT);
  });
}

main();
