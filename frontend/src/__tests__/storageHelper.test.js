import { describe, it, expect } from 'vitest';
import { storage } from '../utils/storageHelper';

describe('storageHelper', () => {
  it('handles default values gracefully', () => {
    expect(storage.get('non_existent_key', 'fallback')).toBe('fallback');
  });
});
