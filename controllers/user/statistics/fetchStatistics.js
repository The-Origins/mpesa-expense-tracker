const db = require("../../../config/db");
const addToCache = require("../../../utils/redis/addToCache");
const getPathStatistics = require("../../../utils/user/statistics/getDocStatistics");

module.exports = async (req, res, next) => {
  try {
    let statistics = {};
    if (req.cachedData) {
      statistics = req.cachedData;
    } else {
      const path = `users/${req.user.id}/statistics/all${req.path}`;
      const pathDoc = db.doc(path);
      const pathInfo = await pathDoc.get();
      const pathData = pathInfo.data();

      if (!pathInfo.exists || pathData.total <= 0 || pathData.entries <= 0) {
        res.code = 404;
        throw new Error(`No data for path: ${req.path}`);
      }

      statistics = { id: pathInfo.id, ...pathData };
      await getPathStatistics(pathDoc, statistics, 0, 2);

      //add to cache
      addToCache(req.cacheKey, statistics);
    }
    res.json({
      success: true,
      data: statistics,
      message: "Path statistics successfully returned",
    });
  } catch (error) {
    next(error);
  }
};
