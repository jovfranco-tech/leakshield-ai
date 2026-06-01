import { verifyAuthToken } from './_lib/auth';
import { isRateLimited } from './_lib/rateLimit';
import { setSecureHeaders, sanitizeInput } from './_lib/security';

export default async function handler(req: any, res: any) {
  // 1. Establish Secure CORS Headers & Defenses
  setSecureHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido. Utiliza POST." });
  }

  // 2. Authenticate the Caller using Firebase ID Token
  const user = await verifyAuthToken(req);
  if (!user) {
    return res.status(401).json({ error: "No autorizado. Debes proporcionar un Firebase ID Token de sesión activo válido en la cabecera Authorization Bearer." });
  }

  // 3. Apply Rate Limiting (DoS and Abuse Defense)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const rateLimitKey = `${user.uid || clientIp}_ai`;
  const rateLimitStatus = isRateLimited(rateLimitKey, 10, 60000); // Max 10 AI queries per minute

  res.setHeader('X-RateLimit-Limit', '10');
  res.setHeader('X-RateLimit-Remaining', rateLimitStatus.remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimitStatus.resetTime.toString());

  if (rateLimitStatus.limited) {
    return res.status(429).json({ 
      error: "Has excedido la cuota de consultas conversacionales de IA. Por favor, espera 1 minuto para que el Copiloto procese nuevas solicitudes." 
    });
  }

  // 4. Secure & Validate Input (Prompt Injection and DoS Defense)
  const { message, userName, location, contextView } = req.body;

  // Strict clamp sizing to prevent Prompt Injections or high cost requests
  const sanitizedMessage = sanitizeInput(message || '', 500); 
  const sanitizedUserName = sanitizeInput(userName || 'Usuario', 40);
  const sanitizedLocation = sanitizeInput(location || 'México', 40);
  const sanitizedContextView = sanitizeInput(contextView || 'General', 40);

  if (!sanitizedMessage) {
    return res.status(400).json({ error: "Un parámetro 'message' de texto válido es requerido." });
  }

  // Comply with Zero Plaintext Leakage Policy (Do not log full prompts)
  console.log(`[ai-api] User [${user.uid}] queried AI copilot from view: ${sanitizedContextView}`);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[ai-api] GEMINI_API_KEY is not configured in server variables. Triggering local offline fallback.");
    // Return a clean offline fallback to prevent crashes, clearly marked
    return res.status(200).json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: `🛡️ **[AI offline fallback - Beta Controlada]** Hola **${sanitizedUserName}**, detecto que estás auditando tus datos desde **${sanitizedContextView}**.\n\nActualmente el copiloto está funcionando en modo local seguro offline (Beta). Para activar las respuestas de IA en tiempo real, configura la variable \`GEMINI_API_KEY\` en el panel de Vercel.\n\n*Recomendación de Higiene:* Recuerda rotar las claves expuestas y activar doble factor (2FA) en todos tus correos registrados.`
              }
            ]
          }
        }
      ]
    });
  }

  const systemInstruction = `Eres el analista de ciberseguridad y privacidad de LeakShield AI, un copiloto experto en ciberdefensa personal y de soberanía digital. Te estás comunicando con ${sanitizedUserName} de ${sanitizedLocation} en el panel de control de la sección "${sanitizedContextView}".
Tu objetivo es dar recomendaciones accionables, sumamente tácticas, concisas y elegantes.
Responde siempre en Español con un formato markdown impecable. Nunca inventes o afirmes que la aplicación realiza integraciones reales de eliminación que aún no estén soportadas en la beta.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `[System Instruction: ${systemInstruction}]\n\nUser Question: ${sanitizedMessage}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.25,
      maxOutputTokens: 800
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error(`[ai-api] Gemini API responded with error status: ${response.status}`);
      // Sanitized error to prevent internal stack leak (OWASP)
      return res.status(502).json({ error: "No se pudo descifrar la sugerencia de la IA en este momento." });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("[ai-api] Exception during Gemini proxy query:", error);
    return res.status(500).json({ error: "Excepción en el servidor proxy de IA seguro." });
  }
}
