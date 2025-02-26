const db = require("../../../config/db");
const removeFromCache = require("../../../utils/redis/removeFromCache");
const updateBudgetDuration = require("../../../utils/user/budget/updateBudgetDuration");

module.exports = async (req, res, next) => {
  try {
    if (!req.budget) {
      throw new Error(`No user budget`);
    }

    const budgetCacheKey = `${req.user.id}:budget`

    const {
      items,
      duration,
      ["duration.start"]: _,
      ["duration.end"]: __,
      ...rest
    } = req.body;

    if (items) {
      throw new Error(
        `Update budget items by using the /budget/items/update path`
      );
    }

    let durationStart = duration?.start || req.body["duration.start"];

    let durationEnd = duration?.end || req.body["duration.end"];

    let previousStart = req.budget.duration.start;
    let previousEnd = req.budget.duration.end;

    let newEndPos = null;
    let newStartPos = null;

    if (durationStart) {
      durationStart = new Date(durationStart).toISOString();

      if (durationStart < previousStart) {
        newStartPos = "left";
      } else if (durationStart >= previousEnd) {
        if (!durationEnd || durationEnd <= durationStart) {
          throw new Error(`Invalid budget duration`);
        }
        newStartPos = "right";
      } else if (durationStart > previousStart) {
        newStartPos = "middle";
      }
    }

    if (durationEnd) {
      durationEnd = new Date(durationEnd).toISOString();

      if (durationEnd > previousEnd) {
        newEndPos = "right";
      } else if (durationEnd < previousStart) {
        if (!durationStart || durationStart >= durationEnd) {
          throw new Error(`Invalid budget duration`);
        }
        newEndPos = "left";
      } else {
        newEndPos = "middle";
      }
    }

    if (newStartPos || newEndPos) {
      await updateBudgetDuration(
        newStartPos,
        newEndPos,
        durationStart,
        durationEnd,
        previousStart,
        previousEnd,
        req.user,
        req.budget
      );

      rest["duration.start"] = durationStart;
      rest["duration.end"] = durationEnd;
      //invalidate *all* budget cache
      removeFromCache(budgetCacheKey + "*");
    }

    //invalidate budget cache
    removeFromCache(budgetCacheKey);

    const budgetRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info");

    await budgetRef.update(rest);

    res.json({
      success: true,
      data: req.body,
      message: `Successfully updated user budget`,
    });
  } catch (error) {
    next(error);
  }
};
