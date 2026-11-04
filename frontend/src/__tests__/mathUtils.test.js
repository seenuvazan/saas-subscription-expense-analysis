import { describe, it, expect } from 'vitest';
import { calculatePercentage, sumBy } from '../utils/mathUtils';

describe('mathUtils', () => {
  it('calculates percentage correctly', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(0, 0)).toBe(0);
  });

  it('sums array by key', () => {
    const list = [{ val: 10 }, { val: 20 }, { val: 30 }];
    expect(sumBy(list, 'val')).toBe(60);
  });
});
