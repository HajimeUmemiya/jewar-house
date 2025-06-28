const NodeCache = require('node-cache');
const { logger } = require('../utils/logger');

// Initialize cache with TTL from environment
const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes default
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false // Better performance
});

// Redis client (optional for production)
let redisClient = null;

// Initialize Redis if configured
if (process.env.USE_REDIS === 'true' && process.env.REDIS_URL) {
  try {
    const redis = require('redis');
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD || undefined
    });

    redisClient.on('error', (err) => {
      logger.error('Redis error:', err);
      redisClient = null; // Fallback to in-memory cache
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });

    redisClient.connect();
  } catch (error) {
    logger.warn('Redis initialization failed, using in-memory cache:', error.message);
    redisClient = null;
  }
}

/**
 * Get value from cache
 */
function getFromCache(key) {
  try {
    if (redisClient) {
      // Redis implementation (async, but we'll use sync for simplicity)
      // In production, you might want to use async/await pattern
      return cache.get(key); // Fallback to memory cache for now
    }
    
    const value = cache.get(key);
    if (value) {
      logger.debug(`Cache hit for key: ${key}`);
      return value;
    }
    
    logger.debug(`Cache miss for key: ${key}`);
    return null;
  } catch (error) {
    logger.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set value in cache
 */
function setInCache(key, value, ttl = null) {
  try {
    const cacheTime = ttl || parseInt(process.env.CACHE_TTL) || 300;
    
    if (redisClient) {
      // Redis implementation
      redisClient.setEx(key, cacheTime, JSON.stringify(value));
    }
    
    // Always set in memory cache as fallback
    cache.set(key, value, cacheTime);
    
    logger.debug(`Cached value for key: ${key} (TTL: ${cacheTime}s)`);
    return true;
  } catch (error) {
    logger.error('Cache set error:', error);
    return false;
  }
}

/**
 * Delete value from cache
 */
function deleteFromCache(key) {
  try {
    if (redisClient) {
      redisClient.del(key);
    }
    
    cache.del(key);
    logger.debug(`Deleted cache key: ${key}`);
    return true;
  } catch (error) {
    logger.error('Cache delete error:', error);
    return false;
  }
}

/**
 * Clear all cache
 */
function clearCache() {
  try {
    if (redisClient) {
      redisClient.flushAll();
    }
    
    cache.flushAll();
    logger.info('Cache cleared');
    return true;
  } catch (error) {
    logger.error('Cache clear error:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  try {
    const stats = cache.getStats();
    
    return {
      keys: stats.keys,
      hits: stats.hits,
      misses: stats.misses,
      hit_rate: stats.hits / (stats.hits + stats.misses) || 0,
      redis_connected: !!redisClient,
      memory_usage: process.memoryUsage()
    };
  } catch (error) {
    logger.error('Cache stats error:', error);
    return {
      error: 'Failed to get cache stats',
      redis_connected: !!redisClient
    };
  }
}

// Cache event listeners
cache.on('set', (key, value) => {
  logger.debug(`Cache set: ${key}`);
});

cache.on('del', (key, value) => {
  logger.debug(`Cache delete: ${key}`);
});

cache.on('expired', (key, value) => {
  logger.debug(`Cache expired: ${key}`);
});

module.exports = {
  cache,
  getFromCache,
  setInCache,
  deleteFromCache,
  clearCache,
  getCacheStats
};