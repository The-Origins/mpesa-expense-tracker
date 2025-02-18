const db = require("../../../config/db");
const addToCache = require("../../../utils/redis/addToCache");

module.exports = async (req, res, next) => {
  try {
    let dictionary = [];
    if (req.cachedData) {
      dictionary = req.cachedData.dictionary;
    } else {
      const dictionaryRef = db
        .collection("users")
        .doc(req.user.id)
        .collection("dictionary");

      const dictionaryDocs = await dictionaryRef.get();

      dictionary = dictionaryDocs.docs.map((d) => d.data().labels);

      addToCache(req.cacheKey, { dictionary });
    }
    res.json({
      success: true,
      data: dictionary,
      message: `Successfully returned user dictionary`,
    });
  } catch (error) {
    next(error);
  }
};
