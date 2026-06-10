const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Payment = sequelize.define(
  "payment",
  {
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
    },
    refId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // reason  for charge or deposit or something...
  },
  {
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = {
  Payment,
};
