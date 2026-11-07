# Setup Supabase

Panduan menyambungkan project ini ke database Supabase, dan cara menambah
halaman tabel baru. Contoh yang sudah jadi: [`/data-pengguna`](http://localhost:3000/data-pengguna).

## A. Di Supabase (sekali saja, oleh satu orang)

1. Buat project di [supabase.com](https://supabase.com) → **New project**.
2. Buka **SQL Editor** → **New query**, tempel seluruh isi [`schema.sql`](./schema.sql), lalu klik **Run**.
   File ini membuat **semua 14 tabel** dari class diagram sekaligus, jadi anggota tim
   lain tidak perlu menyentuh Supabase lagi. File ini aman dijalankan ulang karena
   tabel yang sudah ada dilewati dan data tidak dihapus.
3. Buka **Project Settings → API Keys**, lalu catat:
   - **Project URL**, contoh `https://abcdefgh.supabase.co`
   - **Secret key** (`sb_secret_...`). Di project lama namanya **service_role key**.

Bagikan kedua nilai itu ke anggota tim lewat jalur pribadi. **Jangan** ditulis di
`.env.example` dan **jangan** di-commit.

## B. Di laptop masing-masing

```bash
bun install                  # pasang package (supabase-js, zod, shadcn)
cp .env.example .env.local   # kalau .env.local belum ada
```

Isi `.env.local`:

```
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxx
```

Lalu jalankan `bun dev`. Kalau sudah berjalan, **restart**, karena `.env.local` hanya dibaca saat start.

## Cara cek berhasil

| Cek | Artinya |
| --- | --- |
| Buka http://localhost:3000/api/user-account → muncul JSON | API **mengambil** data berhasil |
| Buka http://localhost:3000/data-pengguna → tabel terisi | Halaman memanggil API dengan benar |
| Edit satu baris → Simpan → nilai di **Table Editor** Supabase ikut berubah | **Mengubah** data berhasil |
| Isi nomor `0812...` → muncul "Harus format E.164" | Validasi **zod** berjalan |

Di DevTools → **Network** (filter **Fetch/XHR**) akan terlihat:
- `GET user-account`: tab **Response** berisi JSON hasil query
- `PATCH <id>`: tab **Payload** berisi isian form, **Response** berisi `{ success: true }` atau pesan error

## Alur kode

```
Browser                                 Server Next.js                  Supabase
───────                                 ──────────────                  ────────
data-pengguna/page.tsx
  └─ user-table.tsx (tabel + dialog)
       └─ hooks/use-user-accounts.ts
            ├─ fetch GET  /api/user-account ──► api/user-account/route.ts ──► select
            │                    ◄──── JSON { data } ◄─────────────────────────┘
            └─ fetch PATCH /api/user-account/:id
                                 ──► api/user-account/[id]/route.ts
                                       ├─ zod safeParse  (gagal → 400 { fieldErrors })
                                       └─ update ───────────────────────────► update
                                 ◄──── JSON { success: true }
               lalu GET ulang supaya tabel menampilkan data terbaru
```

| File | Isi |
| --- | --- |
| `src/lib/db.ts` | Koneksi Supabase, hanya untuk server. **Dipakai bersama, jangan diduplikasi** |
| `src/lib/validations/user-account.ts` | Aturan zod + type data |
| `src/app/api/user-account/route.ts` | `GET`: ambil semua data |
| `src/app/api/user-account/[id]/route.ts` | `PATCH`: ubah satu data |
| `src/hooks/use-user-accounts.ts` | `fetch` ke API dari browser |
| `src/app/data-pengguna/page.tsx` | Halaman |
| `src/app/data-pengguna/user-table.tsx` | Tabel + dialog edit (shadcn) |

## Menambah tabel baru

**Semua tabel sudah ada di Supabase** (lihat `schema.sql`), jadi yang dikerjakan
hanya kode di lokal. Nama kolom yang dipakai di kode harus sama persis dengan yang
ada di `schema.sql`.

Contoh untuk tabel `emergency_contact`. Paling mudah: salin file `user-account`, lalu ganti nama tabel dan kolomnya.

| # | File yang dibuat | Disalin dari |
| - | --- | --- |
| 1 | `src/lib/validations/emergency-contact.ts` | `validations/user-account.ts` |
| 2 | `src/app/api/emergency-contact/route.ts` | `api/user-account/route.ts` |
| 3 | `src/app/api/emergency-contact/[id]/route.ts` | `api/user-account/[id]/route.ts` |
| 4 | `src/hooks/use-emergency-contacts.ts` | `hooks/use-user-accounts.ts` |
| 5 | `src/app/data-kontak-darurat/page.tsx` | `data-pengguna/page.tsx` |
| 6 | `src/app/data-kontak-darurat/contact-table.tsx` | `data-pengguna/user-table.tsx` |

Tabel selain `user_account` masih kosong. Isi beberapa baris contoh lewat
**Table Editor** → pilih tabel → **Insert row**. Untuk kolom `user_id`, salin `id`
salah satu baris dari tabel `user_account`.

Yang perlu diganti di setiap salinan:
- nama tabel di `.from("user_account")`
- daftar kolom di `.select("...")`
- aturan di schema zod
- URL API di hook (`/api/user-account` → `/api/emergency-contact`)
- `RouteContext<"/api/user-account/[id]">` → `RouteContext<"/api/emergency-contact/[id]">`
- kolom tabel dan isian form di komponen tabel

## Kenapa lewat API di server, bukan langsung dari browser ke Supabase?

- **Secret key** punya akses penuh ke database, jadi harus tetap di server (`src/lib/db.ts`).
- Di `schema.sql`, **RLS aktif tanpa policy**, jadi akses dari browser langsung ke Supabase ditolak.
  Satu-satunya jalan ke data adalah lewat API kita.
- Validasi zod berjalan di server, jadi tidak bisa dilewati dari browser.

> ⚠️ Belum ada fitur login. Siapa pun yang tahu URL API bisa membaca dan mengubah data.
> Untuk demo tugas ini masih wajar, tapi jangan dipakai untuk data asli.

## Masalah umum

| Pesan / gejala | Solusi |
| --- | --- |
| `SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi` | Isi `.env.local`, lalu restart `bun dev` |
| `relation "..." does not exist` | `schema.sql` belum dijalankan di SQL Editor, atau nama tabel di `.from()` salah ketik |
| `column "..." does not exist` | Nama kolom di `.select()` atau di zod tidak sama dengan `schema.sql` |
| `Invalid API key` | Yang dipakai publishable/anon key. Ganti dengan **secret key** |
| `Cannot find name 'RouteContext'` di editor | Jalankan `bun dev` sekali. Tipe ini dibuat otomatis oleh Next.js |
| Tabel kosong | Jalankan ulang bagian `insert into` di `schema.sql` |
