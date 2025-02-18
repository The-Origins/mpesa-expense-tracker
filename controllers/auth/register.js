const db = require("../../config/db");
const passwordUtils = require("../../utils/auth/passwordUtils");
const issueTokens = require("../../utils/auth/issueTokens");
const handleRefreshToken = require("../../utils/auth/handleRefreshToken");
const isInCredentials = require("../../utils/auth/isInCredentials");
const addCredentials = require("../../utils/auth/addCredentials");

module.exports = async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body;
    const batch = db.batch();

    if (await isInCredentials(email, phone.number)) {
      res.code = 400;
      throw new Error(`A user with these credentials already exists`);
    }

    const generatedHash = passwordUtils.generateHash(password);
    const userData = {
      name,
      phone,
      email,
      hash: generatedHash.hash,
      salt: generatedHash.salt,
      role: "user",
    };

    const userRef = db.collection("users").doc();
    batch.set(userRef, userData);
    const issuedTokens = issueTokens(userRef.id);
    await handleRefreshToken(res, userRef.id, issuedTokens.refresh);

    addCredentials(email, phone.number, batch);

    await batch.commit();

    res.status(201).json({
      success: true,
      data: { access: issuedTokens.access },
      message: `New user created`,
    });
  } catch (error) {
    next(error);
  }
};
