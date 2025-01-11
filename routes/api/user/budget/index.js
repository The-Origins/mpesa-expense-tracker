const router = require("express").Router()

router.get("/", require("../../../../controllers/user/budget/fetchBudget"))
router.post("/set", require("../../../../controllers/user/budget/setBudget"))
router.put("/update", require("../../../../controllers/user/budget/updateBudget"))
router.delete("/delete", require("../../../../controllers/user/budget/deleteBudget"))
router.use("/items", require("./items"))

module.exports = router