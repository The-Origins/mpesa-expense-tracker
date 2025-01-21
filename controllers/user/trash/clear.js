const db = require("../../../config/db");
const clearStatistics = require("../../../utils/user/statistics/clearStatistics");

module.exports = async (req, res, next) => {
  try {
    let checkedPaths = {};
    let clearedPaths = {};

    const trashRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("trash");
    const batch = db.batch();

    const documents = await trashRef.listDocuments();

    if (!documents.length) {
      res.code = 404;
      next(new Error(`No items in trash to clear`));
    }

    for (document of documents) {
      batch.delete(document);
      await clearStatistics(document, req.user, checkedPaths, clearedPaths);
    }

    await batch.commit();
    res.json({
      success: true,
      data: {},
      message: `Successfully cleared trash.`,
    });
  } catch (error) {
    next(error);
  }
};
