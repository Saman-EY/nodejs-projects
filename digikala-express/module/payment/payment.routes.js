const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { paymentBasketService, paymentVerifyService } = require("./payment.service");

const router = Router();

router.post("/", AuthGuard, paymentBasketService);
router.get("/callback", paymentVerifyService);

module.exports = {
  paymentRouter: router,
};
