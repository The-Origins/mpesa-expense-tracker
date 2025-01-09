const { FieldValue } = require("firebase-admin/firestore");
const db = require("../../../config/db");
const updateExpenseStatistics = require("./updateExpenseStatistics");

module.exports = async (expense, user, operation="add") => {
  const date = new Date(expense.date);
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();

  const batch = db.batch();
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
  updateExpenseStatistics(allRef.collection("expenses"), expense, batch, operation);

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
  updateExpenseStatistics(yearRef.collection("expenses"), expense, batch, operation);

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
  updateExpenseStatistics(monthRef.collection("expenses"), expense, batch, operation);

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
  updateExpenseStatistics(dateRef.collection("expenses"), expense, batch, operation);

  //commit batch
  await batch.commit();
};
