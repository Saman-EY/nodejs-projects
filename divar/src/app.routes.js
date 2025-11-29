const { Router } = require("express");
const { AuthRouter } = require("./modules/auth/auth.route");
const { UserRouter } = require("./modules/user/user.route");

const mainRouter = Router();

mainRouter.use("/auth", AuthRouter);
mainRouter.use("/user", UserRouter);

module.exports = mainRouter;
