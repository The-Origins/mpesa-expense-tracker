const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const expenseRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("expenses")
      .doc(req.params.id);
    const expense = await expenseRef.get();
    if (!expense.exists) {
      res.code = 404;
      new Error(`No expense with id: ${req.params.id}`);
    }

    req.expense = { id: expense.id, ...expense.data() };
    next();
  } catch (error) {
    next(error);
  }
};
