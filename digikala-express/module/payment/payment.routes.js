const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { paymentBasketService } = require("./payment.service");

const router = Router();

router.post("/", AuthGuard, paymentBasketService);

module.exports = {
  paymentRouter: router,
};
