const db = require("../../../config/db");
const removeFromCache = require("../../../utils/redis/removeFromCache");

module.exports = async (req, res, next) => {
  try {
    const ids = req.body.id ? [req.body.id] : req.body.ids || [];

    if (!ids.length) {
      res.code = 400;
      throw new Error(`Invalid input`);
    }

    const operations = await deleteExpenses(
      ids,
      db.collection("users").doc(req.user.id).collection("trash")
    );
    removeFromCache(`${req.user.id}:trash*`);

    res.json({
      success: !operations.failed.length,
      data: operations,
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
