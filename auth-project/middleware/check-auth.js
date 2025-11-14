const UserModel = require("../models/user.model");
const { verifyToken } = require("../utils/auth");

async function checkAuth(req, res, next) {
  try {
    const authrization = req?.headers?.authorization;
    const [bearer, token] = authrization?.split(" ");
    if (bearer && bearer.toLowerCase() === "bearer") {
      if (token) {
        const verifyResult = verifyToken(token);
        const user = await UserModel.findOne({ email: verifyResult.email });
        req.isAuthenticated = !!user;

        if (!user) {
          throw {
            status: 404,
            message: "user not found",
          };
        }

        req.user = {
          fullname: user.fullname,
          email: user.email,
        };
        return next();
      }
      throw {
        status: 401,
        message: "authrization failed",
      };
    }
    throw {
      status: 401,
      message: "authrization failed",
    };
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkAuth,
};
