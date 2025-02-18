const db = require("../../../../config/db");
const removeFromCache = require("../../../../utils/redis/removeFromCache");

module.exports = async (req, res, next) => {
  try {
    //invalidate cache
    removeFromCache(`failed:${req.user.id}:*`);

    const failedDocRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("failed")
      .doc(req.params.id);

    await failedDocRef.delete();

    res.status(200).json({
      success: true,
      data: {},
      message: "Successfully deleted failed expense",
    });
  } catch (error) {
    next(error);
  }
};
