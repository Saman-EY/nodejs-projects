const autoBind = require("auto-bind");
const postService = require("./post.service");
const CategoryModel = require("../category/category.model");
const createHttpError = require("http-errors");
const PostMessages = require("./post.message");

class OptionController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = postService;
  }

  async createPostPage(req, res, next) {
    try {
      let { slug } = req.query;
      let match = { parent: null };
      let categories = [];
      let showBack = false;
      if (slug) {
        slug = slug.trim();
        const category = await CategoryModel.findOne({ slug });
        if (!category) throw new createHttpError.NotFound(PostMessages.NotFound);
        match = { parent: category._id };
        showBack = true;
      }
      categories = await CategoryModel.aggregate([
        {
          $match: match,
        },
      ]);
      res.render("./pages/panel/create-post.ejs", {
        categories,
        showBack,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OptionController();
