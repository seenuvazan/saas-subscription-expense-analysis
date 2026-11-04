$body = @{
    from = 'SaaSOptima <onboarding@resend.dev>'
    to = @('test@example.com')
    subject = 'Verification Test'
    html = '<p>Test</p>'
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri 'https://api.resend.com/emails' -Method Post -Headers @{
        'Authorization' = 'Bearer re_test_mock_key_12345'
        'Content-Type' = 'application/json'
    } -Body $body
    Write-Host "Resend Success:" ($res | ConvertTo-Json)
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    Write-Host "Resend HTTP Status: $status"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $msg = $reader.ReadToEnd()
    Write-Host "Resend Response Body: $msg"
}
