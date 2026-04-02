/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} Validation result with isValid and error
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{4,6}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate username format
 * Requirements: 3-20 characters, alphanumeric and underscores only
 * @param {string} username - Username to validate
 * @returns {object} Validation result with isValid and error
 */
export const validateUsername = (username) => {
  if (!username || username.length < 3 || username.length > 20) {
    return {
      isValid: false,
      error: 'Username must be between 3 and 20 characters',
    };
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, and underscores',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};