import { CopilotPlan, Task } from '../types/privacy';
import { generateDeletionRequest, getAliasStrategy } from '../lib/aiOrchestration';

/**
 * AI Orchestration Service
 * 
 * Future Integration Plan (Real Backend):
 * - Crucial: NEVER call Google Gemini API directly from the frontend to protect API keys.
 * - Route prompt calls through server-side proxy functions (Vertex AI SDK or standard Gemini REST endpoints on backend).
 * - Ensure client requests are rate-limited and user-scoped to prevent prompt injections and abuse.
 */
export const aiService = {
  /**
   * Mock copilot chat query
   */
  async queryCopilot(message: string, contextView: string, userName: string = 'Jovan Franco', location: string = 'Ciudad de México, MX'): Promise<string> {
    console.log(`[aiService] Copilot prompt received for view [${contextView}] from ${userName}: "${message}"`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Analicé tu consulta sobre *${contextView}*. Basado en tu perfil de exposición soberano (${userName}, ${location}), mi recomendación es priorizar la rotación de tus credenciales reutilizadas, ya que representan el 84% de tu vulnerabilidad inmediata. Si ya realizaste esto, deberíamos redactar y enviar una solicitud de remoción ARCO/CCPA dirigida al broker DataFind.`
        );
      }, 800);
    });
  },

  /**
   * Generates a suppression request draft using local orchestration rules
   */
  async getDeletionDraft(target: string, type: 'ARCO' | 'GDPR' | 'CCPA' | 'Generic', userName: string = 'Usuario', location: string = 'Local'): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateDeletionRequest(target, type, userName, location));
      }, 300);
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
        impact: t.id === 't1' ? '+8' : '+4',
        priority: t.priority
      }));

    const thisWeek = pendingTasks
      .filter(t => t.priority === 'High' || (t.priority === 'Medium' && t.module === 'Brokers'))
      .map(t => ({
        id: t.id,
        text: t.title,
        impact: t.id === 't5' ? '+3' : '+2',
        priority: t.priority
      }));

    const later = pendingTasks
      .filter(t => t.priority === 'Low' || (t.priority === 'Medium' && t.module !== 'Brokers'))
      .map(t => ({
        id: t.id,
        text: t.title,
        impact: t.priority === 'Low' ? '—' : '+1',
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
