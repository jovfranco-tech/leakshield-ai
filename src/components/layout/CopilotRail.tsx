import React, { useState, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { CopilotData, PlanItem } from '../../types/privacy';

export const Typed: React.FC<{ text: string; speed?: number }> = ({ text, speed = 14 }) => {
  const [n, setN] = useState(0);
  
  useEffect(() => { 
    setN(0); 
  }, [text]);
  
  useEffect(() => {
    if (n >= text.length) return;
    const id = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(id);
  }, [n, text, speed]);
  
  const done = n >= text.length;
  return (
    <span>
      {text.slice(0, n)}
      {!done && <span className="border-r-2 border-teal animate-[pulse_1s_infinite] ml-0.5" />}
    </span>
  );
};

export const RAIL_CONTEXT: Record<string, { label: string; summary: string }> = {
  landing: {
    label: "Exploring LeakShield",
    summary: "Welcome to LeakShield AI. Take a look at the landing screen, understand our safety parameters, and click 'Start privacy scan' to explore the onboarding sequence."
  },
  consent: {
    label: "Onboarding boundaries",
    summary: "I'm keeping track of your consent parameters. Protecting your identity starts with locking down the rules of engagement."
  },
  intake: {
    label: "Setting up your shield",
    summary: "I'm monitoring your input vectors. Adding key emails and handles lets me cross-reference the complete threat matrix."
  },
  dashboard: {
    label: "Reviewing your full exposure",
    summary: "I've analyzed 4 breaches, 6 footprint findings and 2 broker listings. Your biggest gap is one password reused across two breached accounts — fixing it alone could add ~12 points."
  },
  identity: {
    label: "Watching your identifiers",
    summary: "I'm monitoring 2 emails and 2 usernames. Adding your phone number would let me catch SIM-swap and SMS-leak signals you're currently blind to."
  },
  breaches: {
    label: "Prioritizing breaches",
    summary: "I ranked your breaches by sensitivity, not just recency. ConnectHub and DevForum share the same leaked password — treat them as one fix, done together."
  },
  footprint: {
    label: "Mapping your public footprint",
    summary: "Of 6 public findings, the people-directory listing is the one I'd remove first — it ties your real name to a home address. I can draft the opt-out for you."
  },
  brokers: {
    label: "Tracking data brokers",
    summary: "2 brokers list your profile. One removal is already in progress; I've pre-drafted the deletion request for the second so you only review and send."
  },
  copilot: {
    label: "Your remediation plan",
    summary: "Here's your prioritized plan. I sequence by score impact ÷ effort, so the fastest wins come first. You stay in control — nothing is sent without your approval."
  },
  tasks: {
    label: "Working your task board",
    summary: "2 of 9 tasks are resolved. The 2 Critical items are quick (under 5 min each) and unlock the largest score gain — I'd clear those today."
  },
  trust: {
    label: "Privacy boundaries",
    summary: "I operate within strict limits: only your own or authorized data, no stored passwords, and every action I draft needs your review before anything happens."
  }
};

interface CopilotRailProps {
  view: string;
  copilotData: CopilotData;
  onNav: (view: string) => void;
  onToast: (msg: string) => void;
  onOpenDeletion: () => void;
  className?: string;
}

export const CopilotRail: React.FC<CopilotRailProps> = ({
  view,
  copilotData,
  onNav,
  onToast,
  onOpenDeletion,
  className = ""
}) => {
  const ctx = RAIL_CONTEXT[view] || RAIL_CONTEXT.dashboard;

  return (
    <aside className={`w-[var(--rail-w)] bg-gradient-to-b from-bg-1 to-bg-0 border-l border-line flex flex-col h-full overflow-hidden select-none flex-shrink-0 ${className}`}>
      {/* Header */}
      <div className="px-[18px] py-4 border-b border-line z-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal">
            <Icon name="sparkles" size={17} />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-semibold text-t-0">Privacy Copilot</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ok shadow-[0_0_8px_var(--ok)]" />
              <span className="text-[11px] text-t-2 font-medium">{ctx.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body Scroll */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Context Summary card */}
        <div className="relative border border-teal-line bg-gradient-to-b from-teal/6 to-bg-2 rounded-lg p-3.5 overflow-hidden flex-shrink-0" key={view}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal mb-2">
            <Icon name="sparkles" size={13} style={{ marginRight: 4 }} />
            Context summary
          </span>
          <div className="text-[12.8px] leading-[1.6] text-t-0 font-medium">
            <Typed text={ctx.summary} />
          </div>
        </div>

        {/* Next Best Action Card */}
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-2">Next best action</div>
          <div className="border border-teal-line bg-bg-2 rounded-lg p-3.5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
            <div className="text-[13.5px] font-semibold text-t-0 mb-1">{copilotData.nextBest.title}</div>
            <div className="text-t-1 text-[12.3px] leading-[1.55] mb-3">{copilotData.nextBest.why}</div>
            <div className="flex gap-1.5 mb-3.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-teal-line bg-teal-dim text-teal">
                <Icon name="trending-up" size={11} style={{ marginRight: 3 }} />
                {copilotData.nextBest.impact}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                <Icon name="clock" size={11} style={{ marginRight: 3 }} />
                {copilotData.nextBest.effort}
              </span>
            </div>
            <button 
              className="w-full flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12.5px] px-3 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100"
              onClick={() => {
                onNav("breaches");
                onToast("Opened the fix in Breach Intelligence");
              }}
            >
              <Icon name="key" size={14} />
              Start this fix
            </button>
          </div>
        </div>

        {/* Mini Plan Board */}
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-2">Remediation Sequence</div>
          <div className="flex flex-col gap-3">
            {Object.entries(copilotData.plan).map(([bucket, items]) => (
              <div key={bucket} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11.5px] font-semibold text-t-1">{bucket}</span>
                  <span className="flex-1 h-[1px] bg-line" />
                  <span className="font-mono text-[10.5px] text-t-2">{items.length}</span>
                </div>
                <div className="flex flex-col gap-1">
                  {items.map((it: PlanItem) => (
                    <div key={it.id} className="flex gap-2.5 py-1.5 items-start">
                      <span 
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          it.priority === "Critical" ? "bg-crit" : 
                          it.priority === "High" ? "bg-high" : 
                          it.priority === "Medium" ? "bg-med" : "bg-low"
                        }`} 
                      />
                      <span className="text-[12.3px] text-t-1 flex-1 leading-normal">{it.text}</span>
                      <span className={`font-mono text-[11px] font-semibold ${it.impact === "—" ? "text-t-3" : "text-teal"}`}>
                        {it.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="mt-2 flex-shrink-0">
          <button 
            className="w-full flex items-center justify-center gap-2 rounded-lg font-semibold text-[12.5px] px-3 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
            onClick={onOpenDeletion}
          >
            <Icon name="file" size={14} />
            Draft deletion request
          </button>
          <button 
            className="w-full text-center text-t-2 hover:text-teal font-semibold text-[11.5px] mt-2.5 flex items-center justify-center gap-1.5 bg-transparent border-0 cursor-pointer transition-all duration-130"
            onClick={() => onNav("copilot")}
          >
            Open full copilot workspace
            <Icon name="arrow-right" size={13} />
          </button>
        </div>
      </div>

      {/* Footer input */}
      <div className="border-t border-line p-4 bg-bg-1 flex-shrink-0">
        <div className="flex items-center gap-2 bg-bg-inset border border-line rounded-lg px-3 py-2 text-t-2">
          <Icon name="sparkles" size={15} style={{ color: "var(--teal)" }} />
          <input 
            className="bg-transparent border-0 outline-none text-t-0 font-sans text-[13px] w-full placeholder-t-3"
            placeholder="Ask the copilot…" 
            onKeyDown={e => {
              if (e.key === "Enter") {
                onToast("Copilot is a simulated demo — responses are illustrative");
                (e.target as HTMLInputElement).value = "";
              }
            }} 
          />
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 text-t-3 text-[10.5px]">
          <Icon name="shield-check" size={12} />
          <span>AI outputs require human review · simulated demo</span>
        </div>
      </div>
    </aside>
  );
};
export default CopilotRail;
