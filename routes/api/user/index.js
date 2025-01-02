const passport = require("passport")
const router = require("express").Router();

router.use("/auth", require("./auth"))
router.get("/test", passport.authenticate("jwt", {session:false}), (req, res, next) => {
    res.status(200).json({success:true, data:req.user, message:`Accessed protected path`})
})
router.use("/expenses", passport.authenticate("jwt", {session:false}), require("./expenses"));
router.use("/statistics", passport.authenticate("jwt", {session:false}), require("./statistics"));
module.exports = router;
