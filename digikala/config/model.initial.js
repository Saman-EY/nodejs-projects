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

  await sequelize.sync({ alter: true });
}

module.exports = {
  initialDatabase,
};
