const db = require("../../../../config/db");
const deleteSubCollections = require("../../../../utils/user/statistics/deleteSubCollections");
const router = require("express").Router();

router.get("/", require("../../../../controllers/user/expenses/fetchEpenses"));
router.get(
  "/:id",
  require("../../../../middleware/user/expenses/getExpense"),
  require("../../../../controllers/user/expenses/fetchExpense")
);
router.post(
  "/add",
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/expenses/addExpense")
);
router.delete(
  "/delete/:id",
  require("../../../../middleware/user/expenses/getExpense"),
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/expenses/deleteExpense")
);
router.put(
  "/update/:id",
  require("../../../../middleware/user/expenses/getExpense"),
  require("../../../../middleware/user/budget/getBudget"),
  require("../../../../controllers/user/expenses/updateExpense")
);

router.delete("/reset",  async (req, res, next) => {
    const batch = db.batch()
    await deleteSubCollections(db.collection("users").doc(req.user.id), batch)
    await batch.commit()
    res.json({success:true, data:{}, message:"successful reset"})
})

module.exports = router
