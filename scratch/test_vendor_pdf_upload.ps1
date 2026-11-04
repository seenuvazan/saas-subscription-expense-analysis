$authBody = @{ email = "admin@company.com"; password = "admin123" } | ConvertTo-Json
$authRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $authBody
$token = $authRes.token

# Create mock vendor PDF content
$samplePdfPath = "c:\projects\saas\scratch\sample_vendor_aws.pdf"
$mockPdfText = "%PDF-1.4`n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj`n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj`n3 0 obj<</Type/Page/MediaBox[0 0 595 842]>>endobj`nxref`n0 4`ntrailer<</Root 1 0 R>>`nstartxref`n150`n%%EOF"
[System.IO.File]::WriteAllText($samplePdfPath, $mockPdfText)

# Get invoice id
$headers = @{ "Authorization" = "Bearer $token" }
$invoices = Invoke-RestMethod -Uri "http://localhost:8080/api/invoices" -Method Get -Headers $headers
$invId = $invoices[0].id

# Upload multipart using curl.exe
$uploadOut = curl.exe -s -X POST "http://localhost:8080/api/invoices/$invId/upload-original" `
    -H "Authorization: Bearer $token" `
    -F "file=@$samplePdfPath;type=application/pdf"

Write-Host "Uploaded original vendor PDF response: $uploadOut"

# Verify download original
$downloadDest = "c:\projects\saas\scratch\downloaded_original_aws.pdf"
curl.exe -s -X GET "http://localhost:8080/api/invoices/$invId/download-original" `
    -H "Authorization: Bearer $token" `
    --output $downloadDest

$downSize = (Get-Item $downloadDest).Length
Write-Host "Downloaded original vendor PDF size: $downSize bytes."
if ($downSize -gt 0) {
    Write-Host "ORIGINAL VENDOR PDF UPLOAD & DOWNLOAD TEST PASSED!"
}
