const jwt = require("jsonwebtoken");

module.exports = (id) => {
  const now = Math.floor(Date.now() / 1000);

  const accessPayload = {
    sub: id,
    iat: now,
  };

  const refreshPayload = {
    sub: id,
    iat: now,
    type: "refresh",
  };

  const accessToken = jwt.sign(
    accessPayload,
    process.env.private_key.replace(/\\n/g, "\n"),
    {
      expiresIn: 3600,
      algorithm: "RS256",
    }
  );

  const refreshToken = jwt.sign(
    refreshPayload,
    process.env.private_key.replace(/\\n/g, "\n"),
    {
      expiresIn: 604800,
      algorithm: "RS256",
    }
  );

  return {
    access: {
      token: `Bearer ${accessToken}`,
      iat: now,
      expiresIn: 3600,
    },
    refresh: {
      token: refreshToken,
      iat: now,
      expiresIn: 604800,
    },
  };
};
