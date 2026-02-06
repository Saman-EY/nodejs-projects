const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { addToBasketService } = require("./basket.service");

const router = Router();

router.post("/add", AuthGuard, addToBasketService);

module.exports = {
  basketRouter: router,
};
