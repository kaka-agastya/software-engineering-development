#!/usr/bin/env bash
# Setup project setelah clone (macOS / Linux)
set -e

if ! command -v bun >/dev/null 2>&1; then
  echo "Bun belum terinstal. Install dulu:"
  echo "  curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

echo "==> Install dependency"
bun install --frozen-lockfile

if [ ! -f .env.local ]; then
  echo "==> Membuat .env.local dari .env.example"
  cp .env.example .env.local
fi

echo ""
echo "Setup selesai. Jalankan: bun dev"
