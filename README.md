# pppl

Project Next.js yang memakai **Bun** sebagai package manager.

## Yang perlu diinstal dulu

1. [Git](https://git-scm.com/downloads)
2. [Node.js LTS](https://nodejs.org)
3. [Bun](https://bun.sh)
   - Windows (PowerShell): `powershell -c "irm bun.sh/install.ps1 | iex"`
   - macOS / Linux: `curl -fsSL https://bun.sh/install | bash`

Tutup lalu buka lagi terminal setelah instalasi, kemudian cek:

```bash
git --version
node -v
bun -v
```

## Cara menjalankan project

```bash
# 1. Clone repo
git clone https://github.com/USERNAME/pppl.git
cd pppl

# 2. Jalankan script setup
#    Windows (PowerShell):
.\scripts\setup.ps1
#    macOS / Linux:
bash scripts/setup.sh

# 3. Isi file .env.local kalau ada nilai yang perlu diisi (tanya ke owner project)

# 4. Jalankan
bun dev
```

Buka http://localhost:3000

## Perintah yang sering dipakai

| Perintah            | Fungsi                                  |
| ------------------- | --------------------------------------- |
| `bun dev`           | Menjalankan server development          |
| `bun run build`     | Build untuk production                  |
| `bun start`         | Menjalankan hasil build                 |
| `bun run lint`      | Cek kode dengan ESLint                  |
| `bun add nama-pkg`  | Menambah package                        |
| `bun remove nama-pkg` | Menghapus package                     |

## Aturan tim

- Selalu pakai **bun**, jangan `npm install` / `yarn` / `pnpm`. Kalau tercampur, akan muncul lockfile lain dan versi package bisa beda.
- Setelah `git pull`, jalankan `bun install` kalau ada perubahan di `package.json` atau `bun.lock`.
- Jangan commit file `.env.local` (berisi rahasia). Kalau menambah variabel baru, tambahkan juga namanya ke `.env.example`.
