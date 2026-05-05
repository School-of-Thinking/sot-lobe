import { Redis } from '@upstash/redis'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MANIFEST_SKILL = `---
name: sot-scales-manifest
description: SOT Thinking Lobe (Universal Scales)
version: 1.0.0
---

# SOT Universal Scales Manifest
[The full content of your Thinking Lobe / Universal Scales goes here]
`

export async function GET(
  request: NextRequest,
  { params }: { params: { access_code: string } }
) {
  const { access_code } = params

  if (!access_code) {
    return new NextResponse('Access code required', { status: 400 })
  }

  // 1. Edge Validation via Upstash
  const keyInfo = await redis.get(`sot_key:${access_code}`)

  if (!keyInfo) {
    return new NextResponse('Invalid or expired access code', { status: 401 })
  }

  // 2. Async Logging to Supabase (Non-blocking)
  const agentInfo = request.headers.get('user-agent') || 'unknown'
  
  // Note: In edge runtime, we can use waitUntil if available or just non-blocking promise
  supabase.from('sot_access_logs').insert({
    access_code,
    agent_info: agentInfo,
  }).then(({ error }) => {
    if (error) console.error('Logging error:', error)
  })

  // 3. Deliver Raw Markdown
  return new NextResponse(MANIFEST_SKILL, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
