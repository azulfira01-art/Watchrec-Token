-- Supabase > SQL Editor: eski kodu silip bunu yapıştır, RUN'a bas.
-- Davet kayıtları: kim kimi davet etti (bir oyuncu yalnızca bir kez davet edilebilir).
create table if not exists public.referrals (
  invitee_id   bigint primary key,
  inviter_id   bigint not null,
  invitee_name text not null default 'Player',
  created_at   timestamptz not null default now(),
  check (inviter_id <> invitee_id)
);
create index if not exists referrals_inviter_idx on public.referrals (inviter_id, created_at desc);

alter table public.referrals enable row level security;
drop policy if exists "referrals_select" on public.referrals;
drop policy if exists "referrals_insert" on public.referrals;
create policy "referrals_select" on public.referrals for select to anon using (true);
create policy "referrals_insert" on public.referrals for insert to anon with check (inviter_id <> invitee_id);
