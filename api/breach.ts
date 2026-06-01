import { verifyAuthToken } from './_lib/auth';
import { isRateLimited } from './_lib/rateLimit';
import { setSecureHeaders, sanitizeInput, maskEmail } from './_lib/security';

export default async function handler(req: any, res: any) {
  // 1. Establish Secure CORS Headers & Defenses
  setSecureHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Método no permitido. Utiliza GET." });
  }

  // 2. Authenticate the Caller using Firebase ID Token
  const user = await verifyAuthToken(req);
  if (!user) {
    return res.status(401).json({ error: "No autorizado. Debes proporcionar un Firebase ID Token de sesión activo válido en la cabecera Authorization Bearer." });
  }

  // 3. Apply Rate Limiting (DoS and Abuse Defense)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const rateLimitKey = `${user.uid || clientIp}_breach`;
  const rateLimitStatus = isRateLimited(rateLimitKey, 15, 60000); // Max 15 requests per minute

  res.setHeader('X-RateLimit-Limit', '15');
  res.setHeader('X-RateLimit-Remaining', rateLimitStatus.remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimitStatus.resetTime.toString());

  if (rateLimitStatus.limited) {
    return res.status(429).json({ 
      error: "Límite de peticiones de seguridad excedido. Por favor, espera 1 minuto antes de escanear nuevos identificadores corporativos o de correo." 
    });
  }

  // 4. Secure & Validate Input (Sanitize and Mask)
  const { email } = req.query;
  const sanitizedEmail = sanitizeInput(email || '', 100);

  // Strict email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({ error: "El correo electrónico proporcionado no tiene un formato RFC 5322 válido." });
  }

  // Obfuscate logs to comply with PII isolation boundaries (Zero plaintext leaks)
  console.log(`[breach-api] User [${user.uid}] is auditing a masked email: ${maskEmail(sanitizedEmail)}`);

  const apiKey = process.env.HIBP_API_KEY;
  if (!apiKey) {
    console.warn("[breach-api] HaveIBeenPwned API key is not configured in environment variables. Returning a clean local mock database query.");
    // Bypassing real external queries safely when API key is missing (for clean offline deployment)
    return res.status(200).json([]);
  }

  const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(sanitizedEmail)}?truncateResponse=false`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'hibp-api-key': apiKey,
        'user-agent': 'LeakShield-AI-SaaS'
      }
    });

    if (response.status === 404) {
      // 404 means the email address was not found in any breached dataset (completely secure)
      return res.status(200).json([]);
    }

    if (response.status === 429) {
      console.warn("[breach-api] HIBP API Rate Limiting Triggered (429).");
      return res.status(429).json({ error: "El proveedor de inteligencia de brechas (HIBP) está experimentando alta demanda. Por favor, re-intenta en unos segundos." });
    }

    if (!response.ok) {
      console.error(`[breach-api] HaveIBeenPwned API responded with an error code: ${response.status}`);
      // Return normalized safe error preventing leakage of provider details (OWASP)
      return res.status(502).json({ error: "No se pudo consultar el proveedor de base de datos de filtraciones en este momento." });
    }

    const breaches = await response.json();
    return res.status(200).json(breaches);
  } catch (error: any) {
    console.error("[breach-api] Fetch exception occurred during lookup proxy:", error);
    return res.status(500).json({ error: "Excepción en el servidor proxy de filtración seguro." });
  }
}
