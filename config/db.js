const admin = require("firebase-admin");

// Load Firebase credentials (replace with your own credentials JSON)
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
