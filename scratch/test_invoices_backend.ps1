$authBody = @{ email = "admin@company.com"; password = "admin123" } | ConvertTo-Json
$authRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $authBody
$token = $authRes.token
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

Write-Host "1. Admin logged in successfully."

# Create invoice
$invBody = @{
    invoiceNumber = "INV-2026-001"
    vendorName = "Amazon Web Services"
    invoiceDate = "2026-10-15"
    dueDate = "2026-11-15"
    billingPeriodStart = "2026-10-01"
    billingPeriodEnd = "2026-10-31"
    billingPeriod = "01 Oct 2026 - 31 Oct 2026"
    currency = "INR"
    gstRate = 18.0
    discountAmount = 500.0
    vendorGstin = "29AABCU9603R1ZM"
    vendorAddress = "AWS Cloud Services India Pvt Ltd, Mumbai, Maharashtra"
    customerName = "SaaSOptima Enterprise"
    customerGstin = "33AAECS1234F1Z5"
    customerAddress = "T-Hub, HITEC City, Hyderabad, Telangana"
    notes = "Monthly cloud infrastructure and bandwidth costs"
    items = @(
        @{ description = "Amazon EC2 Elastic Compute Instances"; quantity = 2; unitPrice = 5000.0 },
        @{ description = "Amazon S3 Standard Storage & Data Transfer"; quantity = 1; unitPrice = 2500.0 }
    )
} | ConvertTo-Json -Depth 5

$createdInv = Invoke-RestMethod -Uri "http://localhost:8080/api/invoices" -Method Post -Headers $headers -Body $invBody
Write-Host "2. Invoice Created:" $createdInv.invoiceNumber "Total:" $createdInv.totalAmount "Status:" $createdInv.status

# Check summary
$summary = Invoke-RestMethod -Uri "http://localhost:8080/api/invoices/summary" -Method Get -Headers $headers
Write-Host "3. Summary: Total:" $summary.totalInvoiceAmount "Paid:" $summary.paidAmount "Pending:" $summary.pendingAmount

# Test PDF Download
$pdfHeaders = @{ "Authorization" = "Bearer $token" }
$pdfBytes = Invoke-RestMethod -Uri "http://localhost:8080/api/invoices/$($createdInv.id)/download-pdf" -Method Get -Headers $pdfHeaders
$isPdf = ($pdfBytes.Length -gt 100)
Write-Host "4. Generated Invoice PDF Downloaded: Size =" $pdfBytes.Length "bytes. Valid PDF =" $isPdf

# Save PDF to disk to inspect
[System.IO.File]::WriteAllBytes("c:\projects\saas\scratch\Invoice_INV-2026-001.pdf", $pdfBytes)
Write-Host "5. Saved PDF to c:\projects\saas\scratch\Invoice_INV-2026-001.pdf"

# Record Payment
$pmtBody = @{
    amount = 5000.0
    paymentDate = "2026-10-20"
    paymentMethod = "Corporate Credit Card"
    transactionReference = "TXN-984210"
    notes = "Advance milestone payment"
} | ConvertTo-Json

$updatedInv = Invoke-RestMethod -Uri "http://localhost:8080/api/invoices/$($createdInv.id)/payments" -Method Post -Headers $headers -Body $pmtBody
Write-Host "6. Payment Recorded. New Status:" $updatedInv.status "Paid:" $updatedInv.paidAmount "Balance:" $updatedInv.balanceDue

# Test Monthly Expense Report PDF
$reportBytes = Invoke-RestMethod -Uri "http://localhost:8080/api/invoices/report/download-pdf?month=10&year=2026" -Method Get -Headers $pdfHeaders
Write-Host "7. Monthly Report PDF Downloaded: Size =" $reportBytes.Length "bytes."
[System.IO.File]::WriteAllBytes("c:\projects\saas\scratch\SaaSOptima_Expense_Report_10_2026.pdf", $reportBytes)

Write-Host "ALL INVOICE BACKEND TESTS COMPLETED SUCCESSFULLY!"
