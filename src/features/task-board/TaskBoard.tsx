import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { StatusPill } from '../../components/ui/StatusPill';
import { Task } from '../../types/privacy';

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTasks: (updated: Task[]) => void;
  onToast: (msg: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onUpdateTasks, onToast }) => {
  const FLOW: Task['status'][] = ["Pending", "In Progress", "Sent", "Resolved"];
  const [group, setGroup] = useState<'priority' | 'status'>('priority');

  const handleAdvanceTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id !== id) return t;
      if (t.status === "Monitor" || t.status === "Resolved") return t;
      
      const idx = FLOW.indexOf(t.status);
      const nextStatus = FLOW[Math.min(FLOW.length - 1, idx + 1)];
      onToast(`"${t.title}" → ${nextStatus}`);
      return { ...t, status: nextStatus };
    });
    onUpdateTasks(updated);
  };

  const cols = group === 'priority'
    ? (["Critical", "High", "Medium", "Low"] as const).map(k => ({ k, items: tasks.filter(t => t.priority === k) }))
    : (["Pending", "In Progress", "Sent", "Resolved"] as const).map(k => ({ 
        k, 
        items: tasks.filter(t => 
          (t.status === "Monitor" ? "Pending" : t.status) === k || (k === "Pending" && t.status === "Monitor")
        ) 
      }));

  const resolved = tasks.filter(t => t.status === "Resolved").length;

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Privacy Task Board</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Remediation tasks</h1>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1 rounded-[7px] bg-bg-2 border border-line text-t-1">
            <Icon name="check-circle" size={13} style={{ color: "var(--ok)", marginRight: 3 }} />
            {resolved}/{tasks.length} resolved
          </span>
          
          <div className="flex bg-bg-inset p-1 rounded-lg border border-line">
            <button 
              className={`px-3 py-1 rounded-md text-[12.5px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                group === "priority" 
                  ? "bg-bg-3 text-t-0" 
                  : "text-t-1 hover:text-t-0 bg-transparent"
              }`} 
              onClick={() => setGroup("priority")}
            >
              By priority
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-[12.5px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                group === "status" 
                  ? "bg-bg-3 text-t-0" 
                  : "text-t-1 hover:text-t-0 bg-transparent"
              }`} 
              onClick={() => setGroup("status")}
            >
              By status
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cols.map(col => (
          <div key={col.k} className="border border-line rounded-lg p-3 bg-bg-1 min-h-[120px]">
            <div className="flex items-center gap-2 pb-3 px-1.5">
              {group === "priority" 
                ? <Badge level={col.k as 'Critical' | 'High' | 'Medium' | 'Low'} /> 
                : <span className="text-[13.5px] font-semibold text-t-0">{col.k}</span>
              }
              <span className="ml-auto text-[11px] font-semibold px-2 py-0.2 rounded-full bg-bg-3 text-t-1">
                {col.items.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-2.5">
              {col.items.map(t => (
                <div 
                  key={t.id} 
                  className="border border-line rounded-md p-3.5 bg-bg-2 shadow-sm hover:border-line-2 active:translate-y-[0.5px] cursor-grab transition-all duration-120"
                  onClick={() => handleAdvanceTask(t.id)}
                >
                  <div className="flex justify-between items-center mb-2.5 flex-wrap gap-1.5">
                    {group === "priority" 
                      ? <StatusPill status={t.status} /> 
                      : <Badge level={t.priority} />
                    }
                    {t.ai && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-teal">
                        <Icon name="sparkles" size={11} style={{ marginRight: 3 }} />
                        AI
                      </span>
                    )}
                  </div>
                  
                  <div className="text-[13px] text-t-0 leading-[1.42] mb-3 font-medium">{t.title}</div>
                  
                  <div className="flex justify-between items-center text-[11.5px]">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                      <Icon name="kanban" size={11} style={{ marginRight: 3 }} />
                      {t.module}
                    </span>
                    <span className="text-t-2 font-mono">{t.effort}</span>
                  </div>
                </div>
              ))}
              
              {col.items.length === 0 && (
                <div className="text-t-2 text-[12px] text-center py-6 border border-dashed border-line rounded-lg">
                  Column clear
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-1.5 mt-5.5 text-t-3 text-[11.5px] justify-center">
        <Icon name="arrow-right" size={13} style={{ color: "var(--t-3)", flexShrink: 0 }} />
        <span>Tip: click any task to advance its status (Pending → In Progress → Sent → Resolved).</span>
      </div>
    </div>
  );
};
export default TaskBoard;
