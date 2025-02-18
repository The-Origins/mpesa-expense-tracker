const db = require("../../config/db");
const removeFromCache = require("../../utils/redis/removeFromCache");
const addCredentials = require("../../utils/auth/addCredentials");
const removeCredentials = require("../../utils/auth/removeCredentials");

module.exports = async (req, res, next) => {
  try {
    //invalidate user cache
    removeFromCache(`users:${req.user.id}`);

    const batch = db.batch();

    const phoneNumber = req.body.phone?.number || req.body["phone.number"];
    if (req.body.email || phoneNumber) {
      removeCredentials(email, phoneNumber, batch);
      addCredentials(req.body.email, phoneNumber, batch);
    }

    batch.update(db.collection("users").doc(req.user.id), req.body);

    await batch.commit();

    res.json({ success: true, data: {}, message: `Successfully updated user` });
  } catch (error) {
    next(error);
  }
};
