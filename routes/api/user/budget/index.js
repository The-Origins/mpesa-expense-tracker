const router = require("express").Router();

router.get(
  "/",
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/budget/fetchBudget")
);
router.get(
  `/expenses`,
  require("../../../../controllers/user/budget/expenses/fetchBudgetExpenses")
);
router.post("/set", require("../../../../controllers/user/budget/setBudget"));
router.put(
  "/update",
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/budget/updateBudget")
);
router.delete(
  "/delete",
  require("../../../../controllers/user/budget/deleteBudget")
);
router.use("/items", require("./items"));

module.exports = router;
