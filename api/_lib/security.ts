/**
 * Serverless Security & CORS hardened library
 * OWASP-lite security compliance for LeakShield AI v0.2.0
 */

export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://leakshield-ai.vercel.app')
  .split(',')
  .map(o => o.trim());

/**
 * Configure secure CORS headers dynamically based on allowed origins whitelist
 */
export function setSecureHeaders(req: any, res: any) {
  const origin = req.headers.origin;
  
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Default to the first allowed origin or none in production to maintain strict CORS
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0] || '');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Secure browser policies
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

/**
 * Defensive input sanitization: Strips HTML/Script injection tags and clamps length
 */
export function sanitizeInput(val: string, maxLength: number = 200): string {
  if (!val) return '';
  return val
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ""); // Strip HTML tags
}

/**
 * Mask PII emails in logs to ensure zero plaintext leak in telemetries
 * e.g. jovan.franco@techflow.io -> jo***co@techflow.io
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'invalid-email';
  const [local, domain] = email.split('@');
  if (local.length <= 4) {
    return `${local.charAt(0)}***@${domain}`;
  }
  return `${local.slice(0, 2)}***${local.slice(-2)}@${domain}`;
}
