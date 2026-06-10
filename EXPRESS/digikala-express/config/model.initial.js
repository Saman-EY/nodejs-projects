const { Basket } = require("../module/basket/basket.model");
const { Discount } = require("../module/discount/discount.model");
const { Order, OrderItem } = require("../module/order/order.model");
const { Payment } = require("../module/payment/payment.model");
const { Product, ProductDetail, ProductColor, ProductSize } = require("../module/product/product.model");
const { Role, RolePermission, Permission } = require("../module/RBAC/rbac.model");
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

  OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product", targetKey: "id" });
  OrderItem.belongsTo(ProductColor, { foreignKey: "colorId", as: "color", targetKey: "id" });
  OrderItem.belongsTo(ProductSize, { foreignKey: "sizeId", as: "size", targetKey: "id" });

  User.hasMany(Order, { foreignKey: "userId", as: "order", sourceKey: "id" });
  User.hasMany(Payment, { foreignKey: "userId", as: "payment", sourceKey: "id" });
  Payment.hasOne(Order, { foreignKey: "paymentId", as: "order", sourceKey: "id", onDelete: "CASCADE" });
  Order.belongsTo(Payment, { foreignKey: "paymentId", as: "payment", targetKey: "id" });

  Role.hasMany(RolePermission, { foreignKey: "roleId", as: "rolePermissions", sourceKey: "id" });
  Permission.hasMany(RolePermission, { foreignKey: "permissionId", as: "rolePermissions", sourceKey: "id" });
  RolePermission.belongsTo(Role, { foreignKey: "roleId", targetKey: "id" });
  RolePermission.belongsTo(Permission, { foreignKey: "permissionId", targetKey: "id" });

  // await sequelize.sync({ alter: true });
  await User.sync({ alter: true });
  await Otp.sync({ alter: true });
  await Role.sync({ alter: true });
  await Permission.sync({ alter: true });
  await RolePermission.sync({ alter: true });
  await Discount.sync({ alter: true });
  await Product.sync({ alter: true });
  await ProductDetail.sync({ alter: true });
  await ProductColor.sync({ alter: true });
  await ProductSize.sync({ alter: true });
  await Basket.sync({ alter: true });
  await Payment.sync({ alter: true }); // ✅ Payment before Order
  await Order.sync({ alter: true }); // ✅ Order after Payment
  await OrderItem.sync({ alter: true });
}

module.exports = {
  initialDatabase,
};
