const db = require("../../../config/db");

module.exports = async (ids, ref, operation) => {
  const operations = { successful: { length: 0 }, failed: { length: 0 } };
  const batch = db.batch();
  let writes = 0;

  //docs to delete
  const docs = (await ref.where(FieldPath.documentId(), "in", ids).get()).docs;

  const invalidatedKeys = {};

  for (let doc of docs) {
    if (writes >= 499) {
      await batch.commit();
      batch = db.batch();
      writes = 0;
    }

    batch.delete(doc.ref);
    writes++;

    if (operation) {
      await operation(doc, batch, writes, invalidatedKeys, operations);
    }

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
  return operations;
};
