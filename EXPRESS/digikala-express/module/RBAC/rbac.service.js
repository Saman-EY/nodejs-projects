const createHttpError = require("http-errors");
const { Role, Permission, RolePermission } = require("./rbac.model");
const { Op } = require("sequelize");

async function createRoleService(req, res, next) {
  try {
    const { title, description } = req.body;

    const existRole = await Role.findOne({
      where: {
        title,
      },
    });
    if (existRole) throw createHttpError(409, "role already exist!");

    await Role.create({
      title,
      description,
    });

    res.json({
      message: "role successfuly added",
    });
  } catch (error) {
    next(error);
  }
}
async function createPermissionService(req, res, next) {
  try {
    const { title, description } = req.body;

    const existPermission = await Permission.findOne({
      where: {
        title,
      },
    });
    if (existPermission) throw createHttpError(409, "Permission already exist!");

    await Permission.create({
      title,
      description,
    });

    res.json({
      message: "permission successfuly added",
    });
  } catch (error) {
    next(error);
  }
}
async function assignPermsissionToRole(req, res, next) {
  try {
    let { roleId, permissions = [] } = req.body;

    const role = await Role.findOne({
      where: {
        id: roleId,
      },
    });

    if (!role) throw createHttpError(404, "Role Not Found");
    if (permissions?.length > 0) {
      const permissionCount = await Permission.count({
        where: {
          id: {
            [Op.in]: permissions,
          },
        },
      });

      if (permissionCount !== permissions.length) throw createHttpError(400, "send the correct list of permissions");
      const permissionList = permissions.map((per) => {
        return {
          roleId,
          permissionId: per,
        };
      });

      await RolePermission.bulkCreate(permissionList);
    }

    return res.json({
      message: "permission to role assigned",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createRoleService,
  createPermissionService,
  assignPermsissionToRole,
};
