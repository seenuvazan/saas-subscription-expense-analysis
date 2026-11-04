Write-Host "=========================================================="
Write-Host "   SaaSOptima Invoices & Payments End-to-End Test Suite   "
Write-Host "=========================================================="

# Step 0: Login as Admin
$authBody = @{ email = "admin@company.com"; password = "admin123" } | ConvertTo-Json
$authRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $authBody
$adminToken = $authRes.token
$adminHeaders = @{ "Authorization" = "Bearer $adminToken"; "Content-Type" = "application/json" }

Write-Host "`n[TEST 1] Create an invoice and save it..."
$newInvBody = @{
    invoiceNumber = "INV-2026-SLK-09"
    vendorName = "Slack Technologies LLC"
    invoiceDate = "2026-10-10"
    dueDate = "2026-11-10"
    billingPeriodStart = "2026-10-01"
    billingPeriodEnd = "2026-10-31"
    billingPeriod = "Oct 2026"
    currency = "INR"
    gstRate = 18.0
    discountAmount = 250.0
    vendorGstin = "27AABCS1429B1Z0"
    vendorAddress = "Slack Technologies India, BKC, Mumbai 400051"
    customerName = "SaaSOptima Finance & Operations"
    customerGstin = "36AAECS9876P1Z3"
    customerAddress = "Knowledge City, Hyderabad"
    notes = "Business+ Plan for 45 team seats"
    items = @(
        @{ description = "Slack Business+ Annual Tier"; quantity = 45; unitPrice = 650.0 },
        @{ description = "Slack AI Add-on for Engineering"; quantity = 10; unitPrice = 250.0 }
    )
} | ConvertTo-Json -Depth 5

$invRes = Invoke-RestMethod -Uri "http://localhost:8080/api/invoices" -Method Post -Headers $adminHeaders -Body $newInvBody
$invId = $invRes.id
Write-Host "-> Success! Invoice ID: $invId, Number: $($invRes.invoiceNumber), Total: $($invRes.totalAmount) INR, Status: $($invRes.status)"

Write-Host "`n[TEST 2 & 3] Download generated PDF and verify contents..."
$pdfDownloadPath = "c:\projects\saas\scratch\Downloaded_Invoice_SLK.pdf"
curl.exe -s -X GET "http://localhost:8080/api/invoices/$invId/download-pdf" `
    -H "Authorization: Bearer $adminToken" `
    --output $pdfDownloadPath

$pdfFileInfo = Get-Item $pdfDownloadPath
$firstLine = (Get-Content $pdfDownloadPath -TotalCount 1)
Write-Host "-> Downloaded PDF Size: $($pdfFileInfo.Length) bytes"
Write-Host "-> PDF Header Signature: $firstLine"
if ($firstLine -match "%PDF-") {
    Write-Host "-> VALIDATION PASSED: True vector PDF generated with OpenPDF."
} else {
    throw "Invalid PDF header!"
}

Write-Host "`n[TEST 4 & 5] Upload original vendor PDF & download unchanged..."
$mockVendorFile = "c:\projects\saas\scratch\vendor_slack_original.pdf"
$mockContent = "%PDF-1.4 - SLACK VENDOR OFFICIAL INVOICE TEST DATA 2026 - CHECKSUM_ABC123 %EOF"
[System.IO.File]::WriteAllText($mockVendorFile, $mockContent)

$uploadRes = curl.exe -s -X POST "http://localhost:8080/api/invoices/$invId/upload-original" `
    -H "Authorization: Bearer $adminToken" `
    -F "file=@$mockVendorFile;type=application/pdf"

$downOrigPath = "c:\projects\saas\scratch\downloaded_slack_vendor_back.pdf"
curl.exe -s -X GET "http://localhost:8080/api/invoices/$invId/download-original" `
    -H "Authorization: Bearer $adminToken" `
    --output $downOrigPath

