const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const expensesRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("expenses");
    let expenses = await expensesRef.get();
    expenses = expenses.docs.map((d) => ({ id: d.id, ...d.data() }));

    res.json({
      success: true,
      data: expenses,
      message: "Successfully returned expenses",
    });
  } catch (error) {
    next(error);
  }
};
