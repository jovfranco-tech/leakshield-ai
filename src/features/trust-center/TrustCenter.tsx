import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Switch } from '../../components/ui/Switch';

interface ToggleProps {
  label: string;
  defaultOn: boolean;
  onToast: (msg: string) => void;
}

const ToggleRow: React.FC<ToggleProps> = ({ label, defaultOn, onToast }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-line last:border-b-0">
      <span className="text-[13px] text-t-1 font-medium">{label}</span>
      <Switch 
        on={on} 
        onClick={() => { 
          setOn(!on); 
          onToast(`${label}: ${!on ? "on" : "off"}`); 
        }} 
      />
    </div>
  );
};

interface TrustCenterProps {
  onToast: (msg: string) => void;
  onResetTasks?: () => void;
}

export const TrustCenter: React.FC<TrustCenterProps> = ({ onToast, onResetTasks }) => {
  const principles = [
    { ic: "user", t: "Your accounts only", d: "Scan only identifiers you own or are authorized to monitor. We support authorized privacy reviews with strictly authenticated telemetry." },
    { ic: "lock", t: "No passwords stored", d: "Zero plaintext passwords stored. Credential checks are architected using the k-anonymity protocol—transmitting only the first 5 characters of SHA-1 hashes to Have I Been Pwned APIs so your credentials never leave the client." },
    { ic: "scan", t: "Demo data is simulated", d: "Demo data is simulated. All listings, data breaches, and public footprint details represent fictional vectors to securely model exposure risks." },
    { ic: "key", t: "API keys stay server-side", d: "API keys stay server-side. Third-party integrations (Vertex AI, HIBP, search engines) route via secure serverless proxies with robust rate-limiting and audit logging." },
    { ic: "sparkles", t: "AI requires human review", d: "AI outputs require human review. The copilot advises on exposure reduction but acts as human-reviewed AI assistance. Nothing is submitted without consent." },
    { ic: "shield", t: "No absolute promises", d: "LeakShield provides exposure reduction and privacy hygiene. We make no guarantee of complete internet removal, setting realistic, ethical expectations." },
  ];

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Trust Center · Security Boundaries</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">How LeakShield protects you</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
          <span className="demo-blip" />
          Prototype
        </span>
      </div>

      <div className="border border-teal-line rounded-lg p-5 bg-gradient-to-br from-teal/6 to-bg-2 shadow-premium mb-4 flex gap-3.5 items-center flex-wrap sm:flex-nowrap relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
        <div className="w-[42px] h-[42px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
          <Icon name="shield-check" size={22} />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-t-0 mb-1 leading-tight">Privacy-first by design</h2>
          <p className="text-t-1 text-[13.5px] leading-[1.55] max-w-[720px]">
            LeakShield AI is built so that the safest choice is the default. These boundaries are product constraints, not just policy — they shape what the app is technically allowed to do.
          </p>
        </div>
      </div>

      {/* Principles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {principles.map((p, i) => (
          <div key={i} className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between">
            <div>
              <div className="w-[30px] h-[30px] rounded-lg bg-teal-dim border border-teal-line text-teal flex items-center justify-center flex-shrink-0 mb-3">
                <Icon name={p.ic} size={16} />
              </div>
              <div className="flex justify-between items-center mb-1.5 gap-2">
                <h3 className="text-[14px] font-semibold text-t-0 truncate">{p.t}</h3>
                <Icon name="check-circle" size={15} style={{ color: "var(--ok)", flexShrink: 0 }} />
              </div>
              <p className="text-t-2 text-[12.5px] leading-[1.55]">{p.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Toggle Controls */}
        <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
              <Icon name="settings" size={16} />
              <h2 className="text-[15px] font-semibold text-t-0">Data controls</h2>
            </div>
            <div className="flex flex-col">
              <ToggleRow label="Monitor my identifiers" defaultOn={true} onToast={onToast} />
              <ToggleRow label="Store findings for this session only" defaultOn={true} onToast={onToast} />
              <ToggleRow label="Let copilot pre-draft (never auto-send)" defaultOn={true} onToast={onToast} />
              <ToggleRow label="Share anonymized stats" defaultOn={false} onToast={onToast} />
            </div>
          </div>
        </div>

        {/* Data Wiping Actions */}
        <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
              <Icon name="file" size={16} />
              <h2 className="text-[15px] font-semibold text-t-0">Your data, your call</h2>
            </div>
            <p className="text-t-2 text-[12.8px] leading-[1.55] mb-4.5">
              Export everything we hold, or wipe it instantly. In this demo no data leaves your browser.
            </p>
            <div className="flex gap-2.5">
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130"
                onClick={() => onToast("Export prepared (demo)")}
              >
                <Icon name="file" size={15} />
                Export my data
              </button>
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 bg-transparent hover:bg-bg-inset border border-transparent hover:border-line text-crit cursor-pointer transition-all duration-130"
                onClick={() => {
                  if (onResetTasks) {
                    onResetTasks();
                  }
                  onToast("Demo data reset");
                }}
              >
                <Icon name="trash" size={15} />
                Delete everything
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-t-3 text-[11px] border-t border-line pt-3.5">
            <Icon name="shield-check" size={13} />
            <span>Built to connect to a serverless backend — no secrets in the client.</span>
          </div>
        </div>
      </div>

      {/* Advanced Cybersecurity & Privacy Boundaries Panel */}
      <div className="border border-line rounded-lg p-6 bg-bg-2 shadow-premium mt-6">
        <div className="flex items-center gap-2 mb-4 border-b border-line pb-3">
          <Icon name="shield-check" size={18} style={{ color: "var(--teal)" }} />
          <h2 className="text-[16px] font-semibold text-t-0">Privacy Architecture &amp; Verification Mechanics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[12.8px] leading-relaxed text-t-1">
          <div>
            <h3 className="font-semibold text-t-0 text-[13.5px] mb-2 flex items-center gap-1.5">
              <Icon name="key" size={15} style={{ color: "var(--cyan)" }} />
              k-Anonymity Credential Verification
            </h3>
            <p className="m-0 text-t-2 leading-relaxed">
              When verifying if a password was exposed in public breaches, LeakShield strictly avoids transmitting plaintext values or full hashes. 
              Instead, we hash the password using SHA-1, extract the <strong>first 5 hexadecimal characters</strong> of the hash (e.g., <code className="bg-bg-inset border border-line px-1 rounded font-mono text-[11.5px]">21BD1</code>), and transmit only this prefix to the Have I Been Pwned API.
            </p>
            <p className="mt-2.5 m-0 text-t-2 leading-relaxed">
              The API returns a list of all matching suffixes and breach counts. LeakShield matches your hash suffix locally in the browser memory. This guarantees that neither our servers nor Have I Been Pwned ever discover your full password hash or plaintext credentials.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-t-0 text-[13.5px] mb-2 flex items-center gap-1.5">
              <Icon name="sparkles" size={15} style={{ color: "var(--teal)" }} />
              Serverless Proxy &amp; AI Security Isolation
            </h3>
            <p className="m-0 text-t-2 leading-relaxed">
              All AI recommendations, breach searches, and data broker suppressions are structured to run through secure backend serverless functions (e.g., Firebase App Hosting, Vercel Serverless, or Cloud Functions).
            </p>
            <ul className="m-0 mt-2.5 pl-4 flex flex-col gap-1 text-t-2 list-disc">
              <li><strong>Zero Exposed Secrets:</strong> Vertex AI API keys, Google Custom Search credentials, and HIBP tokens reside strictly in secure server environments, never exposed in client bundles.</li>
              <li><strong>Privacy-Safe Logs:</strong> User identifiers are anonymized. System access logs contain no PII (Personally Identifiable Information) and undergo strict rate-limiting to prevent automated scraping.</li>
              <li><strong>Human-in-the-loop:</strong> Every compliance deletion request drafted by the AI is presented locally for manual human review and verification before queuing.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrustCenter;
