const db = require("../../../config/db")
const updateStatistics = require("../../../utils/user/statistics/updateStatistics")

module.exports = async (req, res, next) =>
{
    try {
        const expense = await db.collection("users").doc(req.user.id).collection("trash").doc(req.params.id).get()
        const expenseData = expense.data()
        
        if(!expense.exists)
        {
            return next(new Error(`No expense with id: ${req.params.id} in trash`))
        }

        await db.collection("users").doc(req.user.id).collection("expenses").doc(expense.id).set(expenseData)
        await db.collection("users").doc(req.user.id).collection("trash").doc(req.params.id).delete()
        await updateStatistics(expenseData, req.user)

        res.status(201).json({success:true, data:expense.id, message:"Successfully restored expense"})
    } catch (error) {
        next(error)
    }
}