const { FieldPath } = require("firebase-admin/firestore");
const db = require("../../../config/db");
const removeFromCache = require("../../../utils/redis/removeFromCache");
const deleteExpenses = require("../../../utils/user/expenses/deleteExpenses");

module.exports = async (req, res, next) => {
  try {
    const ids = req.body.id ? [req.body.id] : req.body.ids || [];

    if (!ids.length) {
      res.code = 400;
      throw new Error(`Invalid input`);
    }

    const operation = async (doc, batch, writes, invalidatedKeys) => {
      const data = doc.data();
      removeFromUniqueRefs(data.ref, req.user, batch);
      writes++;

      batch.set(
        db.collection("users").doc(req.user.id).collection(`trash`).doc(doc.id),
        data
      );
      writes++;

      await updateStatistics(
        { ...data, id: doc.id },
        user,
        req.budget,
        invalidatedKeys,
        "delete"
      );
    };
    const operations = await deleteExpenses(
      ids,
      db
        .collection("users")
        .doc(req.user.id)
        .collection("expenses"),
      operation
    );

    removeFromCache(`${req.user.id}:expenses*`);
    removeFromCache(`${req.user.id}:trash*`);

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
