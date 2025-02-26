const client = require("../../config/redis");
const generateCacheKey = require("../../utils/redis/generateCacheKey");

module.exports = async (req, res, next) => {
  try {
    const key = req.baseUrl.split("/").slice(3).join(":");
    const cacheKey = generateCacheKey(req, key);
    
    const data = await client.get(cacheKey);

    if (data) {
      req.cachedData = JSON.parse(data);
    }
    req.cacheKey = cacheKey;
    next();
  } catch (error) {
    next(error);
  }
};
