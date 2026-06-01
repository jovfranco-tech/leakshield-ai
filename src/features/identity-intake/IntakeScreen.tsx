import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Logo } from '../../components/layout/NavRail';
import { Badge } from '../../components/ui/Badge';
import { AIInsightCard } from '../../components/ui/AIInsightCard';
import { Profile } from '../../types/privacy';

interface IntakeScreenProps {
  profile: Profile;
  inApp?: boolean;
  onComplete?: () => void;
  onToast?: (msg: string) => void;
}

export const IntakeScreen: React.FC<IntakeScreenProps> = ({ profile, inApp = false, onComplete, onToast }) => {
  const [emails, setEmails] = useState<string[]>(profile.emails);
  const [usernames, setUsernames] = useState<string[]>(profile.usernames);
  const [draft, setDraft] = useState("");
  const [phone, setPhone] = useState("");
  const [scanning, setScanning] = useState(false);

  const addId = (val: string) => {
    // Defensive input sanitization: limit length to 80 chars and strip out HTML tag symbols
    const trimmed = val.trim().slice(0, 80).replace(/[<>]/g, "");
    if (!trimmed) return;
    if (trimmed.includes("@")) {
      setEmails(e => [...new Set([...e, trimmed])]);
    } else {
      setUsernames(u => [...new Set([...u, trimmed])]);
    }
    setDraft("");
    if (onToast) {
      onToast(`Now monitoring ${trimmed}`);
    }
  };

  const handleStartScan = () => {
    setScanning(true);
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 2100);
  };

  const Body = (
    <div className={`grid gap-5 items-start ${inApp ? "grid-cols-1 lg:grid-cols-[1.3fr_0.9fr]" : "grid-cols-1"}`}>
      <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
        <div className="flex items-center gap-2 mb-3.5">
          <Icon name="fingerprint" size={18} style={{ color: "var(--teal)" }} />
          <h2 className="text-[15px] font-semibold text-t-0">Monitored identifiers</h2>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[12px] font-semibold text-t-1">Full name</label>
          <input className="bg-bg-inset border border-line-2 rounded-lg px-3 py-2 text-t-0 font-sans text-[13.5px] outline-none focus:border-teal-line focus:shadow-[0_0_0_3px_var(--teal-dim)] transition-all duration-130 w-full" defaultValue={profile.name} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-t-1">Country / region</label>
            <input className="bg-bg-inset border border-line-2 rounded-lg px-3 py-2 text-t-0 font-sans text-[13.5px] outline-none focus:border-teal-line focus:shadow-[0_0_0_3px_var(--teal-dim)] transition-all duration-130 w-full" defaultValue="Mexico" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-t-1">Phone (optional)</label>
            <input 
              className="bg-bg-inset border border-line-2 rounded-lg px-3 py-2 text-t-0 font-sans text-[13.5px] outline-none focus:border-teal-line focus:shadow-[0_0_0_3px_var(--teal-dim)] transition-all duration-130 w-full" 
              placeholder="+52 …" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
            />
          </div>
        </div>

        <label className="text-[12px] font-semibold text-t-1 block mb-2">Emails & usernames</label>
        <div className="flex flex-col gap-2 mb-3">
          {emails.map(e => (
            <div key={e} className="flex items-center gap-2.5 border border-line rounded-lg px-3 py-2 bg-bg-inset">
              <Icon name="mail" size={15} style={{ color: "var(--t-2)" }} />
              <span className="font-mono text-[12.5px] flex-1 text-t-0">{e}</span>
              <Badge level="ok">monitoring</Badge>
            </div>
          ))}
          {usernames.map(u => (
            <div key={u} className="flex items-center gap-2.5 border border-line rounded-lg px-3 py-2 bg-bg-inset">
              <Icon name="user" size={15} style={{ color: "var(--t-2)" }} />
              <span className="font-mono text-[12.5px] flex-1 text-t-0">@{u}</span>
              <Badge level="ok">monitoring</Badge>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2.5">
          <div className="flex-1 flex items-center gap-2 bg-bg-2 border border-line rounded-lg px-3 py-2 text-t-2">
            <Icon name="plus" size={15} />
            <input 
              className="bg-transparent border-0 outline-none text-t-0 font-sans text-[13px] w-full placeholder-t-3"
              placeholder="Add email or username…" 
              maxLength={80}
              value={draft} 
              onChange={e => setDraft(e.target.value)} 
              onKeyDown={e => {
                if (e.key === "Enter") addId(draft);
              }} 
            />
          </div>
          <button 
            className="inline-flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-[15px] py-[9px] border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
            onClick={() => addId(draft)}
          >
            Add
          </button>
        </div>

        {!inApp && (
          <button 
            className="w-full flex items-center justify-center gap-2 rounded-lg font-semibold text-[13px] px-[15px] py-3 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] mt-5.5 cursor-pointer transition-all duration-130 shadow-premium"
            onClick={handleStartScan}
          >
            {scanning ? (
              <>
                <Icon name="refresh" size={16} className="spin" />
                Scanning your exposure…
              </>
            ) : (
              <>
                <Icon name="scan" size={16} />
                Run privacy scan
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <AIInsightCard 
          tag="AI Coverage" 
          lead 
          confidence="Medium"
          title="Widen your coverage"
          body="You're monitoring 2 emails and 2 usernames. Adding your phone number lets me detect SIM-swap and SMS-leak signals you're currently blind to."
          impact={inApp ? "+coverage" : null} 
        />
        
        <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-3">What a scan checks</div>
          <div className="flex flex-col gap-3">
            {[
              ["breach", "Known breach databases"], 
              ["globe", "Public web & social footprint"], 
              ["building", "Data-broker listings"], 
              ["clock", "Dormant / old accounts"]
            ].map(([ic, t]) => (
              <div key={t} className="flex items-center gap-2.5">
                <Icon name={ic} size={15} style={{ color: "var(--teal)" }} />
                <span className="text-[12.8px] text-t-1">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-t-3 text-[11px]">
            <Icon name="shield-check" size={13} style={{ flexShrink: 0 }} />
            <span>Identifiers are matched, never stored as passwords.</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (inApp) {
    return (
      <div className="max-w-[1180px] mx-auto fade-in">
        <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
          <div>
            <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Digital Identity Intake</div>
            <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Identity & monitoring</h1>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
            <span className="demo-blip" />
            Simulated
          </span>
        </div>
        {Body}
      </div>
    );
  }

  return (
    <div className="page min-h-screen bg-bg-0 flex items-center justify-center p-6">
      <div className="fade-in w-full max-w-[720px] flex flex-col gap-5">
        <div className="flex items-center gap-3 justify-center">
          <Logo />
          <div className="font-semibold text-[18px] text-t-0">LeakShield AI</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1.5">Step 2 of 2 · Identity setup</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">What should we watch for you?</h1>
        </div>
        {Body}
      </div>
    </div>
  );
};
export default IntakeScreen;
