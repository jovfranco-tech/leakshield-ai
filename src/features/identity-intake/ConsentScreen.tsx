import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Logo } from '../../components/layout/NavRail';

interface ConsentScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({ onBack, onContinue }) => {
  const [checks, setChecks] = useState({ own: false, sim: false, review: false });
  const all = checks.own && checks.sim && checks.review;

  const items = [
    { 
      k: "own" as const, 
      t: "These are my own accounts, or I'm authorized to check them", 
      d: "Use only your own accounts or authorized data. Investigating third parties without explicit consent is strictly prohibited." 
    },
    { 
      k: "sim" as const, 
      t: "I understand this demo uses simulated data", 
      d: "No real passwords, emails, or personal databases are queried or stored in this demonstration center." 
    },
    { 
      k: "review" as const, 
      t: "I'll review AI suggestions before acting", 
      d: "AI outputs are human-reviewed recommendations, not absolute decisions. Suggestions do not constitute definitive legal or security counsel." 
    },
  ];

  return (
    <div className="page min-h-screen bg-bg-0 flex items-center justify-center p-6">
      <div className="fade-in w-full max-w-[560px] flex flex-col gap-6">
        <div className="flex items-center gap-3 justify-center">
          <Logo />
          <div className="font-semibold text-[18px] text-t-0">LeakShield AI</div>
        </div>
        
        <div className="border border-line rounded-lg p-7 bg-bg-2 shadow-premium">
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-2">Step 1 of 2 · Consent</div>
          <h1 className="text-[22px] font-semibold tracking-tight text-t-0 leading-tight mb-2">Before we scan, your boundaries</h1>
          <p className="text-t-1 text-[13.5px] mb-5.5 leading-relaxed">Privacy-first means consent-first. Confirm the following to continue.</p>
          
          <div className="flex flex-col gap-2.5">
            {items.map(it => (
              <button 
                key={it.k} 
                onClick={() => setChecks(c => ({ ...c, [it.k]: !c[it.k] }))}
                className={`border rounded-lg p-3.5 text-left cursor-pointer flex gap-3.5 items-start transition-all duration-130 ${
                  checks[it.k] 
                    ? "bg-teal-dim border-teal-line" 
                    : "bg-bg-2 border-line hover:border-line-2"
                }`}
              >
                <span className={`w-5.5 h-5.5 rounded-[7px] flex-shrink-0 mt-0.5 flex items-center justify-center border transition-all duration-130 ${
                  checks[it.k] 
                    ? "border-teal bg-teal text-[#04110F]" 
                    : "border-line-3 bg-transparent text-transparent"
                }`}>
                  {checks[it.k] && <Icon name="check" size={14} />}
                </span>
                <div>
                  <span className="text-[13.5px] font-semibold text-t-0 block leading-tight">{it.t}</span>
                  <span className="text-t-2 text-[12px] leading-relaxed mt-1 block">{it.d}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 my-4.5 text-t-2 text-[11.5px] leading-relaxed">
            <Icon name="lock" size={14} style={{ color: "var(--teal)", flexShrink: 0 }} />
            <span>We never ask for real passwords. API keys stay server-side. Removal can't be legally guaranteed.</span>
          </div>

          <div className="flex gap-2.5 mt-2">
            <button 
              className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-[13px] px-[15px] py-[9px] border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
              onClick={onBack}
            >
              Back
            </button>
            <button 
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-[13px] px-[15px] py-[9px] bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] cursor-pointer transition-all duration-130"
              style={{ opacity: all ? 1 : 0.5, pointerEvents: all ? "auto" : "none" }}
              onClick={onContinue}
            >
              Continue to identity setup
              <Icon name="arrow-right" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
