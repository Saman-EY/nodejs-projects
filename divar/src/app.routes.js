const { Router } = require("express");
const { AuthRouter } = require("./modules/auth/auth.route");
const { UserRouter } = require("./modules/user/user.route");
const { CategoryRouter } = require("./modules/category/category.route");
const { OptionRouter } = require("./modules/option/option.route");

const mainRouter = Router();

mainRouter.use("/auth", AuthRouter);
mainRouter.use("/user", UserRouter);
mainRouter.use("/category", CategoryRouter);
mainRouter.use("/option", OptionRouter);

module.exports = mainRouter;
