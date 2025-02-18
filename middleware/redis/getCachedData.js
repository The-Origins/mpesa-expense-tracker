const client = require("../../config/redis");
const generateCacheKey = require("../../utils/redis/generateCacheKey");

module.exports = async (req, res, next) => {
  try {
    const prefix = req.baseUrl.split("/")[3];
    const cacheKey = generateCacheKey(req, prefix);
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
