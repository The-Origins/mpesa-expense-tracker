const router = require("express").Router();

router.post("/login", require("../../../controllers/auth/login"));
router.post("/register", require("../../../controllers/auth/register"));
router.delete("/logout", require("../../../controllers/auth/logout"));
router.get("/failed", require("../../../controllers/auth/failed"));
router.post(
  "/re-issue-tokens",
  require("../../../controllers/auth/reIssueTokens")
);

module.exports = router;
