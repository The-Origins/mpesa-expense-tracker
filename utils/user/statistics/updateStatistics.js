const { FieldValue } = require("firebase-admin/firestore");
const db = require("../../../config/db");
const updateExpenseStatistics = require("./updateExpenseStatistics");

module.exports = async (expense, user, budget, operation = "add") => {
  const batch = db.batch();
  const date = new Date(expense.date);

  //handle dictionary
  const dictionaryRef = db
    .collection("users")
    .doc(user.id)
    .collection("dictionary")
    .doc(expense.recipient);
  if (expense.labels[0] !== "unkown") {
    if (operation === "add") {
      batch.set(dictionaryRef, { labels: expense.labels });
    } else {
      batch.delete(dictionaryRef);
    }
  }

  let isInBudgetDuration = false

  //handle budget
  if (budget) {
    isInBudgetDuration =
      date >= budget.duration.start && date < budget.duration.end;
    
    budget.isInBudgetDuration = isInBudgetDuration

    if (isInBudgetDuration) {
      batch.update(budget.ref, {
        "amount.current": FieldValue.increment(
          operation === "add" ? expense.amount : -expense.amount
        ),
      });
    }
  }

  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();

  //ref for all the user statistics
  const allRef = db
    .collection("users")
    .doc(user.id)
    .collection("statistics")
    .doc("all");
  //ref for all the user statistics for the year
  const yearRef = allRef.collection("years").doc(year);
  //ref for all the user statistics for the month
  const monthRef = yearRef.collection("months").doc(month);
  //ref for all the user statistics of the day
  const dateRef = monthRef.collection("days").doc(day);

  //update statistics

  batch.set(
    allRef,
    {
      total: FieldValue.increment(
        operation === "add" ? expense.amount : -expense.amount
      ),
      entries: FieldValue.increment(operation === "add" ? 1 : -1),
    },
    { merge: true }
  );
  updateExpenseStatistics(
    allRef.collection("expenses"),
    expense,
    batch,
    operation,
    budget
  );

  batch.set(
    yearRef,
    {
      total: FieldValue.increment(
        operation === "add" ? expense.amount : -expense.amount
      ),
      entries: FieldValue.increment(operation === "add" ? 1 : -1),
    },
    { merge: true }
  );
  updateExpenseStatistics(
    yearRef.collection("expenses"),
    expense,
    batch,
    operation
  );

  batch.set(
    monthRef,
    {
      total: FieldValue.increment(
        operation === "add" ? expense.amount : -expense.amount
      ),
      entries: FieldValue.increment(operation === "add" ? 1 : -1),
    },
    { merge: true }
  );
  updateExpenseStatistics(
    monthRef.collection("expenses"),
    expense,
    batch,
    operation
  );

  batch.set(
    dateRef,
    {
      total: FieldValue.increment(
        operation === "add" ? expense.amount : -expense.amount
      ),
      entries: FieldValue.increment(operation === "add" ? 1 : -1),
    },
    { merge: true }
  );
  updateExpenseStatistics(
    dateRef.collection("expenses"),
    expense,
    batch,
    operation
  );

  //commit batch
  await batch.commit();
};
