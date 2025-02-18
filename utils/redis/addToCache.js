const client = require("../../config/redis");

module.exports = async (key, data, ttl) => {
  await client.setEx(
    key,
    ttl || Number(process.env.REDIS_TTL),
    JSON.stringify(data)
  );
};
