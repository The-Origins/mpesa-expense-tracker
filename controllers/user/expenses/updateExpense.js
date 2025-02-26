const db = require("../../../config/db");
const removeFromCache = require("../../../utils/redis/removeFromCache");
const addToUniqueRefs = require("../../../utils/user/expenses/addToUniqueRefs");
const removefromUniqueRefs = require("../../../utils/user/expenses/removefromUniqueRefs");
const updateStatistics = require("../../../utils/user/statistics/updateStatistics");

module.exports = async (req, res, next) => {
  try {
    const newValues = req.body;
    const batch = db.batch();
    

    const invalidatedKeys = {};

    if (newValues.date) {
      newValues.date = new Date(newValues.date).toISOString();
    }

    const expenseDocRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("expenses")
      .doc(req.expense.id);

    batch.update(expenseDocRef, newValues);

    if (newValues.ref) {
      //remove from unique
      removefromUniqueRefs(req.expense.ref, req.user, batch);

      //add to unique
      addToUniqueRefs(newValues.ref, req.user, batch);
    }

    if (newValues.labels || newValues.amount) {
      
      if (newValues.labels) {
        newValues.isUnkown = false; 
        newValues.keyword = false
      }

      newValues = { ...req.expense, ...newValues };

      await updateStatistics(
        req.expense,
        req.user,
        req.budget,
        invalidatedKeys,
        "delete"
      );

      await updateStatistics(newValues, req.user, req.budget, invalidatedKeys);
    }

    //invalidate cache
    removeFromCache(`${req.user.id}:expenses*`);

    await batch.commit();
    res.json({
      success: true,
      data: newValues,
      message: "Successfully updated expense",
    });
  } catch (error) {
    next(error);
  }
};
