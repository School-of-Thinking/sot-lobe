import { get as edgeConfigGet } from '@vercel/edge-config'

/**
 * Look up a single access-code in Vercel Edge Config.
 *
 * Storage model:
 * - Each subscription's access_key is an Edge Config item key
 * - The value is the subscription's UUID (string), used as the FK for logging
 *
 * Edge Config keys must match /^[A-Za-z0-9_-]+$/, which is a superset of the
 * access-code format (`^sot_[A-Za-z0-9_-]{1,128}$`), so we can use access_code
 * directly as the Edge Config item key without translation.
 *
 * Reads are sub-ms because Edge Config is globally replicated to every Vercel
 * region. No network round-trip per request.
 */
export async function lookupAccessCode(accessCode: string): Promise<string | null> {
  const value = await edgeConfigGet<string>(accessCode)
  return value ?? null
}
