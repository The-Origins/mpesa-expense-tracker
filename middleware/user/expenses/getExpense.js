const { FieldPath } = require("firebase-admin/firestore");
const addToCache = require("../../../utils/redis/addToCache");
const fetchExpenseDocs = require("../../../utils/user/expenses/fetchExpenseDocs");

module.exports = async (req, res, next) => {
  try {
    if (!req.params?.id || req.params?.id === "unique_refs") {
      throw new Error(`Invalid request`);
    }

    let expense = null;
    if (req.cachedData) {
      expense = req.cachedData;
    } else {
      const expenseDocs = await fetchExpenseDocs(
        req.user,
        [{ field: FieldPath.documentId(), op: "in", value: [req.params.id] }],
        1
      );

      if (!expenseDocs.length) {
        throw new Error(`No expense with id: ${req.params.id}`);
      }

      expense = { id: expenseDocs[0].id, ...expenseDocs[0].data() };

      if (!req.baseUrl.startsWith("/api/user/expenses/delete")) {
        addToCache(req.cacheKey, expense);
      }
    }

    req.expense = expense;
    next();
  } catch (error) {
    next(error);
  }
};
