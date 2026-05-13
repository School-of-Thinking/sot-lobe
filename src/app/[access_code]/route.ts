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

  // Content negotiation. ChatGPT's web-browsing tool (among others) expects
  // text/html and runs a readability extractor over the body. When we serve
  // raw text/markdown it reports "no readable content". The same fetcher
  // happily parses <pre>-wrapped HTML. Agent SDKs and tools that explicitly
  // want markdown still get markdown via Accept: text/markdown or */*.
  const accept = request.headers.get('accept') ?? ''
  const wantsHtml =
    /text\/html/i.test(accept) && !/text\/markdown/i.test(accept)

  if (wantsHtml) {
    return new Response(renderHtml(MANIFEST_SKILL, access_code), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Manifest-Version': MANIFEST_VERSION,
        'X-Robots-Tag': 'all',
        'Vary': 'Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      },
    })
  }

  return new Response(MANIFEST_SKILL, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Manifest-Version': MANIFEST_VERSION,
      'X-Robots-Tag': 'all',
      'Vary': 'Accept',
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

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderHtml(markdown: string, accessCode: string): string {
  const escaped = htmlEscape(markdown)
  const url = `https://sotlobe.ai/${accessCode}`
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SOTLobe Skills — Manifest</title>
<meta name="description" content="School of Thinking (SOT) SOTLobe Skills. Procedural framework for agents to execute GBB, DVR, CPV, and TPF cognitive strategies." />
<meta name="robots" content="all" />
<meta property="og:type" content="article" />
<meta property="og:title" content="SOTLobe Skills" />
<meta property="og:description" content="Procedural framework for agents to execute GBB, DVR, CPV, and TPF cognitive strategies." />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="sotlobe.ai" />
<link rel="canonical" href="${url}" />
<link rel="alternate" type="text/markdown" href="${url}" />
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;background:#f6f8fa;color:#1a1a1a;line-height:1.6}
main{max-width:48rem;margin:2rem auto;padding:0 1.5rem}
header{margin-bottom:2rem}
header h1{margin:0;font-size:1.5rem;font-weight:600}
header p{margin:.25rem 0 0;color:#666;font-size:.9rem}
pre{background:#fff;border:1px solid #e1e4e8;border-radius:6px;padding:1.5rem;overflow-x:auto;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.85rem;line-height:1.55;color:#1a1a1a}
footer{margin-top:2rem;color:#888;font-size:.8rem}
footer a{color:#666}
</style>
</head>
<body>
<main>
<header>
<h1>SOTLobe Skills — Manifest</h1>
<p>School of Thinking. Served as <code>text/markdown</code> when requested with <code>Accept: text/markdown</code> or <code>*/*</code>.</p>
</header>
<article>
<pre>${escaped}</pre>
</article>
<footer>
<a href="https://sotlobe.ai">sotlobe.ai</a>
</footer>
</main>
</body>
</html>
`
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
