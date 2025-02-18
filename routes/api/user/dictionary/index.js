const router = require("express").Router();

router.get(
  "/",
  require("../../../../middleware/redis/getCachedData"),
  require("../../../../controllers/user/dictionary/fetchDictionary")
);

module.exports = router;
