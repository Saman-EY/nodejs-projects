const { Router } = require("express");
const { productRouter } = require("./product/product.routes");
const { authRouter } = require("./auth/auth.routes");

const router = Router();

router.use("/api/product", productRouter);
router.use("/api/auth", authRouter);

module.exports = {
  mainRouter: router,
};
