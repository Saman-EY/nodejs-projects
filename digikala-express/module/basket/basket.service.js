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
      productCount = product?.count ?? 0;
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

    res.json({
      messaage: "Added To Cart Successfuly",
    });
  } catch (error) {
    next(error);
  }
}

async function getUserBasketService(req, res, next) {
  try {
    const { id: userId } = req.user;
    const basket = await Basket.findAll({
      where: {
        userId,
      },
      include: [
        { model: Product, as: "product" },
        { model: ProductColor, as: "color" },
        { model: ProductSize, as: "size" },
      ],
    });

    let totalAmount = 0;
    let totalDiscount = 0;
    let finalAmount = 0;
    let finalBasket = [];

    for (const item of basket) {
      const { product, color, size, count } = item;
      const productIndex = finalBasket.findIndex((item) => item.id === product.id);
      let productData = finalBasket.find((item) => item.id === product.id);
      if (!productData) {
        productData = {
          id: product.id,
          title: product.title,
          count: product.count,
          type: product.type,
          count,
          sizes: [],
          colors: [],
        };
      } else {
        productData.count += count;
      }

      if (product?.type === ProductTypes.Coloring && color) {
        let price = color?.price * count;
        totalAmount += price;
        let discountAmount = 0;
        let finalPrice = 0;

        if (color?.active_discount && color?.discount > 0) {
          discountAmount = price * (color?.discount / 100);
          totalDiscount += discountAmount;
        }
        finalPrice = price - discountAmount;
        finalAmount += finalPrice;
        productData.colors.push({
          id: color.id,
          name: color.name,
          code: color.code,
          price,
          discountAmount,
          finalPrice,
          count,
        });
      } else if (product?.type === ProductTypes.Sizing && size) {
        let price = size?.price * count;
        totalAmount += price;
        let discountAmount = 0;
        let finalPrice = 0;

        if (size?.active_discount && size?.discount > 0) {
          discountAmount = price * (size?.discount / 100);
          totalDiscount += discountAmount;
        }
        finalPrice = price - discountAmount;
        finalAmount += finalPrice;
        productData.sizes.push({
          id: size.id,
          size: size?.size,
          price,
          discountAmount,
          finalPrice,
          count,
        });
      } else if (product?.type === ProductTypes.Single && product) {
        let price = product?.price * count;
        totalAmount += price;
        let discountAmount = 0;
        let finalPrice = 0;

        if (product?.active_discount && product?.discount > 0) {
          discountAmount = price * (product?.discount / 100);
          totalDiscount += discountAmount;
        }
        finalPrice = price - discountAmount;
        finalAmount += finalPrice;
        productData.price = price;
        productData.finalPrice = finalPrice;
        productData.discountAmount = discountAmount;
      }

      if (productIndex > -1) finalBasket[productIndex] = productData;
      else finalBasket.push(productData);
    }

    res.json({
      totalAmount,
      totalDiscount,
      finalAmount,

      basket: finalBasket,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToBasketService,
  getUserBasketService,
};
