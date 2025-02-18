const db = require("../../../config/db");
const removeFromCache = require("../../../utils/redis/removeFromCache");

module.exports = async (req, res, next) => {
  try {
    removeFromCache(`trash:${req.user.id}:*`);

    const trashRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("trash");
    const batch = db.batch();

    const documents = await trashRef.listDocuments();

    if (!documents.length) {
      res.code = 404;
      throw new Error(`No items in trash to clear`);
    }

    let writes = 0;
    for (document of documents) {
      if (writes >= 499) {
        await batch.commit();
        writes = 0;
        batch = db.batch();
      }

      batch.delete(document);
      writes++;
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
