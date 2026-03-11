const { sequelize } = require("../../config/sequelize");
const { DataTypes } = require("sequelize");

const Role = sequelize.define(
  "role",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true },
);
const Permission = sequelize.define(
  "permission",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);
const RolePermission = sequelize.define(
  "role_permission",
  {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = {
  Role,
  Permission,
  RolePermission,
};
