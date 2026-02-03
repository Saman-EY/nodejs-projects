const createHttpError = require("http-errors");
const { ProductTypes } = require("../../common/prodcut.const");
const { Product, ProductDetail, ProductSize, ProductColor } = require("./product.model");

async function createProductService(req, res, next) {
  try {
    const {
      title,
      description,
      type,
      price = undefined,
      discount = undefined,
      active_discount = undefined,
      count = undefined,
      details,
      colors,
      sizes,
    } = req.body;

    if (!Object.values(ProductTypes).includes(type)) {
      throw createHttpError(400, "invalid product type");
    }

    const product = await Product.create({
      title,
      description,
      type,
      price,
      count,
      discount,
      active_discount,
    });

    if (details && Array.isArray(details)) {
      let detailsList = [];
      for (const item of details) {
        detailsList.push({
          key: item.key,
          value: item.value,
          productId: product.id,
        });
      }
      if (detailsList.length > 0) {
        await ProductDetail.bulkCreate(detailsList);
      }
    }

    if (type === ProductTypes.Coloring) {
      if (colors && Array.isArray(colors)) {
        console.log(colors);
        let colorList = [];
        for (const item of colors) {
          colorList.push({
            name: item.name,
            code: item.code,
            price: item.price,
            discount: item.discount,
            active_discount: item.active_discount,
            count: item.count,
            productId: product.id,
          });
        }
        if (colorList.length > 0) {
          await ProductColor.bulkCreate(colorList);
        }
      }
    }
    if (type === ProductTypes.Sizing) {
      if (sizes && Array.isArray(sizes)) {
        let sizeList = [];
        for (const item of sizes) {
          sizeList.push({
            size: item.size,
            price: item.price,
            discount: item.discount,
            active_discount: item.active_discount,
            count: item.count,
            productId: product.id,
          });
        }
        if (sizeList.length > 0) {
          await ProductSize.bulkCreate(sizeList);
        }
      }
    }

    console.log("created", product.dataValues);

    return res.json({
      message: "product created successfully",
    });
  } catch (error) {
    next(error);
  }
}

// ALL PRODUCTS
async function getProductsService(req, res, next) {
  try {
    const products = await Product.findAll();

    return res.json({
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

// SINGLE PRODUCT
async function getSingleProductService(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id },
      include: [
        { model: ProductDetail, as: "details" },
        { model: ProductColor, as: "colors" },
        { model: ProductSize, as: "sizes" },
      ],
    });

    if (!product) throw createHttpError(404, "Product Not Found!");

    return res.json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
}
// DELETE PRODUCT
async function removeProductService(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) throw createHttpError(404, "Product Not Found!");
    await product.destroy();

    return res.json({
      message: "Product removed successfuly",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProductService,
  getProductsService,
  getSingleProductService,
  removeProductService,
};
