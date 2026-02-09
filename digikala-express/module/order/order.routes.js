const { Router } = require("express");
const { getOrdersService, getSingleOrdersService } = require("./order.service");
const { AuthGuard } = require("../auth/auth.guard");

const router = Router();

router.get("/", AuthGuard, getOrdersService);
router.get("/:id", AuthGuard, getSingleOrdersService);

module.exports = {
  ordersRouter: router,
};
