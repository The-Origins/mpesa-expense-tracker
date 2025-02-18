const addTocache = require("../../../utils/redis/addToCache");
const fetchExpenseDocs = require("../../../utils/user/expenses/fetchExpenseDocs");

module.exports = async (req, res, next) => {
  try {
    let expenses = [];
    if (req.cachedData) {
      //retrive from cache
      expenses = req.cachedData;
    } else {
      const expenseDocs = await fetchExpenseDocs(
        req.user,
        [],
        req.query?.limit
      );

      for (doc of expenseDocs) {
        if (doc.id !== "unique_refs") {
          expenses.push({ id: doc.id, ...doc.data() });
        }
      }

      //add to cache
      addTocache(req.cacheKey, expenses);
    }

    res.json({
      success: true,
      data: expenses,
      message: "Successfully returned expenses",
    });
  } catch (error) {
    next(error);
  }
};
