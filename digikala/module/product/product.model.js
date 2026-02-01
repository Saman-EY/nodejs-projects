const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { ProductType } = require("../../common/prodcut.const");

const Product = sequelize.define(
  "product",
  {
    title: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active_discount: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ProductType)),
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "product",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

const ProductDetail = sequelize.define(
  "product_detail",
  {
    key: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.STRING,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "product_detail",
    timestamps: false,
  },
);
const ProductColor = sequelize.define(
  "product_color",
  {
    color_name: {
      type: DataTypes.STRING,
    },
    color_code: {
      type: DataTypes.STRING,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active_discount: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "product_color",
    timestamps: false,
  },
);
const ProductSize = sequelize.define(
  "product_size",
  {
    size: {
      type: DataTypes.STRING,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active_discount: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "product_size",
    timestamps: false,
  },
);

module.exports = {
  ProductColor,
  Product,
  ProductDetail,
  ProductSize,
};
