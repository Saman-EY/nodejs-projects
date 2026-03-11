const { Router } = require("express");
const { AuthRoutes } = require("./auth.route");
const { ProfileRoutes } = require("./profile.route");

const router = Router();


router.use("/auth", AuthRoutes);
router.use("/user", ProfileRoutes);

module.exports = {
  AllRoutes: router,
};
