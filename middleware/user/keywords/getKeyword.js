const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const keyword = req.query.id || req.query.keyword || req.body.keyword;
    if (!keyword) {
      res.code = 400;
      throw new Error(`Invalid request`);
    }

    const keywordInfo = await db
      .collection("users")
      .doc(req.user.id)
      .collection("keywords")
      .doc(keyword)
      .get();

    if (req.path.startsWith(`/add`)) {
      if (keywordInfo.exists) {
        res.code = 400;
        throw new Error(`Keyword already exists`);
      } else {
        req.keyword = req.body;
        return next();
      }
    }

    if (!keywordInfo.exists) {
      res.code = 400;
      throw new Error(`No keyword found for id: ${keyword}`);
    }

    req.keyword = { keyword: keywordInfo.id, ...keywordInfo.data() };
    next();
  } catch (error) {
    next(error);
  }
};
