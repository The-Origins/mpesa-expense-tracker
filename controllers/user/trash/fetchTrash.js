const db = require("../../../config/db");
const addTocache = require("../../../utils/redis/addToCache");

module.exports = async (req, res, next) => {
  try {
    let trash = [];
    if (req.cachedData) {
      //retrive from cache
      trash = req.cachedData;
    } else {
      const trashRef = db
        .collection("users")
        .doc(req.user.id)
        .collection("trash");

      if (req.query?.limit) {
        trashRef = trashRef.limit(Number(req.query.limit));
      }

      trash = (await trashRef.get()).docs.map((doc) => ({id:doc.id, ...doc.data()}));


      //add to cache
      addTocache(req.cacheKey, trash);
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
