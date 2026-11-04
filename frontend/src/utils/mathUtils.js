export function calculatePercentage(part, total) {
  if (!total || total === 0) return 0;
  return Math.round((part / total) * 100);
}

export function sumBy(array, key) {
  if (!Array.isArray(array)) return 0;
  return array.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
}

export function calculateBurnRate(monthlySpend, budget) {
  if (!budget || budget === 0) return 0;
  return (monthlySpend / budget) * 100;
}
