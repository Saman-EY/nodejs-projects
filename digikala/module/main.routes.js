const { Router } = require("express");
const { productRouter } = require("./product/product.routes");

const router = Router();

router.use("/api/product", productRouter);

module.exports = {
  mainRouter: router,
};
