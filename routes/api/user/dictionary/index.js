const router = require("express").Router();

router.get(
  "/",
  require("../../../../middleware/redis/getCachedData"),
  require("../../../../controllers/user/dictionary/fetchDictionary")
);

router.use("/entry", require("./entry"));

module.exports = router;
