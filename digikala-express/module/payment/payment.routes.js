const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { paymentBasketService, paymentVerifyService, checkoutService } = require("./payment.service");

const router = Router();

router.post("/", AuthGuard, paymentBasketService);
router.get("/callback", paymentVerifyService);
router.get("/checkout", AuthGuard, checkoutService);

module.exports = {
  paymentRouter: router,
};
