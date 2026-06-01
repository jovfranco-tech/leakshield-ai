import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { AIInsightCard, Confidence } from '../../components/ui/AIInsightCard';
import { generateDeletionRequest, getAliasStrategy } from '../../lib/aiOrchestration';
import { CopilotData, LogEntry, Profile, PlanItem } from '../../types/privacy';

interface CopilotWorkspaceProps {
  profile: Profile;
  copilotData: CopilotData;
  onToast: (msg: string) => void;
  onNav: (view: string) => void;
  currentScoreValue: number;
}

export const CopilotWorkspace: React.FC<CopilotWorkspaceProps> = ({
  profile,
  copilotData,
  onToast,
  onNav,
  currentScoreValue
}) => {
  const projected = Math.min(100, currentScoreValue + 12);
  const [log, setLog] = useState<LogEntry[]>([
    { t: "Drafted deletion request for InfoAggregate", tag: "Generated", time: "2h ago" },
    { t: "Re-prioritized breaches after ConnectHub detection", tag: "Analysis", time: "3h ago" },
  ]);

  const [target, setTarget] = useState<'DataFind' | 'InfoAggregate'>('DataFind');
  const [lawType, setLawType] = useState<'CCPA' | 'GDPR' | 'ARCO' | 'Generic'>('CCPA');
  const [sent, setSent] = useState(false);
  const [innerModal, setInnerModal] = useState(false);

  const letter = generateDeletionRequest(target, lawType, profile.name, profile.location);

  const pushLog = (t: string, tag: string) => {
    setLog(l => [{ t, tag, time: "just now" }, ...l]);
  };

  const aliasGov = getAliasStrategy('banking');
  const aliasShop = getAliasStrategy('shopping');
  const aliasNewsletter = getAliasStrategy('newsletters');

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">AI Remediation Copilot</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Your remediation plan</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
          <span className="demo-blip" />
          AI · review before acting
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-4">
        {/* Summary & Projection */}
        <div className="border border-teal-line rounded-lg p-5 bg-gradient-to-br from-teal/6 to-bg-2 shadow-premium relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal mb-3">
            <Icon name="sparkles" size={14} style={{ marginRight: 4 }} />
            Copilot summary
          </span>
          <p className="text-[15px] leading-[1.55] text-t-0 mb-4.5 font-medium">{copilotData.summary}</p>
          <div className="border border-line rounded-lg p-4 bg-bg-inset">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold">Projected score if you finish this plan</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[12.5px] text-ok">
                <Icon name="trending-up" size={14} />
                +12
              </span>
            </div>
            <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
              <span className="font-mono text-[30px] font-semibold text-med">{currentScoreValue}</span>
              <div className="flex-1 h-1.5 rounded-full bg-bg-2 overflow-hidden min-w-[120px]">
                <div className="h-full rounded-full bg-gradient-to-r from-teal to-cyan" style={{ width: `${projected}%` }} />
              </div>
              <span className="font-mono text-[30px] font-semibold text-teal">{projected}</span>
            </div>
          </div>
        </div>

        {/* Next Best Action Card */}
        <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal">
                <Icon name="sparkles" size={14} style={{ marginRight: 4 }} />
                Next best action
              </span>
              <Confidence level="High" />
            </div>
            <h2 className="text-[16px] font-semibold text-t-0 mb-1.5 leading-tight">{copilotData.nextBest.title}</h2>
            <p className="text-t-1 text-[13px] leading-[1.5] mb-3.5">{copilotData.nextBest.why}</p>
            <div className="flex gap-1.5 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-teal-line bg-teal-dim text-teal">{copilotData.nextBest.impact}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                <Icon name="clock" size={12} style={{ marginRight: 3 }} />
                {copilotData.nextBest.effort}
              </span>
            </div>
          </div>
          <button 
            className="w-full flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-[15px] py-2.5 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100 shadow-premium"
            onClick={() => { 
              onNav("breaches"); 
              onToast("Opening the fix"); 
            }}
          >
            <Icon name="key" size={15} />
            Start now
          </button>
        </div>
      </div>

      {/* Plan Board columns */}
      <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium mb-4">
        <div className="flex justify-between items-center mb-3.5 flex-wrap gap-2.5 pb-3.5 border-b border-line">
          <div className="flex items-center gap-2">
            <Icon name="kanban" size={16} style={{ color: "var(--teal)" }} />
            <h2 className="text-[15px] font-semibold text-t-0">Today · This Week · Later</h2>
          </div>
          <span className="text-t-2 text-[12px]">sequenced by impact ÷ effort</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(copilotData.plan).map(([bucket, items]) => (
            <div key={bucket} className="border border-line rounded-lg p-3 bg-bg-1 min-h-[120px]">
              <div className="flex items-center gap-2 mb-3 px-1.5">
                <span className="text-[13px] font-semibold text-t-0 leading-tight">{bucket}</span>
                <span className="ml-auto text-[11px] font-semibold px-2 py-0.2 rounded-full bg-bg-3 text-t-1">{items.length}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {items.map((it: PlanItem) => (
                  <div key={it.id} className="border border-line rounded-md p-3 bg-bg-2 shadow-sm">
                    <div className="flex justify-between items-center mb-2 flex-wrap gap-1.5">
                      <Badge level={it.priority} />
                      <span className="font-mono text-[11px] ml-auto text-teal font-semibold">
                        {it.impact}
                      </span>
                    </div>
                    <div className="text-[13px] text-t-0 leading-[1.4] mb-2.5 font-medium">{it.text}</div>
                    <button 
                      className="w-full flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-3 py-1.5 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
                      onClick={() => { 
                        pushLog(`Started: ${it.text}`, "Action"); 
                        onToast("Added to active work"); 
                      }}
                    >
                      <Icon name="arrow-right" size={13} />
                      Do it
                    </button>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-t-2 text-[12px] text-center py-6">All tasks completed</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI generators */}
        <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
          <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
            <Icon name="file" size={16} style={{ color: "var(--teal)" }} />
            <h2 className="text-[15px] font-semibold text-t-0">AI generators</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              className="border border-line rounded-lg p-3.5 text-left cursor-pointer flex gap-3.5 items-center bg-bg-inset hover:border-line-2 w-full transition-all duration-130" 
              onClick={() => setInnerModal(true)}
            >
              <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
                <Icon name="file" size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-t-0 leading-tight">Deletion request drafter</div>
                <div className="text-t-2 text-[11.5px] truncate mt-0.5">Generate compliance opt-out letter per broker</div>
              </div>
              <Icon name="chevron-right" size={16} style={{ color: "var(--t-2)" }} />
            </button>

            <div className="border border-line rounded-lg p-3.5 bg-bg-inset">
              <div className="flex items-center gap-3.5 mb-2.5 pb-2.5 border-b border-line">
                <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
                  <Icon name="mask" size={15} />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-semibold text-t-0 leading-tight">Alias strategy</div>
                  <div className="text-t-2 text-[11.5px] mt-0.5">Compartmentalize your identity</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {[
                  [aliasGov.type, aliasGov.recommendation],
                  [aliasShop.type, aliasShop.recommendation],
                  [aliasNewsletter.type, aliasNewsletter.recommendation],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center text-[12px]">
                    <span className="text-t-2">{k}</span>
                    <span className="font-mono text-t-1">{v}</span>
                  </div>
                ))}
              </div>
              
              <button 
                className="w-full flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-3 py-1.5 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 mt-3.5 cursor-pointer transition-all duration-130"
                onClick={() => onToast("Alias plan saved to tasks (demo)")}
              >
                <Icon name="mask" size={13} style={{ marginRight: 3 }} />
                Apply alias plan
              </button>
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
          <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
            <Icon name="clock" size={16} />
            <h2 className="text-[15px] font-semibold text-t-0">Copilot activity</h2>
          </div>
          
          <div className="flex flex-col">
            {log.map((l, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-line last:border-b-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
                  <Icon name="sparkles" size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.8px] text-t-0 truncate">{l.t}</div>
                  <div className="text-t-2 text-[11px] mt-0.5">{l.tag}</div>
                </div>
                <span className="text-t-2 font-mono text-[11px] flex-shrink-0 ml-2">{l.time}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-t-3 text-[11px]">
            <Icon name="shield-check" size={13} />
            <span>Every action above was proposed for your review — nothing was sent.</span>
          </div>
        </div>
      </div>

      {/* Embedded Deletion Letter Modal */}
      {innerModal && (
        <div 
          className="fixed inset-0 z-[60] bg-black/72 backdrop-blur-[6px] grid place-items-center p-6 cursor-pointer"
          onClick={() => setInnerModal(false)}
        >
          <div 
            className="fade-in cursor-default flex flex-col w-full max-w-[720px] max-h-[88vh] overflow-hidden bg-bg-1 border border-line-2 rounded-xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-[22px] py-[18px] border-b border-line sticky top-0 bg-bg-1 z-10 flex-shrink-0">
              <div>
                <div className="text-[17px] font-semibold tracking-tight text-t-0">AI Deletion Request</div>
                <div className="text-t-2 text-[12.5px] mt-0.5">Drafted by the copilot — review before sending</div>
              </div>
              <button 
                className="w-9 h-9 rounded-lg border border-line bg-bg-2 hover:bg-bg-3 hover:text-t-0 text-t-1 flex items-center justify-center cursor-pointer transition-all duration-130"
                onClick={() => setInnerModal(false)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
            
            <div className="p-[22px] overflow-y-auto flex-1">
              <div className="mb-4 bg-high/10 border border-high/30 rounded-lg p-3.5 flex items-center gap-3">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-high/20 text-high flex-shrink-0">
                  <Icon name="alert" size={15} style={{ color: 'var(--high)' }} />
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-t-0 leading-tight">AI-generated draft · Human review required</div>
                  <div className="text-t-2 text-[11.5px] mt-0.5">Verify all pre-filled identity details before submitting. No data is transmitted in this demo.</div>
                </div>
              </div>
              <AIInsightCard 
                tag="AI Drafting" 
                lead 
                confidence="High"
                body="I generated a formal deletion request tailored to this broker using regional compliance frameworks. Review the text, then choose to copy or queue it." 
              />
              
              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Target broker</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit">
                  {["DataFind", "InfoAggregate"].map(t => (
                    <button 
                      key={t} 
                      className={`px-3 py-1 rounded-md text-[12px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                        target === t 
                          ? "bg-bg-3 text-t-0" 
                          : "text-t-1 hover:text-t-0 bg-transparent"
                      }`} 
                      onClick={() => setTarget(t as 'DataFind' | 'InfoAggregate')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Framework & legal scope</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit flex-wrap">
                  {(['CCPA', 'GDPR', 'ARCO', 'Generic'] as const).map(law => (
                    <button 
                      key={law} 
                      className={`px-3.5 py-1 rounded-md text-[11.5px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                        lawType === law 
                          ? "bg-bg-3 text-teal shadow-premium" 
                          : "text-t-1 hover:text-t-0 bg-transparent"
                      }`} 
                      onClick={() => setLawType(law)}
                    >
                      {law === 'Generic' ? 'Generic Support' : law}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Generated request</label>
                <pre className="m-0 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-t-1 bg-bg-inset border border-line rounded-lg p-4">
                  {letter}
                </pre>
              </div>

              <div className="flex items-center gap-1.5 my-3.5 text-t-2 text-[11.5px]">
                <Icon name="shield-check" size={14} style={{ color: "var(--teal)", flexShrink: 0 }} />
                <span>No data is stored or transmitted in this demo. Real sends would route through a server-side queue.</span>
              </div>

              <div className="flex justify-end gap-2.5">
                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130"
                  onClick={() => { 
                    navigator.clipboard?.writeText(letter); 
                    onToast("Draft copied to clipboard"); 
                  }}
                >
                  <Icon name="file" size={15} />
                  Copy draft
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] cursor-pointer transition-all duration-130"
                  onClick={() => { 
                    setSent(true); 
                    onToast("Queued for review — nothing sent in demo"); 
                    setTimeout(() => setInnerModal(false), 700); 
                  }}
                >
                  <Icon name={sent ? "check" : "send"} size={15} />
                  {sent ? "Queued" : "Queue for review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CopilotWorkspace;
