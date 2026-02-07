const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { OrderStatus } = require("../../common/order.const");

const Order = sequelize.define(
  "order",
  {
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      defaultValue: OrderStatus.Pending,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
    },
    final_amount: {
      type: DataTypes.DECIMAL,
    },
    discount_amount: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

const OrderItem = sequelize.define(
  "order_item",
  {
    orderId: {
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    colorId: {
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
  {
    freezeTableName: true,
    timestamps: false,
  },
);

module.exports = {
  Order,
  OrderItem,
};
