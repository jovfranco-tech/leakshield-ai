import React from 'react';

interface BadgeProps {
  level: 'Critical' | 'High' | 'Medium' | 'Low' | 'ok';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ level, children, style }) => {
  const levelClassMap = {
    Critical: "text-crit bg-crit-dim border-crit/25",
    High: "text-high bg-high-dim border-high/25",
    Medium: "text-med bg-med-dim border-med/25",
    Low: "text-low bg-low-dim border-low/25",
    ok: "text-ok bg-ok-dim border-ok/25",
  };

  const cls = levelClassMap[level] || levelClassMap.ok;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-0.5 rounded-[7px] tracking-wide border ${cls}`}
      style={style}
    >
      <span className="w-1.5 height-1.5 h-1.5 rounded-full bg-current"></span>
      {children || level}
    </span>
  );
};
