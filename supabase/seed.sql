-- =====================================================================
-- Data contoh LIVIA untuk SEMUA tabel di schema.sql.
--
-- Cara pakai: jalankan schema.sql dulu, lalu Supabase Dashboard > SQL Editor >
-- New query > tempel seluruh file ini > Run.
--
-- AMAN dijalankan ulang: setiap baris punya id tetap + "on conflict do nothing",
-- jadi tidak dobel. Pengguna dicari lewat phone_number, jadi tetap cocok dengan
-- baris user_account yang sudah dibuat sebelumnya (id-nya acak).
-- Waktu dihitung relatif ke now(), jadi grafik tren selalu berisi 7 hari terakhir.
--
-- Semua akun contoh memakai kata sandi: password123 (hash bcrypt).
--
-- Pemilik data:
--   +6281234567890 Max   : percakapan, log emosi, pola risiko Sedang, check-in, alarm dibatalkan
--   +6289876543210 Clara : percakapan, log emosi, check-in
--   +6281311112222 Budi  : pending, masih proses OTP registrasi
--   +6285733334444 Siti  : pola risiko Tinggi, alarm darurat otomatis sampai selesai
--   +6287855556666 Andi  : pending, belum punya data lain
-- =====================================================================

-- ---------------------------------------------------------------------
-- UserAccount
-- ---------------------------------------------------------------------
insert into user_account (full_name, nickname, phone_number, password_hash, account_status, risk_threshold) values
  ('John Wick',      'Max',   '+6281234567890', extensions.crypt('password123', extensions.gen_salt('bf')), 'active',  0.7),
  ('Clara Wheeler',  'Clara', '+6289876543210', extensions.crypt('password123', extensions.gen_salt('bf')), 'active',  0.7),
  ('Budi Santoso',   'Budi',  '+6281311112222', extensions.crypt('password123', extensions.gen_salt('bf')), 'pending', 0.7),
  ('Siti Rahmawati', 'Siti',  '+6285733334444', extensions.crypt('password123', extensions.gen_salt('bf')), 'active',  0.5),
  ('Andi Pratama',   'Andi',  '+6287855556666', extensions.crypt('password123', extensions.gen_salt('bf')), 'pending', 0.7)
on conflict (phone_number) do update
  -- baris lama dari versi schema.sql sebelumnya masih memakai 'contoh-hash'
  set password_hash = excluded.password_hash
  where user_account.password_hash = 'contoh-hash';

