const db = require("../../config/db");

module.exports = async (email, phoneNumber) => {
  const emailInfo = db.collection("credentials").doc(email);
  const phoneNumberInfo = db.collection("credentials").doc(phoneNumber);
  return (await emailInfo.get()).exists || (await phoneNumberInfo.get()).exists;
};
