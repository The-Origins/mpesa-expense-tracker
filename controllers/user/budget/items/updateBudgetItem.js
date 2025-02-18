const removeFromCache = require("../../../../utils/redis/removeFromCache");
module.exports = async (req, res, next) => {
  try {
    await req.itemRef.update(req.body);
    removeFromCache(`budget:${req.user.id}:items:*`);

    res.json({
      success: true,
      data: {},
      message: `successfully updated budget item`,
    });
  } catch (error) {
    if (error.code === 5) {
      res.code = 404;
    }
    next(error);
  }
};
