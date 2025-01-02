const jwt = require("jsonwebtoken");

module.exports = (user) => {
  const expiresIn = "1d";

  const payload = {
    sub: user.id,
    role: user.role,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.private_key, {
    expiresIn,
    algorithm: "RS256",
  });

  return {
    token: `Bearer ${signedToken}`,
    expiresIn,
  };
};
