import React from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { ScoreDisplay, Delta } from '../../components/ui/ScoreDisplay';
import { ScoreRing } from '../../components/ui/ScoreRing';
import { PrivacyScore, BreachFinding, HighRiskDataClass, RiskTileData, Profile, RemediationProgress } from '../../types/privacy';

interface ScoreCardProps {
  score: PrivacyScore;
  variant: 'numeric' | 'ring' | 'bar';
  big?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, variant, big }) => {
  return (
    <div className="border border-line rounded-lg p-5 bg-gradient-to-br from-bg-2 to-bg-1 shadow-premium">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold">Privacy Exposure Score</span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
          <Icon name="clock" size={12} />
          {score.updated}
        </span>
      </div>
      <ScoreDisplay score={score} variant={variant} compact={!big} />
      <div className="h-[1px] bg-line my-3.5" />
      <div className="text-t-2 text-[12px] leading-relaxed">
        Composite of breach severity, credential reuse, public footprint and broker exposure.
      </div>
    </div>
  );
};

interface FactorsCardProps {
  score: PrivacyScore;
}

const FactorsCard: React.FC<FactorsCardProps> = ({ score }) => {
  return (
    <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
      <div className="flex items-center gap-2 mb-3.5">
        <Icon name="sparkles" size={16} style={{ color: "var(--teal)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Why your score is {score.value}</h2>
        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal">
          <Icon name="sparkles" size={13} style={{ marginRight: 4 }} />
          AI explanation
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {score.factors.map((f, i) => {
          const neg = f.impact < 0;
          const w = Math.min(100, Math.abs(f.impact) / 14 * 100);
          return (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2 text-[12.8px] font-medium text-t-1">
                  <span 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: f.credit ? "var(--ok)" : neg ? "var(--crit)" : "var(--t-3)" }} 
                  />
                  {f.label}
                </span>
                <span 
                  className="font-mono text-[12.5px] font-semibold"
                  style={{ color: f.credit ? "var(--ok)" : neg ? "var(--crit)" : "var(--t-2)" }}
                >
                  {f.impact > 0 ? "+" : ""}{f.impact}
                </span>
              </div>
              <div className="h-1.2 rounded-full bg-bg-inset overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${w}%`, 
                    background: f.credit ? "var(--ok)" : neg ? "linear-gradient(90deg,var(--crit),var(--high))" : "var(--t-3)" 
                  }} 
                />
              </div>
              <div className="text-t-2 text-[11.3px] mt-1">{f.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ProgressCardProps {
  remediation: RemediationProgress;
  onNav: (view: string) => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ remediation, onNav }) => {
  return (
    <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
      <div className="flex items-center gap-2 mb-3.5">
        <Icon name="kanban" size={16} style={{ color: "var(--t-1)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Remediation progress</h2>
      </div>
      <div className="flex items-center gap-4.5">
        <ScoreRing value={remediation.percent} size={104} stroke={9} />
        <div className="flex flex-col gap-2.5 flex-1">
          {[
            ["Resolved", remediation.resolved, "ok"],
            ["In progress", remediation.inProgress, "cyan"],
            ["Remaining", remediation.total - remediation.resolved - remediation.inProgress, "t-2"]
          ].map(([k, v, c]) => (
            <div key={k as string} className="flex justify-between items-center text-[12.5px]">
              <span className="flex items-center gap-2 text-t-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(--${c})` }} />
                {k}
              </span>
              <span className="font-mono font-semibold text-t-0">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <button 
        className="w-full flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-3 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 mt-4 cursor-pointer transition-all duration-130"
        onClick={() => onNav("tasks")}
      >
        Open task board
        <Icon name="arrow-right" size={14} />
      </button>
    </div>
  );
};

interface NextActionCardProps {
  copilot: {
    nextBest: { title: string; why: string; impact: string; effort: string };
  };
  onNav: (view: string) => void;
  onToast: (msg: string) => void;
}

const NextActionCard: React.FC<NextActionCardProps> = ({ copilot, onNav, onToast }) => {
  return (
    <div className="border border-teal-line rounded-lg p-5 bg-gradient-to-br from-teal/7 to-bg-2 shadow-premium relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
      
      <div className="flex justify-between items-center mb-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-teal">
          <Icon name="sparkles" size={14} style={{ marginRight: 4 }} />
          Recommended by AI
        </span>
        <span className="flex items-center gap-1 text-[10.5px] text-t-2 font-semibold">
          <span className="flex gap-0.5">
            <i className="w-1 h-2 rounded-[2px] bg-teal" />
            <i className="w-1 h-2 rounded-[2px] bg-teal" />
            <i className="w-1 h-2 rounded-[2px] bg-teal" />
          </span>
          High confidence
        </span>
      </div>
      
      <h2 className="text-[17px] font-semibold text-t-0 mb-2.5 leading-tight">{copilot.nextBest.title}</h2>
      
      {/* AI Reasoning sections */}
      <div className="flex flex-col gap-2 mb-3.5">
        <div>
          <span className="text-[10px] tracking-wide uppercase text-t-3 font-semibold block">Why this matters</span>
          <p className="text-t-1 text-[12.5px] leading-relaxed m-0">{copilot.nextBest.why}</p>
        </div>
        <div>
          <span className="text-[10px] tracking-wide uppercase text-t-3 font-semibold block">Suggested action</span>
          <p className="text-t-1 text-[12.5px] leading-relaxed m-0">Change the password on ConnectHub and DevForum immediately to isolate the compromise.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] border border-teal-line bg-teal-dim text-teal">
          <Icon name="trending-up" size={13} style={{ marginRight: 3 }} />
          Risk reduced: {copilot.nextBest.impact}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] bg-bg-3 border border-line text-t-1">
          <Icon name="clock" size={13} style={{ marginRight: 3 }} />
          {copilot.nextBest.effort}
        </span>
      </div>

      <div className="flex gap-2.5">
        <button 
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100"
          onClick={() => {
            onNav("breaches");
            onToast("Opened the reused-password fix");
          }}
        >
          <Icon name="key" size={15} />
          Start the fix
        </button>
        <button 
          className="flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
          onClick={() => onNav("copilot")}
        >
          View plan
        </button>
      </div>
      
      <div className="text-t-3 text-[10px] mt-3.5 flex items-center gap-1 border-t border-line/40 pt-2.5">
        <Icon name="shield-check" size={11} />
        <span>Human review required · Simulated recommendations</span>
      </div>
    </div>
  );
};

interface HighRiskCardProps {
  highRiskData: HighRiskDataClass[];
}

const HighRiskCard: React.FC<HighRiskCardProps> = ({ highRiskData }) => {
  return (
    <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
      <div className="flex items-center gap-2 mb-3.5">
        <Icon name="alert" size={16} style={{ color: "var(--crit)" }} />
        <h2 className="text-[15px] font-semibold text-t-0">High-risk exposed data</h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {highRiskData.map((d, i) => (
          <div key={i} className="flex justify-between items-center border border-line rounded-md p-3 bg-bg-inset">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[13.5px] text-t-0">{d.label}</span>
                <Badge level={d.level} />
              </div>
              <div className="text-t-2 text-[11.8px] mt-1">{d.note}</div>
            </div>
            <span className="font-mono text-[20px] font-semibold text-t-1">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Highly-demanded Top 3 Urgent Actions dashboard panel
interface TopUrgentActionsProps {
  onNav: (view: string) => void;
  onToast: (msg: string) => void;
}

const TopUrgentActions: React.FC<TopUrgentActionsProps> = ({ onNav, onToast }) => {
  const actions = [
    {
      id: "u1",
      title: "Rotate password for ConnectHub",
      level: "Critical" as const,
      why: "Weak unsalted hash leak exposes your credential for SIM-swap phishing.",
      reduced: "+8 score points",
      suggested: "Change password to a unique key and activate 2FA.",
      navTo: "breaches"
    },
    {
      id: "u2",
      title: "Rotate password for DevForum",
      level: "Critical" as const,
      why: "Plaintext credential exposed. Same password is reused on ConnectHub.",
      reduced: "+4 score points",
      suggested: "Rotate to a unique strong password separate from primary emails.",
      navTo: "breaches"
    },
    {
      id: "u3",
      title: "Submit opt-out Suppression to PeopleLookup",
      level: "High" as const,
      why: "Home address exposed in ShopMart matches a directory listing, widening public exposure vectors.",
      reduced: "+3 score points",
      suggested: "Draft an ARCO/CCPA opt-out form in the Deletion requests tab.",
      navTo: "brokers"
    }
  ];

  return (
    <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
      <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
        <Icon name="sparkles" size={16} style={{ color: "var(--teal)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Top 3 urgent actions</h2>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border border-teal-line bg-teal-dim text-teal uppercase">
          <Icon name="sparkles" size={10} style={{ marginRight: 3 }} />
          Recommended by AI
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {actions.map(act => (
          <div key={act.id} className="border border-line rounded-lg p-4 bg-bg-inset flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-[13.5px] text-t-0">{act.title}</span>
                <Badge level={act.level} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] leading-relaxed">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-t-3 font-semibold block mb-0.5">Why this matters</span>
                  <span className="text-t-1">{act.why}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-t-3 font-semibold block mb-0.5">Suggested action</span>
                  <span className="text-t-1">{act.suggested}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-end gap-3.5 w-full md:w-auto border-t md:border-t-0 border-line/40 pt-3 md:pt-0 justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border border-teal-line bg-teal-dim text-teal whitespace-nowrap">
                <Icon name="trending-up" size={11} style={{ marginRight: 3 }} />
                Risk reduced if completed: {act.reduced}
              </span>
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12.5px] px-3 py-1.5 bg-bg-3 hover:bg-bg-2 border border-line-2 text-t-0 cursor-pointer transition-all duration-130"
                onClick={() => {
                  onNav(act.navTo);
                  onToast(`Navigated to fix: ${act.title}`);
                }}
              >
                Resolve
                <Icon name="arrow-right" size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-t-3 text-[10.5px] mt-4 flex items-center gap-1 border-t border-line/40 pt-3 font-semibold">
        <Icon name="shield-check" size={12} />
        <span>AI-generated recommendations. Human review required before executing any plan.</span>
      </div>
    </div>
  );
};

interface MiniBreachesProps {
  breaches: BreachFinding[];
  onNav: (view: string) => void;
}

const MiniBreaches: React.FC<MiniBreachesProps> = ({ breaches, onNav }) => {
  return (
    <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
      <div className="flex items-center gap-2 mb-3.5">
        <Icon name="breach" size={16} style={{ color: "var(--t-1)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Top breaches</h2>
        <button 
          className="inline-flex items-center justify-center gap-1.5 text-t-2 hover:text-teal font-semibold text-[12px] bg-transparent border-0 cursor-pointer transition-all duration-130"
          onClick={() => onNav("breaches")}
        >
          All
          <Icon name="arrow-right" size={13} />
        </button>
      </div>
      <div className="flex flex-col">
        {breaches.slice(0, 3).map(b => (
          <div 
            key={b.id} 
            className="flex items-center gap-3 py-3 border-b border-line last:border-b-0 cursor-pointer"
            onClick={() => onNav("breaches")}
          >
            <div className="w-[38px] h-[38px] rounded-lg bg-bg-3 border border-line-2 flex items-center justify-center font-semibold text-[15px] text-t-0 flex-shrink-0">
              {b.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[13.5px] text-t-0 truncate">{b.service}</span>
                <Badge level={b.severity} />
              </div>
              <div className="text-t-2 text-[11.8px] truncate mt-0.5">
                {b.dataClasses.slice(0, 3).join(" · ")}
              </div>
            </div>
            <span className="text-t-2 font-mono text-[11.5px] flex-shrink-0 ml-2">{b.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface RiskTileProps {
  icon: string;
  data: RiskTileData;
  onClick: () => void;
}

const RiskTile: React.FC<RiskTileProps> = ({ icon, data, onClick }) => {
  return (
    <button 
      className="border border-line rounded-lg p-5 bg-bg-2 hover:bg-bg-3/40 hover:border-line-2 shadow-premium text-left cursor-pointer transition-all duration-130 w-full block"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-3.5">
        <div className="flex items-center gap-2 text-t-1">
          <Icon name={icon} size={17} />
          <span className="text-[12.5px] font-semibold">{data.label}</span>
        </div>
        <Badge level={data.level} />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-[22px] font-semibold tracking-tight text-t-0 leading-none">{data.value}</div>
          <div className="text-t-2 text-[12px] mt-1">{data.sub}</div>
        </div>
        <Delta value={data.trend} invert />
      </div>
    </button>
  );
};

interface DashboardProps {
  profile: Profile;
  score: PrivacyScore;
  remediation: RemediationProgress;
  breaches: BreachFinding[];
  highRiskData: HighRiskDataClass[];
  risk: { breach: RiskTileData; footprint: RiskTileData; oldAccounts: RiskTileData; broker: RiskTileData };
  copilot: { nextBest: { title: string; why: string; impact: string; effort: string } };
  dashboardLayout: 'executive' | 'grid' | 'focus';
  scoreStyle: 'scoreStyle' | any; // Tweak dynamic pass
  onNav: (view: string) => void;
  onToast: (msg: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  score,
  remediation,
  breaches,
  highRiskData,
  risk,
  copilot,
  dashboardLayout,
  scoreStyle,
  onNav,
  onToast
}) => {
  const riskTiles = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <RiskTile icon="breach" data={risk.breach} onClick={() => onNav("breaches")} />
      <RiskTile icon="globe" data={risk.footprint} onClick={() => onNav("footprint")} />
      <RiskTile icon="clock" data={risk.oldAccounts} onClick={() => onNav("footprint")} />
      <RiskTile icon="building" data={risk.broker} onClick={() => onNav("brokers")} />
    </div>
  );

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      {/* Custom home header */}
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Executive Privacy Dashboard</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Good evening, {profile.name.split(" ")[0]}</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
            <span className="demo-blip" />
            Simulated data
          </span>
          <button 
            className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12.5px] px-3 py-1.5 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
            onClick={() => onToast("Re-scanning… (demo)")}
          >
            <Icon name="refresh" size={14} />
            Re-scan
          </button>
        </div>
      </div>

      {dashboardLayout === "executive" && (
        <div className="flex flex-col gap-4 stagger">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4">
            <ScoreCard score={score} variant={scoreStyle} big />
            <NextActionCard copilot={copilot} onNav={onNav} onToast={onToast} />
          </div>
          {riskTiles}
          
          {/* Top Urgent Actions Prominent Section */}
          <TopUrgentActions onNav={onNav} onToast={onToast} />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
            <FactorsCard score={score} />
            <div className="flex flex-col gap-4">
              <ProgressCard remediation={remediation} onNav={onNav} />
              <HighRiskCard highRiskData={highRiskData} />
            </div>
          </div>
          <MiniBreaches breaches={breaches} onNav={onNav} />
        </div>
      )}

      {dashboardLayout === "grid" && (
        <div className="flex flex-col gap-4 stagger">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:row-span-2">
              <ScoreCard score={score} variant={scoreStyle} big />
            </div>
            <RiskTile icon="breach" data={risk.breach} onClick={() => onNav("breaches")} />
            <RiskTile icon="globe" data={risk.footprint} onClick={() => onNav("footprint")} />
            <RiskTile icon="clock" data={risk.oldAccounts} onClick={() => onNav("footprint")} />
            <RiskTile icon="building" data={risk.broker} onClick={() => onNav("brokers")} />
          </div>
          <NextActionCard copilot={copilot} onNav={onNav} onToast={onToast} />
          
          <TopUrgentActions onNav={onNav} onToast={onToast} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProgressCard remediation={remediation} onNav={onNav} />
            <HighRiskCard highRiskData={highRiskData} />
            <MiniBreaches breaches={breaches} onNav={onNav} />
          </div>
          <FactorsCard score={score} />
        </div>
      )}

      {dashboardLayout === "focus" && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,720px)_1fr] justify-center max-w-[1040px] mx-auto gap-4 stagger">
          <div className="flex flex-col gap-4">
            <ScoreCard score={score} variant={scoreStyle} big />
            <NextActionCard copilot={copilot} onNav={onNav} onToast={onToast} />
            <TopUrgentActions onNav={onNav} onToast={onToast} />
            <MiniBreaches breaches={breaches} onNav={onNav} />
          </div>
          <div className="flex flex-col gap-4">
            <ProgressCard remediation={remediation} onNav={onNav} />
            <HighRiskCard highRiskData={highRiskData} />
            <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
              <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-3">Exposure at a glance</div>
              <div className="flex flex-col gap-3">
                {[
                  ["breach", risk.breach],
                  ["globe", risk.footprint],
                  ["clock", risk.oldAccounts],
                  ["building", risk.broker]
                ].map(([ic, d], i) => (
                  <div key={i} className="flex justify-between items-center text-[12.8px]">
                    <span className="flex items-center gap-2 text-t-1">
                      <Icon name={ic as string} size={15} />
                      {(d as RiskTileData).label}
                    </span>
                    <Badge level={(d as RiskTileData).level}>{(d as RiskTileData).value}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
