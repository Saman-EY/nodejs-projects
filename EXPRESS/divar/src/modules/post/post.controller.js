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
  #success_message;
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

      // res.render("./pages/panel/create-post.ejs", {
      //   categories,
      //   showBack,
      //   category: category?._id.toString(),
      //   options,
      // });

      res.json({
        categories,
        options,
        category: category?._id.toString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      // remove /public
      const images = req?.files?.map((image) => image?.path?.slice(7));
      const { title_post: title, description: content, lat, lng, categroy, amount } = req.body;

      removePropertyInObject(req.body, ["title_post", "description", "lat", "lng", "category", "images"]);
      const options = req.body;
      for (let key in options) {
        let value = options[key];
        delete options[key];
        key = utf8.decode(key);
        options[key] = value;
      }
      const userId = req.user._id;
      const { address, province, city, district } = await getAddressDetails(lat, lng);

      const data = await this.#service.create({
        userId,
        title,
        amount,
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
      // this.#success_message = PostMessages.Created;
      // return res.redirect("/post/my");
      res.status(201).json({ message: PostMessages.Created, data });
    } catch (error) {
      next(error);
    }
  }

  async findMyPosts(req, res, next) {
    try {
      const userId = req.user._id;
      const posts = await this.#service.find(userId);
      // res.render("./pages/panel/posts.ejs", {
      //   posts,
      //   count: posts.length,
      //   success_message: this.#success_message,
      //   error: null,
      // });
      // this.#success_message = null;

      res.json({
        message: "success",
        posts,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await this.#service.deleteById(id);
      this.#success_message = PostMessages.Deleted;
      res.redirect("/post/my");
    } catch (error) {
      next(error);
    }
  }

  async showPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await this.#service.checkById(id);
      res.locals.layout = "./layouts/website/main.ejs";
      res.render("./pages/home/post.ejs", {
        post,
      });
    } catch (error) {
      next(error);
    }
  }
  async showPostList(req, res, next) {
    try {
      const query = req.query;
      const posts = await this.#service.findAll(query);
      res.locals.layout = "./layouts/website/main.ejs";
      res.render("./pages/home/index.ejs", {
        posts,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OptionController();
