const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const budgetRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info");
    const budgetItemsRef = budgetRef.collection("items");

    const budgetData = (await budgetRef.get()).data();
    const budgetItemsData = (await budgetItemsRef.get()).docs.map((d) => {
        const data = d.data()
        return {id:d.id, amount:data, overbudget:data.current > data.total}
    });

    res.json({
      success: true,
      data: {
        ...budgetData,
        items: budgetItemsData,
        overbudget: budgetData.amount.current > budgetData.amount.total,
      },
      message: `Successfully returned user budget`,
    });
  } catch (error) {
    next(error);
  }
};
