const { FieldPath } = require("firebase-admin/firestore");
const db = require("../../../config/db");
const updateStatistics = require("../statistics/updateStatistics");
const removeFromCache = require("../../redis/removeFromCache");
const addToUniqueRefs = require("../expenses/addToUniqueRefs");
const isInUniqueRefs = require("../expenses/isInUniqueRefs");

module.exports = async (ids, user, budget) => {
  const operations = { successful: { length: 0 }, failed: { length: 0 } };
  const batch = db.batch();
  let writes = 0;
  //docs to restore
  const userRef = db.collection("users").doc(user.id);
  const trashRef = userRef.collection("trash");
  const expenseDocs = (
    await trashRef.where(FieldPath.documentId(), "in", ids).get()
  ).docs;

  const invalidatedKeys = {};

  for (let doc of expenseDocs) {
    if (writes <= 499) {
      await batch.commit();
      batch = db.batch();
      writes = 0;
    }

    const data = doc.data();
    batch.delete(doc.ref);
    writes++;

    if (!isInUniqueRefs(data.ref, user)) {
      addToUniqueRefs(data.ref, user, batch);
      writes++;

      batch.set(userRef.collection(`expenses`).doc(doc.id), data);
      writes++;

      await updateStatistics(
        { ...data, id: doc.id },
        user,
        budget,
        invalidatedKeys
      );
      operations.successful[doc.id] = data;
      operations.successful.length += 1;
    } else {
      operations.failed[doc.id] = {
        ...data,
        errors: { ref: `An expense with this ref already exists` },
      };
      operations.failed.length += 1;
    }
  }

  //capture failed operations
  if (ids.length !== operations.successful.length + operations.failed.length) {
    ids.forEach((id) => {
      if (!operations.successful[id] || !operations.failed[id]) {
        operations.failed[id] = { errors: { id: `No expense with id` } };
      }
    });
  }

  await batch.commit();
  removeFromCache(`expenses:${user.id}:*`);
  removeFromCache(`trash:${user.id}:*`);

  return operations;
};
