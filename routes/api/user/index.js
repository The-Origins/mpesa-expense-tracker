const passport = require("passport");
const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use(
  "/expenses",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/user/auth/failed",
  }),
  require("./expenses")
);
router.use(
  "/statistics",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/user/auth/failed",
  }),
  require("./statistics")
);
router.use(
  "/trash",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/user/auth/failed",
  }),
  require("./trash")
);

router.use(
  "/budget",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/user/auth/failed",
  }),
  require("./budget")
);

module.exports = router;
