const client = require("../../../config/redis");
const addToCache = require("../../../utils/redis/addToCache");
const fetchExpenseDocs = require("../../../utils/user/expenses/fetchExpenseDocs");

module.exports = async (req, res, next) => {
  try {
    if (req.body.updateAllExpenses === true) {
      let keywordExpenses = [];

      if (!req.keyword) {
        res.code = 400;
        throw new Error(`Invalid request`);
      }

      const keyword = req.keyword.keyword;

      const expensesCacheKey = `expenses:${req.user.id}:`;
      const keywordExpensesCachedKey = expensesCacheKey + `${keyword}:`;

      const cachedKeywordExpenses = await client.get(keywordExpensesCachedKey);
      if (cachedKeywordExpenses) {
        keywordExpenses = JSON.parse(cachedKeywordExpenses);
      } else {
        let expenses = [];
        cachedExpenses = await client.get(expensesCacheKey);
        if (cachedExpenses) {
          expenses = JSON.parse(cachedExpenses);
        } else {
          const expenseDocs = await fetchExpenseDocs(req.user);
          for (let doc of expenseDocs) {
            const data = { id: doc.id, ...doc.data() };
            if (data.recipient.includes(keyword)) {
              keywordExpenses.push(data);
            }
            expenses.push(data);
          }
          addToCache(expensesCacheKey, expenses);
          addToCache(keywordExpensesCachedKey, keywordExpenses);
        }
      }

      req.keyword.expenses = expenses;
      req.keyword.keywordExpenses = keywordExpenses;
      req.keyword.cacheKey = keywordExpensesCachedKey;
    }
    next();
  } catch (error) {
    next(error);
  }
};
