const router = require("express").Router();

router.use("/failed", require("./failed"));

router.get(
  "/",
  require("../../../../middleware/redis/getCachedData"),
  require("../../../../controllers/user/expenses/fetchEpenses")
);
router.get(
  "/:id",
  require("../../../../middleware/redis/getCachedData"),
  require("../../../../middleware/user/expenses/getExpense"),
  require("../../../../controllers/user/expenses/fetchExpense")
);
router.post(
  "/add",
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/expenses/addExpense")
);
router.delete(
  "/delete",
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/expenses/deleteExpense")
);
router.put(
  "/update/:id",
  require("../../../../middleware/redis/getCachedData"),
  require("../../../../middleware/user/expenses/getExpense"),
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/expenses/updateExpense")
);

module.exports = router;
