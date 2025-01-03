const passport = require("passport")
const router = require("express").Router();

router.use("/auth", require("./auth"))
router.use("/expenses", passport.authenticate("jwt", {session:false, failureRedirect:"/api/user/auth/failed"}), require("./expenses"));
router.use("/statistics", passport.authenticate("jwt", {session:false, failureRedirect:"/api/user/auth/failed"}), require("./statistics"));
module.exports = router;
