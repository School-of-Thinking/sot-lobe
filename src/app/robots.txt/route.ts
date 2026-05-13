/**
 * Permissive robots.txt — sotlobe.ai is designed for AI agents to fetch
 * subscriber-issued URLs. We explicitly welcome crawlers so ChatGPT,
 * Claude, Perplexity, etc. don't apply default-deny heuristics.
 *
 * Access codes are still the security boundary — invalid codes 404
 * regardless of crawler identity.
 */
export const runtime = 'edge'
export const dynamic = 'force-static'

export function GET(): Response {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: ChatGPT-User',
    'Allow: /',
    '',
    'User-agent: anthropic-ai',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'Sitemap: https://sotlobe.ai/sitemap.xml',
    '',
  ].join('\n')

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
