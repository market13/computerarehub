/**
 * Anti-Spam & Input Validation Utility for Computer Care
 */

/**
 * Validate Indian 10-digit mobile number (allows optional +91 or 91 prefix)
 */
export function validateIndianPhone(phone) {
  if (!phone) return { isValid: false, message: 'Phone number is required.' };
  const clean = String(phone).replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
  if (!phoneRegex.test(clean)) {
    return {
      isValid: false,
      message: 'Please enter a valid 10-digit Indian mobile number (e.g. 9810550222).'
    };
  }
  return { isValid: true, sanitized: clean.slice(-10) };
}

/**
 * Validate email address format
 */
export function validateEmail(email) {
  if (!email) return { isValid: true, sanitized: '' }; // Optional in most forms
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  return { isValid: true, sanitized: String(email).trim().toLowerCase() };
}

/**
 * Client-side rate limiter / cooldown to stop spam bots
 * @param {string} formKey - Unique form identifier (e.g. 'quote_submit', 'repair_book')
 * @param {number} cooldownSeconds - Minimum seconds between submissions (default: 15s)
 */
export function checkSubmissionRateLimit(formKey, cooldownSeconds = 15) {
  try {
    const storageKey = `cc_rate_limit_${formKey}`;
    const lastTime = localStorage.getItem(storageKey);
    const now = Date.now();

    if (lastTime && now - parseInt(lastTime, 10) < cooldownSeconds * 1000) {
      const waitRemaining = Math.ceil((cooldownSeconds * 1000 - (now - parseInt(lastTime, 10))) / 1000);
      return {
        allowed: false,
        message: `Please wait ${waitRemaining}s before submitting another request.`
      };
    }

    localStorage.setItem(storageKey, String(now));
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}
