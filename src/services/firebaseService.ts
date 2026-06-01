import { Task } from '../types/privacy';
import { auth, db } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { demoTasks } from '../data/demoTasks';

/**
 * Firebase Firestore Client Proxy Service
 * 
 * SECURITY BOUNDARY (Privacy-by-Design):
 * - Isolated Client-side writes: All data is saved under 'users/{uid}/tasks' so that users
 *   only read and write their own data, verified by Firestore Security Rules.
 * - Decoupled integration: Fits cleanly into existing hooks.
 */
export const firebaseService = {
  /**
   * Fetch tasks synchronized with Cloud Firestore for the active authenticated user
   */
  async getTasks(): Promise<Task[]> {
    const user = auth.currentUser;
    if (!user) {
      console.warn("[firebaseService] No logged-in user to fetch tasks from Firestore.");
      return [];
    }
    
    console.log(`[firebaseService] Fetching tasks from Cloud Firestore for user: ${user.uid}`);
    try {
      const colRef = collection(db, 'users', user.uid, 'tasks');
      const snap = await getDocs(colRef);
      const list: Task[] = [];
      snap.forEach(doc => {
        list.push(doc.data() as Task);
      });
      
      // Seed Firestore with default remediation tasks if it's the first time
      if (list.length === 0) {
        await this.resetTasks(demoTasks);
        return demoTasks;
      }
      return list;
    } catch (e) {
      console.error("[firebaseService] Failed to load tasks from Firestore", e);
      return [];
    }
  },

  /**
   * Update task status in Cloud Firestore
   */
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    
    console.log(`[firebaseService] Syncing task ${taskId} status update [${status}] to Cloud Firestore for user ${user.uid}...`);
    try {
      const docRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await updateDoc(docRef, { status });
      return true;
    } catch (e) {
      console.error("[firebaseService] Failed to update task status in Firestore", e);
      return false;
    }
  },

  /**
   * Reset all database tasks in Firestore
   */
  async resetTasks(freshTasks: Task[]): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    
    console.log(`[firebaseService] Resetting and re-seeding Cloud Firestore tasks for user ${user.uid}...`);
    try {
      for (const t of freshTasks) {
        const docRef = doc(db, 'users', user.uid, 'tasks', t.id);
        await setDoc(docRef, t);
      }
      return true;
    } catch (e) {
      console.error("[firebaseService] Failed to reset tasks in Firestore", e);
      return false;
    }
  }
};
export default firebaseService;
