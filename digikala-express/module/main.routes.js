const { Router } = require("express");
const { productRouter } = require("./product/product.routes");
const { authRouter } = require("./auth/auth.routes");
const { basketRouter } = require("./basket/basket.routes");

const router = Router();

router.use("/api/product", productRouter);
router.use("/api/auth", authRouter);
router.use("/api/basket", basketRouter);

module.exports = {
  mainRouter: router,
};
