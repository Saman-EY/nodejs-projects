const { Router } = require("express");
const { productRouter } = require("./product/product.routes");
const { authRouter } = require("./auth/auth.routes");
const { basketRouter } = require("./basket/basket.routes");
const { paymentRouter } = require("./payment/payment.routes");
const { ordersRouter } = require("./order/order.routes");

const router = Router();

router.use("/api/product", productRouter);
router.use("/api/auth", authRouter);
router.use("/api/basket", basketRouter);
router.use("/api/payment", paymentRouter);
router.use("/api/orders", ordersRouter);

module.exports = {
  mainRouter: router,
};
