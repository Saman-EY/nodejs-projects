const { Router } = require("express");
const { getOrderService } = require("./order.service");
const { AuthGuard } = require("../auth/auth.guard");

const router = Router();

router.get("/", AuthGuard,  getOrderService);

module.exports = {
  ordersRouter: router,
};
