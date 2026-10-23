-- Apply once in your OWN Supabase project's SQL editor.
-- Client-visible keys must be an anon/publishable key, never service_role.
create table if not exists public.apex_inquiries (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 payload jsonb not null,
 status text not null default 'draft' check (status in ('draft','requested','quoted','confirmed','completed','cancelled')),
 reference text,
 quote text,
 created_at timestamptz not null default now(),
 constraint valid_apex_payload check ((
  jsonb_typeof(payload) = 'object' and
  payload ?& array['experienceId','date','people','language','pickup','dropoff','occasion','notes'] and
  payload->>'experienceId' in ('la-marquesa','vuelo-en-helicoptero') and
  payload->>'date' ~ '^\d{4}-\d{2}-\d{2}$' and
  payload->>'language' in ('es','en') and
  jsonb_typeof(payload->'people') = 'number' and
  (payload->>'people')::numeric between 1 and 99 and
  (payload->>'people')::numeric = trunc((payload->>'people')::numeric) and
  (payload->>'experienceId' <> 'la-marquesa' or (payload->>'people')::numeric between 2 and 6) and
  jsonb_typeof(payload->'pickup') = 'string' and length(payload->>'pickup') <= 300 and
  jsonb_typeof(payload->'dropoff') = 'string' and length(payload->>'dropoff') <= 300 and
  jsonb_typeof(payload->'occasion') = 'string' and length(payload->>'occasion') <= 300 and
  jsonb_typeof(payload->'notes') = 'string' and length(payload->>'notes') <= 1500
 ) is true)
);
create index if not exists apex_inquiries_user_created_idx on public.apex_inquiries(user_id, created_at desc);
alter table public.apex_inquiries enable row level security;
revoke all on public.apex_inquiries from anon;
revoke all on public.apex_inquiries from authenticated;
grant select, insert on public.apex_inquiries to authenticated;
drop policy if exists apex_read_own on public.apex_inquiries;
create policy apex_read_own on public.apex_inquiries for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists apex_insert_draft on public.apex_inquiries;
create policy apex_insert_draft on public.apex_inquiries for insert to authenticated
 with check ((select auth.uid()) = user_id and status = 'draft' and reference is null and quote is null);
-- Only trusted operator/server code may update status, reference or quote.
-- Never grant clients UPDATE or a policy permitting them to confirm themselves.
