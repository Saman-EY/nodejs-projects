const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const User = sequelize.define(
  "user",
  {
    fullname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otpId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "user", createdAt: "created_at", updatedAt: false },
);

const Otp = sequelize.define(
  "user_otp",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_in: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { timestamps: false, tableName: "user_otp" },
);

module.exports = {
  Otp,
  User,
};
