import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { StatusPill } from '../../components/ui/StatusPill';
import { Task } from '../../types/privacy';

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

  // 3D Perspective Tilt Parallax
  const w = rect.width;
  const h = rect.height;
  const mouseX = x - w / 2;
  const mouseY = y - h / 2;
  const rX = (mouseY / (h / 2)) * -6; // Max 6deg
  const rY = (mouseX / (w / 2)) * 6;
  e.currentTarget.style.setProperty('--tilt-rx', `${rX}deg`);
  e.currentTarget.style.setProperty('--tilt-ry', `${rY}deg`);
};

const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  e.currentTarget.style.setProperty('--tilt-rx', '0deg');
  e.currentTarget.style.setProperty('--tilt-ry', '0deg');
};

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTasks: (updated: Task[]) => void;
  onToast: (msg: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onUpdateTasks, onToast }) => {
  const FLOW: Task['status'][] = ["Pending", "In Progress", "Sent", "Resolved"];
  const [group, setGroup] = useState<'priority' | 'status'>('priority');
  const [draggedOverCol, setDraggedOverCol] = useState<string | null>(null);

  const handleMoveTask = (id: string, targetKey: string) => {
    const updated = tasks.map(t => {
      if (t.id !== id) return t;
      if (group === 'status') {
        const nextStatus = targetKey as Task['status'];
        onToast(`"${t.title.slice(0, 30)}..." → ${statusLabelMap[nextStatus] || nextStatus}`);
        return { ...t, status: nextStatus };
      } else {
        const nextPriority = targetKey as Task['priority'];
        onToast(`"${t.title.slice(0, 30)}..." → Prioridad ${nextPriority}`);
        return { ...t, priority: nextPriority };
      }
    });
    onUpdateTasks(updated);
  };

  const statusLabelMap: Record<string, string> = {
    Pending: "Pendiente",
    "In Progress": "En Progreso",
    Sent: "Enviado",
    Resolved: "Resuelto",
    Monitor: "Monitoreo"
  };

  const handleAdvanceTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id !== id) return t;
      if (t.status === "Monitor" || t.status === "Resolved") return t;
      
      const idx = FLOW.indexOf(t.status);
      const nextStatus = FLOW[Math.min(FLOW.length - 1, idx + 1)];
      onToast(`"${t.title.slice(0, 30)}..." → ${statusLabelMap[nextStatus]}`);
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

  const translateModule = (m: string) => {
    if (m === "Breaches") return "Brechas";
    if (m === "Identity") return "Identidad";
    if (m === "Brokers") return "Brokers";
    if (m === "Footprint") return "Huella";
    return m;
  };

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Tablero de Tareas de Privacidad</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Tareas de remediación</h1>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1 rounded-[7px] bg-bg-2 border border-line text-t-1">
            <Icon name="check-circle" size={13} style={{ color: "var(--ok)", marginRight: 3 }} />
            {resolved}/{tasks.length} resueltas
          </span>
          
          <div className="flex bg-bg-inset p-1 rounded-lg border border-line">
            <button 
              className={`px-3 py-1 rounded-md text-[12.5px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                group === "priority" 
                  ? "bg-bg-3 text-t-0 shadow-premium" 
                  : "text-t-1 hover:text-t-0 bg-transparent"
              }`} 
              onClick={() => setGroup("priority")}
            >
              Por prioridad
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-[12.5px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                group === "status" 
                  ? "bg-bg-3 text-t-0 shadow-premium" 
                  : "text-t-1 hover:text-t-0 bg-transparent"
              }`} 
              onClick={() => setGroup("status")}
            >
              Por estado
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 animate-fadeIn">
        {cols.map(col => (
          <div 
            key={col.k} 
            className={`border rounded-lg p-3 bg-bg-1 min-h-[120px] transition-all duration-150 ${
              draggedOverCol === col.k ? 'border-teal/60 bg-teal-dim/10 shadow-premium scale-[1.01]' : 'border-line'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setDraggedOverCol(col.k);
            }}
            onDragLeave={() => {
              setDraggedOverCol(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const taskId = e.dataTransfer.getData('text/plain');
              handleMoveTask(taskId, col.k);
              setDraggedOverCol(null);
            }}
          >
            <div className="flex items-center gap-2 pb-3 px-1.5">
              {group === "priority" 
                ? <Badge level={col.k as 'Critical' | 'High' | 'Medium' | 'Low'} /> 
                : <span className="text-[13.5px] font-semibold text-t-0">{col.k === "Pending" ? "Pendientes" : col.k === "In Progress" ? "En Progreso" : col.k === "Sent" ? "Enviadas" : "Resueltas"}</span>
              }
              <span className="ml-auto text-[11px] font-semibold px-2 py-0.2 rounded-full bg-bg-3 text-t-1">
                {col.items.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-2.5">
              {col.items.map(t => (
                <div 
                  key={t.id} 
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', t.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="group relative overflow-hidden border border-line rounded-md p-3.5 bg-bg-2 shadow-sm hover:border-line-2 cursor-grab active:cursor-grabbing transition-all duration-120 glossy-sweep noise-grain"
                  style={{
                    transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
                    transition: 'transform 0.15s ease-out, border-color 0.2s, box-shadow 0.2s'
                  }}
                  onClick={() => handleAdvanceTask(t.id)}
                >
                  {/* Radial Hover Glow & Specular Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                    background: `radial-gradient(200px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.04), transparent 80%)`
                  }} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.003] to-white/[0.015] pointer-events-none" />

                  <div className="flex justify-between items-center mb-2.5 flex-wrap gap-1.5 relative z-10">
                    {group === "priority" 
                      ? <StatusPill status={t.status === "Pending" ? "Pending" : t.status === "In Progress" ? "In Progress" : t.status === "Sent" ? "Sent" : t.status === "Resolved" ? "Resolved" : "Monitor"} /> 
                      : <Badge level={t.priority} />
                    }
                    {t.ai && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-teal">
                        <Icon name="sparkles" size={11} style={{ marginRight: 3 }} />
                        IA
                      </span>
                    )}
                  </div>
                  
                  <div className="text-[13px] text-t-0 leading-[1.42] mb-3 font-medium relative z-10">{t.title}</div>
                  
                  <div className="flex justify-between items-center text-[11.5px] relative z-10">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                      <Icon name="kanban" size={11} style={{ marginRight: 3 }} />
                      {translateModule(t.module)}
                    </span>
                    <span className="text-t-2 font-mono">{t.effort === "done" || t.effort === "hecho" ? "hecho" : t.effort === "auto" ? "auto" : t.effort === "enviado" ? "enviado" : t.effort === "monitoreo" ? "monitoreo" : t.effort}</span>
                  </div>
                </div>
              ))}
              
              {col.items.length === 0 && (
                <div className="text-t-2 text-[12px] text-center py-6 border border-dashed border-line rounded-lg">
                  Columna vacía
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-1.5 mt-5.5 text-t-3 text-[11.5px] justify-center">
        <Icon name="arrow-right" size={13} style={{ color: "var(--t-3)", flexShrink: 0 }} />
        <span>Consejo: arrastra las tareas entre columnas o haz clic en ellas para avanzar su estado de forma interactiva.</span>
      </div>
    </div>
  );
};
export default TaskBoard;
