const db = require("../../../config/db");
const passwordUtils = require("../../../utils/user/auth/password");
const issueJwt = require("../../../utils/user/auth/issueJwt");

module.exports = async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body;

    let existingEmailUser = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    
    if(!existingEmailUser.empty)
    {
      res.code = 400
      return next(new Error(`A user with these credentials already exists`))
    }

    let existingPhoneUser = await db
      .collection("users")
      .where("phone.number", "==", phone.number)
      .limit(1)
      .get();
    
    if(!existingPhoneUser.empty)
    {
      res.code = 400
      return next(new Error(`A user with these credentials already exists`))
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

    const newUser = await db.collection("users").add(userData);
    const issuedJwt = issueJwt(newUser.id);

    res.status(201).json({
      success: true,
      data: { user: {id:newUser.id, ...userData}, jwt: issuedJwt },
      message: `New user created`,
    });
  } catch (error) {
    next(error);
  }
};
