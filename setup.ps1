$ErrorActionPreference = 'Stop'

Write-Host 'Book Detail - MongoDB setup' -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw 'Node.js is not installed. Install Node.js LTS first.'
}

if (-not (Test-Path '.env')) {
  Copy-Item '.env.example' '.env'
  Write-Host 'Created .env. Open it and replace <db_password> with your real MongoDB password.' -ForegroundColor Yellow
}

npm install
Write-Host ''
Write-Host 'Setup complete.' -ForegroundColor Green
Write-Host 'Run: npm run dev' -ForegroundColor White
Write-Host 'Then open: http://localhost:5000' -ForegroundColor White
