import Redis from "ioredis";

/**
 * Redis (Upstash) used for caching (standings, hot reads) and realtime
 * pub/sub fan-out. Two clients: a shared default for commands, plus a
 * factory for dedicated subscriber connections (a connection in subscribe
 * mode can't run normal commands).
 */
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createClient(): Redis {
  return new Redis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: 3,
    // Connect on first command, not at import — keeps `next build`/CI from
    // dialing Redis when no server is configured.
    lazyConnect: true,
  });
}

export const redis = globalForRedis.redis ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

/** Create a fresh connection for pub/sub subscribers. */
export function createSubscriber(): Redis {
  return createClient();
}
