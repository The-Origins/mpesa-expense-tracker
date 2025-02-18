const { FieldPath } = require("firebase-admin/firestore");
const db = require("../../../config/db");
const fetchExpenseDocs = require("./fetchExpenseDocs");
const removeFromUniqueRefs = require("./removefromUniqueRefs");
const updateStatistics = require("../statistics/updateStatistics");
const removeFromCache = require("../../redis/removeFromCache");

module.exports = async (ids, user, budget) => {
  const operations = { successful: { length: 0 }, failed: { length: 0 } };
  const batch = db.batch();
  let writes = 0;
  //docs to delete
  const expenseDocs = await fetchExpenseDocs(user, [
    { field: FieldPath.documentId(), op: "in", value: ids },
  ]);

  const invalidatedKeys = {};

  for (let doc of expenseDocs) {
    if (writes >= 499) {
      await batch.commit();
      batch = db.batch();
      writes = 0;
    }

    const data = doc.data();
    removeFromUniqueRefs(data.ref, user, batch);
    writes++;

    batch.delete(doc.ref);
    writes++;

    batch.set(
      db.collection("users").doc(user.id).collection(`trash`).doc(doc.id),
      data
    );
    writes++;

    await updateStatistics(
      { ...data, id: doc.id },
      user,
      budget,
      invalidatedKeys,
      "delete"
    );
    operations.successful[doc.id] = data;
    operations.successful.length += 1;
  }

  //capture failed operations
  if (ids.length !== operations.successful.length) {
    ids.forEach((id) => {
      if (!operations.successful[id]) {
        operations.failed[id] = { errors: { id: `No expense with id` } };
      }
    });
  }

  await batch.commit();
  removeFromCache(`expenses:${user.id}:*`);
  removeFromCache(`trash:${user.id}:*`);
  return operations;
};
