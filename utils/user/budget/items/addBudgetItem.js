const db = require("../../../../config/db");
const getInitialCurrentAmount = require("../getInitialCurrentAmount");

module.exports = async (budget, item, user, batch) => {
  const itemRef = db
    .collection("users")
    .doc(user.id)
    .collection("budget")
    .doc("info")
    .collection("items")
    .doc(item.label || item.id);

  const current = await getInitialCurrentAmount(
    item.label,
    budget.duration,
    user
  );
  batch.set(itemRef, { total: item.total, current });
};
