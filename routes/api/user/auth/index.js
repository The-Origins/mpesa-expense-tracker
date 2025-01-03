const router = require("express").Router();
const passport = require("passport");

router.post("/login", require("../../../../controllers/user/auth/login"));
router.post("/register", require("../../../../controllers/user/auth/register"));
router.get("/failed", require("../../../../controllers/user/auth/failed"));
router.get(
  "/re-issue-jwt",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/user/auth/failed",
  }),
  require("../../../../controllers/user/auth/reIssueJwt")
);

module.exports = router;
