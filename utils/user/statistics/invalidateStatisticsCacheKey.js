const generateCacheKey = require("../../redis/generateCacheKey");
const removeFromCache = require("../../redis/removeFromCache");

module.exports = async (user, path, invalidatedKeys) => {
  const cacheKey =
    generateCacheKey(
      { user, params: { 0: path } },
      "statistics"
    ) + "*";

  if (!invalidatedKeys[cacheKey]) {
    await removeFromCache(cacheKey);
    invalidatedKeys[cacheKey] = true;
  }
};
