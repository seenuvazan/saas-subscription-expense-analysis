import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText, Download, Plus, Search, Filter, Calendar, CreditCard,
  CheckCircle2, Clock, AlertTriangle, AlertCircle, Trash2, Edit3,
  Upload, Eye, ChevronLeft, ChevronRight, X, ExternalLink,
  Building, RefreshCw, FileCheck, DollarSign, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { invoiceAPI, subscriptionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Helper for Indian Rupee & currency formatting
export const formatCurrency = (amount, currency = 'INR') => {
  const num = Number(amount) || 0;
  const curr = (currency || 'INR').toUpperCase();
  try {
    return new Intl.NumberFormat(curr === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (e) {
    return `${curr} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

// Status styling badge
const StatusBadge = ({ status }) => {
  switch (status) {
    case 'PAID':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'var(--success-muted, rgba(22, 134, 92, 0.1))', color: 'var(--success, #16865C)' }}>
          <CheckCircle2 className="w-3.5 h-3.5" /> Paid
        </span>
      );
    case 'OVERDUE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'var(--danger-muted, rgba(194, 65, 59, 0.1))', color: 'var(--danger, #C2413B)' }}>
          <AlertCircle className="w-3.5 h-3.5" /> Overdue
        </span>
      );
    case 'PARTIALLY_PAID':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'var(--accent-muted, rgba(49, 87, 213, 0.1))', color: 'var(--accent, #3157D5)' }}>
          <Clock className="w-3.5 h-3.5" /> Partially Paid
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'var(--warning-muted, rgba(217, 119, 6, 0.1))', color: 'var(--warning, #D97706)' }}>
          <Clock className="w-3.5 h-3.5" /> Pending
        </span>
      );
  }
};

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('invoiceDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // Fetch invoices & summary
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invRes, sumRes, subRes] = await Promise.all([
        invoiceAPI.getAll(),
        invoiceAPI.getSummary(),
        subscriptionAPI.getAll().catch(() => ({ data: [] })),
      ]);
      setInvoices(invRes.data || []);
      setSummary(sumRes.data || null);
      setSubscriptions(subRes.data || []);
    } catch (err) {
      console.error('Failed to load invoice data:', err);
      setError('Could not load invoice records. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered and sorted invoices
  const filteredInvoices = useMemo(() => {
    let list = [...invoices];

    if (statusFilter !== 'ALL') {
      list = list.filter(inv => inv.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(inv =>
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
        (inv.vendorName && inv.vendorName.toLowerCase().includes(q)) ||
        (inv.notes && inv.notes.toLowerCase().includes(q)) ||
        (inv.paymentReference && inv.paymentReference.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'totalAmount' || sortBy === 'balanceDue') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [invoices, statusFilter, search, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, currentPage]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // PDF Downloads
  const handleDownloadInvoicePdf = async (inv) => {
    setDownloadingId(inv.id);
    try {
      await invoiceAPI.downloadPdf(inv.id, inv.invoiceNumber);
    } catch (err) {
      alert('Failed to generate invoice PDF. ' + (err?.response?.data?.message || err.message));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadOriginalPdf = async (inv) => {
    try {
      await invoiceAPI.downloadOriginalPdf(inv.id, inv.originalPdfFilename);
    } catch (err) {
      alert('Failed to download original vendor document: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return;
    try {
      await invoiceAPI.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete invoice: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary, #111827)' }}>
            Invoices & Payments
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary, #667085)' }}>
            Manage SaaS vendor invoices, GST breakdown, payment status, and certified PDF downloads.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowReportModal(true)}
            className="btn-secondary flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl transition-all"
            style={{
              background: 'var(--bg-surface, #FFFFFF)',
              border: '1px solid var(--border, #E5E7EB)',
              color: 'var(--text-primary, #111827)',
            }}
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Download Report</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all"
            style={{ background: 'var(--accent, #3157D5)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Invoice</span>
          </button>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoices */}
        <div className="card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Invoice Amount</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(summary?.totalInvoiceAmount || 0, summary?.primaryCurrency)}
          </div>
          <div className="text-xs mt-1.5 text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">{summary?.totalCount || 0}</span> total invoices recorded
          </div>
        </div>

        {/* Paid Invoices */}
        <div className="card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Paid Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(summary?.paidAmount || 0, summary?.primaryCurrency)}
          </div>
          <div className="text-xs mt-1.5 text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-700">{summary?.paidCount || 0}</span> invoices fully settled
          </div>
        </div>

        {/* Pending Payments */}
        <div className="card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Payments</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {formatCurrency(summary?.pendingAmount || 0, summary?.primaryCurrency)}
          </div>
          <div className="text-xs mt-1.5 text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-amber-700">{summary?.pendingCount || 0}</span> pending, {summary?.partiallyPaidCount || 0} partial
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overdue Payments</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600">
            {formatCurrency(summary?.overdueAmount || 0, summary?.primaryCurrency)}
          </div>
          <div className="text-xs mt-1.5 text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-rose-700">{summary?.overdueCount || 0}</span> bills past due date
          </div>
        </div>
      </div>

      {/* 2. Control Bar: Search & Status Filter */}
      <div className="card p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search invoice #, vendor, notes..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Invoices' },
            { id: 'PAID', label: 'Paid' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'PARTIALLY_PAID', label: 'Partially Paid' },
            { id: 'OVERDUE', label: 'Overdue' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setStatusFilter(tab.id); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Invoices Table */}
      <div className="card rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-sm">Loading invoice and payment records...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No invoices found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              {search || statusFilter !== 'ALL'
                ? 'No invoices match your current search or status filter. Try clearing filters.'
                : 'Track vendor invoices, GST taxes, and download certified invoice summaries as real PDFs.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" /> Add Your First Invoice
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('invoiceNumber')}>
                      <div className="flex items-center gap-1">
                        Invoice # <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('vendorName')}>
                      <div className="flex items-center gap-1">
                        SaaS Provider <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('invoiceDate')}>
                      <div className="flex items-center gap-1">
                        Invoice Date <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('dueDate')}>
                      <div className="flex items-center gap-1">
                        Due Date <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Billing Period</th>
                    <th className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('totalAmount')}>
                      <div className="flex items-center justify-end gap-1">
                        Amount <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-right">GST</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedInvoices.map((inv) => {
                    const isOverdue = inv.status === 'OVERDUE';
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Invoice Number */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-slate-100 text-slate-600">
                              <FileText className="w-3.5 h-3.5" />
                            </span>
                            <span>{inv.invoiceNumber}</span>
                          </div>
                        </td>

                        {/* SaaS Provider */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {inv.vendorName?.[0]?.toUpperCase() || 'S'}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{inv.vendorName}</div>
                              {inv.subscriptionVendorName && (
                                <div className="text-[11px] text-slate-400">Linked: {inv.subscriptionVendorName}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Invoice Date */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {formatDate(inv.invoiceDate)}
                        </td>

                        {/* Due Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-600'}`}>
                            {isOverdue && <AlertTriangle className="w-3.5 h-3.5" />}
                            <span>{formatDate(inv.dueDate)}</span>
                          </div>
                        </td>

                        {/* Billing Period */}
                        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                          {inv.billingPeriod || '-'}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                          <div>{formatCurrency(inv.totalAmount, inv.currency)}</div>
                          {inv.paidAmount > 0 && inv.status !== 'PAID' && (
                            <div className="text-[11px] font-normal text-slate-400">
                              Bal: {formatCurrency(inv.balanceDue, inv.currency)}
                            </div>
                          )}
                        </td>

                        {/* GST */}
                        <td className="py-3.5 px-4 text-right text-xs text-slate-500 whitespace-nowrap">
                          {inv.gstRate > 0 ? (
                            <div>
                              <span>{formatCurrency(inv.gstAmount, inv.currency)}</span>
                              <span className="block text-[10px] text-slate-400">({inv.gstRate}%)</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">0%</span>
                          )}
                        </td>

                        {/* Payment Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <StatusBadge status={inv.status} />
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Download Generated PDF — MOST IMPORTANT */}
                            <button
                              onClick={() => handleDownloadInvoicePdf(inv)}
                              disabled={downloadingId === inv.id}
                              title="Download SaaSOptima PDF Invoice"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Download className={`w-3.5 h-3.5 ${downloadingId === inv.id ? 'animate-bounce' : ''}`} />
                              <span>PDF</span>
                            </button>

                            {/* Download Original PDF (if uploaded) */}
                            {inv.hasOriginalPdf && (
                              <button
                                onClick={() => handleDownloadOriginalPdf(inv)}
                                title={`Download Original Vendor PDF: ${inv.originalPdfFilename || ''}`}
                                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                                <span>Vendor PDF</span>
                              </button>
                            )}

                            {/* Record Payment Button */}
                            {inv.status !== 'PAID' && (
                              <button
                                onClick={() => { setSelectedInvoice(inv); setShowPaymentModal(true); }}
                                title="Record payment against this invoice"
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              >
                                <CreditCard className="w-4 h-4" />
                              </button>
                            )}

                            {/* Upload Original PDF button if missing */}
                            {!inv.hasOriginalPdf && (
                              <button
                                onClick={() => { setSelectedInvoice(inv); setShowUploadModal(true); }}
                                title="Upload original vendor PDF invoice"
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteInvoice(inv.id)}
                              title="Delete invoice record"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 text-xs text-slate-500">
                <div>
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredInvoices.length)} of {filteredInvoices.length} invoices
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 font-semibold text-slate-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── MODALS ── */}

      {/* 1. Add Invoice Modal */}
      {showAddModal && (
        <AddInvoiceModal
          subscriptions={subscriptions}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); loadData(); }}
        />
      )}

      {/* 2. Record Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <RecordPaymentModal
          invoice={selectedInvoice}
          onClose={() => { setShowPaymentModal(false); setSelectedInvoice(null); }}
          onSuccess={() => { setShowPaymentModal(false); setSelectedInvoice(null); loadData(); }}
        />
      )}

      {/* 3. Monthly Report Modal */}
      {showReportModal && (
        <MonthlyReportModal
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* 4. Upload Original Vendor PDF Modal */}
      {showUploadModal && selectedInvoice && (
        <UploadVendorPdfModal
          invoice={selectedInvoice}
          onClose={() => { setShowUploadModal(false); setSelectedInvoice(null); }}
          onSuccess={() => { setShowUploadModal(false); setSelectedInvoice(null); loadData(); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal 1: Add Invoice Modal
// ─────────────────────────────────────────────────────────────────────────────
function AddInvoiceModal({ subscriptions, onClose, onSuccess }) {
  const [vendorName, setVendorName] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [billingPeriodStart, setBillingPeriodStart] = useState('');
  const [billingPeriodEnd, setBillingPeriodEnd] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [gstRate, setGstRate] = useState(18);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Line items
  const [items, setItems] = useState([
    { description: 'Pro License / Subscription Fee', quantity: 1, unitPrice: 10000 },
  ]);

  // Vendor & Customer details
  const [vendorGstin, setVendorGstin] = useState('');
  const [vendorAddress, setVendorAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [notes, setNotes] = useState('');

  // File upload
  const [vendorFile, setVendorFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Auto-fill from subscription
  const handleSubscriptionSelect = (subId) => {
    setSelectedSubId(subId);
    if (!subId) return;
    const sub = subscriptions.find(s => String(s.id) === String(subId));
    if (sub) {
      setVendorName(sub.vendorName);
      if (sub.cost) {
        setItems([{
          description: `${sub.vendorName} ${sub.category || 'SaaS'} Subscription Fee`,
          quantity: sub.usedSeats || 1,
          unitPrice: Number(sub.cost),
        }]);
      }
      if (sub.currency) {
        setCurrency(sub.currency);
      }
    }
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Live calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  }, [items]);

  const gstAmount = useMemo(() => {
    return (subtotal * (Number(gstRate) || 0)) / 100;
  }, [subtotal, gstRate]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal + gstAmount - (Number(discountAmount) || 0));
  }, [subtotal, gstAmount, discountAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceNumber.trim()) {
      setFormError('Invoice number is required.');
      return;
    }
    if (!vendorName.trim()) {
      setFormError('SaaS Provider / Vendor name is required.');
      return;
    }
    if (!invoiceDate || !dueDate) {
      setFormError('Both invoice date and due date are required.');
      return;
    }

    setLoading(true);
    setFormError('');

    const payload = {
      invoiceNumber: invoiceNumber.trim(),
      vendorName: vendorName.trim(),
      subscriptionId: selectedSubId ? Number(selectedSubId) : null,
      invoiceDate,
      dueDate,
      billingPeriodStart: billingPeriodStart || null,
      billingPeriodEnd: billingPeriodEnd || null,
      billingPeriod: (billingPeriodStart && billingPeriodEnd) ? `${billingPeriodStart} to ${billingPeriodEnd}` : null,
      currency,
      gstRate: Number(gstRate) || 0,
      discountAmount: Number(discountAmount) || 0,
      vendorGstin: vendorGstin.trim() || null,
      vendorAddress: vendorAddress.trim() || null,
      customerName: customerName.trim() || null,
      customerGstin: customerGstin.trim() || null,
      notes: notes.trim() || null,
      items: items.map(it => ({
        description: it.description || 'Service',
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        totalPrice: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
      })),
    };

    try {
      await invoiceAPI.create(payload, vendorFile);
      onSuccess();
    } catch (err) {
      setFormError(err?.response?.data?.message || err.message || 'Could not save invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Invoice</h2>
            <p className="text-xs text-slate-500">Record a SaaS vendor invoice, add line items and configure GST</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-sm">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Subscription Link & Vendor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link Existing Subscription (Optional)
              </label>
              <select
                value={selectedSubId}
                onChange={e => handleSubscriptionSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
              >
                <option value="">-- Choose SaaS Subscription --</option>
                {subscriptions.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.vendorName} ({s.category} - {s.cost} {s.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SaaS Provider / Vendor Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={e => setVendorName(e.target.value)}
                placeholder="e.g. Amazon Web Services, Slack, Figma"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Invoice Number, Currency, Dates */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-2026-001"
                className="w-full px-3 py-2 font-mono rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={invoiceDate}
                onChange={e => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Billing Period Start & End */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Period Start</label>
              <input
                type="date"
                value={billingPeriodStart}
                onChange={e => setBillingPeriodStart(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Period End</label>
              <input
                type="date"
                value={billingPeriodEnd}
                onChange={e => setBillingPeriodEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Line items table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Itemized Line Charges
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 w-20 text-center">Qty</th>
                    <th className="py-2.5 px-3 w-28 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 w-28 text-right">Total</th>
                    <th className="py-2.5 px-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it, idx) => {
                    const lineTotal = (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2">
                          <input
                            type="text"
                            required
                            value={it.description}
                            onChange={e => handleItemChange(idx, 'description', e.target.value)}
                            placeholder="Item description"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            value={it.quantity}
                            onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 text-center rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={it.unitPrice}
                            onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full px-2 py-1.5 text-right rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-2 text-right font-semibold text-slate-900">
                          {formatCurrency(lineTotal, currency)}
                        </td>
                        <td className="p-2 text-center">
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax, Discounts & Totals Calculation Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">GST Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={gstRate}
                  onChange={e => setGstRate(e.target.value)}
                  className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Discount Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={discountAmount}
                  onChange={e => setDiscountAmount(e.target.value)}
                  className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="text-right space-y-1 text-xs">
              <div className="text-slate-500">Subtotal: <span className="font-semibold text-slate-800">{formatCurrency(subtotal, currency)}</span></div>
              <div className="text-slate-500">GST ({gstRate}%): <span className="font-semibold text-slate-800">{formatCurrency(gstAmount, currency)}</span></div>
              {Number(discountAmount) > 0 && (
                <div className="text-slate-500">Discount: <span className="font-semibold text-emerald-600">-{formatCurrency(discountAmount, currency)}</span></div>
              )}
              <div className="text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                Grand Total: <span className="text-blue-600 text-base">{formatCurrency(grandTotal, currency)}</span>
              </div>
            </div>
          </div>

          {/* Tax & GSTIN Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor GSTIN</label>
              <input
                type="text"
                value={vendorGstin}
                onChange={e => setVendorGstin(e.target.value)}
                placeholder="e.g. 29AABCU9603R1ZM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer GSTIN</label>
              <input
                type="text"
                value={customerGstin}
                onChange={e => setCustomerGstin(e.target.value)}
                placeholder="e.g. 33AAECS1234F1Z5"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase"
              />
            </div>
          </div>

          {/* Upload original vendor PDF */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload Original Vendor PDF (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={e => setVendorFile(e.target.files[0] || null)}
                className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {vendorFile && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {vendorFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Approved for annual billing by VP Finance."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Invoice…' : 'Save Invoice Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal 2: Record Payment Modal
// ─────────────────────────────────────────────────────────────────────────────
function RecordPaymentModal({ invoice, onClose, onSuccess }) {
  const [amount, setAmount] = useState(invoice.balanceDue || 0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Corporate Credit Card');
  const [transactionReference, setTransactionReference] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payNum = Number(amount);
    if (!payNum || payNum <= 0) {
      setError('Please enter a valid payment amount greater than zero.');
      return;
    }
    if (payNum > Number(invoice.balanceDue)) {
      setError(`Payment cannot exceed outstanding balance of ${formatCurrency(invoice.balanceDue, invoice.currency)}.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await invoiceAPI.recordPayment(invoice.id, {
        amount: payNum,
        paymentDate,
        paymentMethod,
        transactionReference: transactionReference.trim() || null,
        notes: notes.trim() || null,
      });
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Could not record payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Record Payment</h2>
            <p className="text-xs text-slate-500">{invoice.invoiceNumber} • {invoice.vendorName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Balance card */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Total Amount</span>
              <span className="font-bold text-slate-800 text-sm">{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Already Paid</span>
              <span className="font-bold text-emerald-600 text-sm">{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Balance Due</span>
              <span className="font-extrabold text-blue-600 text-sm">{formatCurrency(invoice.balanceDue, invoice.currency)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Amount ({invoice.currency}) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={invoice.balanceDue}
              required
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="Corporate Credit Card">Corporate Credit Card</option>
              <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wire Transfer">Wire Transfer</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transaction Reference / UTR #
            </label>
            <input
              type="text"
              value={transactionReference}
              onChange={e => setTransactionReference(e.target.value)}
              placeholder="e.g. TXN-89412501"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Cleared via primary HDFC corporate account."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {loading ? 'Recording…' : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal 3: Monthly Expense Report Modal
// ─────────────────────────────────────────────────────────────────────────────
function MonthlyReportModal({ onClose }) {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [generating, setGenerating] = useState(false);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleDownload = async () => {
    setGenerating(true);
    try {
      await invoiceAPI.downloadMonthlyReport(month, year);
      onClose();
    } catch (err) {
      alert('Failed to generate monthly expense report: ' + (err?.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Monthly Expense Report</h2>
            <p className="text-xs text-slate-500">Generate a printable executive PDF report for a billing period</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
            <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">What is included in this PDF report?</p>
              <ul className="list-disc list-inside text-blue-800/80 space-y-0.5">
                <li>Total spending, paid amounts & pending balances</li>
                <li>Vendor-wise expenditure breakdown table</li>
                <li>Complete itemized invoices table for the month</li>
                <li>GST taxes audit breakdown & report timestamp</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Month</label>
              <select
                value={month}
                onChange={e => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
              <select
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              onClick={onClose}
              disabled={generating}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={generating}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {generating ? 'Generating PDF…' : 'Generate & Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal 4: Upload Vendor PDF Modal
// ─────────────────────────────────────────────────────────────────────────────
function UploadVendorPdfModal({ invoice, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF document to upload.');
      return;
    }
    setUploading(true);
    setError('');

    try {
      await invoiceAPI.uploadOriginalPdf(invoice.id, file);
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Could not upload PDF document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Upload Vendor PDF</h2>
            <p className="text-xs text-slate-500">Attach the original vendor invoice document ({invoice.invoiceNumber})</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 mb-1">Select original invoice PDF</p>
            <p className="text-[11px] text-slate-400 mb-3">Accepted format: .pdf (Max 15MB)</p>
            <input
              type="file"
              accept=".pdf,application/pdf"
              required
              onChange={e => setFile(e.target.files[0] || null)}
              className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Uploading…' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