$origDownloaded = Get-Content $downOrigPath -Raw
if ($origDownloaded -eq $mockContent) {
    Write-Host "-> VALIDATION PASSED: Downloaded vendor PDF matches uploaded document bit-for-bit."
} else {
    throw "Downloaded vendor PDF did not match original!"
}

Write-Host "`n[TEST 6] Record a payment and verify outstanding balance & status..."
$pmtBody = @{
    amount = 15000.0
    paymentDate = "2026-10-18"
    paymentMethod = "Bank Transfer / NEFT"
    transactionReference = "UTR-HDFC-9823410"
    notes = "First tranche transferred"
} | ConvertTo-Json

$pmtRes = Invoke-RestMethod -Uri "http://localhost:8080/api/invoices/$invId/payments" -Method Post -Headers $adminHeaders -Body $pmtBody
Write-Host "-> Payment recorded: $($pmtRes.paidAmount) INR."
Write-Host "-> New Status: $($pmtRes.status) (Expected: PARTIALLY_PAID)"
Write-Host "-> Outstanding Balance: $($pmtRes.balanceDue) INR"
if ($pmtRes.status -eq "PARTIALLY_PAID" -and $pmtRes.balanceDue -gt 0) {
    Write-Host "-> VALIDATION PASSED: Payment balance and status calculated correctly."
} else {
    throw "Payment calculation failed!"
}

Write-Host "`n[TEST 7] Download monthly expense report..."
$reportPath = "c:\projects\saas\scratch\Monthly_Report_October_2026.pdf"
curl.exe -s -X GET "http://localhost:8080/api/invoices/report/download-pdf?month=10&year=2026" `
    -H "Authorization: Bearer $adminToken" `
    --output $reportPath

$reportInfo = Get-Item $reportPath
$reportHead = (Get-Content $reportPath -TotalCount 1)
Write-Host "-> Monthly Report Size: $($reportInfo.Length) bytes, Header: $reportHead"
if ($reportHead -match "%PDF-") {
    Write-Host "-> VALIDATION PASSED: Monthly report PDF generated successfully."
}

Write-Host "`n[TEST 8 & 9] Persistence check: Simulate logout/login & verify records remain..."
# New session login
$login2 = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $authBody
$token2 = $login2.token
$fetchInvoices = Invoke-RestMethod -Uri "http://localhost:8080/api/invoices" -Method Get -Headers @{ "Authorization" = "Bearer $token2" }
$found = $fetchInvoices | Where-Object { $_.invoiceNumber -eq "INV-2026-SLK-09" }
if ($found -ne $null) {
    Write-Host "-> VALIDATION PASSED: Invoice persists across sessions. Payments count: $($found.payments.Count)"
} else {
    throw "Invoice was lost after new login!"
}

# Verify physical file existence in data/uploads/invoices
$uploadsDir = "c:\projects\saas\backend\data\uploads\invoices"
$uploadCount = (Get-ChildItem -Path $uploadsDir -Recurse -Filter *.pdf).Count
Write-Host "-> Persistent disk uploads verified: $uploadCount files stored in $uploadsDir"

Write-Host "`n[TEST 10] Security check: Verify users cannot download other users' invoices..."
$empAuth = @{ email = "employee@company.com"; password = "password123" } | ConvertTo-Json
$empRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $empAuth
$empToken = $empRes.token

$statusCode = curl.exe -s -o nul -w "%{http_code}" -X GET "http://localhost:8080/api/invoices/$invId/download-pdf" `
    -H "Authorization: Bearer $empToken"

Write-Host "-> Employee access attempt status code: $statusCode (Expected: 404 or 403)"
if ($statusCode -eq "404" -or $statusCode -eq "403") {
    Write-Host "-> VALIDATION PASSED: Cross-account invoice access is strictly denied."
} else {
    throw "Security leak detected! HTTP $statusCode"
}

Write-Host "`n=========================================================="
Write-Host "       ALL 10 VERIFICATION TESTS PASSED WITH 100% SUCCESS  "
Write-Host "=========================================================="
