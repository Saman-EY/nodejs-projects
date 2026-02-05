const { Router } = require("express");
const { sendOtpService, checkOtpService, verifyRefreshToken } = require("./auth.service");
const { AuthGuard } = require("./auth.guard");

const router = Router();

router.post("/send-otp", sendOtpService);
router.post("/check-otp", checkOtpService);
router.post("/refresh-token", verifyRefreshToken);
router.get("/check-login", AuthGuard, (req, res, next) => {
  return res.json({
    userData: req.user ?? null,
  });
});

module.exports = {
  authRouter: router,
};
