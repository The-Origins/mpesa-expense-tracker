const db = require("../../../../config/db");

module.exports = async (req, res, next) => {
  try {
    const { label, id, ...rest } = req.body;
    const batch = db.batch();

    const budgetItemsRef = db
      .collection("users")
      .doc(req.user.id)
      .collection("budget")
      .doc("info")
      .collection("items");

    if (label || id) {
      //delete old document
      batch.delete(req.budgetItem.ref);

      //create new document
      const newDocRef = budgetItemsRef.doc(label || id);
      batch.set(newDocRef, req.budgetItem.data);

      //check if there are more values to update
      if (Object.keys(rest).length) {
        //update the new document
        batch.update(newDocRef, rest);
      }
    } else {
      //update the current document
      batch.update(req.budgetItem.ref, rest);
    }

    await batch.commit();

    res.json({
      success: true,
      data: {},
      message: `successfully updated budget item: ${req.budgetItemDocument.id}`,
    });
  } catch (error) {
    next(error);
  }
};
