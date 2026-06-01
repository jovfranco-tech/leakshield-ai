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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  const { message, userName = 'Usuario', location = 'Ubicación no especificada', contextView = 'General' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: "Un parámetro 'message' de texto es requerido." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[/api/ai] GEMINI_API_KEY is not configured in Vercel environment variables. Using high-quality offline simulated responder.");
    // Fallback response if API key is not configured yet
    return res.status(200).json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: `🔒 **[LeakShield Copilot - Modo Desconectado]** Hola, **${userName}** (${location}). Detecto que estás en la sección de **${contextView}**.\n\nHe recibido tu consulta: *"${message}"*.\n\nPara poder brindarte respuestas reales de inteligencia artificial generativa integradas en la nube, es necesario configurar tu \`GEMINI_API_KEY\` en el panel de control de Vercel. Mientras tanto, analicé tu perfil y te sugiero priorizar la rotación de tus credenciales y activar doble factor de autenticación (2FA) en todos tus correos bajo vigilancia.`
              }
            ]
          }
        }
      ]
    });
  }

  const systemInstruction = `Eres el analista de ciberseguridad y privacidad de LeakShield AI, un copiloto experto en ciberdefensa personal y de soberanía digital. Te estás comunicando con ${userName} de ${location} en el panel de control de la sección "${contextView}".
Tu objetivo es dar recomendaciones accionables, sumamente tácticas, concisas y elegantes.
Ayúdale con técnicas específicas de rotación de contraseñas (k-anonymity), exclusión de brokers de datos (solicitudes ARCO, CCPA, GDPR), enmascaramiento SMTP y eliminación de metadatos EXIF.
Usa un formato markdown impecable con emojis de seguridad para destacar puntos clave, y mantén un tono profesional, protector y altamente sofisticado. Responde siempre en Español.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `[System Instruction: ${systemInstruction}]\n\nUser Question: ${message}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.25,
      maxOutputTokens: 1024
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
      const errText = await response.text();
      console.error(`[/api/ai] Gemini API responded with status ${response.status}:`, errText);
      return res.status(response.status).json({ error: `Error en la API de Gemini: ${response.statusText}`, detail: errText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("[/api/ai] Exception during Gemini proxy query:", error);
    return res.status(500).json({ error: "Excepción del servidor proxy de IA: " + error.message });
  }
}
