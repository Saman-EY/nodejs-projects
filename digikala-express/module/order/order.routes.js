const { Router } = require("express");
const {
  getOrdersService,
  getSingleOrdersService,
  setPackedStatusToOrderService,
  setCancledStatusToOrderService,
  setDeliveryStatusToOrderService,
} = require("./order.service");
const { AuthGuard } = require("../auth/auth.guard");

const router = Router();

router.get("/", AuthGuard, getOrdersService);
router.get("/:id", AuthGuard, getSingleOrdersService);
router.get("/set-packed/:id", AuthGuard, setPackedStatusToOrderService);
router.get("/set-cancel/:id", AuthGuard, setCancledStatusToOrderService);
router.get("/set-delivered/:id", AuthGuard, setDeliveryStatusToOrderService);

module.exports = {
  ordersRouter: router,
};
