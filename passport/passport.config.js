const LocalStorage = require("passport-local").Strategy;
const userModel = require("./models/user.model");
const { compareSync } = require("bcrypt");

function passportInit(passport) {
  const authenticatedUser = async (username, password, done) => {
    try {
      const user = await userModel.findOne({ username });
      if (!user) {
        return done(null, false, { message: "user not found" });
      }
      if (compareSync(password, user.password)) {
        return done(null, user);
      }
      return done(null, false, { message: "username or password is incorrect" });
    } catch (error) {
      console.log("💥💥💥💥💥💥", error);

      done(error);
    }
  };

  const localStrategy = new LocalStorage({ usernameField: "username", passwordField: "password" }, authenticatedUser);

  const serializeUser = passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  const deserializeUser = passport.deserializeUser(async (id, done) => {
    const user = await userModel.findOne({ _id: id });
    if (!user) return done(null, false, { message: "user account not found" });
    return done(null, user);
  });

  passport.use("local", localStrategy, serializeUser, deserializeUser);
}

module.exports = { passportInit };
