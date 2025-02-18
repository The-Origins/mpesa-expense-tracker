const { FieldValue } = require("firebase-admin/firestore");
const db = require("../../../config/db");
const updateExpenseStatistics = require("./updateExpenseStatistics");
const invalidateStatisticsCacheKey = require("./invalidateStatisticsCacheKey");
const generateCacheKey = require("../../redis/generateCacheKey");
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

  //handle dictionary
  const dictionaryRef = db
    .collection("users")
    .doc(user.id)
    .collection("dictionary")
    .doc(expense.recipient);

  const keywordsRef = db
    .collection("users")
    .doc(user.id)
    .collection("keywords");
  if (!expense.isUnkown) {
    if (operation === "add") {
      const values = { labels: expense.labels };
      if (expense.keyword) {
        values.keyword = expense.keyword;
        batch.set(
          keywordsRef
            .doc(expense.keyword)
            .collection("expenses")
            .doc(expense.id),
          { value: expense.id }
        );
      }
      batch.set(dictionaryRef, values);
    } else {
      if (expense.keyword) {
        batch.delete(
          keywordsRef
            .doc(expense.keyword)
            .collection("expenses")
            .doc(expense.id)
        );
      }
      batch.delete(dictionaryRef);
    }

    //invalidate dictionary cache
    const cacheKey = generateCacheKey({ user }, "dictionary") + "*";
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
      const cacheKey = `budget:${user.id}:*`;
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
