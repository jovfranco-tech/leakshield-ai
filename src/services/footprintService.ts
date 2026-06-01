import { FootprintFinding, OldAccount, DataBroker } from '../types/privacy';
import { demoFootprint, demoOldAccounts, demoDataBrokers } from '../data/demoFootprint';

/**
 * Public Footprint & Data Broker Tracker Service
 * 
 * Future Integration Plan (Real Backend):
 * - Google Custom Search API / Scraper Proxy: Perform authenticated keyword queries from backend serverless
 *   functions (rate-limited, sanitized) to discover public index postings of the user's phone, email, or usernames.
 * - Suppress / Opt-out queue: Connect removals to a secure queue (e.g. Supabase, Firebase, or Postgres via Prisma)
 *   to track the progress of deletion drafts dispatched to privacy@broker.com.
 */
export const footprintService = {
  async getFootprintFindings(): Promise<FootprintFinding[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...demoFootprint]);
      }, 250);
    });
  },

  async getOldAccounts(): Promise<OldAccount[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...demoOldAccounts]);
      }, 150);
    });
  },

  async getDataBrokers(): Promise<DataBroker[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...demoDataBrokers]);
      }, 150);
    });
  },

  /**
   * Mock deletion request dispatch
   */
  async dispatchDeletionRequest(brokerId: string, payload: string): Promise<boolean> {
    console.log(`[footprintService] Deletion request dispatched for broker: ${brokerId}`);
    console.log(`[footprintService] Payload size: ${payload.length} chars`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 600);
    });
  }
};
