import { Task } from '../types/privacy';
import { demoTasks } from '../data/demoTasks';

/**
 * Task & Remediation Board Service
 * 
 * Future Integration Plan (Real Backend):
 * - Store tasks in a user-authenticated database (Supabase DB, Firebase Firestore, or custom Prisma Postgres).
 * - Real-time subscriptions let dashboard scorecards refresh instantly when a task status transitions.
 */
let cachedTasks: Task[] = [...demoTasks];

export const taskService = {
  async getTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...cachedTasks]);
      }, 100);
    });
  },

  async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task[]> {
    cachedTasks = cachedTasks.map(t => t.id === taskId ? { ...t, status } : t);
    console.log(`[taskService] Task updated: ${taskId} -> ${status}`);
    return this.getTasks();
  },

  async resetTasks(): Promise<Task[]> {
    cachedTasks = [...demoTasks];
    return this.getTasks();
  }
};
