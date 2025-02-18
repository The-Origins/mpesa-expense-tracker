const addExpenses = require("../../../utils/user/expenses/addExpenses");
const parseReceipts = require("../../../utils/user/expenses/parseReceipts");
const addFailedExpenses = require("../../../utils/user/expenses/failed/addFailedExpenses");

module.exports = async (req, res, next) => {
  try {
    let { receipts, receipt, expense, expenses } = req.body;
    let failed = { length: 0 };

    expenses = expense
      ? [expense]
      : expenses ||
        (await parseReceipts(
          receipt ? [receipt] : receipts || [],
          failed,
          req.user
        ));


    if (!expenses.length) {
      res.code = 400;
      throw new Error(`Invalid input`);
    }

    const operations = await addExpenses(expenses, req.user, req.budget);

    failed = {
      ...failed,
      ...operations.failed,
      length: failed.length + operations.failed.length,
    };

    if (failed.length) {
      await addFailedExpenses(failed, req.user);
    }

    res.json({
      success: !failed.length,
      data: operations,
      message: `${operations.successful.length} Successfull operation${
        operations.successful.length === 1 ? "" : "s"
      }, ${failed.length} failed operation${failed.length === 1 ? "" : "s"}`,
    });
  } catch (error) {
    next(error);
  }
};
