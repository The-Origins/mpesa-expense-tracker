const db = require("../../../config/db")
const getPathStatistics = require("../../../utils/user/statistics/getPathStatistics")

module.exports = async (req, res, next) => {
  try {
    const path = `users/${req.user.id}/statistics/all${req.path}`;
    const pathInfo = await db.doc(path).get()

    if(!pathInfo.exists)
    {
        res.code = 404
        return next(new Error(`No data for path: ${req.path}`))
    }

    const pathStatistics = await getPathStatistics(path, pathInfo)
    res.json({
      success: true,
      data: pathStatistics,
      message: "Path statistics successfully returned",
    });
  } catch (error) {
    next(error);
  }
};
