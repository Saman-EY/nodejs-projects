const autoBind = require("auto-bind");
const OptionMessages = require("./option.message");
const optionService = require("./option.service");

class OptionController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = optionService;
  }

  async create(req, res, next) {
    try {
      const { title, key, type, guide, enum: list, category, required } = req.body;
      const result = await this.#service.create({ title, key, type, guide, enum: list, category, required });
      res.status(201).json({ message: OptionMessages.Created, data: result });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { title, key, type, guide, enum: list, category, required } = req.body;
      const { id } = req.params;
      const result = await this.#service.update(id, { title, key, type, guide, enum: list, category, required });
      res.status(201).json({ message: OptionMessages.Updated, data: result });
    } catch (error) {
      next(error);
    }
  }

  async findByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;
      const option = await this.#service.findByCategoryId(categoryId);
      res.status(200).json({ data: option });
    } catch (error) {
      next(error);
    }
  }
  async findByCategorySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const option = await this.#service.findByCategorySlug(slug);
      res.status(200).json({ data: option });
    } catch (error) {
      next(error);
    }
  }
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const option = await this.#service.findById(id);
      res.status(200).json({ data: option });
    } catch (error) {
      next(error);
    }
  }

  async find(req, res, next) {
    try {
      const result = await this.#service.find();
      res.status(200).json({ message: OptionMessages.Find, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      await this.#service.deleteById(id);
      res.status(200).json({ message: OptionMessages.Removed });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OptionController();
