const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {
    if (
      req.path.startsWith("/api/user/expenses/update") &&
      !req.body.amount &&
      !req.body.labels
    ) {
      return next();
    }

    const budgetRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info");

    const budget = await budgetRef.get();

    if (budget.exists) {
      const budgetItems = (
        await budgetRef.collection("items").listDocuments()
      ).map((d) => d.id);

      const budgetData = budget.data();

      req.budget = {
        data: budgetData,
        items: budgetItems,
        ref: budgetRef,
        duration: {
          start: new Date(budgetData.duration.start),
          end: new Date(budgetData.duration.end),
        },
      };
    }
    next();
  } catch (error) {
    next(error);
  }
};
