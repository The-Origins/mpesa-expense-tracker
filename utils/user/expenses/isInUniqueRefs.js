const db = require("../../../config/db");

module.exports = async (ref, user) => {
  const refInfo = await db
    .collection("users")
    .doc(user.id)
    .collection("expenses")
    .doc("unique_refs")
    .collection("refs")
    .doc(ref)
    .get();

  return refInfo.exists;
};
