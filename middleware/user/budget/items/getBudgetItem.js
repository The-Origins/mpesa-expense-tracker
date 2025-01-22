const db = require("../../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const itemId =
      req.query.id || req.query.label
    if (!itemId) {
      new Error(`No budget item id or label`);
    }

    const budgetItemDocument = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info")
      .collection("items")
      .doc(itemId);

    const budgetItemInfo = await budgetItemDocument.get();
    if (!budgetItemInfo.exists) {
      new Error(`No item with id: ${itemId}`);
    }
    
    req.budgetItem = {ref:budgetItemDocument, data:{id:budgetItemInfo.id, ...budgetItemInfo.data()}}

    next();
  } catch (error) {
    next(error);
  }
};
