const autoBind = require("auto-bind");
const CategoryMessages = require("./category.meesage");
const categoryService = require("./category.service");

class CategoryController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = categoryService;
  }

  async create(req, res, next) {
    try {
      const { name, icon, slug, parent } = req.body;
      const result = await this.#service.create({ name, icon, slug, parent });

      res.status(201).json({
        message: CategoryMessages.Created,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAll(req, res, next) {
    try {
      const result = await this.#service.getAll();
      res.status(200).json({
        message: CategoryMessages.Find,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
