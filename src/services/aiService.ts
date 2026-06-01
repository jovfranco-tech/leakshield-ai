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
  async queryCopilot(message: string, contextView: string): Promise<string> {
    console.log(`[aiService] Copilot prompt received for view [${contextView}]: "${message}"`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `I've analyzed your query regarding *${contextView}*. Based on your current exposure profile (Alex Rivera, Mexico City), my recommendation is to prioritize fixing your reused credentials first, as they represent 84% of your immediate vulnerability. If you've already done that, we should draft a CCPA/ARCO suppression request for DataFind.`
        );
      }, 800);
    });
  },

  /**
   * Generates a suppression request draft using local orchestration rules
   */
  async getDeletionDraft(target: string, type: 'ARCO' | 'GDPR' | 'CCPA' | 'Generic'): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateDeletionRequest(target, type));
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

  async getAliasPlan(category: string) {
    return getAliasStrategy(category);
  }
};
