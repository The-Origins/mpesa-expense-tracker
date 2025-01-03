const db = require("../../../config/db")
const updateStatistics = require("../../../utils/user/statistics/updateStatistics")

module.exports = async (req, res, next) =>
{
    try {
        const expensesRef = db.collection("users").doc(req.user.id).collection("expenses")
        const expense = await expensesRef.add(req.body)
        await updateStatistics(req.body, req.user)
        res.status(201).json({success:true, data:expense.id, message:"Successfully added expense"})
    } catch (error) {
        next(error)
    }
}