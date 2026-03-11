const { Router } = require("express");
const { AuthGuard } = require("../auth/auth.guard");
const { createRoleService, createPermissionService, assignPermsissionToRole } = require("./rbac.service");
const { assignPermissionToRoleValidation } = require("./validation");

const router = Router();

router.post("/role", AuthGuard, createRoleService);
router.post("/permission", AuthGuard, createPermissionService);
router.post("/add-permission-to-role", AuthGuard, assignPermissionToRoleValidation, assignPermsissionToRole);

module.exports = {
  rbacRouter: router,
};
