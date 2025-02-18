module.exports = getDocStatistics = async (
  document,
  current,
  depth,
  maxDepth
) => {
  const subcollections = await document.listCollections();

  if (!subcollections.length) {
    return;
  }

  for (const subcollection of subcollections) {
    current[subcollection.id] = current[subcollection.id] || {};
    const subDocs = await subcollection.listDocuments();

    if (!subDocs.length) {
      continue;
    }

    for (const doc of subDocs) {
      const data = (await doc.get()).data();
      if (data.total <= 0 || data.entries <= 0) {
        continue;
      }
      current[subcollection.id][doc.id] =
        current[subcollection.id][doc.id] || {};

      Object.assign(current[subcollection.id][doc.id], data);

      if (subcollection.id === "expenses") {
        if (depth < maxDepth) {
          await getDocStatistics(
            doc,
            current[subcollection.id][doc.id],
            depth + 1,
            maxDepth
          );
        }
      }
    }
  }
};
