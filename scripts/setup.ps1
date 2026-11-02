# Setup project setelah clone (Windows PowerShell)
$ErrorActionPreference = "Stop"

if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
  Write-Host "Bun belum terinstal. Install dulu:" -ForegroundColor Red
  Write-Host '  powershell -c "irm bun.sh/install.ps1 | iex"'
  exit 1
}

Write-Host "==> Install dependency" -ForegroundColor Cyan
bun install --frozen-lockfile

if (-not (Test-Path ".env.local")) {
  Write-Host "==> Membuat .env.local dari .env.example" -ForegroundColor Cyan
  Copy-Item ".env.example" ".env.local"
}

Write-Host ""
Write-Host "Setup selesai. Jalankan: bun dev" -ForegroundColor Green
