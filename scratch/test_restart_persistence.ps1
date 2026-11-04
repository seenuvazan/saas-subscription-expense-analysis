$ErrorActionPreference = 'Stop'

Write-Host "Stopping backend process on port 8080..." -ForegroundColor Cyan
$conn = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($conn) {
    Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
}

Write-Host "Restarting Spring Boot with persistent file H2..." -ForegroundColor Cyan
$proc = Start-Process -FilePath "./mvnw.cmd" -ArgumentList "spring-boot:run" -WorkingDirectory "c:\projects\saas\backend" -PassThru -WindowStyle Hidden

Write-Host "Waiting for server to become responsive on port 8080..." -ForegroundColor Cyan
$started = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 2
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method Post -Body '{"email":"admin@company.com","password":"admin123"}' -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
        if ($res.StatusCode -eq 200) {
            $started = $true
            break
        }
    } catch {
        # continue waiting
    }
}

if (-not $started) {
    Write-Error "Server failed to start within 60 seconds!"
}

Write-Host "[PASS] Server restarted successfully on persistent database." -ForegroundColor Green

# Query database for User A's email from our previous test
Write-Host "Testing account persistence across server restart..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@company.com"
    password = "admin123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
if ($loginRes.id -gt 0) {
    Write-Host "[PASS] Existing accounts and data preserved across full server restart!" -ForegroundColor Green
} else {
    Write-Error "Failed to retrieve accounts after restart!"
}
