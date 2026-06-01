import { BreachFinding, HighRiskDataClass } from '../types/privacy';
import { demoBreaches, highRiskDataClasses } from '../data/demoBreaches';

/**
 * Breach Intelligence Service
 * 
 * Future Integration Plan (Real Backend):
 * - Have I Been Pwned API: Do NOT query HIBP from the frontend directly to avoid exposing API keys.
 *   Call a serverless function endpoint (e.g. `/api/breach-lookup`) that acts as a secure rate-limited proxy.
 * - Pwned Passwords K-Anonymity: For password checking, hash the password locally using SHA-1,
 *   send ONLY the first 5 characters of the hash to the serverless proxy, receive the suffix candidates,
 *   and perform matching client-side. The full password NEVER leaves the client.
 */
export const breachService = {
  /**
   * Fetch all breaches matching monitored identifiers
   */
  async getBreaches(): Promise<BreachFinding[]> {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...demoBreaches]);
      }, 300);
    });
  },

  /**
   * Fetch high-risk compromised data classes
   */
  async getHighRiskData(): Promise<HighRiskDataClass[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...highRiskDataClasses]);
      }, 200);
    });
  },

  /**
   * Simulate a password rotation trigger
   */
  async rotatePassword(breachId: string): Promise<boolean> {
    console.log(`[breachService] Triggered password rotation sequence for breach: ${breachId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
};
