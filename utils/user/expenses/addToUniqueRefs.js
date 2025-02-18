const db = require("../../../config/db");

module.exports = (ref, user, batch) => {
  batch.set(
    db
      .collection("users")
      .doc(user.id)
      .collection("expenses")
      .doc("unique_refs")
      .collection("refs")
      .doc(ref),
    { value: ref }
  );
};
