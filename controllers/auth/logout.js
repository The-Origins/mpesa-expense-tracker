const handleRefreshToken = require("../../utils/auth/handleRefreshToken");
const removeFromCache = require("../../utils/redis/removeFromCache");

module.exports = async (req, res, next) => {
  try {
    await removeFromCache(`users:${req.user.id}:`);
    await handleRefreshToken(res, req.user.id, null, "delete");

    res.json({ success: true, data: {}, message: `User logged out` });
  } catch (error) {
    next(error);
  }
};
