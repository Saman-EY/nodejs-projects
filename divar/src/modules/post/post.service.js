const autoBind = require("auto-bind");
const PostModel = require("./post.model");

class OptionService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = PostModel;
  }

  async create() {}
}

module.exports = new OptionService();
