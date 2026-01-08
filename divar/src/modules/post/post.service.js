const autoBind = require("auto-bind");
const PostModel = require("./post.model");
const OptionModel = require("../option/option.model");
const { isValidObjectId, Types } = require("mongoose");
const createHttpError = require("http-errors");
const PostMessages = require("./post.message");
const CategoryModel = require("../category/category.model");

class OptionService {
  #model;
  #optionModel;
  #categoryModel;
  constructor() {
    autoBind(this);
    this.#model = PostModel;
    this.#optionModel = OptionModel;
    this.#categoryModel = CategoryModel;
  }

  async getCategoryOptions(categoryId) {
    const option = await this.#optionModel.find({ category: categoryId });
    return option;
  }

  async create(dto) {
    return await this.#model.create(dto);
  }
  async find(userId) {
    if (userId && isValidObjectId(userId)) return await this.#model.find({ userId });
    throw new createHttpError.BadRequest(PostMessages.RequestNotValid);
  }
  async findAll(options) {
    let { category, search } = options;
    const query = {};
    if (category) {
      const result = await this.#categoryModel.findOne({ slug: category });
      const categories = await this.#categoryModel.find({ parents: result._id }, { _id: 1 });
      categories = categories.map((item) => item.id);
      if (result) {
        query["category"] = {
          $in: [result._id, ...categories],
        };
      } else {
        return [];
      }
    }
    if (search) {
      search = new RegExp(search, "ig");
      query["$or"] = [{ title: search }, { description: search }];
    }

    const posts = await this.#model.find(query, {}, { sort: { _id: -1 } });
    return posts;
  }
  
  async deleteById(id) {
    await this.checkById(id);
    await this.#model.deleteOne({ _id: id });
  }

  async checkById(id) {
    if (!id || !isValidObjectId(id)) throw new createHttpError.BadRequest(PostMessages.RequestNotValid);
    // const post = await this.#model.findById(id);
    const [post] = await this.#model.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          userMobile: "$user.mobile",
        },
      },
      {
        $project: {
          user: 0,
        },
      },
    ]);
    console.log(post);
    return post;
  }
}

module.exports = new OptionService();
