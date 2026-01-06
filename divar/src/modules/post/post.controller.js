const autoBind = require("auto-bind");
const postService = require("./post.service");
const CategoryModel = require("../category/category.model");
const createHttpError = require("http-errors");
const PostMessages = require("./post.message");
const { Types } = require("mongoose");
const { getAddressDetails } = require("../../common/utils/http");
const { removePropertyInObject } = require("../../common/utils/functions");
const utf8 = require("utf8");

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
      let options, category;
      if (slug) {
        slug = slug.trim();
        category = await CategoryModel.findOne({ slug });
        if (!category) throw new createHttpError.NotFound(PostMessages.NotFound);
        match = { parent: category._id };
        options = await this.#service.getCategoryOptions(category._id);
        if (options.length === 0) options = null;
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
        category: category?._id.toString(),
        options,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      console.log(req.body);
      // remove /public
      const images = req?.files?.map((image) => image?.path?.slice(7));
      const { title_post: title, description: content, lat, lng, categroy } = req.body;

      removePropertyInObject(req.body, ["title_post", "description", "lat", "lng", "category", "images"]);
      const options = req.body;
      for (let key in options) {
        let value = options[key];
        delete options[key];
        key = utf8.decode(key);
        options[key] = value;
      }

      const { address, province, city, district } = await getAddressDetails(lat, lng);

      await this.#service.create({
        title,
        content,
        coordinate: [lat, lng],
        category: new Types.ObjectId(categroy),
        images,
        options,
        address,
        province,
        city,
        district,
      });
      res.status(201).json({ message: PostMessages.Created });
    } catch (error) {
      next(error);
    }
  }

  async find(req, res, next) {
    try {
      const posts = await this.#service.find();
      return res.render("./pages/panel/posts.ejs", { posts });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OptionController();
