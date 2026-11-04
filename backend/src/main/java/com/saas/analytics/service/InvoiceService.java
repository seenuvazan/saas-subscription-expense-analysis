package com.saas.analytics.service;

import com.saas.analytics.dto.*;
import com.saas.analytics.entity.*;
import com.saas.analytics.exception.ResourceNotFoundException;
import com.saas.analytics.model.InvoiceStatus;
import com.saas.analytics.repository.InvoicePaymentRepository;
import com.saas.analytics.repository.InvoiceRepository;
import com.saas.analytics.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoicePaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final FileStorageService fileStorageService;
    private final PdfInvoiceGeneratorService pdfGeneratorService;

    @Transactional(readOnly = true)
    public List<InvoiceDTO> getAllInvoices(User user, InvoiceStatus status, String search) {
        List<Invoice> invoices;
        if (status != null || (search != null && !search.isBlank())) {
            invoices = invoiceRepository.searchInvoices(user, status, (search != null && !search.isBlank()) ? search.trim() : null);
        } else {
            invoices = invoiceRepository.findByUserOrderByInvoiceDateDesc(user);
        }
        return invoices.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InvoiceDTO getInvoiceById(Long id, User user) {
        Invoice invoice = findUserInvoice(id, user);
        return mapToDTO(invoice);
    }

    @Transactional(readOnly = true)
    public InvoiceSummaryDTO getInvoiceSummary(User user) {
        List<Invoice> invoices = invoiceRepository.findByUserOrderByInvoiceDateDesc(user);

        BigDecimal total = BigDecimal.ZERO;
        BigDecimal paid = BigDecimal.ZERO;
        BigDecimal pending = BigDecimal.ZERO;
        BigDecimal overdue = BigDecimal.ZERO;

        long paidCount = 0;
        long pendingCount = 0;
        long overdueCount = 0;
        long partialCount = 0;

        for (Invoice inv : invoices) {
            total = total.add(inv.getTotalAmount());
            paid = paid.add(inv.getPaidAmount());

            if (inv.getStatus() == InvoiceStatus.PAID) {
                paidCount++;
            } else if (inv.getStatus() == InvoiceStatus.OVERDUE) {
                overdueCount++;
                overdue = overdue.add(inv.getBalanceDue());
            } else if (inv.getStatus() == InvoiceStatus.PARTIALLY_PAID) {
                partialCount++;
                pending = pending.add(inv.getBalanceDue());
            } else {
                pendingCount++;
                pending = pending.add(inv.getBalanceDue());
            }
        }

        return InvoiceSummaryDTO.builder()
                .totalInvoiceAmount(total.setScale(2, RoundingMode.HALF_UP))
                .paidAmount(paid.setScale(2, RoundingMode.HALF_UP))
                .pendingAmount(pending.setScale(2, RoundingMode.HALF_UP))
                .overdueAmount(overdue.setScale(2, RoundingMode.HALF_UP))
                .totalCount(invoices.size())
                .paidCount(paidCount)
                .pendingCount(pendingCount)
                .overdueCount(overdueCount)
                .partiallyPaidCount(partialCount)
                .primaryCurrency("INR")
                .build();
    }

    @Transactional
    public InvoiceDTO createInvoice(InvoiceCreateRequest request, MultipartFile vendorPdf, User user) {
        String cleanInvoiceNum = request.getInvoiceNumber().trim();

        // Prevent accidental duplicate invoice numbers per user
        if (invoiceRepository.existsByInvoiceNumberAndUser(cleanInvoiceNum, user)) {
            throw new IllegalArgumentException("Invoice with number '" + cleanInvoiceNum + "' already exists in your account.");
        }

        Subscription sub = null;
        if (request.getSubscriptionId() != null) {
            sub = subscriptionRepository.findById(request.getSubscriptionId()).orElse(null);
        }

        Invoice invoice = Invoice.builder()
                .invoiceNumber(cleanInvoiceNum)
                .vendorName(request.getVendorName().trim())
                .subscription(sub)
                .invoiceDate(request.getInvoiceDate())
                .dueDate(request.getDueDate())
                .billingPeriodStart(request.getBillingPeriodStart())
                .billingPeriodEnd(request.getBillingPeriodEnd())
                .billingPeriod(request.getBillingPeriod())
                .currency(request.getCurrency() != null ? request.getCurrency().trim().toUpperCase() : "INR")
                .gstRate(request.getGstRate() != null ? request.getGstRate() : BigDecimal.valueOf(18.00))
                .discountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO)
                .vendorAddress(request.getVendorAddress())
                .vendorGstin(request.getVendorGstin())
                .customerName(request.getCustomerName() != null ? request.getCustomerName() : user.getFullName())
                .customerGstin(request.getCustomerGstin())
                .customerAddress(request.getCustomerAddress())
                .notes(request.getNotes())
                .user(user)
                .items(new ArrayList<>())
                .payments(new ArrayList<>())
                .build();

        // Add line items
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (InvoiceItemDTO itemDto : request.getItems()) {
                if (itemDto.getDescription() == null || itemDto.getDescription().isBlank()) continue;
                int qty = itemDto.getQuantity() != null && itemDto.getQuantity() > 0 ? itemDto.getQuantity() : 1;
                BigDecimal price = itemDto.getUnitPrice() != null ? itemDto.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);

                InvoiceItem item = InvoiceItem.builder()
                        .invoice(invoice)
                        .description(itemDto.getDescription().trim())
                        .quantity(qty)
                        .unitPrice(price)
                        .totalPrice(lineTotal)
                        .build();
                invoice.getItems().add(item);
            }
        } else {
            // Default item from vendor/sub
            BigDecimal defaultPrice = (sub != null && sub.getCost() != null) ? sub.getCost() : BigDecimal.ZERO;
            InvoiceItem item = InvoiceItem.builder()
                    .invoice(invoice)
                    .description(request.getVendorName().trim() + " Subscription Service")
                    .quantity(1)
                    .unitPrice(defaultPrice)
                    .totalPrice(defaultPrice)
                    .build();
            invoice.getItems().add(item);
        }

        invoice.recalculateTotals();

        // Handle uploaded original vendor PDF
        if (vendorPdf != null && !vendorPdf.isEmpty()) {
            try {
                String path = fileStorageService.storeVendorPdf(user.getId(), vendorPdf);
                invoice.setOriginalPdfPath(path);
                invoice.setOriginalPdfFilename(vendorPdf.getOriginalFilename());
                invoice.setOriginalPdfContentType(vendorPdf.getContentType());
            } catch (IOException e) {
                log.error("Failed to store original vendor PDF: {}", e.getMessage());
                throw new RuntimeException("Could not upload vendor PDF: " + e.getMessage());
            }
        }

        Invoice saved = invoiceRepository.save(invoice);
        log.info("Created invoice {} for user {}", saved.getInvoiceNumber(), user.getEmail());
        return mapToDTO(saved);
    }

    @Transactional
    public InvoiceDTO updateInvoice(Long id, InvoiceCreateRequest request, User user) {
        Invoice invoice = findUserInvoice(id, user);

        String cleanInvoiceNum = request.getInvoiceNumber().trim();
        if (invoiceRepository.existsByInvoiceNumberAndUserAndIdNot(cleanInvoiceNum, user, id)) {
            throw new IllegalArgumentException("Another invoice with number '" + cleanInvoiceNum + "' already exists.");
        }

        invoice.setInvoiceNumber(cleanInvoiceNum);
        invoice.setVendorName(request.getVendorName().trim());
        if (request.getSubscriptionId() != null) {
            Subscription sub = subscriptionRepository.findById(request.getSubscriptionId()).orElse(null);
            invoice.setSubscription(sub);
        } else {
            invoice.setSubscription(null);
        }

        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setBillingPeriodStart(request.getBillingPeriodStart());
        invoice.setBillingPeriodEnd(request.getBillingPeriodEnd());
        invoice.setBillingPeriod(request.getBillingPeriod());
        if (request.getCurrency() != null) {
            invoice.setCurrency(request.getCurrency().trim().toUpperCase());
        }
        if (request.getGstRate() != null) {
            invoice.setGstRate(request.getGstRate());
        }
        if (request.getDiscountAmount() != null) {
            invoice.setDiscountAmount(request.getDiscountAmount());
        }
        invoice.setVendorAddress(request.getVendorAddress());
        invoice.setVendorGstin(request.getVendorGstin());
        invoice.setCustomerName(request.getCustomerName());
        invoice.setCustomerGstin(request.getCustomerGstin());
        invoice.setCustomerAddress(request.getCustomerAddress());
        invoice.setNotes(request.getNotes());

        // Update items
        invoice.getItems().clear();
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (InvoiceItemDTO itemDto : request.getItems()) {
                if (itemDto.getDescription() == null || itemDto.getDescription().isBlank()) continue;
                int qty = itemDto.getQuantity() != null && itemDto.getQuantity() > 0 ? itemDto.getQuantity() : 1;
                BigDecimal price = itemDto.getUnitPrice() != null ? itemDto.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);

                InvoiceItem item = InvoiceItem.builder()
                        .invoice(invoice)
                        .description(itemDto.getDescription().trim())
                        .quantity(qty)
                        .unitPrice(price)
                        .totalPrice(lineTotal)
                        .build();
                invoice.getItems().add(item);
            }
        }

        invoice.recalculateTotals();
        Invoice saved = invoiceRepository.save(invoice);
        return mapToDTO(saved);
    }

    @Transactional
    public void deleteInvoice(Long id, User user) {
        Invoice invoice = findUserInvoice(id, user);
        if (invoice.getOriginalPdfPath() != null) {
            fileStorageService.deleteFile(invoice.getOriginalPdfPath());
        }
        invoiceRepository.delete(invoice);
        log.info("Deleted invoice ID {} for user {}", id, user.getEmail());
    }

    @Transactional
    public InvoiceDTO recordPayment(Long id, RecordPaymentRequest request, User user) {
        Invoice invoice = findUserInvoice(id, user);

        if (invoice.getBalanceDue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("This invoice has already been fully paid.");
        }

        if (request.getAmount().compareTo(invoice.getBalanceDue()) > 0) {
            throw new IllegalArgumentException("Payment amount (" + request.getAmount() + ") cannot exceed outstanding balance (" + invoice.getBalanceDue() + ").");
        }

        InvoicePayment payment = InvoicePayment.builder()
                .invoice(invoice)
                .paymentDate(request.getPaymentDate())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .transactionReference(request.getTransactionReference())
                .notes(request.getNotes())
                .recordedBy(user)
                .build();

        invoice.getPayments().add(payment);
        invoice.setPaidAmount(invoice.getPaidAmount().add(request.getAmount()));
        if (request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank()) {
            invoice.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getTransactionReference() != null && !request.getTransactionReference().isBlank()) {
            invoice.setPaymentReference(request.getTransactionReference());
        }

        invoice.recalculateTotals();
        Invoice saved = invoiceRepository.save(invoice);
        log.info("Recorded payment of {} on invoice {} for user {}", request.getAmount(), invoice.getInvoiceNumber(), user.getEmail());
        return mapToDTO(saved);
    }

    @Transactional
    public InvoiceDTO uploadOriginalVendorPdf(Long id, MultipartFile file, User user) {
        Invoice invoice = findUserInvoice(id, user);

        try {
            // Remove previous file if exists
            if (invoice.getOriginalPdfPath() != null) {
                fileStorageService.deleteFile(invoice.getOriginalPdfPath());
            }

            String path = fileStorageService.storeVendorPdf(user.getId(), file);
            invoice.setOriginalPdfPath(path);
            invoice.setOriginalPdfFilename(file.getOriginalFilename());
            invoice.setOriginalPdfContentType(file.getContentType());

            Invoice saved = invoiceRepository.save(invoice);
            log.info("Uploaded vendor PDF for invoice {}", invoice.getInvoiceNumber());
            return mapToDTO(saved);
        } catch (IOException e) {
            log.error("Failed to upload vendor PDF: {}", e.getMessage());
            throw new RuntimeException("Could not upload vendor PDF: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public byte[] generateInvoicePdf(Long id, User user) {
        Invoice invoice = findUserInvoice(id, user);
        return pdfGeneratorService.generateInvoicePdf(invoice);
    }

    @Transactional(readOnly = true)
    public Resource getOriginalVendorPdfResource(Long id, User user) {
        Invoice invoice = findUserInvoice(id, user);
        if (invoice.getOriginalPdfPath() == null || invoice.getOriginalPdfPath().isBlank()) {
            throw new ResourceNotFoundException("No original vendor PDF was uploaded for this invoice.");
        }
        return fileStorageService.loadAsResource(invoice.getOriginalPdfPath());
    }

    @Transactional(readOnly = true)
    public byte[] generateMonthlyReport(int month, int year, User user) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Invoice> invoices = invoiceRepository.findByUserAndDateRange(user, start, end);
        return pdfGeneratorService.generateMonthlyExpenseReport(user, month, year, invoices);
    }

    public Invoice findUserInvoice(Long id, User user) {
        return invoiceRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
    }

    private InvoiceDTO mapToDTO(Invoice inv) {
        List<InvoiceItemDTO> items = inv.getItems() != null
                ? inv.getItems().stream().map(i -> InvoiceItemDTO.builder()
                .id(i.getId())
                .description(i.getDescription())
                .quantity(i.getQuantity())
                .unitPrice(i.getUnitPrice())
                .totalPrice(i.getTotalPrice())
                .build()).collect(Collectors.toList())
                : List.of();

        List<InvoicePaymentDTO> payments = inv.getPayments() != null
                ? inv.getPayments().stream().map(p -> InvoicePaymentDTO.builder()
                .id(p.getId())
                .paymentDate(p.getPaymentDate())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod())
                .transactionReference(p.getTransactionReference())
                .notes(p.getNotes())
                .recordedByName(p.getRecordedBy() != null ? p.getRecordedBy().getFullName() : null)
                .createdAt(p.getCreatedAt())
                .build()).collect(Collectors.toList())
                : List.of();

        return InvoiceDTO.builder()
                .id(inv.getId())
                .invoiceNumber(inv.getInvoiceNumber())
                .vendorName(inv.getVendorName())
                .subscriptionId(inv.getSubscription() != null ? inv.getSubscription().getId() : null)
                .subscriptionVendorName(inv.getSubscription() != null ? inv.getSubscription().getVendorName() : null)
                .invoiceDate(inv.getInvoiceDate())
                .dueDate(inv.getDueDate())
                .billingPeriodStart(inv.getBillingPeriodStart())
                .billingPeriodEnd(inv.getBillingPeriodEnd())
                .billingPeriod(inv.getBillingPeriod())
                .currency(inv.getCurrency())
                .subtotal(inv.getSubtotal())
                .gstRate(inv.getGstRate())
                .gstAmount(inv.getGstAmount())
                .discountAmount(inv.getDiscountAmount())
                .totalAmount(inv.getTotalAmount())
                .paidAmount(inv.getPaidAmount())
                .balanceDue(inv.getBalanceDue())
                .status(inv.getStatus())
                .paymentMethod(inv.getPaymentMethod())
                .paymentReference(inv.getPaymentReference())
                .vendorAddress(inv.getVendorAddress())
                .vendorGstin(inv.getVendorGstin())
                .customerName(inv.getCustomerName())
                .customerGstin(inv.getCustomerGstin())
                .customerAddress(inv.getCustomerAddress())
                .notes(inv.getNotes())
                .hasOriginalPdf(inv.getOriginalPdfPath() != null && !inv.getOriginalPdfPath().isBlank())
                .originalPdfFilename(inv.getOriginalPdfFilename())
                .items(items)
                .payments(payments)
                .createdAt(inv.getCreatedAt())
                .updatedAt(inv.getUpdatedAt())
                .build();
    }
}
