const { Router } = require("express");
const { registerController, loginController } = require("../controllers/user.controller");

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);

module.exports = {
  AuthRoutes: router,
};