-- ---------------------------------------------------------------------
-- OTP: Budi sedang registrasi (pending_data), Max verifikasi ulang (sudah dipakai)
-- ---------------------------------------------------------------------
insert into otp (id, user_id, phone_number, otp_code, expires_at, pending_data, verified, created_at)
select v.id::uuid, u.id, v.phone, v.code, now() + v.expires, v.pending::jsonb, v.verified, now() + v.created
from (values
  ('20000000-0000-4000-8000-000000000001', '+6281311112222', '482913', interval '4 minutes',
   '{"full_name":"Budi Santoso","nickname":"Budi"}', false, interval '-1 minute', false),
  ('20000000-0000-4000-8000-000000000002', '+6281234567890', '105377', interval '-7 days' + interval '5 minutes',
   '{}', true, interval '-7 days', true)
) v(id, phone, code, expires, pending, verified, created, has_account)
left join user_account u on v.has_account and u.phone_number = v.phone
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- EmergencyContact (pengguna active wajib punya minimal satu)
-- ---------------------------------------------------------------------
insert into emergency_contact (id, user_id, full_name, phone_number, relationship)
select v.id::uuid, u.id, v.full_name, v.contact_phone, v.relationship
from (values
  ('10000000-0000-4000-8000-000000000001', '+6281234567890', 'Helen Wick',      '+6281298765432', 'Pasangan'),
  ('10000000-0000-4000-8000-000000000002', '+6281234567890', 'Winston Scott',   '+6281355501234', 'Teman'),
  ('10000000-0000-4000-8000-000000000003', '+6289876543210', 'Mira Wheeler',    '+6281277788899', 'Orang tua'),
  ('10000000-0000-4000-8000-000000000004', '+6285733334444', 'Ahmad Rahmawan',  '+6285612345678', 'Saudara kandung'),
  ('10000000-0000-4000-8000-000000000005', '+6285733334444', 'Dewi Lestari',    '+6287712340000', 'Teman')
) v(id, phone, full_name, contact_phone, relationship)
join user_account u on u.phone_number = v.phone
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Conversation
-- ---------------------------------------------------------------------
insert into conversation (id, user_id, start_date, end_date)
select v.id::uuid, u.id, now() + v.start_offset, now() + v.end_offset
from (values
  ('30000000-0000-4000-8000-000000000001', '+6281234567890', interval '-3 days', interval '-3 days' + interval '20 minutes'),
  ('30000000-0000-4000-8000-000000000002', '+6281234567890', interval '-2 hours', null),
  ('30000000-0000-4000-8000-000000000003', '+6289876543210', interval '-1 day',  interval '-1 day' + interval '15 minutes'),
  ('30000000-0000-4000-8000-000000000004', '+6285733334444', interval '-5 hours', interval '-4 hours')
) v(id, phone, start_offset, end_offset)
join user_account u on u.phone_number = v.phone
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- ChatMessage (created_at = awal percakapan + offset)
-- ---------------------------------------------------------------------
insert into chat_message (id, conversation_id, sender, content, created_at)
select v.id::uuid, v.conversation_id::uuid, v.sender, v.content, c.start_date + v.offset_time
from (values
  ('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'user', 'Aku capek banget minggu ini, kerjaan numpuk terus.', interval '1 minute'),
  ('40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 'ai',   'Kedengarannya minggu ini berat sekali, Max. Wajar kalau kamu merasa lelah. Mau cerita bagian mana yang paling membebani?', interval '2 minutes'),
  ('40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', 'user', 'Deadline barengan, dan aku susah tidur.', interval '4 minutes'),
  ('40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', 'ai',   'Terima kasih sudah cerita. Kurang tidur bisa bikin semuanya terasa lebih berat. Ada dua hal kecil yang bisa dicoba malam ini.', interval '5 minutes'),
  ('40000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000002', 'user', 'Hari ini lumayan, tadi sempat jalan sore.', interval '1 minute'),
  ('40000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000002', 'ai',   'Senang dengarnya! Jalan sore itu cara yang bagus untuk menjaga suasana hati.', interval '2 minutes'),
  ('40000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000003', 'user', 'Aku lagi kangen rumah.', interval '1 minute'),
  ('40000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000003', 'ai',   'Rindu rumah itu perasaan yang sangat manusiawi, Clara. Mungkin menelepon keluarga sebentar bisa membantu?', interval '2 minutes'),
  ('40000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000004', 'user', 'Aku merasa sendirian dan nggak ada yang peduli.', interval '1 minute'),
  ('40000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000004', 'ai',   'Aku di sini mendengarkanmu, Siti. Perasaanmu penting. Apakah kamu mau aku menghubungi kontak daruratmu?', interval '2 minutes')
) v(id, conversation_id, sender, content, offset_time)
join conversation c on c.id = v.conversation_id::uuid
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- CopingSuggestion (hanya pada pesan AI)
-- ---------------------------------------------------------------------
insert into coping_suggestion (id, chat_message_id, title, suggestion_text) values
  ('50000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000004', 'Napas 4-7-8',        'Tarik napas 4 detik, tahan 7 detik, hembuskan perlahan 8 detik. Ulangi 4 kali sebelum tidur.'),
  ('50000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000004', 'Jeda layar',         'Matikan layar ponsel 30 menit sebelum tidur dan tulis 3 hal yang perlu dikerjakan besok.'),
  ('50000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000008', 'Hubungi orang dekat', 'Luangkan 10 menit untuk menelepon atau mengirim pesan suara ke keluarga.'),
  ('50000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000010', 'Grounding 5-4-3-2-1', 'Sebutkan 5 hal yang kamu lihat, 4 yang kamu sentuh, 3 yang kamu dengar, 2 yang kamu cium, 1 yang kamu rasakan.')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- CheckInSchedule
-- ---------------------------------------------------------------------
insert into check_in_schedule (id, user_id, schedule_type, is_active, schedule_time, days)
select v.id::uuid, u.id, v.schedule_type, v.is_active, v.schedule_time::time, v.days::smallint[]
from (values
  ('80000000-0000-4000-8000-000000000001', '+6281234567890', 'Otomatis', true,  '21:00', '{0,1,2,3,4,5,6}'),
  ('80000000-0000-4000-8000-000000000002', '+6281234567890', 'Manual',   false, '07:30', '{1,3,5}'),
  ('80000000-0000-4000-8000-000000000003', '+6289876543210', 'Manual',   true,  '20:00', '{1,2,3,4,5}'),
  ('80000000-0000-4000-8000-000000000004', '+6285733334444', 'Otomatis', true,  '19:00', '{0,1,2,3,4,5,6}')
) v(id, phone, schedule_type, is_active, schedule_time, days)
join user_account u on u.phone_number = v.phone
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- CheckIn: Dijawab, Terlewat, Menunggu
-- ---------------------------------------------------------------------
insert into check_in (id, user_id, schedule_id, scheduled_for, status, mood, influencing_factor, note, response_time)
select v.id::uuid, s.user_id, s.id, now() + v.scheduled, v.status, v.mood, v.factors::text[], v.note, now() + v.responded
from (values
  ('90000000-0000-4000-8000-000000000001', '80000000-0000-4000-8000-000000000001', interval '-2 days', 'Dijawab',  'sedih',  '{Pekerjaan,Tidur}', 'Masih kepikiran deadline.', interval '-2 days' + interval '10 minutes'),
  ('90000000-0000-4000-8000-000000000002', '80000000-0000-4000-8000-000000000001', interval '-1 day',  'Terlewat', null,     '{}',                null,                         null),
  ('90000000-0000-4000-8000-000000000003', '80000000-0000-4000-8000-000000000001', interval '1 hour',  'Menunggu', null,     '{}',                null,                         null),
  ('90000000-0000-4000-8000-000000000004', '80000000-0000-4000-8000-000000000003', interval '-1 day',  'Dijawab',  'netral', '{Keluarga}',        null,                         interval '-1 day' + interval '3 minutes'),
  ('90000000-0000-4000-8000-000000000005', '80000000-0000-4000-8000-000000000004', interval '-1 day',  'Dijawab',  'sangat_sedih', '{Kesepian}',  'Nggak pengen ngapa-ngapain.', interval '-1 day' + interval '30 minutes')
) v(id, schedule_id, scheduled, status, mood, factors, note, responded)
join check_in_schedule s on s.id = v.schedule_id::uuid
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- EmotionLog: Chat (dari pesan), Manual, Check-in. 7 hari terakhir.
-- ---------------------------------------------------------------------
insert into emotion_log (id, user_id, type, mood, note, risk_score, chat_message_id, timestamp)
select v.id::uuid, u.id, v.type, v.mood, v.note, v.risk_score, v.chat_message_id::uuid, now() + v.at
from (values
  ('60000000-0000-4000-8000-000000000001', '+6281234567890', 'Manual',   'senang',       'Weekend santai.',            0.10, null,                                   interval '-6 days'),
  ('60000000-0000-4000-8000-000000000002', '+6281234567890', 'Manual',   'netral',       null,                         0.25, null,                                   interval '-5 days'),
  ('60000000-0000-4000-8000-000000000003', '+6281234567890', 'Chat',     'sedih',        null,                         0.45, '40000000-0000-4000-8000-000000000001', interval '-3 days'),
  ('60000000-0000-4000-8000-000000000004', '+6281234567890', 'Chat',     'sedih',        null,                         0.55, '40000000-0000-4000-8000-000000000003', interval '-3 days' + interval '4 minutes'),
  ('60000000-0000-4000-8000-000000000005', '+6281234567890', 'Check-in', 'sedih',        'Masih kepikiran deadline.',  0.50, null,                                   interval '-2 days'),
  ('60000000-0000-4000-8000-000000000006', '+6281234567890', 'Chat',     'senang',       null,                         0.15, '40000000-0000-4000-8000-000000000005', interval '-2 hours'),
  ('60000000-0000-4000-8000-000000000007', '+6289876543210', 'Manual',   'senang',       'Dapat nilai bagus.',         0.05, null,                                   interval '-4 days'),
  ('60000000-0000-4000-8000-000000000008', '+6289876543210', 'Chat',     'sedih',        null,                         0.30, '40000000-0000-4000-8000-000000000007', interval '-1 day'),
  ('60000000-0000-4000-8000-000000000009', '+6289876543210', 'Check-in', 'netral',       null,                         0.20, null,                                   interval '-1 day'),
  ('60000000-0000-4000-8000-000000000010', '+6285733334444', 'Manual',   'sedih',        'Susah fokus.',               0.60, null,                                   interval '-5 days'),
  ('60000000-0000-4000-8000-000000000011', '+6285733334444', 'Check-in', 'sangat_sedih', 'Nggak pengen ngapa-ngapain.', 0.75, null,                                  interval '-1 day'),
  ('60000000-0000-4000-8000-000000000012', '+6285733334444', 'Chat',     'sangat_sedih', null,                         0.90, '40000000-0000-4000-8000-000000000009', interval '-5 hours')
) v(id, phone, type, mood, note, risk_score, chat_message_id, at)
join user_account u on u.phone_number = v.phone
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- RiskPattern + log emosi pembentuknya
-- ---------------------------------------------------------------------
insert into risk_pattern (id, user_id, risk_level, average_risk, start_period, end_period)
select v.id::uuid, u.id, v.risk_level, v.average_risk, now() + v.start_offset, now()
from (values
  ('70000000-0000-4000-8000-000000000001', '+6281234567890', 'Sedang', 0.50, interval '-3 days'),
  ('70000000-0000-4000-8000-000000000002', '+6289876543210', 'Rendah', 0.18, interval '-4 days'),
  ('70000000-0000-4000-8000-000000000003', '+6285733334444', 'Tinggi', 0.75, interval '-5 days')
) v(id, phone, risk_level, average_risk, start_offset)
join user_account u on u.phone_number = v.phone
on conflict (id) do nothing;

insert into risk_pattern_emotion_log (risk_pattern_id, emotion_log_id) values
  ('70000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000003'),
  ('70000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000004'),
  ('70000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000005'),
  ('70000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000007'),
  ('70000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000008'),
  ('70000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000009'),
  ('70000000-0000-4000-8000-000000000003', '60000000-0000-4000-8000-000000000010'),
  ('70000000-0000-4000-8000-000000000003', '60000000-0000-4000-8000-000000000011'),
  ('70000000-0000-4000-8000-000000000003', '60000000-0000-4000-8000-000000000012')
on conflict do nothing;

-- ---------------------------------------------------------------------
-- EmergencyAlert: Siti otomatis (risk 0.90 > ambang 0.5) sampai Selesai,
-- Max menekan tombol darurat lalu membatalkan.
-- ---------------------------------------------------------------------
insert into emergency_alert (id, user_id, trigger_source, status, created_at, sent_at, resolved_at)
select v.id::uuid, u.id, v.trigger_source, v.status, now() + v.created, now() + v.sent, now() + v.resolved
from (values
  ('a0000000-0000-4000-8000-000000000001', '+6285733334444', 'Otomatis', 'Selesai',    interval '-5 hours' + interval '2 minutes', interval '-5 hours' + interval '3 minutes', interval '-4 hours'),
  ('a0000000-0000-4000-8000-000000000002', '+6281234567890', 'Manual',   'Dibatalkan', interval '-1 day',                          null,                                       interval '-1 day' + interval '30 seconds')
) v(id, phone, trigger_source, status, created, sent, resolved)
join user_account u on u.phone_number = v.phone
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Location (hanya alarm yang terkirim)
-- ---------------------------------------------------------------------
insert into location (id, emergency_alert_id, coordinates, location_link, created_at)
select v.id::uuid, a.id, v.coordinates, v.link, a.created_at
from (values
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', '-7.2819,112.7949', 'https://maps.google.com/?q=-7.2819,112.7949')
) v(id, alert_id, coordinates, link)
join emergency_alert a on a.id = v.alert_id::uuid
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- IncidentLog: kronologi alarm
-- ---------------------------------------------------------------------
insert into incident_log (id, emergency_alert_id, description, timestamp)
select v.id::uuid, a.id, v.description, a.created_at + v.offset_time
from (values
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Skor risiko 0.90 melewati ambang 0.5. Alarm otomatis dibuat.',      interval '0 seconds'),
  ('c0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Tidak ada pembatalan dalam 60 detik. SMS darurat dikirim ke 2 kontak.', interval '1 minute'),
  ('c0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Ahmad Rahmawan merespons dan menghubungi pengguna.',                 interval '20 minutes'),
  ('c0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'Insiden ditandai selesai.',                                         interval '58 minutes'),
  ('c0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000002', 'Tombol darurat ditekan.',                                           interval '0 seconds'),
  ('c0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000002', 'Pengguna membatalkan alarm sebelum SMS dikirim.',                   interval '30 seconds')
) v(id, alert_id, description, offset_time)
join emergency_alert a on a.id = v.alert_id::uuid
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Notification: satu contoh untuk setiap type
-- ---------------------------------------------------------------------
insert into notification (id, user_id, emergency_contact_id, emergency_alert_id, check_in_id, type, message, status, created_at)
select v.id::uuid, u.id, v.contact_id::uuid, v.alert_id::uuid, v.check_in_id::uuid, v.type, v.message, v.status, now() + v.created
from (values
  ('d0000000-0000-4000-8000-000000000001', '+6281234567890', '10000000-0000-4000-8000-000000000001', null, null,
   'registrasi', 'Nomor Anda didaftarkan oleh John Wick sebagai kontak darurat di LIVIA.', 'sent', interval '-7 days'),
  ('d0000000-0000-4000-8000-000000000002', '+6281234567890', '10000000-0000-4000-8000-000000000002', null, null,
   'pembaruan', 'Data kontak darurat Anda di akun John Wick telah diperbarui.', 'sent', interval '-4 days'),
  ('d0000000-0000-4000-8000-000000000003', '+6285733334444', '10000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', null,
   'darurat', 'Siti Rahmawati mungkin membutuhkan bantuan. Lokasi: https://maps.google.com/?q=-7.2819,112.7949', 'sent', interval '-5 hours' + interval '3 minutes'),
  ('d0000000-0000-4000-8000-000000000004', '+6285733334444', '10000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', null,
   'darurat', 'Siti Rahmawati mungkin membutuhkan bantuan. Lokasi: https://maps.google.com/?q=-7.2819,112.7949', 'failed', interval '-5 hours' + interval '3 minutes'),
  ('d0000000-0000-4000-8000-000000000005', '+6285733334444', '10000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', null,
   'eskalasi', 'PENGINGAT: Siti Rahmawati belum merespons. Mohon segera hubungi.', 'sent', interval '-5 hours' + interval '13 minutes'),
  ('d0000000-0000-4000-8000-000000000006', '+6281234567890', null, null, '90000000-0000-4000-8000-000000000003',
   'checkin', 'Hai Max, bagaimana perasaanmu malam ini?', 'pending', interval '0 seconds'),
  ('d0000000-0000-4000-8000-000000000007', '+6281234567890', null, null, '90000000-0000-4000-8000-000000000002',
   'pengingat', 'Kamu belum mengisi check-in kemarin. Yuk luangkan 1 menit.', 'sent', interval '-20 hours')
) v(id, phone, contact_id, alert_id, check_in_id, type, message, status, created)
join user_account u on u.phone_number = v.phone
on conflict (id) do nothing;
