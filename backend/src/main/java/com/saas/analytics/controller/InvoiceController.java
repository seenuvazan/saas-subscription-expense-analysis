package com.saas.analytics.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saas.analytics.dto.*;
import com.saas.analytics.entity.Invoice;
import com.saas.analytics.entity.User;
import com.saas.analytics.model.InvoiceStatus;
import com.saas.analytics.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getInvoices(
            @RequestParam(required = false) InvoiceStatus status,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        return ResponseEntity.ok(invoiceService.getAllInvoices(loggedInUser, status, search));
    }

    @GetMapping("/summary")
    public ResponseEntity<InvoiceSummaryDTO> getInvoiceSummary(
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        return ResponseEntity.ok(invoiceService.getInvoiceSummary(loggedInUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDTO> getInvoiceById(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id, loggedInUser));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InvoiceDTO> createInvoiceJson(
            @Valid @RequestBody InvoiceCreateRequest request,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        InvoiceDTO created = invoiceService.createInvoice(request, null, loggedInUser);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<InvoiceDTO> createInvoiceMultipart(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) throws Exception {
        InvoiceCreateRequest request = objectMapper.readValue(dataJson, InvoiceCreateRequest.class);
        InvoiceDTO created = invoiceService.createInvoice(request, file, loggedInUser);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceDTO> updateInvoice(
            @PathVariable Long id,
            @Valid @RequestBody InvoiceCreateRequest request,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        return ResponseEntity.ok(invoiceService.updateInvoice(id, request, loggedInUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteInvoice(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        invoiceService.deleteInvoice(id, loggedInUser);
        return ResponseEntity.ok(Map.of("success", true, "message", "Invoice deleted successfully."));
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<InvoiceDTO> recordPayment(
            @PathVariable Long id,
            @Valid @RequestBody RecordPaymentRequest request,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        return ResponseEntity.ok(invoiceService.recordPayment(id, request, loggedInUser));
    }

    @PostMapping("/{id}/upload-original")
    public ResponseEntity<InvoiceDTO> uploadOriginalPdf(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        return ResponseEntity.ok(invoiceService.uploadOriginalVendorPdf(id, file, loggedInUser));
    }

    @GetMapping("/{id}/download-pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        InvoiceDTO invoice = invoiceService.getInvoiceById(id, loggedInUser);
        byte[] pdfBytes = invoiceService.generateInvoicePdf(id, loggedInUser);

        String safeNumber = invoice.getInvoiceNumber().replaceAll("[^a-zA-Z0-9.-]", "_");
        String filename = "Invoice_" + safeNumber + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(pdfBytes);
    }

    @GetMapping("/{id}/download-original")
    public ResponseEntity<Resource> downloadOriginalVendorPdf(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        InvoiceDTO invoice = invoiceService.getInvoiceById(id, loggedInUser);
        Resource resource = invoiceService.getOriginalVendorPdfResource(id, loggedInUser);

        String filename = (invoice.getOriginalPdfFilename() != null && !invoice.getOriginalPdfFilename().isBlank())
                ? invoice.getOriginalPdfFilename()
                : "Vendor_Invoice_" + invoice.getInvoiceNumber() + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(resource);
    }

    @GetMapping("/report/download-pdf")
    public ResponseEntity<byte[]> downloadMonthlyExpenseReport(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : #this") User loggedInUser) {
        int m = (month != null && month >= 1 && month <= 12) ? month : LocalDate.now().getMonthValue();
        int y = (year != null && year >= 2000 && year <= 2100) ? year : LocalDate.now().getYear();

        byte[] pdfBytes = invoiceService.generateMonthlyReport(m, y, loggedInUser);
        String filename = "SaaSOptima_Expense_Report_" + m + "_" + y + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(pdfBytes);
    }
}
