const { FieldValue } = require("firebase-admin/firestore");
const db = require("../../../config/db");
const getExpenseStatistics = require("./getExpenseStatistics");

module.exports = async (expense, user, operation = "add") => {
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
  const allExpensesRef = allRef.collection("expenses").doc(expense.labels[0]);

  //ref for all the user statistics for the year
  const yearRef = db
    .collection("users")
    .doc(user.id)
    .collection("statistics")
    .doc(year);
  const yearExpensesRef = yearRef.collection("expenses").doc(expense.labels[0]);

  //ref for all the user statistics for the month
  const monthRef = yearRef.collection("months").doc(month);
  const monthExpensesRef = monthRef
    .collection("expenses")
    .doc(expense.labels[0]);

  //ref for all the user statistics of the day
  const dateRef = monthRef.collection("days").doc(day);
  const dateExpensesRef = dateRef.collection("expenses").doc(expense.labels[0]);

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

  const allExpenses = await getExpenseStatistics(
    allExpensesRef,
    expense,
    operation
  );
  if (allExpenses !== undefined) {
    batch.set(allExpensesRef, allExpenses);
  } else {
    batch.delete(allExpensesRef);
  }

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
  const yearExpenses = await getExpenseStatistics(
    yearExpensesRef,
    expense,
    operation
  );
  if (yearExpenses !== undefined) {
    batch.set(yearExpensesRef, yearExpenses);
  } else {
    batch.delete(yearExpensesRef);
  }

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
  const monthExpenses = await getExpenseStatistics(
    monthExpensesRef,
    expense,
    operation
  );
  if (monthExpenses !== undefined) {
    batch.set(monthExpensesRef, monthExpenses);
  } else {
    batch.delete(monthExpensesRef);
  }

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
  const dateExpenses = await getExpenseStatistics(
    dateExpensesRef,
    expense,
    operation
  );
  if(dateExpenses !== undefined)
  {
    batch.set(dateExpensesRef, dateExpenses);
  }else{
    batch.delete(dateExpensesRef)
  }

  //commit batch
  await batch.commit();
};
