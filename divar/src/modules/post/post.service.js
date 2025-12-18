const autoBind = require("auto-bind");
const PostModel = require("./post.model");
const OptionModel = require("../option/option.model");

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
}

module.exports = new OptionService();
