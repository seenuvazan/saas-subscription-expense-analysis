package com.saas.analytics.repository;

import com.saas.analytics.entity.Invoice;
import com.saas.analytics.entity.InvoicePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoicePaymentRepository extends JpaRepository<InvoicePayment, Long> {
    List<InvoicePayment> findByInvoiceOrderByPaymentDateDesc(Invoice invoice);
}
