Write-Host "Fixing npm installation issues..." -ForegroundColor Green
Write-Host ""

Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Removing node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Installation complete! You can now run:" -ForegroundColor Green
Write-Host "npm run dev" -ForegroundColor Cyan