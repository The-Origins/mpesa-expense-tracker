const db = require("../../../config/db");
const removeFromCache = require("../../redis/removeFromCache");
const addExpense = require("./addExpense");

module.exports = async (expenses, user, budget) => {
  const operations = { successful: { length: 0 }, failed: { length: 0 } };
  const invalidatedKeys = {};
  const batch = db.batch();
  let writes = 0;

  for (let i = 0; i < expenses.length; i++) {
    let expense = expenses[i];
    expense.date = new Date(expense.date).toISOString();
    if (writes >= 499) {
      await batch.commit();
      batch = db.batch();
      writes = 0;
    }

    await addExpense(
      db.collection("users").doc(user.id).collection(`expenses`).doc(),
      expense,
      operations,
      user,
      budget,
      invalidatedKeys,
      batch,
      writes
    );
  }

  await batch.commit();

  //invalidate cache
  removeFromCache(`${user.id}:expenses*`);
  return operations;
};
