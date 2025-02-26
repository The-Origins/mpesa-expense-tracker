const db = require("../../../../config/db");
const deleteSubCollections = require("../../../../utils/app/deleteSubCollections");
const removeFromCache = require("../../../../utils/redis/removeFromCache");

module.exports = async (req, res, next) => {
  try {
    const batch = db.batch();
    await deleteSubCollections(req.itemRef, batch);
    await batch.commit();
    removeFromCache(`${req.user.id}:budget:items*`);

    res.json({
      success: true,
      data: {},
      message: `successfully deleted item from budget`,
    });
  } catch (error) {
    next(error);
  }
};
