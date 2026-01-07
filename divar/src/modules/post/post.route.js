const { Router } = require("express");
const postController = require("./post.controller");
const { upload } = require("../../common/utils/multer");
const AuthorizationGuard = require("../../common/guard/authorization.guard");

const router = Router();

router.get("/create", AuthorizationGuard, postController.createPostPage);
router.post("/create", AuthorizationGuard, upload.array("images", 10), postController.create);
router.get("/my", AuthorizationGuard, postController.findMyPosts);

module.exports = {
  PostRouter: router,
};
