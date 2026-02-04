const { Router } = require("express");
const { sendOtpService, checkOtpService } = require("./auth.service");

const router = Router();

router.post("/send-otp", sendOtpService);
router.post("/check-otp", checkOtpService);

module.exports = {
  authRouter: router,
};
