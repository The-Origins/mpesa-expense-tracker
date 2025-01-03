const issueJwt = require("../../../utils/user/auth/issueJwt");

module.exports = (req, res, next) => {
  try {
    const issuedJwt = issueJwt(req.user.id);
    res.json({
      success: true,
      data: { user: req.user, jwt: issuedJwt },
      message: "successfully re issued jwt",
    });
  } catch (error) {
    next(error)
  }
};
