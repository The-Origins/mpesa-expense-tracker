const router = require("express").Router();

router.get(
  "/",
  require("../../../../../middleware/redis/getCachedData"),
  require("../../../../../controllers/user/expenses/failed/fetchFailedExpenses")
);

router.delete(
  "/delete/:id",
  require("../../../../../controllers/user/expenses/failed/deleteFailedExpenses")
);

module.exports = router;
