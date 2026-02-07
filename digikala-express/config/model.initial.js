const { Basket } = require("../module/basket/basket.model");
const { Discount } = require("../module/discount/discount.model");
const { Order, OrderItem } = require("../module/order/order.model");
const { Payment } = require("../module/payment/payment.model");
const { Product, ProductDetail, ProductColor, ProductSize } = require("../module/product/product.model");
const { User, Otp } = require("../module/user/user.model");
const { sequelize } = require("./sequelize");

async function initialDatabase() {
  Product.hasMany(ProductDetail, { foreignKey: "productId", sourceKey: "id", as: "details" });
  ProductDetail.belongsTo(Product, { foreignKey: "productId", targetKey: "id" });

  Product.hasMany(ProductColor, { foreignKey: "productId", sourceKey: "id", as: "colors" });
  ProductColor.belongsTo(Product, { foreignKey: "productId", targetKey: "id" });

  Product.hasMany(ProductSize, { foreignKey: "productId", sourceKey: "id", as: "sizes" });
  ProductSize.belongsTo(Product, { foreignKey: "productId", targetKey: "id" });

  User.hasOne(Otp, { foreignKey: "userId", sourceKey: "id", as: "otp" });
  // Otp.hasOne(User, { foreignKey: "otpId", sourceKey: "id", as: "user" });
  Otp.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

  Product.hasMany(Basket, { foreignKey: "productId", sourceKey: "id", as: "basket" });
  ProductSize.hasMany(Basket, { foreignKey: "sizeId", sourceKey: "id", as: "basket" });
  ProductColor.hasMany(Basket, { foreignKey: "colorId", sourceKey: "id", as: "basket" });
  User.hasMany(Basket, { foreignKey: "userId", sourceKey: "id", as: "basket" });
  Discount.hasMany(Basket, { foreignKey: "discountId", sourceKey: "id", as: "basket" });

  Basket.belongsTo(Product, { foreignKey: "productId", targetKey: "id", as: "product" });
  Basket.belongsTo(ProductSize, { foreignKey: "sizeId", targetKey: "id", as: "size" });
  Basket.belongsTo(ProductColor, { foreignKey: "colorId", targetKey: "id", as: "color" });
  Basket.belongsTo(User, { foreignKey: "userId", targetKey: "id", as: "user" });
  Basket.belongsTo(Discount, { foreignKey: "discountId", targetKey: "id", as: "discount" });

  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items", sourceKey: "id" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order", targetKey: "id" });

  User.hasMany(Order, { foreignKey: "userId", as: "order", sourceKey: "id" });
  Order.hasOne(Payment, { foreignKey: "orderId", as: "payment", sourceKey: "id" });
  Payment.hasOne(Order, { foreignKey: "paymentId", as: "order", sourceKey: "id" });

  await sequelize.sync({ alter: true });
}

module.exports = {
  initialDatabase,
};
