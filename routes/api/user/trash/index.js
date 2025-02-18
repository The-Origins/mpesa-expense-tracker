const db = require("../../../../config/db");
const router = require("express").Router();

router.get(
  "/",
  require("../../../../middleware/redis/getCachedData"),
  require("../../../../controllers/user/trash/fetchTrash")
);
router.delete("/clear", require("../../../../controllers/user/trash/clear"));
router.post(
  "/restore",
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/trash/restore")
);

module.exports = router;
