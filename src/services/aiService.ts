import { CopilotPlan, Task } from '../types/privacy';
import { generateDeletionRequest, getAliasStrategy } from '../lib/aiOrchestration';

export const aiService = {
  /**
   * Real-time query to Gemini AI Copilot securely proxied or directly queried in DEV mode
   */
  async queryCopilot(message: string, contextView: string, userName: string = 'Jovan Franco', location: string = 'Ciudad de México, MX'): Promise<string> {
    console.log(`[aiService] Copilot prompt received for view [${contextView}] from ${userName}: "${message}"`);

    const localApiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
    const isDev = (import.meta as any).env.DEV;

    if (isDev && localApiKey && localApiKey !== "FakeKeyPlaceholder") {
      console.log("[aiService] DEV Mode: Querying Gemini API directly from the client...");
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${localApiKey}`;
        const systemInstruction = `Eres el analista de ciberseguridad y privacidad de LeakShield AI, un copiloto experto en ciberdefensa personal y de soberanía digital. Te estás comunicando con ${userName} de ${location} en el panel de control de la sección "${contextView}".
Tu objetivo es dar recomendaciones accionables, sumamente tácticas, concisas y elegantes.
Responde siempre en Español con un formato markdown impecable.`;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
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
          })
        });

        if (res.ok) {
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo descifrar la respuesta de la IA.";
        } else {
          console.error(`[aiService] Direct Gemini query returned status ${res.status}`);
        }
      } catch (err) {
        console.error("[aiService] Direct Gemini query exception:", err);
      }
    } else {
      console.log("[aiService] Production Mode: Querying secure serverless AI proxy...");
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            userName,
            location,
            contextView
          })
        });

        if (res.ok) {
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo descifrar la respuesta de la IA.";
        } else {
          console.error(`[aiService] Serverless AI proxy query returned status ${res.status}`);
        }
      } catch (err) {
        console.error("[aiService] Serverless AI proxy query exception:", err);
      }
    }

    // High quality offline fallback
    return `🔒 **[LeakShield Copilot - Modo Desconectado]** Recibí tu consulta sobre *${contextView}*. Basado en tu perfil soberano (${userName}, ${location}), te sugiero priorizar la rotación de tus contraseñas reutilizadas y enviar solicitudes de remoción ARCO/CCPA a los data brokers activos.`;
  },

  /**
   * Generates a suppression request draft using local orchestration rules
   */
  async getDeletionDraft(target: string, type: 'ARCO' | 'GDPR' | 'CCPA' | 'Generic', userName: string = 'Usuario', location: string = 'Local'): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateDeletionRequest(target, type, userName, location));
      }, 200);
    });
  },

  /**
   * Build AI Today/This Week/Later plan dynamically
   */
  async getRemediationPlan(tasks: Task[]): Promise<CopilotPlan> {
    const pendingTasks = tasks.filter(t => t.status !== 'Resolved');
    
    const today = pendingTasks
      .filter(t => t.priority === 'Critical')
      .map(t => ({
        id: t.id,
        text: t.title,
        impact: t.priority === 'Critical' ? '+14' : '+8',
        priority: t.priority
      }));

    const thisWeek = pendingTasks
      .filter(t => t.priority === 'High' || (t.priority === 'Medium' && t.module === 'Brokers'))
      .map(t => ({
        id: t.id,
        text: t.title,
        impact: t.priority === 'High' ? '+10' : '+6',
        priority: t.priority
      }));

    const later = pendingTasks
      .filter(t => t.priority === 'Low' || (t.priority === 'Medium' && t.module !== 'Brokers'))
      .map(t => ({
        id: t.id,
        text: t.title,
        impact: t.priority === 'Low' ? '+3' : '+6',
        priority: t.priority
      }));

    return {
      Today: today,
      'This Week': thisWeek,
      Later: later
    };
  },

  async getAliasPlan(category: string, userEmail?: string) {
    return getAliasStrategy(category, userEmail);
  }
};
export default aiService;
