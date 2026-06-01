import React from 'react';
import { Icon } from './Icon';

interface ConfidenceProps {
  level?: 'High' | 'Medium' | 'Low';
}

export const Confidence: React.FC<ConfidenceProps> = ({ level = "High" }) => {
  const map = { High: 3, Medium: 2, Low: 1 };
  const v = map[level] || 2;
  return (
    <span className="flex items-center gap-1 text-[10.5px] text-t-2 font-semibold">
      <span className="flex gap-0.5">
        {[1, 2, 3].map(i => (
          <i 
            key={i} 
            className="w-1 h-2 rounded-[2px]" 
            style={{ 
              backgroundColor: i <= v ? "var(--teal)" : "var(--bg-3)" 
            }} 
          />
        ))}
      </span>
      {level} confidence
    </span>
  );
};

interface AIInsightCardProps {
  tag?: string;
  title?: string;
  body?: string;
  impact?: string | null;
  action?: string;
  onAction?: () => void;
  lead?: boolean;
  confidence?: 'High' | 'Medium' | 'Low';
  children?: React.ReactNode;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  tag = "AI Analyst",
  title,
  body,
  impact,
  action,
  onAction,
  lead,
  confidence,
  children
}) => {
  return (
    <div 
      className={`relative border rounded-md p-3.5 mb-3 overflow-hidden ${
        lead 
          ? "border-teal-line bg-gradient-to-b from-teal/6 to-bg-2" 
          : "border-line bg-bg-2"
      }`}
    >
      {/* Dynamic accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
      
      <div className="flex justify-between items-center mb-2">
        <span className="inline-flex items-center gap-1.2 text-[10.5px] font-semibold tracking-wider uppercase text-teal">
          <Icon name="sparkles" size={13} style={{ marginRight: 4 }} />
          {tag}
        </span>
        {confidence && <Confidence level={confidence} />}
      </div>
      
      {title && <div className="text-[13.5px] font-semibold text-t-0 mb-1.2">{title}</div>}
      {body && <div className="text-t-1 text-[12.5px] leading-[1.55]">{body}</div>}
      {children}
      
      {(impact || action) && (
        <div className="flex justify-between items-center mt-3">
          {impact 
            ? (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] border border-teal-line bg-teal-dim text-teal">
                <Icon name="trending-up" size={12} />
                {impact}
              </span>
            ) 
            : <span />
          }
          {action && (
            <button 
              className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12px] px-2.5 py-1 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100"
              onClick={onAction}
            >
              {action}
              <Icon name="arrow-right" size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
