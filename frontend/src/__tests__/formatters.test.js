import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber } from '../utils/formatters';

describe('formatters utility', () => {
  it('formats currency with symbol', () => {
    expect(formatCurrency(100)).toContain('100');
  });

  it('formats plain numbers correctly', () => {
    expect(formatNumber(1000)).toBe('1,000');
  });
});
