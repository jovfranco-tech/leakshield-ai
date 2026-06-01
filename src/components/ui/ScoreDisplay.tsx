import React from 'react';
import { PrivacyScore } from '../../types/privacy';
import { Badge } from './Badge';
import { ScoreRing, CountUp } from './ScoreRing';
import { Icon } from './Icon';

export function scoreColor(v: number): string {
  if (v < 40) return "var(--crit)";
  if (v < 60) return "var(--high)";
  if (v < 75) return "var(--med)";
  if (v < 90) return "var(--teal)";
  return "var(--ok)";
}

interface DeltaProps {
  value: number;
  suffix?: string;
  invert?: boolean;
}

export const Delta: React.FC<DeltaProps> = ({ value, suffix = "", invert = false }) => {
  if (value === 0) return <span className="inline-flex items-center gap-1 font-semibold text-[12.5px] text-t-2">—</span>;
  const good = invert ? value < 0 : value > 0;
  const up = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 font-semibold text-[12.5px] ${good ? "text-ok" : "text-crit"}`}>
      <Icon name={up ? "trending-up" : "trending-down"} size={13} />
      {up ? "+" : ""}{value}{suffix}
    </span>
  );
};

interface ScoreDisplayProps {
  score: PrivacyScore;
  variant?: 'numeric' | 'ring' | 'bar';
  compact?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, variant = "numeric", compact = false }) => {
  const col = scoreColor(score.value);

  if (variant === "ring") {
    return (
      <div className="flex flex-row gap-[22px] items-center">
        <ScoreRing value={score.value} size={compact ? 130 : 168} />
        <div className="flex flex-col gap-2">
          <Badge level={score.value < 60 ? "High" : score.value < 75 ? "Medium" : "ok"}>
            {score.grade}
          </Badge>
          <Delta value={score.trend} suffix=" / 30d" />
          <div className="text-t-2 text-[12px]">Updated {score.updated}</div>
        </div>
      </div>
    );
  }

  if (variant === "bar") {
    return (
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-row items-baseline gap-3">
          <div 
            className="font-mono font-semibold tracking-tighter leading-[0.9]"
            style={{ fontSize: compact ? 52 : 68, color: col }}
          >
            <CountUp value={score.value} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Badge level={score.value < 60 ? "High" : score.value < 75 ? "Medium" : "ok"}>
              {score.grade}
            </Badge>
            <Delta value={score.trend} suffix=" / 30d" />
          </div>
        </div>
        <div>
          <div className="flex gap-[3px]">
            {score.bands.map((b, i) => {
              const active = score.value >= b.min;
              return (
                <i 
                  key={i} 
                  className="flex-1 h-1.5 rounded-[3px]"
                  style={{ background: active ? b.color : "var(--bg-inset)" }} 
                  title={b.label} 
                />
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[10.5px]">
            {score.bands.map((b, i) => (
              <span 
                key={i} 
                className="font-semibold tracking-wide uppercase"
                style={{ color: score.value >= b.min && score.value <= b.max ? b.color : "var(--t-3)" }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // default 'numeric'
  return (
    <div className="flex flex-row gap-[22px] items-center">
      <div className="relative">
        <div 
          className="font-mono font-semibold tracking-tighter leading-[0.9]"
          style={{ 
            fontSize: compact ? 76 : 104, 
            color: col, 
            textShadow: `0 0 50px ${col}55` 
          }}
        >
          <CountUp value={score.value} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[11px] uppercase tracking-[0.14em] text-t-2 font-semibold">Privacy Score</div>
        <Badge 
          level={score.value < 60 ? "High" : score.value < 75 ? "Medium" : "ok"} 
          style={{ fontSize: 13, padding: "5px 12px" }}
        >
          {score.grade}
        </Badge>
        <Delta value={score.trend} suffix=" / 30d" />
        <div className="text-t-2 text-[12px]">Updated {score.updated}</div>
      </div>
    </div>
  );
};
