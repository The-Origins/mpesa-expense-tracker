const db = require("../../config/db");
const passwordUtils = require("../../utils/auth/passwordUtils");
const issueTokens = require("../../utils/auth/issueTokens");
const handleRefreshToken = require("../../utils/auth/handleRefreshToken");

module.exports = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //login
    let user = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (user.empty) {
      res.code = 400;
      throw new Error("Invalid email or password");
    }

    user = { id: user.docs[0].id, ...user.docs[0].data() };

    if (passwordUtils.isValid(password, user.hash, user.salt)) {
      const issuedTokens = issueTokens(user.id);
      await handleRefreshToken(res, user.id, issuedTokens.refresh);

      res.status(200).json({
        success: true,
        data: { user: user, access: issuedTokens.access },
        message: "Successful login",
      });
    } else {
      res.code = 400;
      throw new Error("Invalid email or password");
    }

    //reponse
  } catch (error) {
    next(error);
  }
};
