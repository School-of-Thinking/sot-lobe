import { Redis } from '@upstash/redis'

// Lazy init so the build's "collect page data" step doesn't fail before
// env vars are wired up. The Upstash client validates the URL eagerly when
// constructed (it must start with `https://`), so we defer construction
// until the first request actually needs it.
let cached: Redis | null = null

function getRedis(): Redis {
  if (cached) return cached
  cached = Redis.fromEnv()
  return cached
}

// Exposed as a const but the underlying client is lazily constructed.
// All operations route through the Proxy → getRedis() on first access.
export const redis = new Proxy({} as Redis, {
  get(_target, prop, receiver) {
    const client = getRedis() as unknown as Record<string | symbol, unknown>
    const value = client[prop]
    return typeof value === 'function' ? (value as Function).bind(client) : value
  },
})
