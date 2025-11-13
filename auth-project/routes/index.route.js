const { Router } = require("express");
const { AuthRoutes } = require("./auth.route");

const router = Router();

router.use("/auth", AuthRoutes);

module.exports = {
  AllRoutes: router,
};
