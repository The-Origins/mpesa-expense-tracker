const router = require("express").Router();

router.get("/", require("../../../../../controllers/user/budget/items/fetchBudgetItems"))
router.post(
  "/add/*",
  require("../../../../../middleware/user/budget/items/getItemRef"),
  require("../../../../../middleware/user/budget/getBudget"),
  require("../../../../../controllers/user/budget/items/addBudgetItem")
);
router.put(
  "/update/*",
  require("../../../../../middleware/user/budget/items/getItemRef"),
  require("../../../../../controllers/user/budget/items/updateBudgetItem")
);
router.delete(
  "/delete/*",
  require("../../../../../middleware/user/budget/items/getItemRef"),
  require("../../../../../controllers/user/budget/items/deleteBudgetItem")
);

module.exports = router;
