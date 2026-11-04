$body = @{ email = "seenuvazzan046@gmail.com" } | ConvertTo-Json
try {
    $res = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/forgot-password" -Method Post -ContentType "application/json" -Body $body
    Write-Host "SUCCESS:" ($res | ConvertTo-Json)
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "HTTP Status: $statusCode"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $respBody = $reader.ReadToEnd()
    Write-Host "Response Body: $respBody"
}
