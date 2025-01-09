const db = require("../../../config/db");

const getCollectionData = async (ref) => {
  const data = {};
  const documents = await ref.listDocuments();
  for (document of documents) {
    const documentData = (await document.get()).data();
    if (documentData.total > 0 && documentData.entries > 0) {
      data[document.id] = documentData;
    }
  }
  return data;
};

module.exports = async (path, pathInfo) => {
  const pathData = pathInfo.data();

  let statistics = {
    id: pathInfo.id,
    total: pathData.total,
    entries: pathData.entries,
  };

  const ref = db.doc(path);
  const collections = await ref.listCollections();

  for (let collection of collections) {
    statistics[collection.id] = await getCollectionData(
      ref.collection(collection.id)
    );
  }

  return statistics;
};
