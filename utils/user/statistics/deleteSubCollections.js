module.exports = async function deleteSubCollections(ref, batch) {
  const subcollections = await ref.listCollections();

  for (const subcollection of subcollections) {
    const subDocs = await subcollection.listDocuments();

    for (const doc of subDocs) {
      // Recursively delete subcollections within each document
      await deleteSubCollections(doc, batch);

      // Add document delete to the batch
      batch.delete(doc);
    }
  }

  batch.delete(ref);
};
