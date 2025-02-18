const { FieldPath } = require("firebase-admin/firestore");
const db = require("../../../config/db");
const addToCache = require("../../../utils/redis/addToCache");
const removeFromCache = require("../../../utils/redis/removeFromCache");
const updateLables = require("../../../utils/user/keywords/updateLabels");
const fetchExpenseDocs = require("../../../utils/user/expenses/fetchExpenseDocs");
const client = require("../../../config/redis");

module.exports = async (req, res, next) => {
  try {
    const batch = db.batch();
    let writes = 0;

    const keywordExpenses = [];
    const keyword = req.query.keyword || req.body.keyword;
    const { updateAllExpenses, labels } = req.body;

    if (!keyword) {
      res.code = 400;
      throw new Error(`Invalid request`);
    }

    const keywordRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("keywords")
      .doc(keyword);
    const keywordInfo = await keywordRef.get();

    if (keywordInfo.exists) {
      if (req.path === `/add`) {
        res.code = 400;
        throw new Error(`Keyword already exists`);
      }
    } else {
      if (req.path !== "/add") {
        res.code = 400;
        throw new Error(`Keyword not found`);
      }
    }

    if (updateAllExpenses) {
      const expensesCacheKey = `expenses:${req.user.id}:`;
      const keywordExpensesCachedKey = expensesCacheKey + `keyword:${keyword}:`;
      const cachedKeywordExpenses = await client.get(keywordExpensesCachedKey);
      if (cachedKeywordExpenses) {
        for (let keywordExpense of JSON.parse(cachedKeywordExpenses)) {
          if (writes >= 499) {
            await batch.commit();
            batch = db.batch();
            writes = 0;
          }
          await updateLables(
            keywordExpense,
            keyword,
            labels,
            req.user,
            req.budget,
            batch,
            writes
          );
        }
      } else {
        
        cachedExpenses = await client.get(expensesCacheKey);
        if (cachedExpenses) {
          for (let expense of JSON.parse(cachedExpenses)) {
            if (writes >= 499) {
              await batch.commit();
              batch = db.batch();
              writes = 0;
            }
            if (expense.recipient.includes(keyword)) {
              await updateLables(
                expense,
                keyword,
                labels,
                req.user,
                req.budget,
                batch,
                writes
              );
              keywordExpenses.push(expense);
              if (req.path === "/add") {
                batch.set(keywordRef.collection("expenses").doc(expense.id), {
                  value: expense.id,
                });
              }
            }
          }
          addToCache(keywordExpensesCachedKey, keywordExpenses);
        } else {
          const expenses = [];
          let ids = null;

          if (req.path === "/update" || req.path === "/delete") {
            ids = (await keywordRef.collection("expenses").listDocuments()).map(
              (d) => d.id
            );
          }

          const expenseDocs = await fetchExpenseDocs(
            req.user,
            ids && [{ field: FieldPath.documentId(), op: "in", value: ids }]
          );
          for (let doc of expenseDocs) {
            const data = { id: doc.id, ...doc.data() };
            if (ids || data.recipient.includes(keyword)) {
              if (writes >= 499) {
                await batch.commit();
                batch = db.batch();
                writes = 0;
              }
              await updateLables(
                data,
                keyword,
                labels,
                req.user,
                req.budget,
                batch,
                writes
              );
              if (req.path !== "/delete") {
                keywordExpenses.push(data);
              }
              if (req.path === "/add") {
                batch.set(keywordRef.collection("expenses").doc(doc.id), {
                  value: doc.id,
                });
              }
            }
            if (!ids);
            {
              expenses.push(data);
            }
          }
          if (!ids) {
            addToCache(expensesCacheKey, expenses);
          }
          if (req.path !== "/delete") {
            addToCache(keywordExpensesCachedKey, keywordExpenses);
          }
        }
      }
      if (req.path == "/delete") {
        removeFromCache(keywordExpensesCachedKey);
      }
    }

    if (req.path === "/delete") {
      batch.delete(keywordRef);
    } else {
      batch.set(keywordRef, { labels });
    }

    await batch.commit();

    //clear cache
    removeFromCache(`keywords:${req.user.id}:`);

    res.json({
      success: true,
      data: req.body,
      message: `Successfully added keyword${
        updateAllExpenses
          ? ` and updated the lables of ${keywordExpenses.length} expense${
              keywordExpenses.length === 1 ? "" : "s"
            }`
          : ""
      }`,
    });
  } catch (error) {
    next(error);
  }
};
