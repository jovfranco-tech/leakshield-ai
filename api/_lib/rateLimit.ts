/**
 * In-Memory Serverless Rate Limiter Foundation
 * LeakShield AI v0.2.0-private-beta-security-hardening
 * 
 * TODO / Scale Strategy:
 * - In serverless environments, memory state is ephemeral and isolated across lambda instances.
 * - For a distributed, production-grade cluster, replace this in-memory driver with an Upstash Redis KV connection:
 *   import { Redis } from '@upstash/redis'
 *   const redis = Redis.fromEnv()
 *   // const { success } = await redis.limit(...)
 */

interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const buckets = new Map<string, RateLimitBucket>();

/**
 * Checks if a specific key (UID or IP) has exceeded the rate limit
 * Defaults to max 15 requests per 60-second window.
 */
export function isRateLimited(
  key: string,
  limit: number = 15,
  windowMs: number = 60000
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  let bucket = buckets.get(key);

  // Clean expired bucket
  if (bucket && now > bucket.resetTime) {
    buckets.delete(key);
    bucket = undefined;
  }

  // Create new bucket
  if (!bucket) {
    bucket = {
      count: 0,
      resetTime: now + windowMs
    };
    buckets.set(key, bucket);
  }

  bucket.count++;

  const remaining = Math.max(0, limit - bucket.count);
  const limited = bucket.count > limit;

  return {
    limited,
    remaining,
    resetTime: bucket.resetTime
  };
}

/**
 * Clean up memory periodically (optional utility)
 */
export function cleanExpiredBuckets() {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now > bucket.resetTime) {
      buckets.delete(key);
    }
  }
}
