const { FieldValue } = require("firebase-admin/firestore");
const db = require("../../../config/db");
const updateExpenseStatistics = require("./updateExpenseStatistics");
const invalidateStatisticsCacheKey = require("./invalidateStatisticsCacheKey");
const removeFromCache = require("../../redis/removeFromCache");

module.exports = async (
  expense,
  user,
  budget,
  invalidatedKeys,
  operation = "add"
) => {
  const batch = db.batch();
  const date = new Date(expense.date);

  //handle keyword
  if (expense.keyword) {
    const keywordExpensesRef = db
      .collection("users")
      .doc(user.id)
      .collection("keywords")
      .doc(expense.keyword)
      .collection("expenses");

    if (operation == "add") {
      batch.set(keywordExpensesRef.doc(expense.id), { value: expense.id });
    } else {
      batch.delete(keywordExpensesRef.doc(expense.id));
    }

    //invalidate keyword cache
    const cacheKey = `${user.id}:keywords:${expense.keyword}:expenses`
    removeFromCache(cacheKey);
    invalidatedKeys[cacheKey] = true;
  }

  //handle dictionary
  if ( operation == "add" && !expense.isUnkown) {
    const dictionaryEntryRef = db
      .collection("users")
      .doc(user.id)
      .collection("dictionary")
      .doc(expense.recipient);

    let values = { labels: expense.labels };
    if (expense.keyword) {
      values.keyword = expense.keyword;
    }
    batch.set(dictionaryEntryRef, values);

    //invalidate dictionary cache
    const cacheKey = `${user.id}:dictionary`
    removeFromCache(cacheKey);
    invalidatedKeys[cacheKey] = true;
  }

  //handle budget
  if (budget) {
    const isInBudgetDuration =
      date.toISOString() >= budget.duration.start &&
      date.toISOString() < budget.duration.end;

    budget.isInBudgetDuration = isInBudgetDuration;

    if (isInBudgetDuration) {
      budget.ref = db
        .collection("users")
        .doc(user.id)
        .collection("budget")
        .doc("info");

      batch.set(
        budget.ref,
        {
          current: FieldValue.increment(
            operation === "add" ? expense.amount : -expense.amount
          ),
        },
        { merge: true }
      );

      if (operation === "add") {
        batch.set(budget.ref.collection("expenses").doc(expense.id), {
          value: expense.id,
        });
      } else {
        batch.delete(budget.ref.collection("expenses").doc(expense.id));
      }

      //invalidate budget cache
      const cacheKey = `${user.id}:budget*`;
      removeFromCache(cacheKey);
      invalidatedKeys[cacheKey] = true;
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
  await updateExpenseStatistics(
    allRef.collection("expenses"),
    user,
    expense,
    batch,
    invalidatedKeys,
    operation,
    budget
  );

  //invalidate cache
  invalidateStatisticsCacheKey(user, "", invalidatedKeys);

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
  await updateExpenseStatistics(
    yearRef.collection("expenses"),
    user,
    expense,
    batch,
    invalidatedKeys,
    operation
  );

  invalidateStatisticsCacheKey(user, `years/${year}`, invalidatedKeys);

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
  await updateExpenseStatistics(
    monthRef.collection("expenses"),
    user,
    expense,
    batch,
    invalidatedKeys,
    operation
  );

  invalidateStatisticsCacheKey(
    user,
    `years/${year}/months/${month}`,
    invalidatedKeys
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
  await updateExpenseStatistics(
    dateRef.collection("expenses"),
    user,
    expense,
    batch,
    invalidatedKeys,
    operation
  );

  invalidateStatisticsCacheKey(
    user,
    `years/${year}/months/${month}/days/${day}`,
    invalidatedKeys
  );

  //commit batch
  await batch.commit();
};
