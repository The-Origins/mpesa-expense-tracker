const db = require("../../../../config/db");
const addTocache = require("../../../../utils/redis/addToCache");

module.exports = async (req, res, next) => {
  try {
    let failed = [];
    if (req.cachedData) {
      //retrive from cache
      failed = req.cachedData;
    } else {
      const { limit } = req.query;

      const failedRef = db
        .collection("users")
        .doc(req.user.id)
        .collection("failed");

      let failedDocs = (await failedRef.get()).docs;

      for (let faliure of failedDocs) {
        if (limit && failed.length >= Number(limit)) {
          break;
        }

        if (faliure.id !== "unique_refs") {
          failed.push({ id: faliure.id, ...faliure.data() });
        }
      }

      //add to cache
      addTocache(req.cacheKey, failed);
    }

    res.json({
      success: true,
      data: failed,
      message: "Successfully returned expenses",
    });
  } catch (error) {
    next(error);
  }
};
