const client = require("../../config/redis");

module.exports = async (keyPattern) => {
  const stream = client.scanIterator({
    MATCH: keyPattern, // Pattern to match keys
    COUNT: 100, // Fetch 100 keys at a time for performance
  });

  const pipeline = client.multi(); // Use `multi` for pipelining

  // Iterate over the matching keys
  for await (const key of stream) {
    pipeline.del(key);
  }

  // Execute the pipeline
  await pipeline.exec();

  // console.log(`Cache invalidation completed for pattern: ${keyPattern}`);
};
