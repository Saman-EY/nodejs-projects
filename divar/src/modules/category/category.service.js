const autoBind = require("auto-bind");
const CategoryMessages = require("./category.meesage");
const CategoryModel = require("./category.model");
const createHttpError = require("http-errors");
const { isValidObjectId, Types } = require("mongoose");
const { default: slugify } = require("slugify");

class CategoryService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = CategoryModel;
  }

  async create(categoryDto) {
    if (categoryDto?.parent && isValidObjectId(categoryDto?.parent)) {
      const existCategory = await this.checkExistById(categoryDto.parent);
      categoryDto.parent = existCategory._id;
      categoryDto.parents = [
        ...new Set(
          [existCategory._id.toString()]
            .concat(existCategory.parents.map((id) => id.toString()))
            .map((id) => new Types.ObjectId(id))
        ),
      ];
    }

    if (categoryDto?.slug) {
      categoryDto.slug = slugify(categoryDto.slug);
      await this.alreadyExistBySlug(categoryDto.slug);
    } else {
      categoryDto.slug = slugify(categoryDto.name);
    }

    const category = await this.#model.create(categoryDto);
    return category;
  }

  async getAll() {
    // const categories = await this.#model.find({ parent: { $exists: false } }).populate([{ path: "children" }]);
    const categories = await this.#model.find({ parent: { $exists: false } });

    return categories;
  }

  async checkExistById(id) {
    const category = await this.#model.findById(id);
    if (!category) throw new createHttpError.NotFound(CategoryMessages.NotFound);
    return category;
  }
  async checkExistBySlug(slug) {
    const category = await this.#model.findOne({ slug });
    if (!category) throw new createHttpError.NotFound(CategoryMessages.NotFound);
    return category;
  }
  async alreadyExistBySlug(slug) {
    const category = await this.#model.findOne({ slug });
    if (!category) throw new createHttpError.Conflict(CategoryMessages.AlreadyExists);
    return null;
  }
}

module.exports = new CategoryService();
