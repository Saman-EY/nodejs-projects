const autoBind = require("auto-bind");
const PostModel = require("./post.model");
const OptionModel = require("../option/option.model");
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const PostMessages = require("./post.message");

class OptionService {
  #model;
  #optionModel;
  constructor() {
    autoBind(this);
    this.#model = PostModel;
    this.#optionModel = OptionModel;
  }

  async getCategoryOptions(categoryId) {
    const option = await this.#optionModel.find({ category: categoryId });
    return option;
  }

  async create(dto) {
    return await this.#model.create(dto);
  }
  async find(userId) {
    if (userId && isValidObjectId(userId)) return await this.#model.find({userId});
    throw new createHttpError.BadRequest(PostMessages.RequestNotValid);
  }
}

module.exports = new OptionService();
