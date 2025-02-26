module.exports = async (
  doc,
  data,
  operations,
  user,
  budget,
  invalidatedKeys,
  batch,
  writes
) => {
  if (!isInUniqueRefs(data.ref, user)) {
    addToUniqueRefs(data.ref, user, batch);
    writes++;

    batch.set(
      doc,
      data
    );
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
};
