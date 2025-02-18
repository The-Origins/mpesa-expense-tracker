const db = require("../../../config/db");

module.exports = async (user, params, limit) => {
  let ref = db.collection("users").doc(user.id).collection("expenses");

  if (params) {
    for (let param of params) {
      ref = ref.where(param.field, param.op, param.value);
    }
  }

  if (limit) {
    ref = ref.limit(Number(limit));
  }

  let expensesDocs = (await ref.get()).docs;

  return expensesDocs;
};
