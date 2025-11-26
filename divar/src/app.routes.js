const { Router } = require("express");
const { AuthRouter } = require("./modules/auth/auth.route");

const mainRouter = Router();

mainRouter.use("/auth", AuthRouter);

module.exports = mainRouter;
