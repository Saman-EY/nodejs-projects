const autoBind = require("auto-bind");
const OptionMessages = require("./option.message");
const { default: slugify } = require("slugify");
const OptionModel = require("./option.model");

const createHttpError = require("http-errors");
const categoryService = require("../category/category.service");
const { isTrue, isFalse } = require("../../common/utils/functions");
const { isValidObjectId } = require("mongoose");

class OptionService {
  #model;
  #categoryService;
  constructor() {
    autoBind(this);
    this.#model = OptionModel;
    this.#categoryService = categoryService;
  }

  async create(optionDto) {
    const category = await this.#categoryService.checkExistById(optionDto.category);
    optionDto.category = category._id;
    optionDto.key = slugify(optionDto.key, { trim: true, lower: true, replacement: "_" });
    await this.alreadyEXistByCategoryAndKey(optionDto.key, optionDto.category);
    if (optionDto?.enum && typeof optionDto.enum === "string") {
      optionDto.enum = optionDto.enum.split(",");
    } else if (Array.isArray(optionDto.enum)) {
      optionDto.enum = [];
    }
    if (isTrue(optionDto?.required)) optionDto.required = true;
    if (isFalse(optionDto?.required)) optionDto.required = false;

    const option = await this.#model.create(optionDto);
    return option;
  }

  async update(id, optionDto) {
    const existOption = await this.checkExistById(id);
    if (optionDto.category && isValidObjectId(optionDto.category)) {
      const category = await this.#categoryService.checkExistById(optionDto.category);
      optionDto.category = category._id;
    } else {
      delete optionDto.category;
    }
    if (optionDto.slug) {
      optionDto.key = slugify(optionDto.key, { trim: true, lower: true, replacement: "_" });
      let categoryId = existOption.category;
      if (optionDto.category) categoryId = optionDto.category;
      await this.alreadyEXistByCategoryAndKey(optionDto.key, categoryId);
    }

    if (optionDto?.enum && typeof optionDto.enum === "string") {
      optionDto.enum = optionDto.enum.split(",");
    } else if (!Array.isArray(optionDto.enum)) {
      delete optionDto.enum;
    }
    if (isTrue(optionDto?.required)) optionDto.required = true;
    else if (isFalse(optionDto?.required)) optionDto.required = false;
    else delete optionDto.required;
    return await this.#model.updateOne({ _id: id }, { $set: optionDto });
  }

  async find() {
    const options = await this.#model
      .find({}, { __v: 0 }, { sort: { _id: -1 } })
      .populate([{ path: "category", select: { name: 1, slug: 1 } }]);
    return options;
  }
  async findById(id) {
    await this.checkExistById(id);
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
  async deleteById(id) {
    await this.checkExistById(id);
    return await this.#model.deleteOne({ _id: id });
  }

  async checkExistById(id) {
    const option = await this.#model.findById(id);

    if (!option) throw new createHttpError.NotFound(OptionMessages.NotFound);
    return option;
  }
  async alreadyEXistByCategoryAndKey(key, category) {
    const isExist = await this.#model.findOne({ category, key });
    if (isExist) throw new createHttpError.Conflict(OptionMessages.AlreadyExists);
    return null;
  }
}

module.exports = new OptionService();
