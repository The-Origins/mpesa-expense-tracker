const db = require("../../config/db");
const deleteSubCollections = require("../../utils/app/deleteSubCollections");
const removeFromCache = require("../../utils/redis/removeFromCache");
const removeCredentials = require("../../utils/auth/removeCredentials");

module.exports = async (req, res, next) => {
  try {
    //invalidate user cache
    removeFromCache(`${req.user.id}*`);

    //remove from credentials collection
    const batch = db.batch();
    removeCredentials(req.user.email, req.user.phone.number, batch);
    await deleteSubCollections(db.collection("users").doc(req.user.id), batch);

    await batch.commit();
    res.json({ success: true, data: {}, message: `Successfully deleted user` });
  } catch (error) {
    next(error);
  }
};
