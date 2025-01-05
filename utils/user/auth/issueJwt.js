const jwt = require("jsonwebtoken");

module.exports = (id) => {
  const expiresIn = "1d";

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.private_key.replace(/\\n/g, '\n'), {
    expiresIn,
    algorithm: "RS256",
  });

  return {
    token: `Bearer ${signedToken}`,
    expiresIn,
  };
};
