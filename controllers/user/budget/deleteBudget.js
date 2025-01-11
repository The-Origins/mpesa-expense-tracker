const db = require("../../../config/db");

module.exports = async (req, res, next) => {
  try {

    const budgetRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info");

    await budgetRef.delete()

    res.json({success:true, data:{}, message:`Successfully deleted user budget`})
  } catch (error) {
    next(error);
  }
};
