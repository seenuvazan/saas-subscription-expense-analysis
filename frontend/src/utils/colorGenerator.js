const PALETTE = [
  '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6',
  '#8b5cf6', '#14b8a6', '#f43f5e', '#06b6d4', '#eab308'
];

export function getColorForIndex(index) {
  return PALETTE[index % PALETTE.length];
}

export function getAlphaColor(hex, alpha = 0.2) {
  return `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
}
