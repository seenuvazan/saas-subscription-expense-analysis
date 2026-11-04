export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function validatePasswordStrength(password) {
  if (!password) return { isValid: false, message: 'Password is required' };
  if (password.length < 8) return { isValid: false, message: 'Must be at least 8 characters' };
  return { isValid: true, message: 'Strong password' };
}

export function validateRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}
