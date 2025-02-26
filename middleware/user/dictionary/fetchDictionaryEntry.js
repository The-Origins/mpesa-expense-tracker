const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const entry =
      req.query?.entry || req.query?.id || req.body?.entry || req.body?.id;

    if (!entry) {
      res.code = 400;
      throw new Error(`Invalid input`);
    }

    const entryRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("dictionary")
      .doc(entry);
    const entryInfo = await entryRef.get();

    if (entryInfo.exists) {
      if (req.path == "/add") {
        res.code = 400;
        throw new Error(`An entry with this id already exists`);
      }
    } else {
      if (req.path !== "/add") {
        res.code = 400;
        throw new Error(`No entry with id found`);
      }
    }

    req.dictionaryEntry = { info: entryInfo, ref: entryRef };
  } catch (error) {
    next(error);
  }
};
