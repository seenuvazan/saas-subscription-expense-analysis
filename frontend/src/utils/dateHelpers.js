export function getDaysUntil(targetDate) {
  if (!targetDate) return 0;
  const now = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isDateInPast(dateString) {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
}

export function formatShortDate(dateString) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
}
