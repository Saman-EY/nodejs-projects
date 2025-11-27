const { Router } = require("express");
const authController = require("./auth.controller");

const router = Router();

router.post("/send-otp", lorem, authController.sendOTP);
router.post("/check-otp", authController.checkOTP);

module.exports = {
  AuthRouter: router,
};

function lorem(req, res, next) {
  console.log("testiiiing");

  next();
}
