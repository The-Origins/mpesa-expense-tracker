const db = require("../../../config/db");
const setDefaultLabels = require("../expenses/setDefaultLabels");

module.exports = async (
  keywordExpense,
  keyword,
  labels,
  user,
  budget,
  batch,
  writes
) => {
  const invalidatedKeys = {};
  const expensesRef = db
    .collection("users")
    .doc(user.id)
    .collection("expenses");

  await updateStatistics(
    keywordExpense,
    user,
    budget,
    invalidatedKeys,
    "delete"
  );

  if (labels) {
    keywordExpense.labels = labels;
    keywordExpense.isUnkown = false;
    keywordExpense.keyword = keyword;
  } else {
    setDefaultLabels(keywordExpense);
    keywordExpense.keyword = false;
  }

  batch.update(expensesRef.doc(keywordExpense.id), {
    labels: keywordExpense.labels,
    isUnkown: keywordExpense.isUnkown,
    keyword: keywordExpense.keyword,
  });
  writes++;

  await updateStatistics(keywordExpense, user, budget, invalidatedKeys);
};
