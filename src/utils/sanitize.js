import DOMPurify from 'dompurify'

// Configure DOMPurify
DOMPurify.setConfig({
  ALLOWED_TAGS: [
    'b',
    'i',
    'em',
    'strong',
    'a',
    'p',
    'br',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'class'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
})

/**
 * Sanitize a single input string
 */
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim())
  }
  return input
}

/**
 * Sanitize an entire object recursively
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj

  const sanitized = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]

      if (typeof value === 'string') {
        sanitized[key] = DOMPurify.sanitize(value.trim())
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
  }

  return sanitized
}

/**
 * Escape HTML special characters
 */
export const escapeHtml = (text) => {
  if (!text) return text

  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }

  return String(text).replace(/[&<>"']/g, (char) => htmlEscapes[char])
}
