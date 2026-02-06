const createHttpError = require("http-errors");
const { Product, ProductColor, ProductSize } = require("../product/product.model");
const { ProductTypes } = require("../../common/prodcut.const");
const { Basket } = require(".././basket/basket.model");

async function addToBasketService(req, res, next) {
  try {
    // get id from auth midleware
    const { id: userId } = req.user;
    const { productId, colorId, sizeId } = req.body;

    // find product
    const product = await Product.findByPk(productId);
    if (!product) throw createHttpError(404, "Product Not Found!");

    // create an instance
    const basketItem = {
      productId: product.id,
      userId,
    };

    let productCount = undefined;
    let colorCount = undefined;
    let sizeCount = undefined;

    // check and set for each type of product
    if (product.type === ProductTypes.Coloring) {
      if (!colorId) throw createHttpError(400, "Product Color Details Required!");
      const productColor = await ProductColor.findByPk(colorId);
      if (!productColor) throw createHttpError(404, "Color Not Found!");
      basketItem.colorId = colorId;
      colorCount = product?.count ?? 0;
      if (colorCount === 0) throw createHttpError(400, "product out of stock!");
    } else if (product.type === ProductTypes.Sizing) {
      if (!sizeId) throw createHttpError(400, "Product Size Details Required!");
      const productSize = await ProductSize.findByPk(sizeId);
      if (!productSize) throw createHttpError(404, "Size Not Found!");
      basketItem.sizeId = sizeId;
      sizeCountCount = product?.count ?? 0;
      if (sizeCountCount === 0) throw createHttpError(400, "product size out of stock!");
    } else {
      if (productCount === 0) throw createHttpError(400, "product out of stock!");
    }
    const basket = await Basket.findOne({
      where: basketItem,
    });

    if (basket) {
      if (sizeCount && sizeCount > basket?.count) {
        basket.count += 1;
      } else if (colorCount && colorCount > basket?.count) {
        basket.count += 1;
      } else if (productCount && productCount > basket?.count) {
        basket.count += 1;
      } else {
        throw createHttpError(400, "product out of stock!");
      }
      await basket.save();
    } else {
      await Basket.create({ ...basketItem, count: 1 });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToBasketService
}