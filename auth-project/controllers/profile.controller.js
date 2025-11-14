async function getProfileController(req, res, next) {
  //   console.log("aaaaaaaaaaaaaaa💥💥💥");
  res.send(req.user);
}

module.exports = {
  getProfileController,
};
