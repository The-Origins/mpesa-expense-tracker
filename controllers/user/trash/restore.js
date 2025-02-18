const addFailedExpenses = require("../../../utils/user/expenses/failed/addFailedExpenses");
const restoreExpenses = require("../../../utils/user/trash/restoreExpenses");

module.exports = async (req, res, next) => {
  try {
    const ids = req.body.id ? [req.body.id] : req.body.ids || [];

    if (!ids.length) {
      res.code = 400;
      throw new error(`Invalid input`);
    }

    const operations = await restoreExpenses(ids, req.user, req.budget);

    if (operations.failed.length) {
      await addFailedExpenses(operations.failed, req.user);
    }

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
