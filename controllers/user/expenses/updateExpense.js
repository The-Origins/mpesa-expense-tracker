const db = require("../../../config/db");
const updateStatistics = require("../../../utils/user/statistics/updateStatistics");

module.exports = async (req, res, next) => {
  try {
    const expensesRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("expenses");
    await expensesRef.doc(req.expense.id).update(req.body);
    if (req.body.labels || req.body.amount) {
      await updateStatistics(req.expense, req.user, "delete");
      await updateStatistics(req.body, req.user);
    }
    res.json({
      success: true,
      data: req.body,
      message: "Successfully updated expense",
    });
  } catch (error) {
    next(error);
  }
};
