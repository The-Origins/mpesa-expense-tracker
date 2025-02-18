module.exports = setItems = (items, ref, batch) => {
  Object.keys(items).forEach((key) => {
    Object.assign(items[key], {
      ...items[key],
      current: items[key].current || 0,
    });
    batch.set(ref.doc(key), {
      total: items[key].total,
      current: items[key].current,
    });

    if (items[key].items) {
      setItems(items[key].items, ref.doc(key).collection("items"), batch);
    }
  });
};
