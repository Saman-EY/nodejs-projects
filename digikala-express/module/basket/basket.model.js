const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Basket = sequelize.define(
  "basket",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    colorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discountId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sizeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    count: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: true, timestamps: false },
);

module.exports = {
  Basket,
};
