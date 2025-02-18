const db = require("../../../config/db");
const client = require("../../../config/redis");
const addToCache = require("../../../utils/redis/addToCache");

module.exports = async (req, res, next) => {
  try {
    const cachedBudget = await client.get(`budget:${req.user.id}:`);

    if (cachedBudget) {
      req.budget = JSON.parse(cachedBudget);
    } else {
      const budget = await db
        .collection("users")
        .doc(req.user.id)
        .collection("budget")
        .doc("info")
        .get();

      if (budget.exists) {
        const data = budget.data();
        addToCache(`budget:${req.user.id}:`, data);
        req.budget = data;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
