package com.saas.analytics.repository;

import com.saas.analytics.entity.Invoice;
import com.saas.analytics.entity.User;
import com.saas.analytics.model.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findByUserOrderByInvoiceDateDesc(User user);

    Optional<Invoice> findByIdAndUser(Long id, User user);

    Optional<Invoice> findByInvoiceNumberAndUser(String invoiceNumber, User user);

    boolean existsByInvoiceNumberAndUser(String invoiceNumber, User user);

    boolean existsByInvoiceNumberAndUserAndIdNot(String invoiceNumber, User user, Long id);

    List<Invoice> findByUserAndStatusOrderByInvoiceDateDesc(User user, InvoiceStatus status);

    @Query("SELECT i FROM Invoice i WHERE i.user = :user " +
           "AND (:status IS NULL OR i.status = :status) " +
           "AND (:search IS NULL OR LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(i.vendorName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(i.notes) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY i.invoiceDate DESC")
    List<Invoice> searchInvoices(
            @Param("user") User user,
            @Param("status") InvoiceStatus status,
            @Param("search") String search
    );

    @Query("SELECT i FROM Invoice i WHERE i.user = :user " +
           "AND i.invoiceDate >= :startDate AND i.invoiceDate <= :endDate " +
           "ORDER BY i.invoiceDate ASC")
    List<Invoice> findByUserAndDateRange(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
