const db = require("../../config/db");

module.exports = (email, phoneNumber, batch) => {
  const credentialsRef = db.collection("credentials");
  if (email) {
    batch.set(credentialsRef.doc(email), { value: email });
  }
  if (phoneNumber) {
    batch.set(credentialsRef.doc(phoneNumber), { value: phoneNumber });
  }
};
