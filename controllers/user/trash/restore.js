const db = require("../../../config/db");
const removeFromCache = require("../../../utils/redis/removeFromCache");
const addExpense = require("../../../utils/user/expenses/addExpense");
const deleteExpenses = require("../../../utils/user/expenses/deleteExpenses");
const addFailedExpenses = require("../../../utils/user/expenses/failed/addFailedExpenses");

module.exports = async (req, res, next) => {
  try {
    const ids = req.body.id ? [req.body.id] : req.body.ids || [];

    if (!ids.length) {
      res.code = 400;
      throw new error(`Invalid input`);
    }

    const operation = async (
      doc,
      batch,
      writes,
      invalidatedKeys,
      operations
    ) => {
      await addExpense(
        db
          .collection("users")
          .doc(req.user.id)
          .collection(`expenses`)
          .doc(doc.id),
        doc.data(),
        operations,
        req.user,
        req.budget,
        invalidatedKeys,
        batch,
        writes
      );
    };

    const operations = await deleteExpenses(
      ids,
      db.collection("users").doc(req.user.id).collection("trash"),
      operation
    );

    if (operations.successful.length) {
      removeFromCache(`${req.user.id}:expenses`);
    }

    if (operations.failed.length) {
      await addFailedExpenses(operations.failed, req.user);
    }

    removeFromCache(`${req.user.id}:trash`)

    res.json({
      success: !operations.failed.length,
      data,
      message: `${operations.successful.length} Successfull operation${
        operations.successful.length === 1 ? "" : "s"
      }, ${operations.failed.length} failed operation${
        operations.failed.length === 1 ? "" : "s"
      }`,
    });
  } catch (error) {
    next(error);
  }
};
