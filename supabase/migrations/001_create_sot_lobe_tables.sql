-- 001_create_sot_lobe_tables.sql
-- Schema for sotlobe.ai access control and audit logging.
--
-- This migration lives in the sot-lobe repo but is applied against the SAME
-- Supabase project as herman-admin (a single SOT database). When applying,
-- prefer running this AFTER herman-admin's own migrations to avoid number
-- collisions in the migrations table.

-- ============================================================================
-- sot_subscriptions
-- ============================================================================
-- One row per subscriber agent. The access_key is the secret shared with the
-- agent and matches the suffix used in Upstash (sot_key:<access_key>).
-- Whoever holds a valid access_key with is_active=true and expires_at>now()
-- (or NULL) can fetch the manifest.
CREATE TABLE IF NOT EXISTS sot_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name  TEXT NOT NULL,
  access_key   TEXT NOT NULL UNIQUE,
  plan_type    TEXT NOT NULL DEFAULT 'trial',          -- trial | monthly | yearly | enterprise
  is_active    BOOLEAN NOT NULL DEFAULT true,
  expires_at   TIMESTAMPTZ,                            -- NULL = no expiry
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sot_subscriptions_access_key_format
    CHECK (access_key ~ '^sot_[A-Za-z0-9_-]{1,128}$')
);

CREATE INDEX IF NOT EXISTS sot_subscriptions_access_key_idx
  ON sot_subscriptions (access_key);

CREATE INDEX IF NOT EXISTS sot_subscriptions_active_idx
  ON sot_subscriptions (is_active)
  WHERE is_active = true;

-- ============================================================================
-- sot_access_logs
-- ============================================================================
-- One row per /access_code request that passed Upstash validation. The Edge
-- route inserts asynchronously (fire-and-forget) so logging never blocks the
-- response. access_code is denormalised for fast-path inserts that don't need
-- a Supabase lookup. key_id is the FK when known.
CREATE TABLE IF NOT EXISTS sot_access_logs (
  id           BIGSERIAL PRIMARY KEY,
  access_code  TEXT NOT NULL,
  key_id       UUID REFERENCES sot_subscriptions(id) ON DELETE SET NULL,
  agent_info   TEXT,                                   -- raw User-Agent
  accessed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sot_access_logs_access_code_idx
  ON sot_access_logs (access_code, accessed_at DESC);

CREATE INDEX IF NOT EXISTS sot_access_logs_key_id_idx
  ON sot_access_logs (key_id, accessed_at DESC)
  WHERE key_id IS NOT NULL;

-- ============================================================================
-- updated_at trigger for sot_subscriptions
-- ============================================================================
CREATE OR REPLACE FUNCTION sot_subscriptions_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sot_subscriptions_touch_updated_at ON sot_subscriptions;
CREATE TRIGGER sot_subscriptions_touch_updated_at
  BEFORE UPDATE ON sot_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sot_subscriptions_touch_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
-- The Edge route uses the service_role key, which bypasses RLS. We still
-- enable RLS so that any future user-facing reads via anon/authenticated keys
-- are denied by default.
ALTER TABLE sot_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sot_access_logs   ENABLE ROW LEVEL SECURITY;

-- No policies = no access for non-service-role connections. Add explicit
-- policies later if/when admin UI moves off service_role.
