const db = require("../../../config/db");
const isInUniqueRefs = require("./isInUniqueRefs");
const updateStatistics = require("../statistics/updateStatistics");
const addToUniqueRefs = require("./addToUniqueRefs");
const removeFromCache = require("../../redis/removeFromCache");

module.exports = async (expenses, user, budget) => {
  const operations = { successful: { length: 0 }, failed: { length: 0 } };
  const invalidatedKeys = {};
  const batch = db.batch();
  let writes = 0;

  for (let i = 0; i < expenses.length; i++) {
    const expense = expenses[i];
    if (writes >= 499) {
      await batch.commit();
      batch = db.batch();
      writes = 0;
    }

    if (!(await isInUniqueRefs(expense.ref, user))) {
      const expenseDoc = db
        .collection("users")
        .doc(user.id)
        .collection("expenses")
        .doc();
      //add expense properties
      if (typeof expense.date === "string") {
        expense.date = new Date(expense.date).toISOString();
      }

      batch.set(expenseDoc, expense);
      writes++;

      addToUniqueRefs(expense.ref, user, batch);
      writes++;

      await updateStatistics(
        { ...expense, id: expenseDoc.id },
        user,
        budget,
        invalidatedKeys
      );

      operations.successful[i] = { ...expense, id: expenseDoc.id };
      operations.successful.length += 1;
    } else {
      operations.failed[i] = {
        ...expense,
        errors: { ref: `An expense with this ref already exists` },
      };
      operations.failed.length += 1;
    }
  }

  await batch.commit();

  //invalidate cache
  removeFromCache(`expenses:${user.id}:*`);
  return operations;
};
