import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/privacy';
import { taskService } from '../services/taskService';
import { firebaseService } from '../services/firebaseService';

export const useTaskBoard = (onToast?: (msg: string) => void) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        let list = await firebaseService.getTasks();
        if (!list || list.length === 0) {
          list = await taskService.getTasks();
        }
        setTasks(list);
      } catch (err) {
        console.warn("[useTaskBoard] Failed to load tasks from Firebase, falling back to local taskService", err);
        const list = await taskService.getTasks();
        setTasks(list);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    try {
      await taskService.updateTaskStatus(taskId, status);
      await firebaseService.updateTaskStatus(taskId, status);
    } catch (err) {
      console.warn("[useTaskBoard] Sync failed for task status update", err);
    }
  }, []);

  const resetAllTasks = useCallback(async () => {
    setLoading(true);
    try {
      const fresh = await taskService.resetTasks();
      await firebaseService.resetTasks(fresh);
      setTasks(fresh);
      if (onToast) onToast("Datos demo restablecidos");
    } catch (err) {
      console.warn("[useTaskBoard] Reset failed", err);
      const fresh = await taskService.resetTasks();
      setTasks(fresh);
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  return { tasks, loading, updateTaskStatus, resetAllTasks, setTasks };
};
export default useTaskBoard;
