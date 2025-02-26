const { FieldPath } = require("firebase-admin/firestore");
const db = require("../../../../config/db");
const addToCache = require("../../../../utils/redis/addToCache");
const client = require("../../../../config/redis");
const fetchExpenseDocs = require("../../../../utils/user/expenses/fetchExpenseDocs");

module.exports = async (req, res, next) => {
  try {
    let expenses;

    const cacheKey = `${req.user.id}:budget:expenses`;
    const cachedBudgetExpenses = await client.get(cacheKey);

    if (cachedBudgetExpenses) {
      expenses = JSON.parse(cachedBudgetExpenses);
    } else {
      const expenseIds = (
        await db
          .collection("users")
          .doc(req.user.id)
          .collection("budget")
          .doc("info")
          .collection("expenses")
          .listDocuments()
      ).map((d) => d.id);

      const expensesDocs = await fetchExpenseDocs(req.user, [
        { field: FieldPath.documentId(), op: "in", value: expenseIds },
      ]);

      expenses = expensesDocs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (!expenses || !expenses.length) {
        res.code = 404;
        throw new Error(`No budget expenses`);
      }

      addToCache(cacheKey, expenses);
    }

    res.json({
      success: true,
      data: expenses,
      message: `returned budget expenses`,
    });
  } catch (error) {
    next(error);
  }
};
