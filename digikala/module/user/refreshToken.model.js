const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const RefreshToken = sequelize.define(
  "refresh_token",
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true, createdAt: "created_at", updatedAt: false },
);

module.exports = {
  RefreshToken,
};
