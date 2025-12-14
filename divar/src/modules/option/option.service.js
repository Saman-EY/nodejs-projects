const autoBind = require("auto-bind");
const CategoryModel = require("../category/category.model");
const OptionMessages = require("./option.message");
const { default: slugify } = require("slugify");
const OptionModel = require("./option.model");

class OptionService {
  #model;
  #CategoryModel;
  constructor() {
    autoBind(this);
    this.#model = OptionModel;
    this.#CategoryModel = CategoryModel;
  }

  async create(optionDto) {
    const category = await this.checkExistById(optionDto.category);
    optionDto.category = category._id;
    optionDto.key = slugify(optionDto.key, { trim: true, lower: true, replacement: "_" });
    await this.alreadyEXistByCategoryAndKey(optionDto.key, optionDto.category);
    if (optionDto?.enum && typeof optionDto.enum === "string") {
      optionDto.enum = optionDto.enum.split(",");
    } else if (Array.isArray(optionDto.enum)) {
      optionDto.enum = [];
    }

    const option = await this.#model.create(optionDto);
    return option;
  }

  async find() {
    const options = await this.#model
      .find({}, { __v: 0 }, { sort: { _id: -1 } })
      .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
    return options;
  }
  async findById(id) {
    return await this.#model.findById(id);
  }
  async findByCategoryId(category) {
    return await this.#model
      .find({ category }, { __v: 0 })
      .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
  }
  async findByCategorySlug(slug) {
    const option = this.#model.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $addFields: {
          categorySlug: "$category.slug",
          categoryName: "$category.name",
          categoryIcon: "$category.icon",
        },
      },
      {
        $project: {
          category: 0,
        },
      },
      {
        $match: {
          categorySlug: slug,
        },
      },
    ]);
    return option;
  }

  async checkExistById(id) {
    const category = await this.#CategoryModel.findById(id);

    if (!category) throw new createHttpError.NotFound(CategoryMessages.NotFound);
    return category;
  }
  async alreadyEXistByCategoryAndKey(key, category2) {
    const isExist = await this.#model.findOne({ category: category2, key });
    if (isExist) throw new createHttpError.Conflict(OptionMessages.AlreadyExists);
    return null;
  }
}

module.exports = new OptionService();
