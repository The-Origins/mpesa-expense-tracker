const db = require("../../../config/db");
const addTocache = require("../../../utils/redis/addToCache");

module.exports = async (req, res, next) => {
  try {
    let trash = [];
    if (req.cachedData) {
      //retrive from cache
      trash = req.cachedData.trash;
    } else {
      const { limit } = req.query;

      const trashRef = db
        .collection("users")
        .doc(req.user.id)
        .collection("trash");

      let trashDocs = (await trashRef.get()).docs;

      for (let i = 0; i < trashDocs.length; i++) {
        if (limit && i >= Number(limit)) {
          break;
        }

        trash.push({ id: trashDocs[i].id, ...trashDocs[i].data() });
      }

      //add to cache
      addTocache(req.cacheKey, { trash });
    }

    res.json({
      success: true,
      data: trash,
      message: "Successfully returned trash",
    });
  } catch (error) {
    next(error);
  }
};
