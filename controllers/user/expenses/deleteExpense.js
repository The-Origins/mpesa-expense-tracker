const db = require("../../../config/db")
const updateStatistics = require("../../../utils/user/statistics/updateStatistics")

module.exports = async (req, res, next) =>
{
    try {
        const expenseRef = db.collection("users").doc(req.user.id).collection("expenses").doc(req.expense.id)
        await expenseRef.delete()
        await updateStatistics(req.expense, req.user, "delete")
        res.status(200).json({success:true, data:{}, message:"Successfully deleted expense"})
    } catch (error) {
        next(error)
    }
}