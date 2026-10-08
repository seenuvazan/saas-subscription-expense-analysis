import { describe, it, expect } from 'vitest';
import { formatShortDate } from '../utils/dateHelpers';

describe('dateHelpers', () => {
  it('formats short date correctly', () => {
    const res = formatShortDate('2026-05-15');
    expect(res).toContain('2026');
  });
});
