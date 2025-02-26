const db = require("../../../config/db");
const deleteSubCollections = require("../../../utils/app/deleteSubCollections");
const removeFromCache = require("../../../utils/redis/removeFromCache");

module.exports = async (req, res, next) => {
  try {
    //invalidate budget cache
    removeFromCache(`${req.user.id}:budget*`);
    const batch = db.batch();
    await deleteSubCollections(
      db.collection("users").doc(req.user.id).collection("budget").doc(`info`),
      batch
    );
    await batch.commit();

    res.json({
      success: true,
      data: {},
      message: `Successfully deleted user budget`,
    });
  } catch (error) {
    next(error);
  }
};
