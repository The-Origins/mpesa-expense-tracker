const deleteExpenses = require("../../../utils/user/expenses/deleteExpenses");

module.exports = async (req, res, next) => {
  try {
    const ids = req.body.id ? [req.body.id] : req.body.ids || [];

    if (!ids.length) {
      res.code = 400;
      throw new Error(`Invalid input`);
    }

    const operations = await deleteExpenses(ids, req.user, req.budget);

    res.status(200).json({
      success: !operations.failed.length,
      data: operations,
      message: `${operations.successful.length} successful operation${
        operations.successful.length === 1 ? "" : "s"
      }, ${operations.failed.length} failed operation${
        operations.successful.length === 1 ? "" : "s"
      }`,
    });
  } catch (error) {
    next(error);
  }
};
