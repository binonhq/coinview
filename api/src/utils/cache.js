const NodeCache = require('node-cache');

// Create a new cache instance with TTL in seconds
const cache = new NodeCache({
  stdTTL: process.env.CACHE_TTL || 300, // Default 5 minutes
  checkperiod: 120, // Check for expired keys every 2 minutes
});

module.exports = cache;
