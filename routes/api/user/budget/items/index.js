const router = require("express").Router();

router.post(
  "/add",
  require("../../../../../controllers/user/budget/items/addBudgetItem")
);
router.put(
  "/update",
  require("../../../../../middleware/user/budget/items/getBudgetItem"),
  require("../../../../../controllers/user/budget/items/updateBudgetItem")
);
router.delete(
  "/delete",
  require("../../../../../middleware/user/budget/items/getBudgetItem"),
  require("../../../../../controllers/user/budget/items/deleteBudgetItem")
);

module.exports = router;
