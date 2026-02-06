const { Router } = require("express");
const { createProductValidation } = require("./validation");
const { createProductService, getProductsService, getSingleProductService, removeProductService } = require("./product.service");

const router = Router();

router.post("/", createProductValidation, createProductService);
router.get("/",  getProductsService);
router.get("/:id",  getSingleProductService);
router.delete("/:id",  removeProductService);

module.exports = {
  productRouter: router,
};
