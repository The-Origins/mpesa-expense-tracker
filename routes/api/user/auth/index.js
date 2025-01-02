const router = require("express").Router();

router.post("/login", require("../../../../controllers/user/auth/login"))
router.post("/register", require("../../../../controllers/user/auth/register"))

module.exports = router;
