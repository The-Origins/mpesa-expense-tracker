const db = require("../../../config/db");
const deleteSubCollections = require("./deleteSubCollections");

// Function to handle each document check and possible deletion
const handleDocument = async (ref, currentChecked, clearedPaths) => {
  const docPath = ref.path;
  if (clearedPaths[docPath]) {
    return { checked: true, cleared: true };
  }

  const currentPath = docPath.split("/").slice(-2).join("/");

  if (!currentChecked[currentPath]) {
    const doc = await ref.get();
    const data = doc.data();

    // If total and entries are both zero, mark as cleared and delete subcollections
    if (data && data.total <= 0 && data.entries <= 0) {
      await deleteSubCollections(ref); // Delete subcollections of this doc
      clearedPaths[docPath] = true; // Mark this path as cleared
      return { checked: true, cleared: true }; // Return early since it's been cleared
    }

    // Mark the path as checked
    currentChecked[currentPath] = {};
  }

  return { checked: true, cleared: false }; // Return whether the path was cleared
};

const clearExpenseStatistics = async (
  ref,
  expense,
  currentChecked,
  clearedPaths
) => {
  // ref = users/{userId}/statistics/{all}/expenses
  for (let i = 0; i < expense.labels.length; i++) {
    ref = ref.doc(expense.labels[i]);
    result = await handleDocument(ref, currentChecked, clearedPaths);

    if (result.cleared) {
      break;
    }
    
    currentChecked = currentChecked[`expenses/${expense.labels[i]}`]; // Move to the next expense level
    ref = ref.collection("expenses");
  }
};

module.exports = async (document, user, checkedPaths, clearedPaths) => {
  const expense = (await document.get()).data();
  const date = new Date(expense.date);
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();

  // Initialize traversal path and current state
  let currentChecked = checkedPaths;

  const allRef = db
    .collection("users")
    .doc(user.id)
    .collection("statistics")
    .doc("all");

  let result = await handleDocument(allRef, currentChecked, clearedPaths);
  if (result.cleared) {
    return;
  }

  currentChecked = currentChecked["statistics/all"];
  await clearExpenseStatistics(
    allRef.collection("expenses"),
    expense,
    currentChecked,
    clearedPaths,
  );

  // Traverse the 'year' level
  const yearRef = allRef.collection("years").doc(year);
  currentChecked = checkedPaths["statistics/all"]

  result = await handleDocument(yearRef, currentChecked, clearedPaths,);
  if (result.cleared) {
    return
  }
  currentChecked = currentChecked[`years/${year}`]; // Move to next level
  await clearExpenseStatistics(
    yearRef.collection("expenses"),
    expense,
    currentChecked,
    clearedPaths,
  );

  // Traverse the 'month' level

  const monthRef = yearRef.collection("months").doc(month);
  currentChecked = checkedPaths["statistics/all"][`years/${year}`];

  result = await handleDocument(monthRef, currentChecked, clearedPaths);
  if (result.cleared) {
    return 
  }
  currentChecked = currentChecked[`months/${month}`]; // Move to next level
  await clearExpenseStatistics(
    monthRef.collection("expenses"),
    expense,
    currentChecked,
    clearedPaths,
  );

  // Traverse the 'day' level
  const dayRef = monthRef.collection("days").doc(day);
  currentChecked = checkedPaths["statistics/all"][`years/${year}`][`months/${month}`];

  result = await handleDocument(dayRef, currentChecked, clearedPaths);
  if (result.cleared) {
    return
  }
  currentChecked = currentChecked[`days/${day}`];
  await clearExpenseStatistics(
    monthRef.collection("expenses"),
    expense,
    currentChecked,
    clearedPaths,
  );
  return
};
