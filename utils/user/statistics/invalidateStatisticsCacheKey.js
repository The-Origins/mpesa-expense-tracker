const removeFromCache = require("../../redis/removeFromCache");

module.exports = async (user, path, invalidatedKeys) => {
  const cacheKey = `${user.id}:statistics:0:${path}*`

  if (!invalidatedKeys[cacheKey]) {
    await removeFromCache(cacheKey);
    invalidatedKeys[cacheKey] = true;
  }
};
