const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const dictionaryRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("dictionary");

    const dictionaryDocs = await dictionaryRef.get();

    const labels = dictionaryDocs.docs.map((d) => d.data().labels);
    res.json({
      success: true,
      data: labels,
      message: `Successfully returned user dictionary`,
    });
  } catch (error) {
    next(error);
  }
};
