const db = require("../../../config/db");

module.exports = (ref, user, batch) => {
  batch.delete(
    db
      .collection("users")
      .doc(user.id)
      .collection("expenses")
      .doc("unique_refs")
      .collection("refs")
      .doc(ref)
  );
};
