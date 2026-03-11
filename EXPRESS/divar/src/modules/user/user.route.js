const { Router } = require("express");
const userController = require("./user.controller");
const AuthorizationGuard = require("../../common/guard/authorization.guard");

const router = Router();

router.get("/profile", AuthorizationGuard, userController.getProfile);


module.exports = {
  UserRouter: router,
};
