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

    const userBudgetRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info");

    const budgetItems = (
      await userBudgetRef.collection("items").listDocuments()
    ).map((d) => d.id);
    const userBudget = (await userBudgetRef.get()).data();

    req.budget = {
      data: userBudget,
      items: budgetItems,
      ref: userBudgetRef,
      duration: {
        start: new Date(userBudget.duration.start),
        end: new Date(userBudget.duration.end),
      },
    };
    next();
  } catch (error) {
    next(error);
  }
};
