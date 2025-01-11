const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const { items, ...rest } = req.body;
    const batch = db.batch();
    const budgetRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info");

    batch.set(budgetRef, rest);

    for (let item of items) {
      batch.set(budgetRef.collection("items").doc(item.label || item.id), item.amount);
    }
    await batch.commit();

    res.json({
      success: true,
      data: {},
      message: `Successfully set user budget`,
    });
  } catch (error) {
    next(error);
  }
};
