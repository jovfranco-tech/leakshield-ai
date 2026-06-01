import { useMemo } from 'react';
import { Task, PrivacyScore } from '../types/privacy';
import { calculateScore } from '../lib/riskScoring';

export const useScoring = (tasks: Task[]): PrivacyScore => {
  return useMemo(() => {
    return calculateScore(tasks);
  }, [tasks]);
};
export default useScoring;
