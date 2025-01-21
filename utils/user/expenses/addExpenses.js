const db = require("../../../config/db")
const updateStatistics = require("../statistics/updateStatistics")

module.exports = async (expenses, user, budget) => {
    const batch = db.batch()
    const expensesRef = db.collection("users").doc(user.id).collection("expenses")

    for(let i=0; i < expenses.length; i++)
    {
        if(i >= 500)
        {
            await batch.commit()
            batch = db.batch()
        }
        batch.set(expensesRef.doc(), expenses[i])
        await updateStatistics(expenses[i], user, budget)
    }
    await batch.commit()
}