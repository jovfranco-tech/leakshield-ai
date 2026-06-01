import React from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { StatusPill } from '../../components/ui/StatusPill';
import { AIInsightCard } from '../../components/ui/AIInsightCard';
import { DataBroker, OldAccount } from '../../types/privacy';

interface DataBrokersProps {
  brokers: DataBroker[];
  oldAccounts: OldAccount[];
  inlineAI: boolean;
  onToast: (msg: string) => void;
  onOpenDeletion: () => void;
}

export const DataBrokers: React.FC<DataBrokersProps> = ({
  brokers,
  oldAccounts,
  inlineAI,
  onToast,
  onOpenDeletion
}) => {
  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Data Broker Tracker</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Data-broker exposure</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
          <span className="demo-blip" />
          Simulated listings
        </span>
      </div>

      {inlineAI && (
        <div className="mb-4">
          <AIInsightCard 
            tag="AI Broker Tracker" 
            lead 
            confidence="High"
            body="Brokers resell aggregated records. I've pre-drafted removals for both — you only review and approve." 
            action="Review drafts" 
            onAction={onOpenDeletion} 
          />
        </div>
      )}

      {/* Active Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brokers.map(db => {
          const isDataFind = db.name === 'DataFind';
          const why = isDataFind 
            ? "Aggregates and resells public records including home address history and relatives, facilitating unauthorized background profiling."
            : "Harvests and packages email addresses, phone listings, and username affiliations for telemarketing feeds and tracking lists.";
          const reduced = isDataFind
            ? "Risk reduced: Suppresses home address lookup (+3 score points)"
            : "Risk reduced: Closes digital contact profiling (+3 score points)";
          
          return (
            <div key={db.id} className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[38px] h-[38px] rounded-lg bg-bg-3 border border-line-2 flex items-center justify-center text-t-0">
                      <Icon name="building" size={18} />
                    </div>
                    <div>
                      <div className="text-[16px] font-semibold text-t-0 leading-tight">{db.name}</div>
                      <div className="text-t-2 text-[11.5px] mt-0.5">{db.since}</div>
                    </div>
                  </div>
                  <StatusPill status={db.status.includes("progress") ? "In Progress" : "Sent"} />
                </div>

                <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1.5">Listed about you</div>
                <div className="flex gap-1.5 mb-3.5 flex-wrap">
                  {db.exposes.map(e => (
                    <span key={e} className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                      {e}
                    </span>
                  ))}
                </div>

                <div className="border border-teal-line/35 bg-gradient-to-br from-teal/6 to-bg-2 rounded-lg p-3.5 relative overflow-hidden mb-3.5">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-teal" />
                  
                  <div className="flex justify-between items-center mb-2.5 flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-teal">
                      <Icon name="sparkles" size={12} style={{ marginRight: 3 }} />
                      Recommended by AI
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded border border-teal-line bg-teal-dim text-teal">
                      <Icon name="trending-up" size={11} style={{ marginRight: 3 }} />
                      {reduced}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] tracking-wide uppercase text-t-3 font-semibold block mb-0.5">Why this matters</span>
                    <p className="text-t-1 text-[12px] leading-relaxed m-0 font-medium">{why}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-t-1 text-[12.5px] mb-3.5">
                  <Icon name="refresh" size={14} style={{ color: "var(--cyan)" }} />
                  <span>{db.status}</span>
                </div>
              </div>

              <div>
                <div className="text-t-3 text-[10.5px] mb-3 flex items-center gap-1 font-semibold">
                  <Icon name="shield-check" size={12} />
                  <span>Human review required before removal submission</span>
                </div>
                <button 
                  className="w-full flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-3 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
                  onClick={onOpenDeletion}
                >
                  <Icon name="file" size={14} />
                  View deletion request
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Old Accounts Closet */}
      <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium mt-4">
        <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
          <Icon name="clock" size={16} />
          <h2 className="text-[15px] font-semibold text-t-0">Dormant accounts widening your exposure</h2>
        </div>
        
        <div className="flex flex-col">
          {oldAccounts.map(o => (
            <div key={o.id} className="flex items-center gap-3 py-3 border-b border-line last:border-b-0">
              <div className="w-[38px] h-[38px] rounded-lg bg-bg-inset border border-line-2 flex items-center justify-center text-t-2 flex-shrink-0">
                <Icon name="clock" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-t-0 truncate leading-tight">{o.service}</div>
                <div className="text-t-2 text-[11.5px] truncate mt-1">
                  Last active {o.lastSeen} · {o.reason}
                </div>
              </div>
              <Badge level={o.risk} />
              <button 
                className="inline-flex items-center justify-center gap-1 text-t-2 hover:text-teal font-semibold text-[12.5px] bg-transparent border-0 px-2 py-1 cursor-pointer transition-all duration-130"
                onClick={() => onToast("Closure guide opened (demo)")}
              >
                Close
                <Icon name="arrow-right" size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DataBrokers;
