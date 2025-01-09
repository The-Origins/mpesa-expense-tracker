const db = require("../../../config/db")

module.exports = async function deleteSubCollections(document) {
  
  const batch = db.batch()

  const subcollections = await document.listCollections();

  for (const subcollection of subcollections) {
    const subDocs = await subcollection.listDocuments();

    for (const doc of subDocs) {
      // Recursively delete subcollections within each document
      await deleteSubCollections(doc, batch);

      // Add document delete to the batch
      batch.delete(doc);
    }
  }

  batch.delete(document);

  await batch.commit()
};
