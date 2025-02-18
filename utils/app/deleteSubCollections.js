const db = require("../../config/db");

module.exports = async function deleteSubCollections(
  document,
  batch,
  writes = 0
) {
  if (writes >= 499) {
    await batch.commit();
    batch = db.batch();
    writes = 0;
  }
  
  const subcollections = await document.listCollections();

  if (!subcollections.length) {
    return;
  }

  for (const subcollection of subcollections) {
    const subDocs = await subcollection.listDocuments();

    if (!subDocs.length) {
      continue;
    }

    for (const doc of subDocs) {
      batch.delete(doc);
      // Recursively delete subcollections within each document
      await deleteSubCollections(doc, batch, writes + 1);
    }
  }

  // Delete the original document
  batch.delete(document);
};
