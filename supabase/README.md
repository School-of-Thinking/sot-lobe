# sot-lobe supabase

Migrations for the `sot_subscriptions` and `sot_access_logs` tables that back the Edge route at `sotlobe.ai/[access_code]`.

## Applying

These tables live in the **same** Supabase project as `herman-admin`. Apply this migration after herman-admin's own migrations to avoid stomping on its `001-004` numbering — that's why the file here starts at `001` but is namespaced (`sot_*` table names).

### Option A — Supabase CLI

```bash
# Link this repo to the existing project (one-time)
supabase link --project-ref <herman-admin-project-ref>

# Apply just this migration file
supabase db push --include-all
```

### Option B — psql / SQL editor

```bash
# Run against the same database herman-admin uses
psql "$DATABASE_URL" -f migrations/001_create_sot_lobe_tables.sql
```

Or paste the SQL into the Supabase Studio SQL editor under the same project.

## Verifying

```sql
SELECT table_name FROM information_schema.tables
WHERE table_name LIKE 'sot_%';
-- expect: sot_subscriptions, sot_access_logs

\d sot_subscriptions
\d sot_access_logs
```

## Seeding the first access code

```sql
INSERT INTO sot_subscriptions (client_name, access_key, plan_type)
VALUES ('Test Subscriber', 'sot_devtest_abc123', 'trial')
RETURNING id;
```

Then in Upstash (CLI or REST):
```bash
# Value is the subscription UUID returned above
SET sot_key:sot_devtest_abc123 "<uuid>"
```

## Rolling back

```sql
DROP TABLE sot_access_logs;
DROP TABLE sot_subscriptions;
DROP FUNCTION sot_subscriptions_touch_updated_at;
```
