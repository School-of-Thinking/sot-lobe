import { after, type NextRequest } from 'next/server'
import { lookupAccessCode } from '@/lib/edge-config'
import { getSupabaseAdmin } from '@/lib/supabase'
import { MANIFEST_SKILL, MANIFEST_VERSION } from '@/lib/manifest.generated'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const ACCESS_CODE_PATTERN = /^sot_[A-Za-z0-9_-]{1,128}$/

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ access_code: string }> }
) {
  const { access_code } = await params

  // Format validation: cheap reject before touching Edge Config. Don't leak
  // that the route exists at all for malformed input — return 404, not 400.
  if (!ACCESS_CODE_PATTERN.test(access_code)) {
    return notFound()
  }

  let keyInfo: string | null
  try {
    keyInfo = await lookupAccessCode(access_code)
  } catch (err) {
    console.error('[sot-lobe] edge-config lookup failed', err)
    return new Response('Service Unavailable', { status: 503 })
  }

  if (!keyInfo) {
    return notFound()
  }

  // Fire-and-forget access log. after() runs the callback AFTER the response
  // is flushed, so it never delays delivery. Failures only log to console.
  const agentInfo = request.headers.get('user-agent') ?? 'unknown'
  after(() => logAccess(access_code, keyInfo, agentInfo))

  return new Response(MANIFEST_SKILL, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Manifest-Version': MANIFEST_VERSION,
      // Be explicit with AI fetchers: this is a public, indexable document.
      // Some web-browsing tools (e.g. ChatGPT's Bing-backed crawler) treat
      // unrecognised content-types as "blocked" without these signals.
      'X-Robots-Tag': 'all',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    },
  })
}

function notFound(): Response {
  return new Response('Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

async function logAccess(
  accessCode: string,
  keyInfo: string | null,
  agentInfo: string
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin()
    const row: Record<string, string | null> = {
      access_code: accessCode,
      agent_info: agentInfo,
    }
    // Edge Config value is the subscription UUID when admin tooling sets it
    // that way. If it's a UUID, store it as the FK; otherwise just log the code.
    if (keyInfo && isUuid(keyInfo)) {
      row.key_id = keyInfo
    }
    await supabase.from('sot_access_logs').insert(row)
  } catch (err) {
    console.error('[sot-lobe] access log insert failed', err)
  }
}

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
}
