const db = require("../../config/db");

module.exports = (email, phoneNumber, batch) => {
  const credentialsRef = db.collection("credentials");
  if (email) {
    batch.delete(credentialsRef.doc(email));
  }
  if (phoneNumber) {
    batch.delete(credentialsRef.doc(phoneNumber));
  }
};
