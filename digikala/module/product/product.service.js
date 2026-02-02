const createHttpError = require("http-errors");
const { ProductTypes } = require("../../common/prodcut.const");
const { Product, ProductDetail, ProductSize } = require("./product.model");

async function createProduct(req, res, next) {
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
        let colorList = [];
        for (const item of colors) {
          colorList.push({
            color_name: item.name,
            color_code: item.code,
            price: item.price,
            discount: item.discount,
            active_discount: item.active_discount,
            count: item.count,
            productId: product.id,
          });
        }
        if (colorList.length > 0) {
          await ProductDetail.bulkCreate(colorList);
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
  } catch (error) {}
}
