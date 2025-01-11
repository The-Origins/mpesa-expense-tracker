const { FieldValue } = require("firebase-admin/firestore");

module.exports = (ref, expense, batch, operation = "add", budget) => {
  // ref = users/{userId}/statistics/{all}/expenses
  let docId = "";

  for (let i = 0; i < expense.labels.length; i++) {
    const label = expense.labels[i];

    if (budget) {
      if (budget.isInBudgetDuration) {
        if (i === 0) {
          docId = label;
        } else {
          docId += `,${label}`;
        }

        if (budget.items.includes(docId)) {
          batch.update(budget.ref.collection("items").doc(docId), {
            current: FieldValue.increment(
              operation === "add" ? expense.amount : -expense.amount
            ),
          });
        }
      }
    }
    ref = ref.doc(label);
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
  }
};
