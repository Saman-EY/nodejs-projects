const { Router } = require("express");
const { AuthRouter } = require("./modules/auth/auth.route");
const { UserRouter } = require("./modules/user/user.route");
const { CategoryRouter } = require("./modules/category/category.route");
const { OptionRouter } = require("./modules/option/option.route");
const { PostRouter } = require("./modules/post/post.route");

const mainRouter = Router();

mainRouter.use("/auth", AuthRouter);
mainRouter.use("/user", UserRouter);
mainRouter.use("/category", CategoryRouter);
mainRouter.use("/option", OptionRouter);
mainRouter.use("/post", PostRouter);
mainRouter.get("/", (req, res) => {
  res.locals.layout = "./layouts/website/main.ejs";
  res.render("./pages/home/index.ejs");
});
mainRouter.get("/auth", (req, res) => {
  res.locals.layout = "./layouts/auth/main.ejs";
  res.render("./pages/auth/index.ejs");
});
mainRouter.get("/panel", (req, res) => {
  res.render("./pages/panel/dashboard.ejs");
});
// mainRouter.use("/", (req, res) => {
//   res.render("./pages/index.ejs");
// });

module.exports = mainRouter;
