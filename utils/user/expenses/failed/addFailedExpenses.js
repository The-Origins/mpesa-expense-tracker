const db = require("../../../../config/db");
const removeFromCache = require("../../../redis/removeFromCache");

module.exports = async (failed, user) => {
  const batch = db.batch();
  let writes = 0;
  const failedRef = db.collection("users").doc(user.id).collection("failed");

  const keys = Object.keys(failed);

  for (let key of keys) {
    const fail = failed[key];
    if (key === "length" || fail.errors?.id) {
      continue;
    }

    if (writes >= 499) {
      await batch.commit();
      batch = db.batch();
    }
    batch.set(failedRef.doc(), fail);
    writes++
  }

  await batch.commit();
  //invalidate failed cache
  removeFromCache(`failed:${user.id}:*`);
};
