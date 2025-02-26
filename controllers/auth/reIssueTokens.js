const client = require("../../config/redis");
const jwt = require("jsonwebtoken");
const issueTokens = require("../../utils/auth/issueTokens");
const handleRefreshToken = require("../../utils/auth/handleRefreshToken");
const parseCookies = require("../../utils/auth/parseCookies");

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.replace("Bearer ", "");

    try {
      jwt.verify(accessToken, process.env.public_key.replace(/\\n/g, "\n"));
    } catch (error) {
      if (error.name !== "TokenExpiredError") {
        throw error;
      }
    }

    const cookies = parseCookies(req.headers.cookie);

    const refreshToken = cookies.refreshToken;
    if (!refreshToken) {
      throw new Error(`Invalid token`);
    }

    const refreshPayload = jwt.verify(
      refreshToken,
      process.env.public_key.replace(/\\n/g, "\n")
    );

    const cacheKey = `${refreshPayload.sub}:tokens`;
    const userToken = JSON.parse(await client.get(cacheKey));

    if (
      !userToken ||
      refreshToken !== userToken
    ) {
      res.code = 403;
      throw new Error(`Invalid token`);
    }

    const issuedTokens = issueTokens(refreshPayload.sub);
    await handleRefreshToken(res, refreshPayload.sub, issuedTokens.refresh);

    res.json({
      success: true,
      data: { user: req.user, access: issuedTokens.access },
      message: "successfully re-issued tokens",
    });
  } catch (error) {
    res.code = 403;
    next(error);
  }
};
