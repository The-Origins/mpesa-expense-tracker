const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const { items, ...rest } = req.body;

    if (items && items.length) {
      return next(
        new Error(`Update budget items by using the /budget/items/update path`)
      );
    }

    const budgetRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info");

    await budgetRef.update(rest);

    res.json({
      success: true,
      data: req.body,
      message: `Successfully updated user budget`,
    });
  } catch (error) {
    next(error);
  }
};
