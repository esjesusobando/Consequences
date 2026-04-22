# Try to connect to ProtonVPN
Write-Host "=== Attempting to connect to ProtonVPN ==="

$cliPath = @(
    "$env:LOCALAPPDATA\ProtonVPN\protonvpn-cli.exe",
    "$env:APPDATA\ProtonVPN\protonvpn-cli.exe",
    "C:\Program Files\ProtonVPN\protonvpn-cli.exe"
)

foreach ($path in $cliPath) {
    if (Test-Path $path) {
        Write-Host "Found CLI at: $path - Connecting..."
        & $path connect --fastest
        break
    }
}

Write-Host "`n=== Waiting 15 seconds ==="
Start-Sleep -Seconds 15

Write-Host "=== IP Check ==="
try {
    $ip = (Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing -TimeoutSec 15).Content
    Write-Host "Your IP: $ip"
    
    if ($ip -notmatch '^190\.') {
        Write-Host "SUCCESS! VPN is working!" -ForegroundColor Green
    } else {
        Write-Host "Still Peru IP - VPN not routing traffic" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error: $_"
}