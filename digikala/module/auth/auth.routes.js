const { Router } = require("express");
const { sendOtpService, checkOtpService, verifyRefreshToken } = require("./auth.service");

const router = Router();

router.post("/send-otp", sendOtpService);
router.post("/check-otp", checkOtpService);
router.post("/refresh-token", verifyRefreshToken);

module.exports = {
  authRouter: router,
};
