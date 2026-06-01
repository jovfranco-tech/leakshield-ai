import React from 'react';

interface StatusPillProps {
  status: 'Pending' | 'In Progress' | 'Sent' | 'Resolved' | 'Monitor';
  style?: React.CSSProperties;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, style }) => {
  const statusClassMap = {
    Pending: "text-t-1 bg-bg-3 border-line-2",
    "In Progress": "text-cyan bg-cyan-dim border-cyan/25",
    Sent: "text-low bg-low-dim border-low/25",
    Resolved: "text-ok bg-ok-dim border-ok/25",
    Monitor: "text-med bg-med-dim border-med/25"
  };

  const cls = statusClassMap[status] || statusClassMap.Pending;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}
      style={style}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};
