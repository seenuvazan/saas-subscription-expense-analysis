import { describe, it, expect } from 'vitest';
import { truncate, capitalizeFirst } from '../utils/stringHelpers';

describe('stringHelpers', () => {
  it('truncates long strings with ellipsis', () => {
    expect(truncate('Hello world this is a very long string', 10)).toBe('Hello worl...');
  });

  it('capitalizes first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });
});
