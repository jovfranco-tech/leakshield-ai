export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: "Un parámetro 'email' válido es requerido." });
  }

  const apiKey = process.env.HIBP_API_KEY;
  if (!apiKey) {
    console.warn("[/api/breach] HIBP_API_KEY is not configured in Vercel environment variables.");
    // Return empty breaches list as fallback so the app continues operating cleanly
    return res.status(200).json([]);
  }

  const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email.trim())}?truncateResponse=false`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'hibp-api-key': apiKey,
        'user-agent': 'LeakShield-AI-SaaS'
      }
    });

    if (response.status === 404) {
      // 404 means the account was not found in any breach (it is clean!)
      return res.status(200).json([]);
    }

    if (response.status === 429) {
      console.warn("[/api/breach] HaveIBeenPwned API rate limit exceeded (429).");
      return res.status(429).json({ error: "Límite de velocidad de HaveIBeenPwned excedido. Por favor, re-intenta en unos segundos." });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[/api/breach] HIBP API responded with status ${response.status}:`, errText);
      return res.status(response.status).json({ error: `Error en la API de HaveIBeenPwned: ${response.statusText}` });
    }

    const breaches = await response.json();
    return res.status(200).json(breaches);
  } catch (error: any) {
    console.error("[/api/breach] Exception during HIBP proxy query:", error);
    return res.status(500).json({ error: "Excepción del servidor proxy: " + error.message });
  }
}
