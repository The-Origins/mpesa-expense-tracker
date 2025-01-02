const db = require("../../../config/db");
const passwordUtils = require("../../../utils/password");

module.exports = async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body;
    const generatedHash = passwordUtils.generateHash(password);

    const newUser = await db
      .collection("users")
      .add({
        name,
        phone,
        email,
        hash: generatedHash.hash,
        salt: generatedHash.salt,
        role:"user",
        expenses: [],
        statistics: {},
      });

    res.status(201).json({success:true, data : newUser.id, message:`New user created`})
  } catch (error) {
    next(error);
  }
};
