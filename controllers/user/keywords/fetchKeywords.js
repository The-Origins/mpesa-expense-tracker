const db = require("../../../config/db");
const addToCache = require("../../../utils/redis/addToCache");

module.exports = async (req, res, next) => {
  try {
    let keywords = [];

    if (req.cachedData) {
      keywords = req.cachedData;
    } else {
      keywords = (
        await db
          .collection("users")
          .doc(req.user.id)
          .collection("keywords")
          .get()
      ).docs.map((doc) => ({ keyword: doc.id, ...doc.data() }));

      if (!keywords.length) {
        res.code = 404;
        throw new Error(`No user keywords`);
      }

      //add to cache
      addToCache(req.cacheKey, keywords);
    }

    res.json({
      success: true,
      data: keywords,
      message: `Successfully returned keywords`,
    });
  } catch (error) {}
};
