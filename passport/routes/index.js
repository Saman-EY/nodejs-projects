const { Router } = require("express");
const { hashSync } = require("bcrypt");
const userModel = require("../models/user.model");
const { redirectIfIsAuth, checkAuthentication } = require("../middleware");

const router = Router();

function initRoutes(passport) {
  router.get("/", (req, res, next) => {
    res.render("index", { title: "home" });
  });
  router.get("/login", redirectIfIsAuth, (req, res, next) => {
    res.render("login", { title: "login" });
  });
  router.get("/register", redirectIfIsAuth, (req, res, next) => {
    res.render("register", { title: "register" });
  });
  router.get("/profile", checkAuthentication, (req, res, next) => {
    const user = req.user;
    res.render("profile", { title: "profile", user });
  });
  router.get("/logout", checkAuthentication, (req, res) => {
    req.logOut({ keepSessionInfo: false }, (err) => {
      if (err) {
        console.log(err);
      }
    });

    res.redirect("/login");
  });
  router.post("/register", checkAuthentication, async (req, res, next) => {
    try {
      const { fullname, username, password } = req.body;
      const hashed = hashSync(password, 10);
      const user = await userModel.findOne({ username });
      if (user) {
        const referrer = req?.header("Referrer") ?? req?.headers?.referer;
        req.flash("error", "نام کاربری قبلا استفاده شده است");
        return res.redirect(referrer ?? "/register");
      }
      await userModel.create({ fullname, username, password: hashed });
      res.redirect("/login");
    } catch (error) {
      next(error);
    }
  });
  router.post(
    "/login",
    checkAuthentication,
    passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/login",
      failureFlash: true,
    }),
    async (req, res, next) => {
      res.redirect("/profile");
    }
  );

  return router;
}

module.exports = { Allroutes: initRoutes };
