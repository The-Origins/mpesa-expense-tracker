const db = require("../../../config/db");
const addToCache = require("../../../utils/redis/addToCache");

module.exports = async (req, res, next) => {
  try {
    let dictionary = [];
    if (req.cachedData) {
      dictionary = req.cachedData;
    } else {
      const dictionaryRef = db
        .collection("users")
        .doc(req.user.id)
        .collection("dictionary");

      const dictionaryDocs = await dictionaryRef.get();

      dictionary = dictionaryDocs.docs.map((doc) => {
        const data = doc.data();
        if (req.query?.["labels-only"]) {
          return data.labels;
        }
        return { id: doc.id, ...data };
      });

      addToCache(req.cacheKey, dictionary);
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
