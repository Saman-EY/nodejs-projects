const { Router } = require("express");
const { getProfileController } = require("../controllers/profile.controller");
const { checkAuth } = require("../middleware/check-auth");

const router = Router();
router.get("/profile", checkAuth, getProfileController);

module.exports = {
  ProfileRoutes: router,
};
