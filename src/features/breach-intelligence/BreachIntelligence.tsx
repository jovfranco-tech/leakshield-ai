import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { StatusPill } from '../../components/ui/StatusPill';
import { AIInsightCard } from '../../components/ui/AIInsightCard';
import { BreachFinding } from '../../types/privacy';

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
};

interface BreachIntelligenceProps {
  breaches: BreachFinding[];
  inlineAI: boolean;
  onToast: (msg: string) => void;
  onResolveTask?: (taskId: string, resolved: boolean) => void;
}

export const BreachIntelligence: React.FC<BreachIntelligenceProps> = ({
  breaches,
  inlineAI,
  onToast,
  onResolveTask
}) => {
  const [list, setList] = useState<BreachFinding[]>(breaches);
  const [sel, setSel] = useState<string>(breaches[0].id);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');
  
  const levels: ('All' | 'Critical' | 'High' | 'Medium')[] = ["All", "Critical", "High", "Medium"];
  const labelMap: Record<string, string> = { All: "Todas", Critical: "Críticas", High: "Altas", Medium: "Medias" };

  const filteredList = list.filter(b => filter === "All" || b.severity === filter);
  const b = list.find(x => x.id === sel) || filteredList[0] || list[0];

  const handleToggleResolve = (breachId: string) => {
    const updated = list.map(item => {
      if (item.id === breachId) {
        const nextStatus = item.status === 'Resolved' ? 'Pending' : 'Resolved';
        onToast(nextStatus === 'Resolved' ? "Marcada como resuelta" : "Marcada como pendiente");
        
        // Link to task system if task ID mapping exists
        const taskIdMap: Record<string, string> = { b1: "t1", b2: "t2", b3: "t5" };
        const taskId = taskIdMap[breachId];
        if (taskId && onResolveTask) {
          onResolveTask(taskId, nextStatus === 'Resolved');
        }

        return { ...item, status: nextStatus as BreachFinding['status'] };
      }
      return item;
    });
    setList(updated);
  };

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Inteligencia de Brechas</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Exposición a brechas</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-ok-dim text-ok border border-ok/25">
          <span className="demo-blip bg-ok" />
          Monitoreo de Brechas Activo
        </span>
      </div>

      {inlineAI && (
        <div className="mb-4">
          <AIInsightCard 
            tag="Analista de Brechas IA" 
            lead 
            confidence="High"
            body="Clasifiqué las filtraciones por severidad y sensibilidad de datos, no por orden cronológico. ConnectHub y DevForum exponen la misma contraseña reutilizada: rótala en ambos servicios hoy."
            impact="+12 score" 
            action="Comenzar con brecha crítica" 
            onAction={() => { 
              setSel("b1"); 
              onToast("Se seleccionó la brecha ConnectHub"); 
            }} 
          />
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-4 flex-wrap animate-fadeIn">
        <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line">
          {levels.map(l => (
            <button 
              key={l} 
              className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                filter === l 
                  ? "bg-bg-3 text-t-0 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]" 
                  : "text-t-1 hover:text-t-0 bg-transparent"
              }`} 
              onClick={() => setFilter(l)}
            >
              {labelMap[l]}
            </button>
          ))}
        </div>
        <span className="text-t-2 text-[12.5px] ml-2">
          {filteredList.length} de {list.length} brechas detectadas
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_1fr] gap-4 items-start">
        {/* Master List */}
        <div className="flex flex-col gap-2.5">
          {filteredList.map(x => (
            <button 
              key={x.id} 
              onMouseMove={handleMouseMove}
              onClick={() => setSel(x.id)} 
              className={`group relative overflow-hidden border rounded-lg p-3.5 text-left cursor-pointer flex gap-3.5 items-center transition-all duration-130 w-full ${
                sel === x.id 
                  ? "border-teal-line bg-teal-dim" 
                  : "border-line bg-bg-2 hover:border-line-2"
              }`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                background: `radial-gradient(200px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
              }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.003] to-white/[0.015] pointer-events-none" />

              <div className="w-[38px] h-[38px] rounded-lg bg-bg-3 border border-line-2 flex items-center justify-center font-semibold text-[15px] text-t-0 flex-shrink-0 relative z-10">
                {x.logo}
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-semibold text-[13.5px] text-t-0 truncate">{x.service}</span>
                  <span className="font-mono text-t-2 text-[11px]">P{x.priority}</span>
                </div>
                <div className="text-t-2 text-[11.5px] mb-1.5">
                  {x.category === "Social network" ? "Red social" : x.category === "Developer community" ? "Comunidad de desarrolladores" : x.category === "E-commerce" ? "Comercio electrónico" : "Aplicación de fitness"} · {x.date}
                </div>
                <div className="flex gap-2">
                  <Badge level={x.severity} />
                  <StatusPill status={x.status === "Pending" ? "Pending" : x.status === "In Progress" ? "In Progress" : x.status === "Resolved" ? "Resolved" : "Monitor"} />
                </div>
              </div>
            </button>
          ))}
          {filteredList.length === 0 && (
            <div className="border border-dashed border-line rounded-lg p-8 text-center text-t-2">
              No se encontraron brechas con este filtro de severidad.
            </div>
          )}
        </div>

        {/* Details View */}
        {b && (
          <div 
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium fade-in" 
            key={b.id}
          >
            {/* Glossy radial glow & specular line highlight */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
              background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
            }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

            <div className="flex justify-between items-center mb-4 flex-wrap gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-[46px] h-[46px] rounded-lg bg-bg-3 border border-line-2 flex items-center justify-center font-semibold text-[18px] text-t-0 flex-shrink-0">
                  {b.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[19px] font-semibold text-t-0 tracking-tight leading-tight">{b.service}</h2>
                    <Badge level={b.severity} />
                  </div>
                  <div className="text-t-2 text-[12.5px] mt-1.2">
                    {b.category === "Social network" ? "Red social" : b.category === "Developer community" ? "Comunidad de devs" : b.category === "E-commerce" ? "Comercio electrónico" : "App de fitness"} · filtrado en {b.date} · {b.records === "118M accounts" ? "118M cuentas" : b.records === "9.4M accounts" ? "9.4M cuentas" : b.records === "42M accounts" ? "42M cuentas" : "6.1M cuentas"}
                  </div>
                </div>
              </div>
              <StatusPill status={b.status === "Pending" ? "Pending" : b.status === "In Progress" ? "In Progress" : b.status === "Resolved" ? "Resolved" : "Monitor"} />
            </div>

            <div className="flex gap-2 mb-4 flex-wrap relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] bg-bg-3 border border-line text-t-1">
                <Icon 
                  name={b.verified ? "check-circle" : "eye"} 
                  size={13} 
                  style={{ color: b.verified ? "var(--ok)" : "var(--med)" }} 
                />
                {b.verified ? "Brecha verificada" : "No verificada"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] bg-bg-3 border border-line text-t-1">
                <Icon name="mail" size={13} />
                {b.affectedEmail}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] bg-bg-3 border border-line text-t-1">
                <Icon name="clock" size={13} />
                {b.discovered}
              </span>
            </div>

            <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-2 relative z-10">Clases de datos expuestos</div>
            <div className="flex gap-2 mb-4.5 flex-wrap relative z-10">
              {b.dataClasses.map(d => {
                const danger = /contraseña|teléfono|domicilio|dirección/i.test(d) || d.includes("hash") || d.includes("plano");
                return (
                  <span 
                    key={d} 
                    className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] border ${
                      danger 
                        ? "text-crit bg-crit-dim border-crit/25" 
                        : "bg-bg-3 border-line text-t-1"
                    }`}
                  >
                    <Icon name={danger ? "alert" : "check"} size={12} />
                    {d}
                  </span>
                );
              })}
            </div>

            <div className="border border-teal-line bg-gradient-to-br from-teal/6 to-bg-2 rounded-lg p-4 relative overflow-hidden mb-4 z-10">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
              
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal">
                  <Icon name="sparkles" size={13} style={{ marginRight: 4 }} />
                  Recomendado por la IA
                </span>
                {b.riskReduced && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border border-teal-line bg-teal-dim text-teal">
                    <Icon name="trending-up" size={11} style={{ marginRight: 3 }} />
                    {b.riskReduced}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[10px] tracking-wide uppercase text-t-3 font-semibold block mb-0.5">Por qué importa</span>
                  <p className="text-t-1 text-[12.8px] leading-relaxed m-0">{b.ai}</p>
                </div>
                
                <div className="border-t border-line/40 pt-2.5">
                  <span className="text-[10px] tracking-wide uppercase text-t-3 font-semibold block mb-0.5">Acción sugerida</span>
                  <p className="text-t-0 text-[13px] leading-relaxed m-0 font-medium">{b.action}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-t-3 text-[11px] mb-4 relative z-10">
              <Icon name="shield-check" size={13} />
              <span>Análisis de brechas IA · Requiere revisión humana antes de ejecutar</span>
            </div>

            <div className="flex gap-2.5 mt-[18px] flex-wrap relative z-10">
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100 animate-pulse-subtle shadow-premium"
                onClick={() => onToast("Abriendo guía integrada de rotación de credencial segura")}
              >
                <Icon name="key" size={15} />
                Rotar contraseña
              </button>
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                onClick={() => handleToggleResolve(b.id)}
              >
                <Icon name="check" size={15} />
                {b.status === "Resolved" ? "Marcar como pendiente" : "Marcar como resuelto"}
              </button>
              <button 
                className="text-t-2 hover:text-t-0 font-semibold text-[13px] px-3 bg-transparent border-0 cursor-pointer transition-all duration-130"
                onClick={() => onToast("Pospuesto — mantendremos el monitoreo")}
              >
                Posponer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BreachIntelligence;
