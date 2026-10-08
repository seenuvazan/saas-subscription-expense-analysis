// Exchange rate: 1 USD = 84.5 INR (approximate)
export const USD_TO_INR = 84.5;

/**
 * Format a number as Indian Rupees with Indian digit grouping.
 * e.g. 1250000 → ₹12,50,000
 */
export const formatINR = (amount, compact = false) => {
  if (amount === undefined || amount === null) return '₹0';
  const val = Number(amount);
  if (isNaN(val)) return '₹0';

  if (compact) {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000)   return `₹${(val / 100000).toFixed(2)}L`;
    if (val >= 1000)     return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val.toLocaleString('en-IN')}`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

/**
 * Convert USD amount to INR and format with Indian grouping.
 */
export const usdToINR = (usdAmount, compact = false) => {
  const inrAmount = Number(usdAmount || 0) * USD_TO_INR;
  return formatINR(inrAmount, compact);
};

/**
 * Format INR in compact "lakh/crore" notation for dashboards.
 * e.g. 1248500 → ₹12.49L
 */
export const formatINRCompact = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  const val = Number(amount);
  if (isNaN(val)) return '₹0';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000)   return `₹${(val / 100000).toFixed(2)}L`;
  if (val >= 1000)     return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
};

/**
 * Format currency — preserves backward compatibility.
 * Now defaults to showing USD as-is for foreign currencies,
 * while using INR for local subscriptions.
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '$0';
  const val = Number(amount);
  if (currency === 'INR') {
    return formatINR(val);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(val);
};

/**
 * Format a USD monthly amount as INR equivalent string.
 * Shows both original and INR value.
 */
export const formatCostWithINR = (usdAmount, currency = 'USD') => {
  if (!usdAmount) return '—';
  const usd = Number(usdAmount);
  if (currency === 'INR') {
    return formatINR(usd);
  }
  const inr = usd * USD_TO_INR;
  return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usd)} (${formatINRCompact(inr)})`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getDaysRemaining = (dateString) => {
  if (!dateString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 30) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
