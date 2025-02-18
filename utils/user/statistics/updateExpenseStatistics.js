const { FieldValue } = require("firebase-admin/firestore");
const invalidateStatisticsCacheKey = require("./invalidateStatisticsCacheKey");

module.exports = async (
  ref,
  user,
  expense,
  batch,
  invalidatedKeys,
  operation = "add",
  budget
) => {
  // ref = users/{userId}/statistics/{all}/expenses
  let path = ref.path.split("/").slice(3).join("/");

  let budgetItemRef = null;
  let isbudgetItemPathInvalid = false;

  if (budget && budget.isInBudgetDuration) {
    budgetItemRef = budget.ref.collection("items");
  }

  for (let i = 0; i < expense.labels.length; i++) {
    const label = expense.labels[i];

    if (budgetItemRef && !isbudgetItemPathInvalid) {
      budgetItemRef = budgetItemRef.doc(label);
      if (operation === "add") {
        try {
          await budgetItemRef.update({
            current: FieldValue.increment(expense.amount),
          });
          batch.set(budgetItemRef.collection("expenses").doc(expense.id), {
            value: expense.id,
          });
        } catch (err) {
          if (err.code === 5) {
            isbudgetItemPathInvalid = true;
          } else {
            throw err;
          }
        }
      } else {
        batch.delete(budgetItemRef);
        batch.delete(budgetItemRef.collection("expenses").doc(expense.id));
      }
      budgetItemRef = budgetItemRef.collection("items");
    }

    ref = ref.doc(label);
    path += `/${label}`;

    //invalidate cache
    invalidateStatisticsCacheKey(user, path, invalidatedKeys);

    batch.set(
      ref,
      {
        total: FieldValue.increment(
          operation === "add" ? expense.amount : -expense.amount
        ),
        entries: FieldValue.increment(operation === "add" ? 1 : -1),
      },
      { merge: true }
    );

    ref = ref.collection("expenses");
    path += `/expenses`;
  }
};
