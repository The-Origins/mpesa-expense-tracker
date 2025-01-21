const addExpenses = require("../../../utils/user/expenses/addExpenses");
const parseReceipts = require("../../../utils/user/expenses/parseReceipts");

module.exports = async (req, res, next) => {
  try {
    if (req.body.receipts) {
      const parsedReceipts = await parseReceipts(req.body.receipts, req.user);
      await addExpenses(parsedReceipts.expenses, req.user, req.budget);
      return res.json({
        success: !parsedReceipts.failed.length,
        data: parsedReceipts,
        message: `${parsedReceipts.expenses.length} Successfull operation${
          parsedReceipts.expenses.length === 1 ? "" : "s"
        }, ${parsedReceipts.failed.length} failed operation${
          parsedReceipts.failed.length === 1 ? "" : "s"
        }`,
      });
    }

    if (req.body.receipt) {
      const parsedReceipts = await parseReceipts([req.body.receipt], req.user);
      await addExpenses(expense, req.user, req.budget);
      return res.json({
        success: !parsedReceipts.failed.length,
        data: parsedReceipts,
        message: parsedReceipts.failed.length ? "Operation failed" : "Expense successfully added",
      });
    }

    if (req.body.expenses) {
      await addExpenses(req.body.expenses, req.user, req.budget);
      return res.json({
        success: true,
        data: req.body.expenses,
        message: `Successfully added expenses`,
      });
    }

    if (req.body.expense) {
      await addExpenses([req.body.expense], req.user, req.budget);
      return res.json({
        success: true,
        data: req.body.expense,
        message: `Successfully added expense`,
      });
    }

    res.code = 400;
    new Error(`Bad request`);
  } catch (error) {
    next(error);
  }
};
