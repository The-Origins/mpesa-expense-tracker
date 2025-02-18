const router = require("express").Router();

router.get(
  "/*",
  require("../../../../middleware/redis/getCachedData"),
  require("../../../../controllers/user/statistics/fetchStatistics")
);
module.exports = router;
