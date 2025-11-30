const { Router } = require("express");
const categoryController = require("./category.controller");

const router = Router();

router.post("/", categoryController.create);
router.get("/", categoryController.getAll);

module.exports = {
  CategoryRouter: router,
};
