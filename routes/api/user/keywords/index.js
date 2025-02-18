const router = require("express").Router();

router.get(
  "/",
  require("../../../../middleware/redis/getCachedData"),
  require("../../../../controllers/user/keywords/fetchKeywords")
);

router.post(
  "/add",
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/keywords/handleKeyword")
);

router.put(
  "/update",
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/keywords/handleKeyword")
);

router.delete(
  "/delete",
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/keywords/handleKeyword")
);

module.exports = router;
