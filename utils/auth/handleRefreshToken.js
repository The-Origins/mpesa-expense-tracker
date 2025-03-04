const addToCache = require("../redis/addToCache");
const removeFromCache = require("../redis/removeFromCache");

module.exports = async (res, id, refresh, operation="set") => {
  //add refresh token to cache for validation
  const cacheKey = `${id}:tokens`
  if (operation === "set") {
    await addToCache(cacheKey, refresh.token, refresh.expiresIn);
  } else {
    await removeFromCache(cacheKey);
  }

  // add to http only cookie
  res.cookie("refreshToken", operation === "set" ? refresh.token : "", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: operation === "set" ? refresh.expiresIn * 1000 : 0,
  });
};
