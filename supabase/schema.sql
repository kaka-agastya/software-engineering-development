-- =====================================================================
-- Skema database LIVIA (tahap awal: tabel UserAccount saja)
-- Sumber: Class Diagram SRS LIVIA, class UserAccount
--   fullName, nickname, phoneNumber, password, accountStatus, riskThreshold
--
-- Cara pakai: Supabase Dashboard > SQL Editor > New query > tempel > Run.
-- Aman dijalankan ulang, tapi tabel lama DIHAPUS dulu (data hilang).
-- =====================================================================

drop table if exists user_account cascade;

create table user_account (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  nickname        text not null,
  phone_number    text not null unique,      -- format E.164, mis. +6281234567890
  password_hash   text not null,             -- kata sandi disimpan sebagai hash, tidak ditampilkan
  account_status  text not null default 'pending'
                  check (account_status in ('pending', 'active')),
  risk_threshold  real not null default 0.7
                  check (risk_threshold between 0 and 1),
  created_at      timestamptz not null default now()
);

-- Keamanan: RLS aktif TANPA policy.
-- Akses dari browser (anon / publishable key) ditolak semua.
-- Aplikasi membaca & mengubah data hanya dari server Next.js memakai secret key.
alter table user_account enable row level security;

-- Data contoh supaya tabel di aplikasi langsung terisi
insert into user_account (full_name, nickname, phone_number, password_hash, account_status, risk_threshold) values
  ('John Wick',          'Max',   '+6281234567890', 'contoh-hash', 'active',  0.7),
  ('Clara Wheeler',      'Clara', '+6289876543210', 'contoh-hash', 'active',  0.7),
  ('Budi Santoso',       'Budi',  '+6281311112222', 'contoh-hash', 'pending', 0.7),
  ('Siti Rahmawati',     'Siti',  '+6285733334444', 'contoh-hash', 'active',  0.5),
  ('Andi Pratama',       'Andi',  '+6287855556666', 'contoh-hash', 'pending', 0.7);
