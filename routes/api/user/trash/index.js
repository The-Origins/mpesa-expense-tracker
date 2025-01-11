const db =  require("../../../../config/db")
const router = require("express").Router()

router.delete("/", require("../../../../controllers/user/trash/clear"))
router.post("/restore/:id", require("../../../../middleware/user/budget/getBudget"), require("../../../../controllers/user/trash/restore") )

module.exports = router