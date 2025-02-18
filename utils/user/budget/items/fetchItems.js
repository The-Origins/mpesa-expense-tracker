module.exports = fetchItems = async (collection, current) => {
  const docs = (await collection.get()).docs;
  if (!docs.length) {
    return;
  }
  current[collection.id] = current[collection.id] || {};
  for (let doc of docs) {
    {
      current[collection.id][doc.id] = current[collection.id][doc.id] || {};
      Object.assign(current[collection.id][doc.id], doc.data());
      await fetchItems(
        doc.ref.collection("items"),
        current[collection.id][doc.id]
      );
    }
  }
};
