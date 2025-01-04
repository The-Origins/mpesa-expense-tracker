const { FieldValue } = require("firebase-admin/firestore");

module.exports = (ref, expense, batch, operation = "add") => {
  // ref = users/{userId}/statistics/{all}/expenses
  for (let i = 0; i < expense.labels.length; i++) {
    ref = ref.doc(expense.labels[i]);
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
