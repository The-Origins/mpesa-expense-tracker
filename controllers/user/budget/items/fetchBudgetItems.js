const db = require("../../../../config/db");
const addToCache = require("../../../../utils/redis/addToCache");
const fetchItems = require("../../../../utils/user/budget/items/fetchItems");

module.exports = async (req, res, next) => {
  try {
    let items = {};
    if (req.cachedData) {
      items = req.cachedData;
    } else {
      await fetchItems(
        db
          .collection("users")
          .doc(req.user.id)
          .collection("budget")
          .doc("info")
          .collection("items"),
        items
      );
      items = items.items;
      if (!items) {
        res.code = 404;
        throw new Error(`No budget items`);
      }
      addToCache(req.cacheKey, items);
    }

    res.json({
      success: true,
      data: items,
      message: `successfuly fetched budget items`,
    });
  } catch (error) {
    next(error);
  }
};
