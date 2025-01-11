const db = require("../../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const budgetItemRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info")
      .collection("items")
      .doc(req.body.label || req.body.id);

    await budgetItemRef.set(req.body.amount)

    res.json({
      success: true,
      data: req.body,
      message: `successfully added item to budget`,
    });
  } catch (error) {
    next(error);
  }
};
