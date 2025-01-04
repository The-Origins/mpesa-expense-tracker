const db = require("../../../config/db");

const getQueryData = (query) => {
  const queryData = query.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      total: data.total,
      entries: data.entries,
    };
  });
  return queryData;
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
    const collectionDocs = await ref.collection(collection.id).get();
    statistics[collection.id] = getQueryData(collectionDocs);
  }

  return statistics;
};
