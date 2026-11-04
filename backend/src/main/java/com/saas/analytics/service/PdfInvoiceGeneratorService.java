package com.saas.analytics.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.saas.analytics.entity.Invoice;
import com.saas.analytics.entity.InvoiceItem;
import com.saas.analytics.entity.InvoicePayment;
import com.saas.analytics.entity.User;
import com.saas.analytics.model.InvoiceStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@Service
@Slf4j
public class PdfInvoiceGeneratorService {

    // Brand Palette
    private static final Color BRAND_NAVY = new Color(17, 24, 39);       // #111827
    private static final Color BRAND_BLUE = new Color(37, 99, 235);      // #2563EB
    private static final Color TEXT_DARK = new Color(15, 23, 42);        // #0F172A
    private static final Color TEXT_MUTED = new Color(100, 116, 139);    // #64748B
    private static final Color BG_LIGHT = new Color(248, 250, 252);      // #F8FAFC
    private static final Color BORDER_COLOR = new Color(226, 232, 240);  // #E2E8F0

    // Status Colors
    private static final Color STATUS_PAID_BG = new Color(220, 252, 231);
    private static final Color STATUS_PAID_TEXT = new Color(22, 101, 52);
    private static final Color STATUS_PENDING_BG = new Color(254, 243, 199);
    private static final Color STATUS_PENDING_TEXT = new Color(146, 64, 14);
    private static final Color STATUS_OVERDUE_BG = new Color(254, 226, 226);
    private static final Color STATUS_OVERDUE_TEXT = new Color(153, 27, 27);
    private static final Color STATUS_PARTIAL_BG = new Color(219, 234, 254);
    private static final Color STATUS_PARTIAL_TEXT = new Color(30, 64, 175);

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");

