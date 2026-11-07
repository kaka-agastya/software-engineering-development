-- =====================================================================
-- Skema database LIVIA: SEMUA tabel dari Class Diagram CDR (Gambar 2).
--
-- Cara pakai: Supabase Dashboard > SQL Editor > New query > tempel seluruh file > Run.
--
-- AMAN dijalankan ulang: tidak ada "drop table".
--   - "create table if not exists" melewati tabel yang sudah ada.
--   - Kolom/index tambahan memakai "if not exists".
-- Kalau kolom sebuah tabel diubah di file ini, tabel lama TIDAK ikut berubah.
-- Ubah lewat Table Editor, atau tanya ke yang mengurus database.
-- =====================================================================

-- ---------------------------------------------------------------------
-- UserAccount: fullName, nickname, phoneNumber, password, accountStatus, riskThreshold
-- ---------------------------------------------------------------------
create table if not exists user_account (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  nickname        text not null,
  phone_number    text not null unique,            -- format E.164, mis. +6281234567890
  password_hash   text not null,                   -- kata sandi disimpan sebagai hash, tidak ditampilkan
  account_status  text not null default 'pending'  -- pending = belum punya kontak darurat
                  check (account_status in ('pending', 'active')),
  risk_threshold  real not null default 0.7        -- ambang skor risiko pemicu darurat
                  check (risk_threshold between 0 and 1),
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- OTP: phoneNumber, otpCode, expiresAt
-- pending_data menampung isian formulir registrasi sampai OTP terverifikasi.
-- user_id kosong selama registrasi (akun belum ada), terisi untuk OTP akun yang sudah ada.
-- ---------------------------------------------------------------------
create table if not exists otp (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references user_account(id) on delete cascade,
  phone_number  text not null,
  otp_code      text not null,
  expires_at    timestamptz not null,
  pending_data  jsonb not null default '{}',
  verified      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- EmergencyContact: fullName, phoneNumber, relationship
-- ---------------------------------------------------------------------
create table if not exists emergency_contact (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references user_account(id) on delete cascade,
  full_name     text not null,
  phone_number  text not null,
  relationship  text not null,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Conversation: startDate, endDate
-- ---------------------------------------------------------------------
create table if not exists conversation (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references user_account(id) on delete cascade,
  start_date  timestamptz not null default now(),
  end_date    timestamptz
);

-- ---------------------------------------------------------------------
-- ChatMessage: sender, content
-- ---------------------------------------------------------------------
create table if not exists chat_message (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references conversation(id) on delete cascade,
  sender           text not null check (sender in ('user', 'ai')),
  content          text not null,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CopingSuggestion: suggestionText (bagian dari pesan balasan AI)
-- ---------------------------------------------------------------------
create table if not exists coping_suggestion (
  id               uuid primary key default gen_random_uuid(),
  chat_message_id  uuid not null references chat_message(id) on delete cascade,
  title            text not null,
  suggestion_text  text not null
);

-- ---------------------------------------------------------------------
-- EmotionLog: type, mood, note, riskScore, timestamp
-- type: Chat (hasil analisis pesan), Manual (diisi pengguna), Check-in
-- ---------------------------------------------------------------------
create table if not exists emotion_log (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references user_account(id) on delete cascade,
  type             text not null check (type in ('Chat', 'Manual', 'Check-in')),
  mood             text not null check (mood in ('sangat_senang', 'senang', 'netral', 'sedih', 'sangat_sedih')),
  note             text,
  risk_score       real not null default 0 check (risk_score between 0 and 1),
  chat_message_id  uuid references chat_message(id) on delete set null,
  timestamp        timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- RiskPattern: riskLevel, startPeriod, endPeriod (ringkasan dari EmotionLog)
-- ---------------------------------------------------------------------
create table if not exists risk_pattern (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references user_account(id) on delete cascade,
  risk_level    text not null check (risk_level in ('Rendah', 'Sedang', 'Tinggi')),
  average_risk  real not null,
  start_period  timestamptz not null,
  end_period    timestamptz not null,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- RiskPattern <>-- EmotionLog (agregasi 1..*): log emosi yang membentuk pola risiko
-- ---------------------------------------------------------------------
create table if not exists risk_pattern_emotion_log (
  risk_pattern_id  uuid not null references risk_pattern(id) on delete cascade,
  emotion_log_id   uuid not null references emotion_log(id) on delete cascade,
  primary key (risk_pattern_id, emotion_log_id)
);

-- ---------------------------------------------------------------------
-- CheckInSchedule: scheduleType, isActive, schedule
-- schedule dipecah jadi jam (schedule_time) dan hari (days, 0 = Minggu .. 6 = Sabtu)
-- ---------------------------------------------------------------------
create table if not exists check_in_schedule (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references user_account(id) on delete cascade,
  schedule_type  text not null check (schedule_type in ('Otomatis', 'Manual')),
  is_active      boolean not null default true,
  schedule_time  time not null,
  days           smallint[] not null default '{0,1,2,3,4,5,6}',
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CheckIn: mood, influencingFactor, note, responseTime, status
-- ---------------------------------------------------------------------
create table if not exists check_in (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references user_account(id) on delete cascade,
  schedule_id         uuid references check_in_schedule(id) on delete set null,
  scheduled_for       timestamptz not null,
  status              text not null default 'Menunggu' check (status in ('Menunggu', 'Dijawab', 'Terlewat')),
  mood                text check (mood in ('sangat_senang', 'senang', 'netral', 'sedih', 'sangat_sedih')),
  influencing_factor  text[] not null default '{}',
  note                text,
  response_time       timestamptz
);

-- ---------------------------------------------------------------------
-- EmergencyAlert: triggerSource, status
-- ---------------------------------------------------------------------
create table if not exists emergency_alert (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references user_account(id) on delete cascade,
  trigger_source  text not null check (trigger_source in ('Manual', 'Otomatis', 'Check-in')),
  status          text not null default 'Menunggu konfirmasi'
                  check (status in ('Menunggu konfirmasi', 'Dibatalkan', 'Terkirim', 'Eskalasi', 'Selesai')),
  created_at      timestamptz not null default now(),
  sent_at         timestamptz,
  resolved_at     timestamptz
);

-- ---------------------------------------------------------------------
-- Location: coordinates, locationLink
-- ---------------------------------------------------------------------
create table if not exists location (
  id                  uuid primary key default gen_random_uuid(),
  emergency_alert_id  uuid not null references emergency_alert(id) on delete cascade,
  coordinates         text,                        -- "lat,lng", mis. "-7.2819,112.7949"
  location_link       text,
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- IncidentLog: description, timestamp
-- ---------------------------------------------------------------------
create table if not exists incident_log (
  id                  uuid primary key default gen_random_uuid(),
  emergency_alert_id  uuid not null references emergency_alert(id) on delete cascade,
  description         text not null,
  timestamp           timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Notification: message, status
-- Satu tabel untuk semua subclass; kolom type yang membedakan:
-- registrasi, pembaruan, darurat, eskalasi, checkin, pengingat
-- ---------------------------------------------------------------------
create table if not exists notification (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references user_account(id) on delete cascade,
  emergency_contact_id  uuid references emergency_contact(id) on delete set null,
  emergency_alert_id    uuid references emergency_alert(id) on delete cascade,
  check_in_id           uuid references check_in(id) on delete cascade,
  type                  text not null check (type in ('registrasi', 'pembaruan', 'darurat', 'eskalasi', 'checkin', 'pengingat')),
  message               text not null,
  status                text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  created_at            timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Keamanan: RLS aktif TANPA policy di SEMUA tabel.
-- Akses dari browser (anon / publishable key) ditolak semua.
-- Aplikasi membaca & mengubah data hanya dari server Next.js memakai secret key.
-- ---------------------------------------------------------------------
alter table user_account       enable row level security;
alter table otp                enable row level security;
alter table emergency_contact  enable row level security;
alter table conversation       enable row level security;
alter table chat_message       enable row level security;
alter table coping_suggestion  enable row level security;
alter table emotion_log        enable row level security;
alter table risk_pattern       enable row level security;
alter table check_in_schedule  enable row level security;
alter table check_in           enable row level security;
alter table emergency_alert    enable row level security;
alter table location           enable row level security;
alter table incident_log       enable row level security;
alter table notification       enable row level security;
alter table risk_pattern_emotion_log enable row level security;

-- ---------------------------------------------------------------------
-- Tambahan untuk database yang sudah dibuat dengan versi file sebelumnya
-- ("create table if not exists" tidak menambah kolom ke tabel lama).
-- ---------------------------------------------------------------------
alter table otp add column if not exists user_id uuid references user_account(id) on delete cascade;

-- ---------------------------------------------------------------------
-- Index untuk foreign key (Postgres tidak membuatnya otomatis).
-- Dipakai saat filter per pengguna / per induk dan saat cascade delete.
-- ---------------------------------------------------------------------
create index if not exists otp_phone_number_idx            on otp (phone_number);
create index if not exists otp_user_id_idx                 on otp (user_id);
create index if not exists emergency_contact_user_id_idx   on emergency_contact (user_id);
create index if not exists conversation_user_id_idx        on conversation (user_id);
create index if not exists chat_message_conversation_idx   on chat_message (conversation_id, created_at);
create index if not exists coping_suggestion_message_idx   on coping_suggestion (chat_message_id);
create index if not exists emotion_log_user_time_idx       on emotion_log (user_id, timestamp);
create index if not exists emotion_log_chat_message_idx    on emotion_log (chat_message_id);
create index if not exists risk_pattern_user_id_idx        on risk_pattern (user_id);
create index if not exists rpel_emotion_log_idx            on risk_pattern_emotion_log (emotion_log_id);
create index if not exists check_in_schedule_user_id_idx   on check_in_schedule (user_id);
create index if not exists check_in_user_id_idx            on check_in (user_id, scheduled_for);
create index if not exists check_in_schedule_id_idx        on check_in (schedule_id);
create index if not exists emergency_alert_user_id_idx     on emergency_alert (user_id);
create index if not exists location_alert_idx              on location (emergency_alert_id);
create index if not exists incident_log_alert_idx          on incident_log (emergency_alert_id, timestamp);
create index if not exists notification_user_id_idx        on notification (user_id);
create index if not exists notification_contact_idx        on notification (emergency_contact_id);
create index if not exists notification_alert_idx          on notification (emergency_alert_id);
create index if not exists notification_check_in_idx       on notification (check_in_id);

-- Data contoh ada di seed.sql (jalankan setelah file ini).
