const router = require("express").Router();

router.get("/", require("../../../../controllers/user/expenses/fetchEpenses"));
router.get(
  "/:id",
  require("../../../../middleware/user/expenses/getExpense"),
  require("../../../../controllers/user/expenses/fetchExpense")
);
router.put(
  "/add",
  require("../../../../controllers/user/expenses/addExpense")
);
router.delete(
  "/delete/:id",
  require("../../../../middleware/user/expenses/getExpense"),
  require("../../../../controllers/user/expenses/deleteExpense")
);
router.put(
  "/update/:id",
  require("../../../../middleware/user/expenses/getExpense"),
  require("../../../../controllers/user/expenses/updateExpense")
);

module.exports = router
