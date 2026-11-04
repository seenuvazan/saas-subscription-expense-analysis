import { describe, it, expect } from 'vitest';
import { validateEmail, validatePasswordStrength } from '../utils/validationRules';

describe('validationRules', () => {
  it('validates proper email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });

  it('validates password minimum length', () => {
    expect(validatePasswordStrength('12345678').isValid).toBe(true);
    expect(validatePasswordStrength('short').isValid).toBe(false);
  });
});
