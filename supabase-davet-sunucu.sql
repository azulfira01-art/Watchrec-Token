-- Supabase > SQL Editor: eski kodu silip bunu yapıştır, RUN'a bas.
-- Davet doğrulaması artık sunucuda (Edge Function "referral") yapılır.
-- ÖNCE Edge Function'ı yayına al, SONRA bu SQL'i çalıştır (aksi halde davetler kısa süre görünmez).

create table if not exists public.referrals (
  invitee_id   bigint primary key,
  inviter_id   bigint not null,
  invitee_name text not null default 'Player',
  created_at   timestamptz not null default now(),
  check (inviter_id <> invitee_id)
);
-- Ödülün verilip verilmediği artık sunucuda tutulur (iki cihazdan çift ödül alınamaz).
alter table public.referrals add column if not exists paid boolean not null default false;
create index if not exists referrals_inviter_idx on public.referrals (inviter_id, created_at desc);

-- Tarayıcıdan (anon) doğrudan yazma/okuma KAPATILIR. Yalnızca Edge Function (service role) erişir.
alter table public.referrals enable row level security;
drop policy if exists "referrals_select" on public.referrals;
drop policy if exists "referrals_insert" on public.referrals;
revoke all on public.referrals from anon, authenticated;
