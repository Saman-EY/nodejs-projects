const { Router } = require("express");
const { createProductValidation } = require("./validation");
const {
  createProductService,
  getProductsService,
  getSingleProductService,
  removeProductService,
} = require("./product.service");
const { AuthGuard } = require("../auth/auth.guard");

const router = Router();

router.post("/", AuthGuard, createProductValidation, createProductService);
router.get("/", getProductsService);
router.get("/:id", getSingleProductService);
router.delete("/:id", AuthGuard, removeProductService);

module.exports = {
  productRouter: router,
};
