module.exports = async (ref, expense, operation = "add") => {
  // ref = users/{userId}/statistics/{all}/expenses/{transport}

  let statistics = await ref.get();

  statistics = statistics.exists
    ? statistics.data()
    : { total: 0, entries: 0, expenses: {} };

  
  statistics.total =
    operation === "add"
      ? statistics.total + expense.amount
      : statistics.total - expense.amount;
  statistics.entries =
    operation === "add" ? statistics.entries + 1 : statistics.entries - 1;

  if (
    operation === "delete" &&
    (statistics.total <= 0 || statistics.entries <= 0)
  ) {
    return undefined
  }

  let current = statistics.expenses;

  for (let i = 1; i <= expense.labels.length - 1; i++) {
    const label = expense.labels[i];
    current[label] = current[label] || {
      total: 0,
      entries: 0,
      expenses: {},
    };

    // Update the current level's total and entries
    current[label].total =
      operation === "add"
        ? current[label].total + expense.amount
        : current[label].total - expense.amount;
    current[label].entries =
      operation === "add"
        ? current[label].entries + 1
        : current[label].entries - 1;

    if (
      operation === "delete" &&
      (current[label].total <= 0 || current[label].entries <= 0)
    ) {
      //delete
      delete current[label];
      break;
    }

    // Move to the next nested level (expenses)
    current = current[label].expenses;
  }

  return statistics;
};
