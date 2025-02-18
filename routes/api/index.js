const router = require("express").Router();
const passport = require("passport");

router.use(
  "/user",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/auth/failed",
  }),
  require("./user")
);
router.use("/auth", require("./auth"));

module.exports = router;
