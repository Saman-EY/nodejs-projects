const { config } = require("dotenv");
const express = require("express");
const { sequelize } = require("./config/sequelize");
const { initialDatabase } = require("./config/model.initial");
const { mainRouter } = require("./module/main.routes");
config();
async function main() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  await initialDatabase();
  app.use(mainRouter);

  // not found
  app.use((req, res, next) => {
    return res.status(404).json({
      message: "not found route",
    });
  });

  // error handler
  app.use((err, req, res, next) => {
    const status = err?.status ?? err?.statusCode ?? 500;
    let message = err?.message ?? "internal server error";

    if (err?.name === "ValidationError") {
      message = err?.details?.body?.[0]?.message ?? "internal server error";
    }

    console.log("❌", JSON.stringify(err, null, 4));

    return res.status(status).json({
      message,
    });
  });

  const PORT = process.env.PORT ?? 3002;

  app.listen(PORT, () => {
    console.log("server running");
  });
}

main();
