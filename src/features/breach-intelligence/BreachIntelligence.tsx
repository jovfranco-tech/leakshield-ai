import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { StatusPill } from '../../components/ui/StatusPill';
import { AIInsightCard } from '../../components/ui/AIInsightCard';
import { BreachFinding } from '../../types/privacy';

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
  const filteredList = list.filter(b => filter === "All" || b.severity === filter);
  const b = list.find(x => x.id === sel) || filteredList[0] || list[0];

  const handleToggleResolve = (breachId: string) => {
    const updated = list.map(item => {
      if (item.id === breachId) {
        const nextStatus = item.status === 'Resolved' ? 'Pending' : 'Resolved';
        onToast(nextStatus === 'Resolved' ? "Marked resolved" : "Marked as pending");
        
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
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Breach Intelligence</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Breach exposure</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
          <span className="demo-blip" />
          Simulated breaches
        </span>
      </div>

      {inlineAI && (
        <div className="mb-4">
          <AIInsightCard 
            tag="AI Breach Prioritizer" 
            lead 
            confidence="High"
            body="I ranked these by sensitivity, not recency. ConnectHub and DevForum share one leaked password — fix them together for the biggest single gain."
            impact="+12 score" 
            action="Start with the reused password" 
            onAction={() => { 
              setSel("b1"); 
              onToast("Selected the critical breach"); 
            }} 
          />
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
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
              {l}
            </button>
          ))}
        </div>
        <span className="text-t-2 text-[12.5px] ml-2">
          {filteredList.length} of {list.length} breaches
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_1fr] gap-4 items-start">
        {/* Master List */}
        <div className="flex flex-col gap-2.5">
          {filteredList.map(x => (
            <button 
              key={x.id} 
              onClick={() => setSel(x.id)} 
              className={`border rounded-lg p-3.5 text-left cursor-pointer flex gap-3.5 items-center transition-all duration-130 w-full ${
                sel === x.id 
                  ? "border-teal-line bg-teal-dim" 
                  : "border-line bg-bg-2 hover:border-line-2"
              }`}
            >
              <div className="w-[38px] h-[38px] rounded-lg bg-bg-3 border border-line-2 flex items-center justify-center font-semibold text-[15px] text-t-0 flex-shrink-0">
                {x.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-semibold text-[13.5px] text-t-0 truncate">{x.service}</span>
                  <span className="font-mono text-t-2 text-[11px]">P{x.priority}</span>
                </div>
                <div className="text-t-2 text-[11.5px] mb-1.5">
                  {x.category} · {x.date}
                </div>
                <div className="flex gap-2">
                  <Badge level={x.severity} />
                  <StatusPill status={x.status} />
                </div>
              </div>
            </button>
          ))}
          {filteredList.length === 0 && (
            <div className="border border-dashed border-line rounded-lg p-8 text-center text-t-2">
              No breaches found for this severity filter.
            </div>
          )}
        </div>

        {/* Details View */}
        {b && (
          <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium fade-in" key={b.id}>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
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
                    {b.category} · breach dated {b.date} · {b.records}
                  </div>
                </div>
              </div>
              <StatusPill status={b.status} />
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] bg-bg-3 border border-line text-t-1">
                <Icon 
                  name={b.verified ? "check-circle" : "eye"} 
                  size={13} 
                  style={{ color: b.verified ? "var(--ok)" : "var(--med)" }} 
                />
                {b.verified ? "Verified breach" : "Unverified"}
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

            <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-2">Exposed data classes</div>
            <div className="flex gap-2 mb-4.5 flex-wrap">
              {b.dataClasses.map(d => {
                const danger = /password|phone|address/i.test(d);
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

            <div className="border border-teal-line bg-gradient-to-br from-teal/6 to-bg-2 rounded-lg p-4 relative overflow-hidden mb-4">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
              
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal">
                  <Icon name="sparkles" size={13} style={{ marginRight: 4 }} />
                  Recommended by AI
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
                  <span className="text-[10px] tracking-wide uppercase text-t-3 font-semibold block mb-0.5">Why this matters</span>
                  <p className="text-t-1 text-[12.8px] leading-relaxed m-0">{b.ai}</p>
                </div>
                
                <div className="border-t border-line/40 pt-2.5">
                  <span className="text-[10px] tracking-wide uppercase text-t-3 font-semibold block mb-0.5">Suggested action</span>
                  <p className="text-t-0 text-[13px] leading-relaxed m-0 font-medium">{b.action}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-t-3 text-[11px] mb-4">
              <Icon name="shield-check" size={13} />
              <span>AI breach intelligence · Human review required before execution</span>
            </div>

            <div className="flex gap-2.5 mt-[18px] flex-wrap">
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100 animate-pulse-subtle"
                onClick={() => onToast("Opening password rotation guide (demo)")}
              >
                <Icon name="key" size={15} />
                Rotate password
              </button>
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
                onClick={() => handleToggleResolve(b.id)}
              >
                <Icon name="check" size={15} />
                {b.status === "Resolved" ? "Mark as pending" : "Mark resolved"}
              </button>
              <button 
                className="text-t-2 hover:text-t-0 font-semibold text-[13px] px-3 bg-transparent border-0 cursor-pointer transition-all duration-130"
                onClick={() => onToast("Snoozed — we'll keep monitoring")}
              >
                Snooze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BreachIntelligence;
