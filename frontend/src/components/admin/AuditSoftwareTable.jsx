import React, { useState } from 'react';
import VendorLogo from '../common/VendorLogo';
import { formatDate, getDaysRemaining, formatINRCompact, USD_TO_INR } from '../../utils/formatters';
import { DEPARTMENTS } from '../../utils/constants';
import { Search, Trash2, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'ACTIVE', 'FLAGGED_IDLE', 'FLAGGED_DUPLICATE', 'CANCELLED'];
const CATEGORIES     = ['ALL', 'DEV', 'DESIGN', 'SALES', 'MARKETING', 'PRODUCTIVITY', 'HR', 'FINANCE', 'OTHER'];

const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE:            { label: 'Active',      cls: 'badge-success' },
    FLAGGED_IDLE:      { label: 'Idle',         cls: 'badge-warning' },
    FLAGGED_DUPLICATE: { label: 'Duplicate',    cls: 'badge-danger' },
    CANCELLED:         { label: 'Cancelled',    cls: 'badge-neutral' },
  };
  const s = map[status] || { label: status, cls: 'badge-neutral' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

const UtilBadge = ({ pct }) => {
  if (pct >= 80) return <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>{Math.round(pct)}%</span>;
  if (pct >= 50) return <span className="text-xs font-semibold" style={{ color: 'var(--warning)' }}>{Math.round(pct)}%</span>;
  return <span className="text-xs font-bold" style={{ color: 'var(--danger)' }}>{Math.round(pct)}% — Low</span>;
};

const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <ChevronUp className="w-3 h-3 opacity-20" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3" style={{ color: 'var(--accent)' }} />
    : <ChevronDown className="w-3 h-3" style={{ color: 'var(--accent)' }} />;
};

