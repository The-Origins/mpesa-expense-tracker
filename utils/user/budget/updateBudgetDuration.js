const { FieldValue } = require("firebase-admin/firestore");
const fetchExpenseDocs = require("../expenses/fetchExpenseDocs");
const db = require("../../../config/db");

module.exports = async (
  newStartPos,
  newEndPos,
  durationStart,
  durationEnd,
  previousStart,
  previousEnd,
  user,
  budget
) => {
  const budgetRef = db
    .collection("users")
    .doc(user.id)
    .collection("budget")
    .doc("info");

  const batch = db.batch();

  let amount = {
    decrement: 0,
    increment: 0,
  };

  const leftNull = newStartPos === "left" && newEndPos === null,
    nullRight = newStartPos === null && newEndPos === "right",
    leftLeft = newStartPos === "left" && newEndPos === "left",
    rightRight = newStartPos === "right" && newEndPos === "right",
    leftMiddle = newStartPos === "left" && newEndPos === "middle",
    middleRight = newStartPos === "middle" && newEndPos === "right",
    middleMiddle = newStartPos === "middle" && newEndPos === "middle",
    middleNull = newStartPos === "middle" && newEndPos === null,
    nullMiddle = newStartPos === null && newEndPos === "middle",
    leftRight = newStartPos === "left" && newEndPos === "right";

  let rightDocs = [];
  let leftDocs = [];

  const rightParams = [
    {
      field: "date",
      op: ">=",
      value:
        rightRight || middleMiddle
          ? durationStart
          : nullRight || middleRight || leftRight
          ? previousEnd
          : leftMiddle
          ? durationEnd
          : middleNull
          ? previousStart
          : null,
    },
    {
      field: "date",
      op: "<",
      value:
        rightRight || nullRight || middleRight || leftRight || middleMiddle
          ? durationEnd
          : leftMiddle
          ? previousEnd
          : middleNull
          ? durationStart
          : null,
    },
  ];

  const leftParams = [
    {
      field: "date",
      op: ">=",
      value:
        leftNull || leftLeft || leftMiddle || leftRight
          ? durationStart
          : middleRight
          ? previousStart
          : nullMiddle
          ? previousEnd
          : null,
    },
    {
      field: "date",
      op: "<",
      value:
        leftNull || leftMiddle || leftRight
          ? previousStart
          : leftLeft
          ? durationEnd
          : middleRight
          ? durationStart
          : nullMiddle
          ? durationEnd
          : null,
    },
  ];

  if (rightParams[0].value && rightParams[1].value) {
    rightDocs = await fetchExpenseDocs(user, rightParams);
  }

  if (leftParams[0].value && leftParams[1].value) {
    leftDocs = await fetchExpenseDocs(user, leftParams);
  }

  const invalidItemPaths = {};
  const newItemAmounts = {};

  //clear the previous budget expenses and set the current amount 0 for these conditions
  if (middleMiddle || rightRight || leftLeft) {
    const expenseDocs = await budgetRef.collection("expenses").listDocuments();
    for (let expenseDoc of expenseDocs) {
      batch.delete(expenseDoc);
    }

    //clear budget items
    await clearBudgetItems(
      budgetRef.collection("items"),
      newItemAmounts,
      batch
    );
  }

  await handleDocs(
    rightDocs,
    budgetRef,
    amount,
    leftMiddle || middleNull,
    batch,
    invalidItemPaths,
    newItemAmounts
  );

  await handleDocs(
    leftDocs,
    budgetRef,
    amount,
    middleRight || nullMiddle,
    batch,
    invalidItemPaths,
    newItemAmounts
  );

  //update budget items
  Object.keys(newItemAmounts).forEach((path) => {
    batch.update(db.doc(path), {
      current: newItemAmounts[path],
    });
  });

  //update budget current amount
  if (
    rightRight ||
    leftLeft ||
    leftMiddle ||
    middleRight ||
    middleMiddle ||
    middleNull ||
    nullMiddle
  ) {
    let newValue = amount.increment;
    if (leftMiddle || middleRight || middleNull || nullMiddle) {
      newValue += budget.current - amount.decrement;
    }
    batch.update(budgetRef, { current: newValue });
  } else if (leftNull || nullRight || leftRight) {
    batch.update(budgetRef, {
      current: FieldValue.increment(amount.increment),
    });
  } else {
    return false;
  }

  await batch.commit();
  return true;
};

const handleDocs = async (
  docs,
  budgetRef,
  amount,
  decrementCondition,
  batch,
  invalidItemPaths,
  newItemAmounts
) => {
  for (let doc of docs) {
    const data = doc.data();
    if (decrementCondition) {
      amount.decrement += data.amount;
      //delete from budget expenses collection
      batch.delete(budgetRef.collection("expenses").doc(doc.id));
    } else {
      amount.increment += data.amount;
      //add them to the budget expenses collection
      batch.set(budgetRef.collection("expenses").doc(doc.id), {
        value: doc.id,
      });
    }

    await updateBudgetItem(
      doc,
      budgetRef,
      batch,
      decrementCondition,
      invalidItemPaths,
      newItemAmounts
    );
  }
};

const updateBudgetItem = async (
  doc,
  budgetRef,
  batch,
  decrementCondition,
  invalidItemPaths,
  newItemAmounts
) => {
  const data = doc.data();
  let itemRef = budgetRef.collection("items");

  for (let label of data.labels) {
    itemRef = itemRef.doc(label);
    if (invalidItemPaths[itemRef.path]) {
      break;
    }

    if (!newItemAmounts[itemRef.path]) {
      const itemInfo = await itemRef.get();

      if (itemInfo.exists) {
        newItemAmounts[itemRef.path] = itemInfo.data().current;
      } else {
        invalidItemPaths[itemRef.path] = true;
        break;
      }
    }

    if (decrementCondition) {
      newItemAmounts[itemRef.path] -= data.amount;
      batch.delete(itemRef.collection("expenses").doc(doc.id));
    } else {
      newItemAmounts[itemRef.path] += data.amount;
      batch.set(itemRef.collection("expenses").doc(doc.id), {
        value: doc.id,
      });
    }

    itemRef = itemRef.collection("items");
  }
};

const clearBudgetItems = async (ref, newItemAmounts, batch) => {
  const items = await ref.listDocuments();

  if (!items.length) {
    return;
  }

  for (let item of items) {
    const doc = db.doc(item.path);
    newItemAmounts[item.path] = 0;

    const expenseDocs = await doc.collection(`expenses`).listDocuments();

    for (let expenseDoc of expenseDocs) {
      batch.delete(expenseDoc);
    }

    await clearBudgetItems(doc.collection("items"), newItemAmounts, batch);
  }
};
