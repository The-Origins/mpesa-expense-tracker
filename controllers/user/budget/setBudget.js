const db = require("../../../config/db");
const addToCache = require("../../../utils/redis/addToCache");
const removeFromCache = require("../../../utils/redis/removeFromCache");
const setItems = require("../../../utils/user/budget/setItems");
const fetchExpenseDocs = require("../../../utils/user/expenses/fetchExpenseDocs");

module.exports = async (req, res, next) => {
  try {
    const budgetCacheKey = `${req.user.id}:budget`
    removeFromCache(budgetCacheKey + "*");

    const batch = db.batch();
    const { items, ...rest } = req.body;
    const duration = {
      start: new Date(rest.duration.start).toISOString(),
      end: new Date(rest.duration.end).toISOString(),
    };

    let currentAmount = 0;

    const budgetRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info");

    const expenses = await fetchExpenseDocs(req.user, [
      { field: "date", op: ">=", value: duration.start },
      { field: "date", op: "<", value: duration.end },
    ]);

    expenses.forEach((expense) => {
      const data = expense.data();
      currentAmount += data.amount;
      batch.set(budgetRef.collection("expenses").doc(expense.id), {
        value: expense.id,
      });

      if (items && Object.keys(items).length) {
        let itemsCurrent = items;
        let ref = budgetRef.collection("items");

        for (let i = 0; i < data.labels.length; i++) {
          const label = data.labels[i];
          if (itemsCurrent[label]) {
            ref = ref.doc(label);
            itemsCurrent[label].current = itemsCurrent[label].current || 0;
            itemsCurrent[label].current += data.amount;
            batch.set(ref.collection("expenses").doc(expense.id), {
              value: expense.id,
            });

            ref = ref.collection("items");
            itemsCurrent = itemsCurrent[label];
          }
        }
      }
    });

    const budget = { ...rest, duration, current: currentAmount };
    batch.set(budgetRef, budget);

    if (items && Object.keys(items).length) {
      setItems(items, budgetRef.collection("items"), batch);
    }

    addToCache(budgetCacheKey, budget);

    addToCache(budgetCacheKey + ":items", items);
    await batch.commit();

    res.json({
      success: true,
      data: budget,
      message: `Successfully set user budget`,
    });
  } catch (error) {
    next(error);
  }
};