const AuditSoftwareTable = ({ subscriptions = [], onUpdateStatus, onDelete, onOpenDrawer }) => {
  const [filterStatus,   setFilterStatus]   = useState('ALL');
  const [filterDept,     setFilterDept]     = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchTerm,     setSearchTerm]     = useState('');
  const [sortField,      setSortField]      = useState('vendorName');
  const [sortDir,        setSortDir]        = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredSubs = subscriptions
    .filter(sub => {
      const matchStatus   = filterStatus === 'ALL'   || sub.status === filterStatus;
      const matchDept     = filterDept === 'ALL'     || sub.department === filterDept;
      const matchCategory = filterCategory === 'ALL' || sub.category === filterCategory;
      const matchSearch   = !searchTerm ||
        sub.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.owner?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchDept && matchCategory && matchSearch;
    })
    .sort((a, b) => {
      let aVal, bVal;
      if (sortField === 'cost') {
        aVal = a.normalizedMonthlyCostUSD || a.cost || 0;
        bVal = b.normalizedMonthlyCostUSD || b.cost || 0;
      } else if (sortField === 'utilization') {
        aVal = a.utilizationRate || 0;
        bVal = b.utilizationRate || 0;
      } else if (sortField === 'renewal') {
        aVal = a.nextRenewalDate ? new Date(a.nextRenewalDate).getTime() : Infinity;
        bVal = b.nextRenewalDate ? new Date(b.nextRenewalDate).getTime() : Infinity;
      } else {
        aVal = (a[sortField] || '').toString().toLowerCase();
        bVal = (b[sortField] || '').toString().toLowerCase();
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const flaggedCount = subscriptions.filter(s =>
    s.status === 'FLAGGED_IDLE' || s.status === 'FLAGGED_DUPLICATE'
  ).length;

  const selectStyle = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: '7px',
    padding: '0.375rem 0.75rem',
    fontSize: '0.8rem',
    outline: 'none',
    cursor: 'pointer',
  };

  const ThCell = ({ label, field, align = 'left' }) => (
    <th
      className={`py-3 px-4 cursor-pointer select-none ${align === 'right' ? 'text-right' : ''}`}
      onClick={() => field && handleSort(field)}
      style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}
    >
      <span className="flex items-center gap-1" style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        {label}
        {field && <SortIcon field={field} sortField={sortField} sortDir={sortDir} />}
      </span>
    </th>
  );

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Subscription Inventory
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {filteredSubs.length} of {subscriptions.length} subscriptions shown
              {flaggedCount > 0 && (
                <span style={{ color: 'var(--warning)' }}> · {flaggedCount} flagged for review</span>
              )}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search vendor, dept…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  ...selectStyle,
                  paddingLeft: '1.75rem',
                  width: '160px',
                }}
              />
            </div>

            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === 'ALL' ? 'All statuses' : s.replace('FLAGGED_', '')}</option>
              ))}
            </select>

            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={selectStyle}>
              <option value="ALL">All depts</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={selectStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All categories' : c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr style={{ background: 'var(--bg-elevated)' }}>
              <ThCell label="Vendor"       field="vendorName" />
              <ThCell label="Department"   field="department" />
              <ThCell label="Category"     field="category" />
              <ThCell label="Monthly (INR)" field="cost" align="right" />
              <ThCell label="Utilization"  field="utilization" />
              <ThCell label="Renewal"      field="renewal" />
              <ThCell label="Status"       />
              <ThCell label="Actions"      align="right" />
            </tr>
          </thead>
          <tbody>
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center">
                  <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No subscriptions found</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {searchTerm ? `No results for "${searchTerm}"` : 'Try adjusting your filters.'}
                  </p>
                </td>
              </tr>
            ) : filteredSubs.map((sub) => {
              const inrMonthly = sub.currency === 'INR'
                ? sub.cost
                : (sub.normalizedMonthlyCostUSD || sub.cost || 0) * USD_TO_INR;
              const utilRatio = sub.utilizationRate !== undefined
                ? sub.utilizationRate
                : (sub.assignedSeats > 0 ? (sub.usedSeats / sub.assignedSeats * 100) : 100);
              const daysLeft  = getDaysRemaining(sub.nextRenewalDate);
              const daysUrgent = daysLeft <= 7;
              const daysWarn  = daysLeft <= 30;

              return (
                <tr key={sub.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <VendorLogo vendorName={sub.vendorName} size="sm" />
                      <div>
                        <button
                          onClick={() => onOpenDrawer && onOpenDrawer(sub)}
                          className="text-xs font-semibold hover:underline text-left"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {sub.vendorName}
                        </button>
                        {sub.currency && sub.currency !== 'INR' && (
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {sub.currency}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sub.department}</span>
                  </td>
                  <td>
                    <span className={`text-xs font-medium cat-text-${sub.category}`}>{sub.category}</span>
                  </td>
                  <td className="text-right">
                    <span className="text-xs font-semibold text-currency" style={{ color: 'var(--text-primary)' }}>
                      {formatINRCompact(inrMonthly)}
                    </span>
                    {sub.currency !== 'INR' && (
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        ${Number(sub.cost || 0).toLocaleString('en-US')} USD
                      </p>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-bar w-16">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.min(utilRatio, 100)}%`,
                            background: utilRatio < 50 ? 'var(--danger)' : utilRatio < 80 ? 'var(--warning)' : 'var(--success)',
                          }}
                        />
                      </div>
                      <UtilBadge pct={utilRatio} />
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {sub.usedSeats}/{sub.assignedSeats} seats
                    </p>
                  </td>
                  <td>
                    {sub.nextRenewalDate ? (
                      <div>
                        <p
                          className="text-xs font-medium"
                          style={{ color: daysUrgent ? 'var(--danger)' : daysWarn ? 'var(--warning)' : 'var(--text-primary)' }}
                        >
                          {daysLeft <= 0 ? 'Today' : `${daysLeft}d`}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {formatDate(sub.nextRenewalDate)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onOpenDrawer && (
                        <button
                          onClick={() => onOpenDrawer(sub)}
                          title="View details"
                          className="p-1.5 rounded-lg transition-colors border"
                          style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'transparent' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--accent)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {sub.status !== 'CANCELLED' ? (
                        <button
                          onClick={() => onUpdateStatus(sub.id, 'CANCELLED')}
                          className="px-2 py-1 rounded-md text-xs font-medium transition-colors"
                          style={{ background: 'var(--danger-muted)', color: 'var(--danger)' }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus(sub.id, 'ACTIVE')}
                          className="px-2 py-1 rounded-md text-xs font-medium transition-colors"
                          style={{ background: 'var(--success-muted)', color: 'var(--success)' }}
                        >
                          Activate
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(sub.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditSoftwareTable;
