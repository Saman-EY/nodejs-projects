const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { addToBasketService, getUserBasketService } = require("./basket.service");

const router = Router();

router.post("/add", AuthGuard, addToBasketService);
router.get("/", AuthGuard, getUserBasketService);

module.exports = {
  basketRouter: router,
};
