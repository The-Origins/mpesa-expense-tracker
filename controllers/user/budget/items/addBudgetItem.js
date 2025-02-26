const { FieldPath } = require("firebase-admin/firestore");
const db = require("../../../../config/db");
const removeFromCache = require("../../../../utils/redis/removeFromCache");
const fetchExpenseDocs = require("../../../../utils/user/expenses/fetchExpenseDocs");

module.exports = async (req, res, next) => {
  try {
    if (!req.budget) {
      res.code = 404;
      throw new Error(`No user budget.`);
    }

    const itemInfo = await req.itemRef.get();

    if (!itemInfo.exists) {
      throw new Error(`Invalid item path`);
    }

    const { label, total } = req.body;
    const labels = [...req.slicedPath, label];
    const docRef = req.itemRef.collection("items").doc(label);

    let current = 0;

    const batch = db.batch();
    const expenseIds = (
      await req.itemRef.collection("expenses").listDocuments()
    ).map((d) => d.id);

    const expensesDocs = await fetchExpenseDocs(req.user, [
      { field: FieldPath.documentId(), op: "in", value: expenseIds },
    ]);

    for (let doc of expensesDocs) {
      const data = doc.data();
      const labelSlice = data.labels.slice(0, labels.length);

      if (labelSlice.join(",") === labels.join(",")) {
        current += data.amount;
        batch.set(docRef.collection("expenses").doc(doc.id), {
          value: doc.id,
        });
      }
    }

    batch.set(docRef, { total, current });

    await batch.commit();

    removeFromCache(`${req.user.id}:budget:items*`);

    res.json({
      success: true,
      data: { ...req.body, current },
      message: `successfully added item to budget`,
    });
  } catch (error) {
    next(error);
  }
};