    /**
     * Generates a professional A4 PDF for a single invoice.
     */
    public byte[] generateInvoicePdf(Invoice invoice) {
        Document document = new Document(PageSize.A4, 36, 36, 40, 40);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            writer.setPageEvent(new PdfPageNumeration("SaaSOptima Expense & Invoice Intelligence Platform"));
            document.open();

            // 1. Top Header: Brand & Document Title
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60, 40});

            // Brand cell
            PdfPCell brandCell = new PdfPCell();
            brandCell.setBorder(Rectangle.NO_BORDER);
            brandCell.setPaddingBottom(12);

            Paragraph brandTitle = new Paragraph("SaaSOptima", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, BRAND_BLUE));
            Paragraph brandSub = new Paragraph("Subscription & Expense Optimization Management", FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_MUTED));
            Paragraph summaryBadge = new Paragraph("VERIFIED INVOICE SUMMARY", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BRAND_NAVY));
            summaryBadge.setSpacingBefore(4);

            brandCell.addElement(brandTitle);
            brandCell.addElement(brandSub);
            brandCell.addElement(summaryBadge);
            headerTable.addCell(brandCell);

            // Invoice number & meta cell
            PdfPCell metaCell = new PdfPCell();
            metaCell.setBorder(Rectangle.NO_BORDER);
            metaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            metaCell.setPaddingBottom(12);

            Paragraph invNumP = new Paragraph(invoice.getInvoiceNumber(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BRAND_NAVY));
            invNumP.setAlignment(Element.ALIGN_RIGHT);
            metaCell.addElement(invNumP);

            Paragraph statusP = new Paragraph(getStatusBadgePhrase(invoice.getStatus()));
            statusP.setAlignment(Element.ALIGN_RIGHT);
            statusP.setSpacingBefore(4);
            metaCell.addElement(statusP);

            Paragraph dateP = new Paragraph("Date: " + invoice.getInvoiceDate().format(DATE_FMT) + "\nDue: " + invoice.getDueDate().format(DATE_FMT),
                    FontFactory.getFont(FontFactory.HELVETICA, 8.5f, TEXT_MUTED));
            dateP.setAlignment(Element.ALIGN_RIGHT);
            dateP.setSpacingBefore(4);
            metaCell.addElement(dateP);

            headerTable.addCell(metaCell);
            document.add(headerTable);

            // Divider
            document.add(createDivider());

            // 2. Billed From (Vendor) vs Billed To (Customer)
            PdfPTable partiesTable = new PdfPTable(2);
            partiesTable.setWidthPercentage(100);
            partiesTable.setWidths(new float[]{50, 50});
            partiesTable.setSpacingBefore(10);
            partiesTable.setSpacingAfter(14);

            // Vendor Details
            PdfPCell vendorCell = new PdfPCell();
            vendorCell.setBorder(Rectangle.NO_BORDER);
            vendorCell.setPaddingRight(10);

            Paragraph vendorLabel = new Paragraph("VENDOR / SAAS PROVIDER", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BRAND_BLUE));
            Paragraph vendorName = new Paragraph(invoice.getVendorName(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, TEXT_DARK));
            vendorName.setSpacingBefore(2);

            StringBuilder vendorMeta = new StringBuilder();
            if (invoice.getVendorGstin() != null && !invoice.getVendorGstin().isBlank()) {
                vendorMeta.append("GSTIN: ").append(invoice.getVendorGstin()).append("\n");
            }
            if (invoice.getVendorAddress() != null && !invoice.getVendorAddress().isBlank()) {
                vendorMeta.append(invoice.getVendorAddress()).append("\n");
            }
            if (invoice.getSubscription() != null) {
                vendorMeta.append("Linked Subscription: ").append(invoice.getSubscription().getVendorName())
                        .append(" (").append(invoice.getSubscription().getCategory()).append(")\n");
            }

            Paragraph vendorBody = new Paragraph(vendorMeta.toString(), FontFactory.getFont(FontFactory.HELVETICA, 9, TEXT_MUTED));
            vendorBody.setSpacingBefore(3);

            vendorCell.addElement(vendorLabel);
            vendorCell.addElement(vendorName);
            vendorCell.addElement(vendorBody);
            partiesTable.addCell(vendorCell);

            // Customer Details
            PdfPCell customerCell = new PdfPCell();
            customerCell.setBorder(Rectangle.NO_BORDER);
            customerCell.setPaddingLeft(10);

            Paragraph custLabel = new Paragraph("BILLED TO / ORGANIZATION", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BRAND_BLUE));
            String custNameStr = (invoice.getCustomerName() != null && !invoice.getCustomerName().isBlank())
                    ? invoice.getCustomerName()
                    : (invoice.getUser() != null ? invoice.getUser().getFullName() : "SaaSOptima Account");
            Paragraph custName = new Paragraph(custNameStr, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, TEXT_DARK));
            custName.setSpacingBefore(2);

            StringBuilder custMeta = new StringBuilder();
            if (invoice.getUser() != null) {
                custMeta.append("Email: ").append(invoice.getUser().getEmail()).append("\n");
            }
            if (invoice.getCustomerGstin() != null && !invoice.getCustomerGstin().isBlank()) {
                custMeta.append("GSTIN: ").append(invoice.getCustomerGstin()).append("\n");
            }
            if (invoice.getCustomerAddress() != null && !invoice.getCustomerAddress().isBlank()) {
                custMeta.append(invoice.getCustomerAddress()).append("\n");
            }
            if (invoice.getBillingPeriod() != null && !invoice.getBillingPeriod().isBlank()) {
                custMeta.append("Billing Period: ").append(invoice.getBillingPeriod()).append("\n");
            }

            Paragraph custBody = new Paragraph(custMeta.toString(), FontFactory.getFont(FontFactory.HELVETICA, 9, TEXT_MUTED));
            custBody.setSpacingBefore(3);

            customerCell.addElement(custLabel);
            customerCell.addElement(custName);
            customerCell.addElement(custBody);
            partiesTable.addCell(customerCell);

            document.add(partiesTable);

            // 3. Itemized Charges Table
            PdfPTable itemsTable = new PdfPTable(4);
            itemsTable.setWidthPercentage(100);
            itemsTable.setWidths(new float[]{55, 12, 16, 17});
            itemsTable.setSpacingBefore(8);
            itemsTable.setSpacingAfter(10);

            // Headers
            addTableHeaderCell(itemsTable, "Item Description", Element.ALIGN_LEFT);
            addTableHeaderCell(itemsTable, "Qty", Element.ALIGN_CENTER);
            addTableHeaderCell(itemsTable, "Unit Price (" + invoice.getCurrency() + ")", Element.ALIGN_RIGHT);
            addTableHeaderCell(itemsTable, "Total (" + invoice.getCurrency() + ")", Element.ALIGN_RIGHT);

            List<InvoiceItem> items = invoice.getItems();
            if (items == null || items.isEmpty()) {
                // If single general service entry
                addTableRow(itemsTable, invoice.getVendorName() + " Subscription Fee", 1, invoice.getSubtotal(), invoice.getSubtotal(), invoice.getCurrency(), false);
            } else {
                for (int i = 0; i < items.size(); i++) {
                    InvoiceItem item = items.get(i);
                    boolean isEven = (i % 2 == 1);
                    addTableRow(itemsTable, item.getDescription(), item.getQuantity(), item.getUnitPrice(), item.getTotalPrice(), invoice.getCurrency(), isEven);
                }
            }
            document.add(itemsTable);

            // 4. Financial Totals & GST Summary
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new float[]{55, 45});
            summaryTable.setSpacingBefore(6);

            // Left: Payment & Verification Notes
            PdfPCell notesCell = new PdfPCell();
            notesCell.setBorder(Rectangle.NO_BORDER);
            notesCell.setPaddingRight(12);

            Paragraph pmtTitle = new Paragraph("PAYMENT & AUDIT DETAILS", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BRAND_BLUE));
            notesCell.addElement(pmtTitle);

            StringBuilder pmtInfo = new StringBuilder();
            pmtInfo.append("Payment Status: ").append(invoice.getStatus()).append("\n");
            pmtInfo.append("Paid Amount: ").append(formatCurrency(invoice.getPaidAmount(), invoice.getCurrency())).append("\n");
            pmtInfo.append("Outstanding Balance: ").append(formatCurrency(invoice.getBalanceDue(), invoice.getCurrency())).append("\n");
            if (invoice.getPaymentMethod() != null && !invoice.getPaymentMethod().isBlank()) {
                pmtInfo.append("Payment Method: ").append(invoice.getPaymentMethod()).append("\n");
            }
            if (invoice.getPaymentReference() != null && !invoice.getPaymentReference().isBlank()) {
                pmtInfo.append("Transaction Ref: ").append(invoice.getPaymentReference()).append("\n");
            }
            if (invoice.getNotes() != null && !invoice.getNotes().isBlank()) {
                pmtInfo.append("\nNotes: ").append(invoice.getNotes()).append("\n");
            }

            Paragraph pmtBody = new Paragraph(pmtInfo.toString(), FontFactory.getFont(FontFactory.HELVETICA, 8.5f, TEXT_MUTED));
            pmtBody.setSpacingBefore(3);
            notesCell.addElement(pmtBody);
            summaryTable.addCell(notesCell);

            // Right: Calculations Breakdown
            PdfPCell calcCell = new PdfPCell();
            calcCell.setBorder(Rectangle.NO_BORDER);

            PdfPTable calcTable = new PdfPTable(2);
            calcTable.setWidthPercentage(100);
            calcTable.setWidths(new float[]{60, 40});

            addCalcRow(calcTable, "Subtotal:", formatCurrency(invoice.getSubtotal(), invoice.getCurrency()), false);
            if (invoice.getGstRate() != null && invoice.getGstRate().compareTo(BigDecimal.ZERO) > 0) {
                addCalcRow(calcTable, "GST (" + invoice.getGstRate() + "%):", formatCurrency(invoice.getGstAmount(), invoice.getCurrency()), false);
            }
            if (invoice.getDiscountAmount() != null && invoice.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
                addCalcRow(calcTable, "Discount:", "-" + formatCurrency(invoice.getDiscountAmount(), invoice.getCurrency()), false);
            }

            // Total highlight row
            addTotalRow(calcTable, "Total Amount:", formatCurrency(invoice.getTotalAmount(), invoice.getCurrency()));
            addCalcRow(calcTable, "Amount Paid:", formatCurrency(invoice.getPaidAmount(), invoice.getCurrency()), false);
            addCalcRow(calcTable, "Balance Due:", formatCurrency(invoice.getBalanceDue(), invoice.getCurrency()), true);

            calcCell.addElement(calcTable);
            summaryTable.addCell(calcCell);

            document.add(summaryTable);

            // 5. Payment history table if payments exist
            if (invoice.getPayments() != null && !invoice.getPayments().isEmpty()) {
                Paragraph pmtHistoryTitle = new Paragraph("Payment Transaction History", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BRAND_NAVY));
                pmtHistoryTitle.setSpacingBefore(16);
                pmtHistoryTitle.setSpacingAfter(6);
                document.add(pmtHistoryTitle);

                PdfPTable historyTable = new PdfPTable(4);
                historyTable.setWidthPercentage(100);
                historyTable.setWidths(new float[]{25, 25, 25, 25});

                addTableHeaderCell(historyTable, "Date", Element.ALIGN_LEFT);
                addTableHeaderCell(historyTable, "Method", Element.ALIGN_LEFT);
                addTableHeaderCell(historyTable, "Reference", Element.ALIGN_LEFT);
                addTableHeaderCell(historyTable, "Amount (" + invoice.getCurrency() + ")", Element.ALIGN_RIGHT);

                for (InvoicePayment pmt : invoice.getPayments()) {
                    addSimpleCell(historyTable, pmt.getPaymentDate().format(DATE_FMT), Element.ALIGN_LEFT);
                    addSimpleCell(historyTable, pmt.getPaymentMethod() != null ? pmt.getPaymentMethod() : "Standard", Element.ALIGN_LEFT);
                    addSimpleCell(historyTable, pmt.getTransactionReference() != null ? pmt.getTransactionReference() : "-", Element.ALIGN_LEFT);
                    addSimpleCell(historyTable, formatCurrency(pmt.getAmount(), invoice.getCurrency()), Element.ALIGN_RIGHT);
                }
                document.add(historyTable);
            }

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF for invoice {}: {}", invoice.getInvoiceNumber(), e.getMessage(), e);
            throw new RuntimeException("Could not generate invoice PDF: " + e.getMessage());
        }
    }

    /**
     * Generates a monthly expense PDF report.
     */
    public byte[] generateMonthlyExpenseReport(User user, int month, int year, List<Invoice> invoices) {
        Document document = new Document(PageSize.A4, 36, 36, 40, 40);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            writer.setPageEvent(new PdfPageNumeration("SaaSOptima Monthly SaaS Expense & Invoices Report"));
            document.open();

            // 1. Report Header
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60, 40});

            PdfPCell brandCell = new PdfPCell();
            brandCell.setBorder(Rectangle.NO_BORDER);

            Paragraph brandTitle = new Paragraph("SaaSOptima", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, BRAND_BLUE));
            Paragraph reportTitle = new Paragraph("Monthly SaaS Expense & Invoice Report", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BRAND_NAVY));
            String monthName = java.time.Month.of(month).name();
            monthName = monthName.charAt(0) + monthName.substring(1).toLowerCase();
            Paragraph period = new Paragraph("Reporting Period: " + monthName + " " + year, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BRAND_BLUE));
            period.setSpacingBefore(2);

            brandCell.addElement(brandTitle);
            brandCell.addElement(reportTitle);
            brandCell.addElement(period);
            headerTable.addCell(brandCell);

            PdfPCell metaCell = new PdfPCell();
            metaCell.setBorder(Rectangle.NO_BORDER);
            metaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            Paragraph genDate = new Paragraph("Generated on: " + LocalDateTime.now().format(DATETIME_FMT), FontFactory.getFont(FontFactory.HELVETICA, 8.5f, TEXT_MUTED));
            genDate.setAlignment(Element.ALIGN_RIGHT);
            Paragraph userP = new Paragraph("Account: " + user.getFullName() + " (" + user.getEmail() + ")", FontFactory.getFont(FontFactory.HELVETICA, 8.5f, TEXT_DARK));
            userP.setAlignment(Element.ALIGN_RIGHT);
            userP.setSpacingBefore(3);

            metaCell.addElement(genDate);
            metaCell.addElement(userP);
            headerTable.addCell(metaCell);

            document.add(headerTable);
            document.add(createDivider());

            // 2. Aggregate Calculations
            BigDecimal totalSpent = BigDecimal.ZERO;
            BigDecimal totalPaid = BigDecimal.ZERO;
            BigDecimal totalPending = BigDecimal.ZERO;
            BigDecimal totalOverdue = BigDecimal.ZERO;
            BigDecimal totalGst = BigDecimal.ZERO;

            Map<String, BigDecimal> vendorTotals = new LinkedHashMap<>();

            for (Invoice inv : invoices) {
                totalSpent = totalSpent.add(inv.getTotalAmount());
                totalPaid = totalPaid.add(inv.getPaidAmount());
                totalGst = totalGst.add(inv.getGstAmount());

                if (inv.getStatus() == InvoiceStatus.OVERDUE) {
                    totalOverdue = totalOverdue.add(inv.getBalanceDue());
                } else if (inv.getStatus() == InvoiceStatus.PENDING || inv.getStatus() == InvoiceStatus.PARTIALLY_PAID) {
                    totalPending = totalPending.add(inv.getBalanceDue());
                }

                String vendor = inv.getVendorName();
                vendorTotals.put(vendor, vendorTotals.getOrDefault(vendor, BigDecimal.ZERO).add(inv.getTotalAmount()));
            }

            // 3. Summary KPI Cards
            PdfPTable kpiTable = new PdfPTable(4);
            kpiTable.setWidthPercentage(100);
            kpiTable.setWidths(new float[]{25, 25, 25, 25});
            kpiTable.setSpacingBefore(12);
            kpiTable.setSpacingAfter(14);

            addKpiCell(kpiTable, "Total Invoiced", formatCurrency(totalSpent, "INR"), BRAND_NAVY);
            addKpiCell(kpiTable, "Total Paid", formatCurrency(totalPaid, "INR"), STATUS_PAID_TEXT);
            addKpiCell(kpiTable, "Pending Balance", formatCurrency(totalPending, "INR"), STATUS_PENDING_TEXT);
            addKpiCell(kpiTable, "Overdue Amount", formatCurrency(totalOverdue, "INR"), STATUS_OVERDUE_TEXT);

            document.add(kpiTable);

            // 4. Vendor Breakdown Summary
            Paragraph vendorSectionTitle = new Paragraph("Vendor Expense Breakdown", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BRAND_NAVY));
            vendorSectionTitle.setSpacingAfter(6);
            document.add(vendorSectionTitle);

            PdfPTable vendorTable = new PdfPTable(3);
            vendorTable.setWidthPercentage(100);
            vendorTable.setWidths(new float[]{50, 25, 25});
            vendorTable.setSpacingAfter(14);

            addTableHeaderCell(vendorTable, "Vendor / SaaS Provider", Element.ALIGN_LEFT);
            addTableHeaderCell(vendorTable, "Total Invoiced (INR)", Element.ALIGN_RIGHT);
            addTableHeaderCell(vendorTable, "% of Monthly Spend", Element.ALIGN_RIGHT);

            if (vendorTotals.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("No invoice records found for this period.", FontFactory.getFont(FontFactory.HELVETICA, 9, TEXT_MUTED)));
                empty.setColspan(3);
                empty.setPadding(10);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                vendorTable.addCell(empty);
            } else {
                for (Map.Entry<String, BigDecimal> entry : vendorTotals.entrySet()) {
                    String vName = entry.getKey();
                    BigDecimal vAmount = entry.getValue();
                    double pct = totalSpent.compareTo(BigDecimal.ZERO) > 0
                            ? vAmount.doubleValue() / totalSpent.doubleValue() * 100.0
                            : 0.0;

                    addSimpleCell(vendorTable, vName, Element.ALIGN_LEFT);
                    addSimpleCell(vendorTable, formatCurrency(vAmount, "INR"), Element.ALIGN_RIGHT);
                    addSimpleCell(vendorTable, String.format("%.1f%%", pct), Element.ALIGN_RIGHT);
                }
            }
            document.add(vendorTable);

            // 5. Detailed Invoices Table
            Paragraph invSectionTitle = new Paragraph("Invoice Details (" + invoices.size() + " Records)", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BRAND_NAVY));
            invSectionTitle.setSpacingAfter(6);
            document.add(invSectionTitle);

            PdfPTable detailsTable = new PdfPTable(6);
            detailsTable.setWidthPercentage(100);
            detailsTable.setWidths(new float[]{20, 25, 15, 15, 12, 13});

            addTableHeaderCell(detailsTable, "Invoice #", Element.ALIGN_LEFT);
            addTableHeaderCell(detailsTable, "Vendor", Element.ALIGN_LEFT);
            addTableHeaderCell(detailsTable, "Invoice Date", Element.ALIGN_CENTER);
            addTableHeaderCell(detailsTable, "Amount (INR)", Element.ALIGN_RIGHT);
            addTableHeaderCell(detailsTable, "GST", Element.ALIGN_RIGHT);
            addTableHeaderCell(detailsTable, "Status", Element.ALIGN_CENTER);

            if (invoices.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("No invoices recorded for the selected month.", FontFactory.getFont(FontFactory.HELVETICA, 9, TEXT_MUTED)));
                empty.setColspan(6);
                empty.setPadding(12);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                detailsTable.addCell(empty);
            } else {
                for (int i = 0; i < invoices.size(); i++) {
                    Invoice inv = invoices.get(i);
                    boolean isEven = (i % 2 == 1);
                    Color rowBg = isEven ? BG_LIGHT : Color.WHITE;

                    addCellWithBg(detailsTable, inv.getInvoiceNumber(), Element.ALIGN_LEFT, rowBg);
                    addCellWithBg(detailsTable, inv.getVendorName(), Element.ALIGN_LEFT, rowBg);
                    addCellWithBg(detailsTable, inv.getInvoiceDate().format(DATE_FMT), Element.ALIGN_CENTER, rowBg);
                    addCellWithBg(detailsTable, formatCurrency(inv.getTotalAmount(), "INR"), Element.ALIGN_RIGHT, rowBg);
                    addCellWithBg(detailsTable, formatCurrency(inv.getGstAmount(), "INR"), Element.ALIGN_RIGHT, rowBg);
                    addStatusCell(detailsTable, inv.getStatus(), rowBg);
                }
            }
            document.add(detailsTable);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate monthly expense report for {}/{}: {}", month, year, e.getMessage(), e);
            throw new RuntimeException("Could not generate monthly report PDF: " + e.getMessage());
        }
    }

    // ── Helper Table & Formatting Methods ──

    private static String formatCurrency(BigDecimal amount, String currency) {
        if (amount == null) amount = BigDecimal.ZERO;
        DecimalFormat df = new DecimalFormat("#,##,##0.00");
        String formatted = df.format(amount);
        String curr = (currency != null && !currency.isBlank()) ? currency.toUpperCase() : "INR";
        return curr + " " + formatted;
    }

    private static Phrase getStatusBadgePhrase(InvoiceStatus status) {
        if (status == null) status = InvoiceStatus.PENDING;
        Color textColor = switch (status) {
            case PAID -> STATUS_PAID_TEXT;
            case PENDING -> STATUS_PENDING_TEXT;
            case OVERDUE -> STATUS_OVERDUE_TEXT;
            case PARTIALLY_PAID -> STATUS_PARTIAL_TEXT;
        };
        return new Phrase("Status: " + status.name(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, textColor));
    }

    private static void addTableHeaderCell(PdfPTable table, String text, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, BRAND_NAVY)));
        cell.setBackgroundColor(BG_LIGHT);
        cell.setHorizontalAlignment(align);
        cell.setPadding(6);
        cell.setBorderColor(BORDER_COLOR);
        cell.setBorderWidth(1);
        table.addCell(cell);
    }

    private static void addTableRow(PdfPTable table, String desc, int qty, BigDecimal unitPrice, BigDecimal total, String curr, boolean isEven) {
        Color bg = isEven ? BG_LIGHT : Color.WHITE;

        PdfPCell c1 = new PdfPCell(new Phrase(desc, FontFactory.getFont(FontFactory.HELVETICA, 8.5f, TEXT_DARK)));
        c1.setBackgroundColor(bg);
        c1.setPadding(6);
        c1.setBorderColor(BORDER_COLOR);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(String.valueOf(qty), FontFactory.getFont(FontFactory.HELVETICA, 8.5f, TEXT_DARK)));
        c2.setBackgroundColor(bg);
        c2.setHorizontalAlignment(Element.ALIGN_CENTER);
        c2.setPadding(6);
        c2.setBorderColor(BORDER_COLOR);
        table.addCell(c2);

        PdfPCell c3 = new PdfPCell(new Phrase(formatCurrency(unitPrice, curr), FontFactory.getFont(FontFactory.HELVETICA, 8.5f, TEXT_DARK)));
        c3.setBackgroundColor(bg);
        c3.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c3.setPadding(6);
        c3.setBorderColor(BORDER_COLOR);
        table.addCell(c3);

        PdfPCell c4 = new PdfPCell(new Phrase(formatCurrency(total, curr), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, TEXT_DARK)));
        c4.setBackgroundColor(bg);
        c4.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c4.setPadding(6);
        c4.setBorderColor(BORDER_COLOR);
        table.addCell(c4);
    }

    private static void addCalcRow(PdfPTable table, String label, String value, boolean isBold) {
        PdfPCell lCell = new PdfPCell(new Phrase(label, FontFactory.getFont(isBold ? FontFactory.HELVETICA_BOLD : FontFactory.HELVETICA, 8.5f, TEXT_MUTED)));
        lCell.setBorder(Rectangle.NO_BORDER);
        lCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        lCell.setPadding(3);
        table.addCell(lCell);

        PdfPCell vCell = new PdfPCell(new Phrase(value, FontFactory.getFont(isBold ? FontFactory.HELVETICA_BOLD : FontFactory.HELVETICA, 8.5f, TEXT_DARK)));
        vCell.setBorder(Rectangle.NO_BORDER);
        vCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        vCell.setPadding(3);
        table.addCell(vCell);
    }

    private static void addTotalRow(PdfPTable table, String label, String value) {
        PdfPCell lCell = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BRAND_NAVY)));
        lCell.setBackgroundColor(BG_LIGHT);
        lCell.setBorder(Rectangle.TOP | Rectangle.BOTTOM);
        lCell.setBorderColor(BORDER_COLOR);
        lCell.setPadding(5);
        table.addCell(lCell);

        PdfPCell vCell = new PdfPCell(new Phrase(value, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BRAND_BLUE)));
        vCell.setBackgroundColor(BG_LIGHT);
        vCell.setBorder(Rectangle.TOP | Rectangle.BOTTOM);
        vCell.setBorderColor(BORDER_COLOR);
        vCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        vCell.setPadding(5);
        table.addCell(vCell);
    }

    private static void addKpiCell(PdfPTable table, String label, String value, Color valColor) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(BG_LIGHT);
        cell.setBorderColor(BORDER_COLOR);
        cell.setPadding(8);

        Paragraph l = new Paragraph(label, FontFactory.getFont(FontFactory.HELVETICA, 7.5f, TEXT_MUTED));
        Paragraph v = new Paragraph(value, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, valColor));
        v.setSpacingBefore(2);

        cell.addElement(l);
        cell.addElement(v);
        table.addCell(cell);
    }

    private static void addSimpleCell(PdfPTable table, String text, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, 8.5f, TEXT_DARK)));
        cell.setHorizontalAlignment(align);
        cell.setPadding(5);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private static void addCellWithBg(PdfPTable table, String text, int align, Color bg) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, 8f, TEXT_DARK)));
        cell.setHorizontalAlignment(align);
        cell.setBackgroundColor(bg);
        cell.setPadding(5);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private static void addStatusCell(PdfPTable table, InvoiceStatus status, Color bg) {
        Color textColor = switch (status) {
            case PAID -> STATUS_PAID_TEXT;
            case PENDING -> STATUS_PENDING_TEXT;
            case OVERDUE -> STATUS_OVERDUE_TEXT;
            case PARTIALLY_PAID -> STATUS_PARTIAL_TEXT;
        };
        PdfPCell cell = new PdfPCell(new Phrase(status.name(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7.5f, textColor)));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(bg);
        cell.setPadding(5);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private static Paragraph createDivider() {
        Paragraph divider = new Paragraph("");
        divider.setSpacingAfter(8);
        return divider;
    }

    // Header & Footer Page Events (Page numbers)
    private static class PdfPageNumeration extends PdfPageEventHelper {
        private final String footerTitle;

        public PdfPageNumeration(String footerTitle) {
            this.footerTitle = footerTitle;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();
            cb.beginText();
            cb.setFontAndSize(FontFactory.getFont(FontFactory.HELVETICA, 7.5f, TEXT_MUTED).getBaseFont(), 7.5f);
            cb.setColorFill(TEXT_MUTED);

            // Left footer
            cb.showTextAligned(PdfContentByte.ALIGN_LEFT, footerTitle, document.left(), document.bottom() - 14, 0);

            // Right footer: Page number
            String pageText = "Page " + writer.getPageNumber();
            cb.showTextAligned(PdfContentByte.ALIGN_RIGHT, pageText, document.right(), document.bottom() - 14, 0);
            cb.endText();
        }
    }
}
